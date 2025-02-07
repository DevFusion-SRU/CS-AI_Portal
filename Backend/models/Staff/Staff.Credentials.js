import mongoose from "mongoose";
import { authenticateDB } from "../config/db.js";

const AuthenticationSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true }, // Add Reference to Student, Admin
        password: { type: String, required: true },
        resetOtp: { type: String }, // Store OTP temporarily
        resetOtpExpiration: { type: Date }, // Store OTP expiration time
    },
    {timestamps: true} //createdAt, updatedAt
);

const Authenticate = authenticateDB.model("Authenticate", AuthenticationSchema);

export default Authenticate;
