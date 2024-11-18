import express from "express";
import { addStudent, addStudentBatch, getStudentDetails, getStudents } from "../controllers/student.js";

const router = express.Router();

router.get("/", getStudents);
router.get("/:rollNumber", getStudentDetails),
router.post("/", addStudent);
router.post("/batch", addStudentBatch);

export default router;
