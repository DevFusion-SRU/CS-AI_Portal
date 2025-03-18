import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
import connectDB from "./config/db.js";

import jobRoutes from "./routes/job.js";
import appliedJobsRoutes from "./routes/appliedJobs.js";
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/student.js";
import staffRoutes from "./routes/staff.js";
import jobAnalyticsRoutes from "./routes/jobAnalytics.js"
import noticeRoutes from "./routes/noticeRoutes.js";
import student from "./controllers/student.js";
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
  res.send("Server is running!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/appliedJobs", appliedJobsRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/jobs/analytics", jobAnalyticsRoutes);
app.use("/api/notices", noticeRoutes);
// Start server
const PORT = process.env.PORT || 5000;
// app.get("/api/students/:username", async (req, res) => {
//   try {
//     const { username } = req.params;
//     const student = await student.findOne({ username }); // Adjust for your DB
//     if (!student) {
//       return res.status(404).json({ success: false, message: "No details found for this student!" });
//     }
//     res.json({ success: true, data: student });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });


const startServer = async () => {
  try {
    // Wait for the DB connection to be established
    await connectDB();

    // Once DB is connected, the server starts
    app.listen(PORT, () => {
      console.log(`Server Started on Port ${PORT}`);
    });
  } catch (error) {
    console.error("Error establishing database connection:", error);
    process.exit(1); // Exit the server if the DB connection fails
  }
};

startServer();
