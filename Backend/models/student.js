import mongoose from "mongoose";
import { studentConn } from "../config/db.js";

const studentSchema = new mongoose.Schema({
    rollNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    course: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: Number, required: false },
    // timestamps: true //createdAt, updatedAt
});

const Student = studentConn.model("Student", studentSchema);

export default Student;
