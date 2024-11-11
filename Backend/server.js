import express from "express";

import { jobConn, studentConn } from "./config/db.js"; // Ensure these connections are imported

import jobRoutes from "./routes/job.js";
import appliedJobsRoutes from "./routes/appliedJobs.js";
import studentRoutes from "./routes/student.js";

const app = express();
app.use(express.json()); // Express middleware: to accept JSON data in req.body

// Test Route
app.get("/", (req, res) => {
    res.send("Server is ready!");
});

// Routes for Jobs
app.use("/api/jobs", jobRoutes);
// Routes for AppliedJobs
app.use("/api/appliedJobs", appliedJobsRoutes);
// Routes for Students
app.use("/api/students", studentRoutes);
// Start server and connect to databases

const PORT = 5000;
app.listen(PORT, () => {
    jobConn; // Establish Job DB connection
    studentConn; // Establish Student DB connection
    console.log(`Server Started at Port http://localhost:${PORT}`);
});
