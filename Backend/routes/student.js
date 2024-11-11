import express from "express";
import { addStudent, addStudentBatch, getStudents } from "../controllers/student.js";

const router = express.Router();

router.get("/", getStudents);
router.post("/", addStudent);
router.post("/batch", addStudentBatch);

export default router;
