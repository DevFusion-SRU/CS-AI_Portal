import mongoose from "mongoose";
import { studentsDBDB } from "../../config/db.js";

const studentSchema = new mongoose.Schema({
    rollNumber: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    course: { type: String, required: true },
    graduationYear: {type: Number, required: true},
    email: { type: String, required: true },
    mobile: { type: Number, required: false },
    photo: { type: Buffer, required: false }, // Store photo as a binary buffer
    photoType: { type: String, required: false }, // Store the photo MIME type (e.g., 'image/png', 'image/jpeg')
    // timestamps: true //createdAt, updatedAt
});

const Student = demographicDB.model("Student", studentSchema);

export default Student;
