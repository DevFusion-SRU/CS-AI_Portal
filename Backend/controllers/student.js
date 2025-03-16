import mongoose from "mongoose";
import axios from "axios";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import sharp from "sharp"; // Import Sharp for image resizing

dotenv.config();
import cloudinary from "../config/cloudinary.js"; // Import Cloudinary config
import StudentDetails from "../models/Students/Student.Details.js"; // StudentDetails model using studentDB
import StudentCredentials from "../models/Students/Student.Credentials.js"; // StudentCredentials model using studentDB
import StudentFiles from "../models/Students/Student.Files.js"; // StudentFiles model using studentDB

export const getStudents = async (req, res) => {
  const { rollNumber, firstName, lastName } = req.query;

  if (
    (rollNumber && firstName) ||
    (rollNumber && lastName) ||
    (firstName && lastName)
  ) {
    return res.status(400).json({
      success: false,
      message: "Only one search filter (rollNumber, firstName, or lastName) is allowed at a time.",
    });
  }

  const filters = {};
  if (rollNumber) filters.rollNumber = new RegExp(rollNumber.trim(), "i");
  else if (firstName) filters.firstName = new RegExp(firstName.trim(), "i");
  else if (lastName) filters.lastName = new RegExp(lastName.trim(), "i");

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;
    const fields = "rollNumber firstName lastName course email mobile";

    const [students, totalStudents] = await Promise.all([
      StudentDetails.find(filters).skip(skip).limit(limit).select(fields),
      StudentDetails.countDocuments(filters),
    ]);

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No students found matching the criteria.",
      });
    }

    res.status(200).json({
      success: true,
      data: students,
      totalPages: Math.ceil(totalStudents / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error in fetching Students:", error.message);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


export const getStudentDetails = async (req, res) => {
  const { rollNumber } = req.params;

  try {
    const studentDetails = await StudentDetails.findOne({ rollNumber });

    if (!studentDetails) {
      return res.status(404).json({
        success: false,
        message: "No details found for this student!",
      });
    }

    const response = {
      rollNumber: studentDetails.rollNumber,
      firstName: studentDetails.firstName,
      lastName: studentDetails.lastName || "",
      course: studentDetails.course,
      graduationYear: studentDetails.graduationYear,
      email: studentDetails.email,
      mobile: studentDetails.mobile || "",
      gender: studentDetails.gender || "",
      address: studentDetails.address || "", // Map to 'location' in frontend
      personalMail: studentDetails.personalMail || "",
      website: studentDetails.website || "",
      about: studentDetails.about || "",
      skills: studentDetails.skills || [],
      experiences: studentDetails.experiences || [],
      education: studentDetails.education || [],
      certifications: studentDetails.certifications || [],
      resumes: studentDetails.resumes?.map((resume) => resume.title) || [],
    };

    // 🔹 Check if the student has a stored photo buffer
    if (studentDetails.photo && studentDetails.photoType) {
      try {
        // ✅ Resize the image while maintaining original dimensions
        const resizedImageBuffer = await sharp(studentDetails.photo)
          .resize({ width: 400, height: 400, fit: "cover" }) // Center cropping
          .toBuffer();

        // ✅ Convert to Base64
        response.photo = `data:${studentDetails.photoType};base64,${resizedImageBuffer.toString("base64")}`;
      } catch (error) {
        console.error("Error processing image:", error.message);
        response.photo = null;
      }
    } else {
      response.photo = null;
    }

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error("Error fetching student details:", error.message);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


export const addStudent = async (req, res) => {
  const student = req.body;
  if (
    !student.rollNumber ||
    !student.firstName ||
    !student.email ||
    !student.course ||
    !student.graduationYear
  ) {
    return res.status(400).json({ success: false, message: "Provide all required fields!" });
  }

  const newStudent = new StudentDetails(student);

  try {
    await newStudent.save();
    const hashedPassword = await bcrypt.hash(process.env.STUDENT_PASSWORD, 10);
    const newAuthentication = new StudentCredentials({
      username: student.rollNumber,
      password: hashedPassword,
      role: "student",
    });
    await newAuthentication.save();

    res.status(201).json({ success: true, data: newStudent });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Student with this Roll Number already exists!",
      });
    }
    console.error("Error in adding Student details:", error.message);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const uploadStudentPhoto = async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const { username } = req.user;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded!" });
    }

    console.log("File received:", req.file);
    const { buffer, mimetype } = req.file;

    // Validate file type (Only JPG & PNG allowed)
    if (!["image/jpeg", "image/png", "image/jpg"].includes(mimetype)) {
      return res.status(400).json({ success: false, message: "Only JPG and PNG files are allowed!" });
    }

    // Find student details
    const student = await StudentDetails.findOne({ rollNumber });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found!" });
    }

    // Authorization check
    if (student.rollNumber !== username) {
      return res.status(403).json({ success: false, message: "You are not authorized to upload photo for this student!" });
    }

    // Check if StudentFiles entry exists for the student
    let studentFiles = await StudentFiles.findOne({ rollNumber });

    if (!studentFiles) {
      // Create new StudentFiles entry
      studentFiles = new StudentFiles({
        rollNumber,
        profilePhoto: { data: buffer, contentType: mimetype },
      });
    } else {
      // Update existing profile photo
      studentFiles.profilePhoto = { data: buffer, contentType: mimetype };
    }

    await studentFiles.save(); // Save the file in StudentFiles

    // Store reference to StudentFiles in StudentDetails
    student.profilePhotoId = studentFiles.profilePhoto._id; // 🔹 Store the ID of StudentFiles, NOT the photo itself
    await student.save();

    // Generate a resized, center-cropped version (400x400) for response
    const resizedImageBuffer = await sharp(buffer)
      .resize(400, 400, { fit: "cover", position: "center" }) // Center crop
      .toBuffer();

    // Convert resized image to Base64 (for immediate preview)
    const base64Image = `data:${mimetype};base64,${resizedImageBuffer.toString("base64")}`;

    res.status(200).json({
      success: true,
      message: "Photo uploaded successfully!",
      profilePhotoId:  studentFiles.profilePhoto._id, // 🔹 Reference to the saved photo
      preview: base64Image, // 🔹 Resized image preview
    });

  } catch (error) {
    console.error("Upload Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const uploadStudentResume = async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const { username } = req.user;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded!" });
    }

    console.log("File received:", req.file);
    const { buffer, mimetype, originalname } = req.file; // Extract file details

    // Validate file type (Allow only PDFs and DOCX)
    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(mimetype)) {
      return res.status(400).json({ success: false, message: "Only PDF and DOCX files are allowed for resumes!" });
    }

    // Find the student by rollNumber
    const student = await StudentDetails.findOne({ rollNumber });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found!" });
    }

    // Ensure the authenticated user is uploading their own resume
    if (student.rollNumber !== username) {
      return res.status(403).json({ success: false, message: "You are not authorized to upload resumes for this student!" });
    }

    // Restrict to a maximum of 3 resumes
    if (student.resumes.length >= 3) {
      return res.status(400).json({ success: false, message: "You can upload a maximum of 3 resumes." });
    }

    // Store resume file in StudentFiles
    let studentFiles = await StudentFiles.findOne({ rollNumber });

    if (!studentFiles) {
      // Create new record if studentFiles entry doesn't exist
      studentFiles = new StudentFiles({ rollNumber, resumes: [] });
    }

    const newResume = {
      data: buffer,
      contentType: mimetype,
    };

    studentFiles.resumes.push(newResume);
    await studentFiles.save(); // Save resume file

    // Get the resumeId of the last added resume
    const resumeId = studentFiles.resumes[studentFiles.resumes.length - 1]._id;

    // Store resume title & reference in StudentDetails
    student.resumes.push({ title: originalname, resumeId });
    await student.save();

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully!",
      resumeId,
      title: originalname,
    });

  } catch (error) {
    console.error("Upload Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteStudentResume = async (req, res) => {
  try {
    const { rollNumber, resumeId } = req.params; // Get rollNumber & resumeId from URL params
    const { username } = req.user; // Get logged-in user

    // Find the student by rollNumber
    const student = await StudentDetails.findOne({ rollNumber });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found!" });
    }

    // Check authorization (Only the owner can delete)
    if (student.rollNumber !== username) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete resumes for this student!",
      });
    }

    // Find the resume to delete
    const resumeIndex = student.resumes.findIndex((r) => r._id.toString() === resumeId);

    if (resumeIndex === -1) {
      return res.status(404).json({ success: false, message: "Resume not found!" });
    }

    // Remove the resume from the array
    student.resumes.splice(resumeIndex, 1);

    await student.save(); // Save updated student data

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully!",
    });
  } catch (error) {
    console.error("Resume Deletion Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const addStudentBatch = async (req, res) => {
  const students = req.body;

  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Provide an array of students with all required fields!",
    });
  }

  for (const student of students) {
    if (
      !student.rollNumber ||
      !student.firstName ||
      !student.email ||
      !student.course
    ) {
      return res.status(400).json({
        success: false,
        message: "Each student must include rollNumber, firstName, email, and course!",
      });
    }
  }

  try {
    const newStudents = await StudentDetails.insertMany(students);
    const authenticationEntries = await Promise.all(
      students.map(async (student) => {
        const hashedPassword = await bcrypt.hash(process.env.STUDENT_PASSWORD, 10);
        return {
          username: student.rollNumber,
          password: hashedPassword,
          role: "student",
        };
      })
    );
    await StudentCredentials.insertMany(authenticationEntries);

    res.status(201).json({ success: true, data: newStudents });
  } catch (error) {
    console.error("Error in entering Student details:", error.message);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  const { rollNumber } = req.params;

  if (!rollNumber) {
    return res.status(400).json({ success: false, message: "Roll number is required!" });
  }

  try {
    const deletedStudent = await StudentDetails.findOneAndDelete({ rollNumber });
    if (!deletedStudent) {
      return res.status(404).json({ success: false, message: "Student not found!" });
    }

    const deletedAuth = await StudentCredentials.findOneAndDelete({ username: rollNumber });
    if (!deletedAuth) {
      console.error("Authentication record not found for roll number:", rollNumber);
    }

    res.status(200).json({
      success: true,
      message: "Student and authentication records deleted successfully!",
    });
  } catch (error) {
    console.error("Error in deleting Student details:", error.message);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Upload Certificate for Experience or Certification
export const uploadCertificateFile = async (req, res) => {
  try {
    const { rollNumber, section, id } = req.params;

    if (!rollNumber || !section || !id) {
      return res.status(400).json({ success: false, message: "Missing required parameters" });
    }

    const student = await StudentDetails.findOne({ rollNumber });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const certificateUrl = req.file.path;
    let updated = false;

    if (section === "experiences") {
      const experience = student.experiences.find((exp) => exp._id.toString() === id);
      if (!experience) {
        return res.status(404).json({ success: false, message: "Experience not found" });
      }
      experience.certificate = certificateUrl;
      updated = true;
    } else if (section === "certifications") {
      const certification = student.certifications.find((cert) => cert._id.toString() === id);
      if (!certification) {
        return res.status(404).json({ success: false, message: "Certification not found" });
      }
      certification.certificateId = certificateUrl; // Matches frontend 'certificateUrl'
      updated = true;
    }

    if (!updated) {
      return res.status(400).json({ success: false, message: "Invalid section or ID" });
    }

    await student.save();
    res.status(200).json({
      success: true,
      message: "Certificate uploaded successfully",
      certificateUrl,
    });
  } catch (error) {
    console.error("Error uploading certificate:", error.message);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

export const editStudent = async (req, res) => {
  const { rollNumber } = req.params;
  const { section, data } = req.body;

  try {
    const student = await StudentDetails.findOne({ rollNumber });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const formatDate = (dateString) => (dateString ? new Date(dateString) : null);

    switch (section) {
      case "experiences":
        if (!Array.isArray(data)) {
          return res.status(400).json({ success: false, message: "Experiences data should be an array" });
        }
        student.experiences = data.map((item) => ({
          _id: item._id || new mongoose.Types.ObjectId(),
          title: item.title,
          company: item.company,
          duration: {
            startDate: formatDate(item.duration.startDate),
            endDate: formatDate(item.duration.endDate),
          },
          location: item.location,
          description: item.description,
          certificate: item.certificate || "",
        }));
        break;

      case "education":
        if (!Array.isArray(data)) {
          return res.status(400).json({ success: false, message: "Education data should be an array" });
        }
        student.education = data.map((item) => ({
          _id: item._id || new mongoose.Types.ObjectId(),
          institution: item.institution,
          degree: item.degree,
          specialization: item.specialization,
          duration: {
            startDate: formatDate(item.duration.startDate),
            endDate: formatDate(item.duration.endDate),
          },
          cgpa: item.cgpa,
        }));
        break;

      case "certifications":
        if (!Array.isArray(data)) {
          return res.status(400).json({ success: false, message: "Certifications data should be an array" });
        }
        student.certifications = data.map((item) => ({
          _id: item._id || new mongoose.Types.ObjectId(),
          title: item.title, // Maps to frontend 'provider'
          issuer: item.issuer,
          courseName: item.courseName, // Maps to frontend 'title'
          validTime: {
            startDate: formatDate(item.validTime.startDate),
            endDate: formatDate(item.validTime.endDate),
          },
          certificateId: item.certificateId || "",
        }));
        break;

        case "skills":
          if (!Array.isArray(data)) {
            return res.status(400).json({ success: false, message: "Skills data must be an array" });
          }
          student.skills = data.map((item) => ({
            _id: item._id || new mongoose.Types.ObjectId(),
            name: item.name,
            level: item.level,
          }));
          break;

      case "resumes":
        if (!Array.isArray(data)) {
          return res.status(400).json({ success: false, message: "Resumes data should be an array" });
        }
        student.resumes = data.map((item) => ({
          _id: item._id || new mongoose.Types.ObjectId(),
          title: item.title,
          resumeUrl: item.resumeUrl,
          size: item.size || "N/A",
          uploadedAt: item.uploadedAt ? new Date(item.uploadedAt) : new Date(),
        }));
        break;

      case "about":
        student.about = data;
        break;

      case "info":
        student.email = data.email || student.email;
        student.mobile = data.phone || student.mobile;
        student.website = data.website || student.website;
        student.gender = data.gender || student.gender;
        student.address = data.address || student.address; // Maps to frontend 'location'
        break;

      default:
        return res.status(400).json({ success: false, message: "Invalid section" });
    }

    const updatedStudent = await student.save();
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    console.error("Error updating student profile:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export default {
  getStudents,
  getStudentDetails,
  addStudent,
  uploadStudentPhoto,
  uploadStudentResume,
  deleteStudentResume,
  addStudentBatch,
  deleteStudent,
  uploadCertificateFile,
  editStudent,
};