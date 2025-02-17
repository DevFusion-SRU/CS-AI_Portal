import mongoose from "mongoose";
import { staffDB } from "../../config/db.js";

const staffCredentialsSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true, ref: "Student" }, // Add Reference to Student, Admin
        password: { type: String, required: true },
        role: { type: String, required: true },
        resetOtp: { type: String }, // Store OTP temporarily
        resetOtpExpiration: { type: Date }, // Store OTP expiration time
    },
    {timestamps: true} //createdAt, updatedAt
);

const StaffCredentials = staffDB.model("Credentials", staffCredentialsSchema);

export default StaffCredentials;
