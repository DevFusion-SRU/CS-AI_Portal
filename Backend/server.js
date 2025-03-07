import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http"; // Required for WebSockets
import { Server } from "socket.io";  // Import Socket.io
import connectDB from "./config/db.js";

import jobRoutes from "./routes/job.js";
import appliedJobsRoutes from "./routes/appliedJobs.js";
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/student.js";
import staffRoutes from "./routes/staff.js";
import forumRoutes from "./routes/forum.js";
import jobAnalyticsRoutes from "./routes/jobAnalytics.js"; // ?

dotenv.config();
const app = express();

// Create HTTP Server
const server = createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  },
});

// WebSocket Connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for job application events from students
  socket.on("jobApplied", (data) => {
    console.log("Job applied:", data);
    
    // Broadcast to all admins
    io.emit("updateAdmin", data);
  });

  // Listen for student profile updates
  socket.on("profileUpdated", (data) => {
    console.log("Profile updated:", data);

    // Notify admins
    io.emit("updateAdminProfile", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Configure CORS
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use("/api/forums", forumRoutes);
app.use("/api/jobAnalytics", jobAnalyticsRoutes); // ?

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); // Connect to DB before starting server

    server.listen(PORT, () => {
      console.log(`Server Started on Port ${PORT}`);
    });
  } catch (error) {
    console.error("Error establishing database connection:", error);
    process.exit(1);
  }
};

startServer();
