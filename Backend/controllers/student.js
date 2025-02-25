import mongoose from "mongoose";
import axios from "axios";
import bcrypt from "bcrypt"; // Import bcrypt for password hashing
import dotenv from "dotenv";
dotenv.config();
import cloudinary from "../config/cloudinary.js"; // Import Cloudinary config
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

    // 🔹 Check if photo URL exists
    if (studentDetails.photoUrl) {
      try {
        // ✅ Resize image dynamically using Cloudinary URL transformation
        const resizedImageUrl = studentDetails.photoUrl.replace(
          "/upload/",
          "/upload/w_400,h_400,c_fill,q_auto/"
        );

        // ✅ Fetch the resized image from Cloudinary
        const imgResponse = await axios.get(resizedImageUrl, {
          responseType: "arraybuffer",
        });

        // ✅ Extract MIME type dynamically
        const contentType = imgResponse.headers["content-type"];

        // ✅ Convert image to Base64 format
        response.photo = `data:${contentType};base64,${Buffer.from(imgResponse.data).toString("base64")}`;
        
      } catch (error) {
        console.error("Error fetching or converting image:", error.message);
        response.photo = null; // If image fetch fails, return null
      }
    } else {
      response.photo = null; // If no photo exists, return null
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

    // Resize Image URL (Cloudinary transformation)
    const resizedImageUrl = fileUrl.replace(
      "/upload/",
      "/upload/w_400,h_400,c_fill/"
    );

    const response = await axios.get(resizedImageUrl, {
      responseType: "arraybuffer",
    });

    // Extract MIME type dynamically
    const contentType = response.headers["content-type"]; // e.g., "image/png" or "image/jpeg"

    // Convert to Base64
    const base64Image = `data:${contentType};base64,${Buffer.from(
      response.data
    ).toString("base64")}`;

    res.status(200).json({
      success: true,
      message: "Photo uploaded successfully!",
      image: base64Image, // 🔹 Sending Base64 instead of URL
    });
  } catch (error) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size exceeds the limit of 2MB.",
      });
    }

    // Handle invalid file types for profile images
    if (error.message.includes("Invalid image type")) {
      return res.status(400).json({
        success: false,
        message: "Only JPG, JPEG, and PNG files are allowed for images!",
      });
    }

    // Handle invalid file types for resumes
    if (error.message.includes("Invalid resume type")) {
      return res.status(400).json({
        success: false,
        message: "Only PDF and DOCX files are allowed for resumes!",
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



export const deleteStudentResume = async (req, res) => {
  try {
    const { rollNumber, resumeId } = req.params;// Get rollNumber & resumeId from URL params

    // Find the student by rollNumber
    const student = await StudentDetails.findOne({ rollNumber });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found!" });
    }

    // Find the resume to delete
    const resume = student.resumes.find((r) => r._id.toString() === resumeId);

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found!" });
    }

    // Extract public ID from the Cloudinary URL
    const publicId = resume.resumeUrl.split("/").pop().split(".")[0];

    // Delete the file from Cloudinary
    await cloudinary.uploader.destroy(`CS-AI_PORTAL/resumes/${publicId}`, { resource_type: "raw" });

    // Remove the resume from the array
    student.resumes = student.resumes.filter((r) => r._id.toString() !== resumeId);

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
    const { rollNumber } = req.params; // Assuming rollNumber is extracted from authentication middleware
    const { section, data } = req.body;

    console.log("Received section:", section);
    console.log("Received data:", data);


    try {
        const student = await StudentDetails.findOne({ rollNumber });

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        let updated = false;

        // 🔹 Update Experiences
        if (section === "experiences") {
            student.experiences = data;
            updated = true;
        }
        // 🔹 Update Education
        else if (section === "education") {
            student.education = data;
            updated = true;
        }
        // 🔹 Update Certifications
        else if (section === "certifications") {
            student.certifications = data;
            updated = true;
        }
        // 🔹 Update Skills
        else if (section === "skills") {
            student.skills = data;
            updated = true;
        }
        // 🔹 Update Resume
        else if (section === "resumes") {
            student.resumes = data;
            updated = true;
        }
        // 🔹 Update Profile Details
        else if (section === "profile") {
            const { gender, Address, personalMail, mobile, website, about } = data;
            student.gender = gender || student.gender;
            student.Address = Address || student.Address;
            student.personalMail = personalMail || student.personalMail;
            student.mobile = mobile || student.mobile;
            student.website = website || student.website;
            student.about = about || student.about;
            updated = true;
        } else {
            return res.status(400).json({ success: false, message: "Invalid section" });
        }

        if (updated) {
            await student.save();
            return res.status(200).json({ success: true, message: "Profile updated successfully", data: student });
        }

        res.status(400).json({ success: false, message: "No updates were made" });

    } catch (error) {
        console.error("Error updating student profile:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
