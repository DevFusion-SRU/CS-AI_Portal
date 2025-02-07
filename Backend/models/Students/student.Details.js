import mongoose from "mongoose";
import { studentDB } from "../../config/db.js";
import StudentCredentials from "./student.credentials.js"; // Import Credentials Model
import bcrypt from "bcrypt"; // For password hashing
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const studentSchema = new mongoose.Schema(
    {
        rollNumber: { type: String, required: true, unique: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: false },
        course: { type: String, required: true },
        graduationYear: { type: Number, required: true },
        email: { type: String, required: true },
        mobile: { type: Number, required: false },
        photo: { type: Buffer, required: false }, // Store photo as a binary buffer
        photoType: { type: String, required: false }, // Store the photo MIME type (e.g., 'image/png', 'image/jpeg')
    },
    { timestamps: true } // createdAt, updatedAt
);

// Middleware: Automatically create credentials after saving student
studentSchema.post("save", async function (doc, next) {
    try {
        // Hash the default password from environment variables
        const defaultPassword = process.env.STUDENT_PASSWORD ; // Fallback if not defined
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        // Create and save credentials
        const newAuthentication = new StudentCredentials({
            username: doc.rollNumber, // Same as rollNumber
            password: hashedPassword, // Hashed password
            role: "student", // Ensure this field exists in StudentCredentials schema
        });

        await newAuthentication.save();
        console.log(`Credentials created for student: ${doc.rollNumber}`);
    } catch (error) {
        console.error("Error creating student credentials:", error);
    }
    next();
});

const StudentDetails = studentDB.model("Student", studentSchema);

export default StudentDetails;
