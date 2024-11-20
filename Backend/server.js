import express from "express";
import cors from "cors"
import dotenv from "dotenv";
dotenv.config();
const corsOptions={
    origin:["http://localhost:5173"]
}


import { jobConn, demographicConn } from "./config/db.js"; // Ensure these connections are imported

import jobRoutes from "./routes/job.js";
import appliedJobsRoutes from "./routes/appliedJobs.js";
import studentRoutes from "./routes/student.js";

const app = express();
app.use(express.json());
app.use(cors(corsOptions))
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Specify allowed origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
 // Express middleware: to accept JSON data in req.body

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
    demographicConn; // Establish Student DB connection
    console.log(`Server Started at Port http://localhost:${PORT}`);
});