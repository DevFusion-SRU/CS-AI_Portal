import express from "express";
import mongoose from "mongoose";

import Student from "../models/student.js"; // Student model using studentConn

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const students = await Student.find({});
        res.status(200).json({ success: true, data: students });
    } catch (error) {
        console.error("Error in fetching Students: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.post("/", async (req, res) => {
    const student = req.body;
    if (!student.rollNumber || !student.name || !student.email || !student.course) {
        return res.status(400).json({ success: false, message: "Provide all required fields!!" });
    }

    const newStudent = new Student(student);
    try {
        await newStudent.save();
        res.status(201).json({ success: true, data: newStudent });
    } catch (error) {
        console.error("Error in entering Student details: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.post("/batch", async (req, res) => {
    const students = req.body;

    // Check if the request body is an array
    if (!Array.isArray(students) || students.length === 0) {
        return res.status(400).json({ success: false, message: "Provide an array of students with all required fields!" });
    }

    // Validate each student in the array
    for (const student of students) {
        if (!student.rollNumber || !student.name || !student.email || !student.course) {
            return res.status(400).json({ success: false, message: "Each student must include rollNumber, name, email, and course!" });
        }
    }

    try {
        // Save all students in bulk using `insertMany`
        const newStudents = await Student.insertMany(students);
        res.status(201).json({ success: true, data: newStudents });
    } catch (error) {
        console.error("Error in entering Student details: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

export default router;
