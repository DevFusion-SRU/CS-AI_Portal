import express from "express";
import multer from "multer";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import {
    addStudent,
    addStudentBatch,
    getStudentDetails,
    getStudents,
    uploadStudentPhoto
} from "../controllers/student.js";

const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage(); // Store file in memory as a Buffer
const upload = multer({ storage });

// Admin-only routes for adding or updating student data
router.post("/", authenticateToken, authorizeRole("admin"), addStudent);
router.post("/batch", authenticateToken, authorizeRole("admin"), addStudentBatch);

// Accessible by both admin and students
router.get("/", authenticateToken, authorizeRole("admin"), getStudents);
router.get("/:rollNumber", authenticateToken, authorizeRole("student"), getStudentDetails);
router.patch("/:rollNumber/photo", authenticateToken, authorizeRole("student"), upload.single("photo"), uploadStudentPhoto);

export default router;
