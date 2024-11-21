import mongoose from "mongoose";
import bcrypt from "bcrypt"; // Import bcrypt for password hashing

import Student from "../models/student.js"; // Student model using studentConn
import Authenticate from "../models/authentication.js"; // Authenticate model using authenticateConn

export const getStudents = async (req, res) => {
    try {
        const students = await Student.find({});
        res.status(200).json({ success: true, data: students });
    } catch (error) {
        console.error("Error in fetching Students: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getStudentDetails = async (req, res) => {
    const { rollNumber } = req.params;
    try {
        const studentDetails = await Student.findOne({ rollNumber });
        if (!studentDetails) {
            return res.status(404).json({ success: false, message: "No details found for this student!" });
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
            response.photo = `data:${studentDetails.photoType};base64,${studentDetails.photo.toString("base64")}`;
        }

        res.status(200).json({ success: true, data: response });
    } catch (error) {
        console.error("Error fetching student details: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const addStudent = async (req, res) => {
    const student = req.body;
    if (!student.rollNumber || !student.firstName || !student.email || !student.course) {
        return res.status(400).json({ success: false, message: "Provide all required fields!" });
    }

    const newStudent = new Student(student);

    try {
        // Save student in the Student collection
        await newStudent.save();

        // Add student entry to Authentication collection
        const hashedPassword = await bcrypt.hash("Student@2025", 10); // Hash the default password
        const newAuthentication = new Authenticate({
            username: student.rollNumber,
            password: hashedPassword,
            role: "student",
        });
        await newAuthentication.save();

        res.status(201).json({ success: true, data: newStudent });
    } catch (error) {
        console.error("Error in adding Student details: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const uploadStudentPhoto = async (req, res) => {
    const { rollNumber } = req.params;

    if (!req.file) {
        return res.status(400).json({ success: false, message: "Photo file is required!" });
    }

    const { buffer, mimetype } = req.file;

    try {
        const student = await Student.findOne({ rollNumber });
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found!" });
        }

        student.photo = buffer;
        student.photoType = mimetype;

        await student.save();
        res.status(200).json({ success: true, message: "Photo uploaded successfully!" });
    } catch (error) {
        console.error("Error uploading photo: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const addStudentBatch = async (req, res) => {
    const students = req.body;

    // Check if the request body is an array
    if (!Array.isArray(students) || students.length === 0) {
        return res.status(400).json({ success: false, message: "Provide an array of students with all required fields!" });
    }

    // Validate each student in the array
    for (const student of students) {
        if (!student.rollNumber || !student.firstName || !student.email || !student.course) {
            return res.status(400).json({ success: false, message: "Each student must include rollNumber, firstName, email, and course!" });
        }
    }

    try {
        // Save all students in bulk using `insertMany`
        const newStudents = await Student.insertMany(students);

        // Add each student to Authentication collection
        const authenticationEntries = await Promise.all(
            students.map(async (student) => {
                const hashedPassword = await bcrypt.hash("Student@2025", 10); // Hash the default password
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
