import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import { jobConn, demographicConn, authenticateConn } from "./config/db.js";

import jobRoutes from "./routes/job.js";
import appliedJobsRoutes from "./routes/appliedJobs.js";
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/student.js";
import adminRoutes from "./routes/admin.js";

const app = express();

// Configure CORS options
const corsOptions = {
  origin: process.env.CLIENT_URL, // Allow requests from the client
  credentials: true, // Allow cookies to be sent
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};

// Middleware
app.use(cors(corsOptions)); // Enable CORS with the specified options
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Test Route
app.get("/", (req, res) => {
  res.send("Server is ready!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/appliedJobs", appliedJobsRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/admins", adminRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  authenticateConn; // Establish Authentication DB connection
  jobConn; // Establish Job DB connection
  demographicConn; // Establish Student DB connection
  console.log(`Server Started at Port http://localhost:${PORT}`);
});
