import mongoose from "mongoose";
import bcrypt from "bcrypt"; // Import bcrypt for password hashing
import dotenv from "dotenv";
dotenv.config();

import StudentDetails from "../models/Students/Student.Details.js"; // StudentDetails model using studentDB
import StudentCredentials from "../models/Students/Student.Credentials.js"; // StudentCredentials model using studentDB

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
      lastName: studentDetails.lastName,
      course: studentDetails.course,
      email: studentDetails.email,
      mobile: studentDetails.mobile,
    };

    if (studentDetails.photo && studentDetails.photoType) {
      response.photo = `data:${
        studentDetails.photoType
      };base64,${studentDetails.photo.toString("base64")}`;
    }

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
  // const { rollNumber } = req.params;

  // if (!req.file) {
  //     return res.status(400).json({ success: false, message: "Photo file is required!" });
  // }

  // const { buffer, mimetype } = req.file;

  // try {
  //     const student = await StudentDetails.findOne({ rollNumber });
  //     if (!student) {
  //         return res.status(404).json({ success: false, message: "Student not found!" });
  //     }

  //     student.photo = buffer;
  //     student.photoType = mimetype;

  //     await StudentDetails.save();
  //     res.status(200).json({ success: true, message: "Photo uploaded successfully!" });
  // } catch (error) {
  //     console.error("Error uploading photo: ", error.message);
  //     res.status(500).json({ success: false, message: "Server Error" });
  // }

  try {
    const { rollNumber } = req.params; // Get rollNumber from URL params

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded!" });
    }

    const fileUrl = req.file.path; // Cloudinary file URL

    // Find the student by rollNumber
    const student = await StudentDetails.findOne({ rollNumber });

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found!" });
    }

    // Update the student document with the Cloudinary URL
    student.photoUrl = fileUrl;

    await student.save(); // Save the updated student record

    res.status(200).json({
      success: true,
      message: "Photo uploaded successfully!",
      fileUrl,
    });
  } catch (error) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size exceeds the limit of 2MB.",
      });
    }

    console.error("Upload Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};




export const uploadStudentResume = async (req, res) => {
  try {
    const { rollNumber } = req.params; // Get rollNumber from URL params

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded!" });
    }

    const fileUrl = req.file.path; // Cloudinary file URL

    // Find the student by rollNumber
    const student = await StudentDetails.findOne({ rollNumber });

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found!" });
    }
    if (student.resumes.length >= 3) {
        return res.status(400).json({
            success: false,
            message: "You can upload a maximum of 3 resumes.",
        });
    }

    // Add the new resume to the array
    student.resumes.push({ resumeUrl: fileUrl });

    await student.save(); // Save the updated student record

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully!",
      fileUrl,
    });
  } catch (error) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size exceeds the limit of 2MB.",
      });
    }

    console.error("Upload Error:", error.message);
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
