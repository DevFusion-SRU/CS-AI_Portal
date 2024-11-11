import express from "express";
import dotenv from "dotenv";
import { jobConn, studentConn } from "./config/db.js"; // Ensure these connections are imported
import Job from "./models/job.js"; // Job model using jobConn
import Student from "./models/student.js"; // Student model using studentConn

dotenv.config();

const app = express();
app.use(express.json()); // Express middleware: to accept JSON data in req.body

// Test Route
app.get("/", (req, res) => {
    res.send("Server is ready!");
});

// Routes for Jobs
app.get("/api/jobs", async (req, res) => {
    try {
        const jobs = await Job.find({});
        res.status(200).json({ success: true, data: jobs });
    } catch (error) {
        console.error("Error in fetching Jobs: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

app.post("/api/jobs", async (req, res) => {
    const job = req.body;
    if (!job.id || !job.name || !job.company || !job.applyLink) {
        return res.status(400).json({ success: false, message: "Provide all required fields!!" });
    }

    const newJob = new Job(job);
    try {
        await newJob.save();
        res.status(201).json({ success: true, data: newJob });
    } catch (error) {
        console.error("Error in entering Job details: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

app.post("/api/jobs/batch", async (req, res) => {
    const jobs = req.body;

    // Check if the request body is an array
    if (!Array.isArray(jobs) || jobs.length === 0) {
        return res.status(400).json({ success: false, message: "Provide an array of jobs with all required fields!" });
    }

    // Validate each job in the array
    for (const job of jobs) {
        if (!job.id || !job.name || !job.company || !job.applyLink) {
            return res.status(400).json({ success: false, message: "Each job must include id, name, company, and applyLink!" });
        }
    }

    try {
        // Save all jobs in bulk using `insertMany`
        const newJobs = await Job.insertMany(jobs);
        res.status(201).json({ success: true, data: newJobs });
    } catch (error) {
        console.error("Error in entering Job details: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

app.delete("/api/jobs/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const job = await Job.findOneAndDelete({ id: id });
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found!" });
        }

        res.status(200).json({ success: true, message: "Job deleted" });
    } catch (error) {
        console.error("Error deleting job: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// Routes for Students
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find({});
        res.status(200).json({ success: true, data: students });
    } catch (error) {
        console.error("Error in fetching Students: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

app.post("/api/students", async (req, res) => {
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

app.post("/api/students/batch", async (req, res) => {
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


// Start server and connect to databases
const PORT = 5000;
app.listen(PORT, () => {
    jobConn; // Establish Job DB connection
    studentConn; // Establish Student DB connection
    console.log(`Server Started at Port http://localhost:${PORT}`);
});
