import mongoose from "mongoose";
import { studentDB } from "../../config/db.js";

const studentCredentialsSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true }, // Add Reference to Student, Admin
        password: { type: String, required: true },
        resetOtp: { type: String }, // Store OTP temporarily
        resetOtpExpiration: { type: Date }, // Store OTP expiration time
    },
    {timestamps: true} //createdAt, updatedAt
);

const StudentCredentials = studentDB.model("Authenticate", studentCredentialsSchema);

export default StudentCredentials;
