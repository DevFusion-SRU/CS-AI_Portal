import mongoose from "mongoose";
import axios from "axios";
import bcrypt from "bcrypt"; // Import bcrypt for password hashing
import dotenv from "dotenv";
import sharp from "sharp"; // Import Sharp for image resizing
import { getProfilePhoto } from "../utils/profilePhoto.js";

dotenv.config();
import cloudinary from "../config/cloudinary.js"; // Import Cloudinary config
import StudentDetails from "../models/Students/Student.Details.js"; // StudentDetails model using studentDB
import StudentCredentials from "../models/Students/Student.Credentials.js"; // StudentCredentials model using studentDB
import StudentFiles from "../models/Students/Student.Files.js"; // StudentFiles model using studentDB

export const getStudents = async (req, res) => {
  const { rollNumber, firstName, lastName } = req.query;

  // Ensure only one filter is applied at a time
  if (
    (rollNumber && firstName) ||
    (rollNumber && lastName) ||
    (firstName && lastName)
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Only one search filter (rollNumber, firstName, or lastName) is allowed at a time.",
    });
  }

  const filters = {};

  if (rollNumber) {
    filters.rollNumber = new RegExp(rollNumber.trim(), "i"); // Case-insensitive regex search
  } else if (firstName) {
    filters.firstName = new RegExp(firstName.trim(), "i"); // Case-insensitive search
  } else if (lastName) {
    filters.lastName = new RegExp(lastName.trim(), "i"); // Case-insensitive search
  }

  try {
    // Pagination setup
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 25; // Default to 25 students per page
    const skip = (page - 1) * limit;

    // Fetch only necessary fields to optimize the data size
    const fields = "rollNumber firstName lastName course email mobile"; // No photo

    // Parallelize querying students and counting documents to reduce response time
    const [students, totalStudents] = await Promise.all([
      StudentDetails.find(filters).skip(skip).limit(limit).select(fields), // Students query with pagination and fields projection
      StudentDetails.countDocuments(filters), // Count the filtered documents (optional but helps with pagination info)
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
      totalPages: Math.ceil(totalStudents / limit), // Total pages based on filtered students
      currentPage: page,
    });
  } catch (error) {
    console.error("Error in fetching Students: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
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
      address: studentDetails.Address || "",
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
    // if (studentDetails.photo && studentDetails.photoType) {
      try {
        // ✅ Resize the image while maintaining original dimensions
        // const resizedImageBuffer = await sharp(studentDetails.photo)
        //   .resize({ width: 400, height: 400, fit: "cover" }) // Center cropping
        //   .toBuffer();

        // // ✅ Convert to Base64
        response.photo = await getProfilePhoto(rollNumber, "Student", 400);
      } catch (error) {
        console.error("Error processing image:", error.message);
        response.photo = null;
      }
    // } else {
    //   response.photo = null; // If no photo exists, return null
    // }

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error("Error fetching student details: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
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
    return res
      .status(400)
      .json({ success: false, message: "Provide all required fields!" });
  }

  const newStudent = new StudentDetails(student);

  try {
    // Save student in the Student collection
    await newStudent.save();

    // Add student entry to Authentication collection
    const hashedPassword = await bcrypt.hash(process.env.STUDENT_PASSWORD, 10); // Hash the default password
    const newAuthentication = new StudentCredentials({
      username: student.rollNumber,
      password: hashedPassword,
      role: "student",
    });
    await newAuthentication.save();

    res.status(201).json({ success: true, data: newStudent });
  } catch (error) {
    // Check if it's a duplicate key error (unique constraint violation)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Student with this Roll Number already exists!",
      });
    }
    console.error("Error in adding Student details: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
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
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const addStudentBatch = async (req, res) => {
  const students = req.body;

  // Check if the request body is an array
  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Provide an array of students with all required fields!",
    });
  }

  // Validate each student in the array
  for (const student of students) {
    if (
      !student.rollNumber ||
      !student.firstName ||
      !student.email ||
      !student.course
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Each student must include rollNumber, firstName, email, and course!",
      });
    }
  }

  try {
    // Save all students in bulk using `insertMany`
    const newStudents = await StudentDetails.insertMany(students);

    // Add each student to Authentication collection
    const authenticationEntries = await Promise.all(
      students.map(async (student) => {
        const hashedPassword = await bcrypt.hash(
          process.env.STUDENT_PASSWORD,
          10
        ); // Hash the default password
        return {
          username: student.rollNumber,
          password: hashedPassword,
          role: "student",
        };
      })
    );
    await Authenticate.insertMany(authenticationEntries); // Bulk insert into Authentication collection

    res.status(201).json({ success: true, data: newStudents });
  } catch (error) {
    console.error("Error in entering Student details: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteStudent = async (req, res) => {
  const { rollNumber } = req.params;

  if (!rollNumber) {
    return res
      .status(400)
      .json({ success: false, message: "Roll number is required!" });
  }

  try {
    // Delete student from the Student collection
    const deletedStudent = await StudentDetails.findOneAndDelete({
      rollNumber,
    });

    if (!deletedStudent) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found!" });
    }

    // Delete student entry from the Authentication collection
    const deletedAuth = await Authenticate.findOneAndDelete({
      username: rollNumber,
    });

    if (!deletedAuth) {
      console.error(
        "Authentication record not found for roll number:",
        rollNumber
      );
    }

    res.status(200).json({
      success: true,
      message: "Student and authentication records deleted successfully!",
    });
  } catch (error) {
    console.error("Error in deleting Student details: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Upload Certificate for Experience or Certification
export const uploadCertificateFile = async (req, res) => {
    try {
        const { rollNumber, section, id } = req.params;

        if (!rollNumber || !section || !id) {
            return res.status(400).json({ message: "Missing required parameters" });
        }

        const student = await StudentDetails.findOne({ rollNumber });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const certificateUrl = req.file.path; // Cloudinary URL

        let updated = false;

        if (section === "experiences") {
            student.experiences = student.experiences.map((exp) =>
                exp._id.toString() === id ? { ...exp, certificate: certificateUrl } : exp
            );
            updated = true;
        } else if (section === "certifications") {
            student.certifications = student.certifications.map((cert) =>
                cert._id.toString() === id ? { ...cert, certificateId: certificateUrl } : cert
            );
            updated = true;
        }

        if (!updated) {
            return res.status(400).json({ message: "Invalid section or ID" });
        }

        await student.save();
        res.status(200).json({ message: "Certificate uploaded successfully", certificateUrl });

    } catch (error) {
        console.error("Error uploading certificate:", error);
        res.status(500).json({ message: "Internal server error" });
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

        switch (section) {
            case "experiences":
            case "education":
            case "certifications":
                if (!Array.isArray(data)) {
                    return res.status(400).json({ success: false, message: "Data should be an array" });
                }
                student[section] = mergeData(student[section], data);
                break;

            case "skills":
            case "resumes":
                student[section] = data;
                break;

            case "profile":
                Object.assign(student, data);
                break;

            default:
                return res.status(400).json({ success: false, message: "Invalid section" });
        }

        await student.save();
        res.status(200).json({ success: true, message: "Profile updated successfully", data: student });

    } catch (error) {
        console.error("Error updating student profile:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const mergeData = (existingData, newData) => {
  const dataMap = new Map(existingData.map(item => [item._id?.toString(), item]));

  newData.forEach(item => {
      if (item._id && dataMap.has(item._id.toString())) {
          Object.assign(dataMap.get(item._id.toString()), item);
      } else {
          dataMap.set(item._id?.toString() || new mongoose.Types.ObjectId(), item);
      }
  });

  return Array.from(dataMap.values());
};
