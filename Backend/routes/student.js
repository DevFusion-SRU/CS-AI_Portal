import express from "express";
import multer from "multer";
import { addStudent, addStudentBatch, getStudentDetails, getStudents, uploadStudentPhoto } from "../controllers/student.js";

const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage(); // Store file in memory as a Buffer
const upload = multer({ storage });

router.get("/", getStudents);
router.get("/:rollNumber", getStudentDetails),
router.post("/", addStudent);
router.post("/batch", addStudentBatch);
router.patch("/:rollNumber/photo", upload.single("photo"), uploadStudentPhoto);

export default router;
