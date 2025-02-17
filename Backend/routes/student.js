import express from "express";
import multer from "multer";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import {
    addStudent,
    addStudentBatch,
    deleteStudent,
    getStudentDetails,
    getStudents,
    uploadStudentPhoto
} from "../controllers/student.js";

const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage(); // Store file in memory as a Buffer
const upload = multer({ storage });

// Admin-only routes for adding, updating, or retrieving students data
router.get("/", authenticateToken, authorizeRole("staff"), getStudents);
router.post("/", authenticateToken, authorizeRole("staff"), addStudent);
router.post("/batch", authenticateToken, authorizeRole("staff"), addStudentBatch);
router.delete("/:rollNumber", authenticateToken, authorizeRole("staff"), deleteStudent);

// Accessible by both admin and students
router.get("/:rollNumber", authenticateToken, authorizeRole(["staff", "student"]), getStudentDetails);

// Student-only route for uploading student photo
router.patch("/:rollNumber/photo", authenticateToken, authorizeRole("student"), upload.single("photo"), uploadStudentPhoto);

export default router;
