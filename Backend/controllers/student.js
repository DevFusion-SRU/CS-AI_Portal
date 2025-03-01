import mongoose from "mongoose";
import axios from "axios";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import cloudinary from "../config/cloudinary.js";
import StudentDetails from "../models/Students/Student.Details.js";
import StudentCredentials from "../models/Students/Student.Credentials.js";

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
      address: studentDetails.Address || "", // Map to 'location' in frontend
      personalMail: studentDetails.personalMail || "",
      website: studentDetails.website || "",
      about: studentDetails.about || "",
      experiences: studentDetails.experiences.map((exp) => ({
        _id: exp._id,
        title: exp.title,
        company: exp.company,
        duration: {
          startDate: exp.duration.startDate ? exp.duration.startDate.toISOString().split("T")[0] : null,
          endDate: exp.duration.endDate ? exp.duration.endDate.toISOString().split("T")[0] : null,
        },
        location: exp.location,
        description: exp.description,
        certificate: exp.certificate, // Matches frontend 'certificate'
      })) || [],
      education: studentDetails.education.map((edu) => ({
        _id: edu._id,
        institution: edu.institution,
        degree: edu.degree,
        specialization: edu.specialization,
        duration: {
          startDate: edu.duration.startDate ? edu.duration.startDate.toISOString().split("T")[0] : null,
          endDate: edu.duration.endDate ? edu.duration.endDate.toISOString().split("T")[0] : null,
        },
        cgpa: edu.cgpa,
      })) || [],
      certifications: studentDetails.certifications.map((cert) => ({
        _id: cert._id,
        title: cert.title, // Matches frontend 'provider'
        issuer: cert.issuer,
        courseName: cert.courseName, // Matches frontend 'title'
        validTime: {
          startDate: cert.validTime.startDate ? cert.validTime.startDate.toISOString().split("T")[0] : null,
          endDate: cert.validTime.endDate ? cert.validTime.endDate.toISOString().split("T")[0] : null,
        },
        certificateId: cert.certificateId, // Matches frontend 'certificateUrl'
      })) || [],
      skills: studentDetails.skills.map((skill) => ({
        _id: skill._id,
        name: skill.name,
        level: skill.level,
      })) || [],
      resumes: studentDetails.resumes.map((resume) => ({
        _id: resume._id,
        title: resume.title,
        resumeUrl: resume.resumeUrl, // Matches frontend 'url'
        size: resume.size || "N/A",
      })) || [],
    };

    if (studentDetails.photoUrl) {
      try {
        const resizedImageUrl = studentDetails.photoUrl.replace(
          "/upload/",
          "/upload/w_400,h_400,c_fill,q_auto/"
        );
        const imgResponse = await axios.get(resizedImageUrl, { responseType: "arraybuffer" });
        const contentType = imgResponse.headers["content-type"];
        response.photo = `data:${contentType};base64,${Buffer.from(imgResponse.data).toString("base64")}`;
      } catch (error) {
        console.error("Error fetching or converting image:", error.message);
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
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded!" });
    }

    const fileUrl = req.file.path;
    const student = await StudentDetails.findOne({ rollNumber });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found!" });
    }

    student.photoUrl = fileUrl;
    await student.save();

    const resizedImageUrl = fileUrl.replace("/upload/", "/upload/w_400,h_400,c_fill/");
    const response = await axios.get(resizedImageUrl, { responseType: "arraybuffer" });
    const contentType = response.headers["content-type"];
    const base64Image = `data:${contentType};base64,${Buffer.from(response.data).toString("base64")}`;

    res.status(200).json({
      success: true,
      message: "Photo uploaded successfully!",
      image: base64Image,
    });
  } catch (error) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size exceeds the limit of 2MB.",
      });
    }
    if (error.message.includes("Invalid image type")) {
      return res.status(400).json({
        success: false,
        message: "Only JPG, JPEG, and PNG files are allowed for images!",
      });
    }
    console.error("Upload Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
export const uploadStudentResume = async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const student = await StudentDetails.findOne({ rollNumber });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found!" });
    }

    if (student.resumes.length >= 3) {
      return res.status(400).json({
        success: false,
        message: "You can upload a maximum of 3 resumes.",
      });
    }

    let fileUrl;
    let fileSize = "N/A";
    let title = req.body.title || "Untitled"; // Use custom title from frontend, fallback to "Untitled"

    if (req.file) {
      // Handle file upload
      fileUrl = req.file.path; // Cloudinary URL
      title = req.body.title || req.file.originalname; // Prefer custom title over filename
      fileSize = `${(req.file.size / 1024 / 1024).toFixed(2)} MB`;
    } else if (req.body.resumeUrl) {
      // Handle URL input
      fileUrl = req.body.resumeUrl;
    } else {
      return res.status(400).json({ success: false, message: "No file uploaded or URL provided!" });
    }

    const newResume = {
      title,
      resumeUrl: fileUrl,
      size: fileSize,
      uploadedAt: new Date(),
    };

    student.resumes.push(newResume);
    await student.save();

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully!",
      data: {
        _id: newResume._id,
        title: newResume.title,
        resumeUrl: newResume.resumeUrl,
        size: newResume.size,
      },
    });
  } catch (error) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size exceeds the limit of 5MB.", // Match Multer config
      });
    }
    console.error("Upload Error:", error.message, error.stack); // Enhanced logging
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
export const deleteStudentResume = async (req, res) => {
  try {
    const { rollNumber, resumeId } = req.params;
    const student = await StudentDetails.findOne({ rollNumber });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found!" });
    }

    const resume = student.resumes.find((r) => r._id.toString() === resumeId);
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found!" });
    }

    const publicId = resume.resumeUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`CS-AI_PORTAL/resumes/${publicId}`, { resource_type: "raw" });

    student.resumes = student.resumes.filter((r) => r._id.toString() !== resumeId);
    await student.save();

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully!",
    });
  } catch (error) {
    console.error("Resume Deletion Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const deleteStudentSectionItem = async (req, res) => {
  try {
    const { rollNumber, section, id } = req.params;
    const student = await StudentDetails.findOne({ rollNumber });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const validSections = ["experiences", "education", "certifications", "skills"];
    if (!validSections.includes(section)) {
      return res.status(400).json({ success: false, message: "Invalid section" });
    }

    const item = student[section].find((item) => item._id.toString() === id);
    if (!item) {
      return res.status(404).json({ success: false, message: `${section} item not found` });
    }

    if (section === "experiences" && item.certificate) {
      const publicId = item.certificate.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`CS-AI_PORTAL/certificates/${publicId}`, { resource_type: "raw" });
    } else if (section === "certifications" && item.certificateId) {
      const publicId = item.certificateId.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`CS-AI_PORTAL/certificates/${publicId}`, { resource_type: "raw" });
    }

    student[section] = student[section].filter((item) => item._id.toString() !== id);
    await student.save();

    res.status(200).json({ success: true, message: `${section} item deleted successfully` });
  } catch (error) {
    console.error(`Error deleting ${req.params.section} item:`, error.message);
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
        student.Address = data.location || student.Address; // Maps to frontend 'location'
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
  deleteStudentSectionItem,
  addStudentBatch,
  deleteStudent,
  uploadCertificateFile,
  editStudent,
};