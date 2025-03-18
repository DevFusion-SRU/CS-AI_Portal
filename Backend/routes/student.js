import express from "express";
import multer from "multer";
// import { uploadResume, atsResumeChecker } from "../middleware/resumeCheck.js";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import {
    addStudent,
    addStudentBatch,
    deleteStudent,
    getStudentDetails,
    getStudents,
    uploadStudentPhoto,
    uploadStudentResume,
    deleteStudentResume,
    uploadCertificateFile,
    editStudent
} from "../controllers/student.js";

const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage(); // Store file in memory as a Buffer
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Admin-only routes for adding, updating, or retrieving students data
router.get("/", authenticateToken, authorizeRole("staff"), getStudents);
router.post("/", authenticateToken, authorizeRole("staff"), addStudent);
router.post("/batch", authenticateToken, authorizeRole("staff"), addStudentBatch);
router.delete("/:rollNumber", authenticateToken, authorizeRole("staff"), deleteStudent);

// Accessible by both admin and students
router.get("/:rollNumber", authenticateToken, authorizeRole(["staff", "student"]), getStudentDetails);

// Student-only route for uploading student photo
router.patch("/:rollNumber/photo", authenticateToken, authorizeRole("student"), upload.single("photo"), uploadStudentPhoto);

router.post("/:rollNumber/resume", authenticateToken, authorizeRole("student"), upload.single("resume"), uploadStudentResume);

// router.post(
//     "/:rollNumber/resume",
//     authenticateToken,      // Auth middleware
//     authorizeRole("student"), // Only students can upload
//     uploadResume,          // Upload using Multer (memory storage)
//     atsResumeChecker,      // ATS compliance check
//     uploadStudentResume    // Proceed with upload if ATS check passes
// );

router.delete("/resume/:rollNumber/:resumeId", authenticateToken, deleteStudentResume);

router.patch("/profile/:rollNumber/:section/:id/certificate", upload.single("certificate"), uploadCertificateFile);

router.patch("/edit/:rollNumber", authenticateToken, authorizeRole("student"), editStudent);

export default router;
