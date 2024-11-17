import mongoose from "mongoose";
import { studentConn } from "../config/db.js";

const studentSchema = new mongoose.Schema({
    rollNumber: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    course: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: Number, required: false },
    // timestamps: true //createdAt, updatedAt
});

const Student = studentConn.model("Student", studentSchema);

export default Student;
