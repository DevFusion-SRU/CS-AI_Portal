import mongoose from "mongoose";
import { demographicConn } from "../config/db.js";

const adminSchema = new mongoose.Schema({
    employeeId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    department: { type: String, required: false },
    email: { type: String, required: true },
    mobile: { type: Number, required: false },
    photo: { type: Buffer, required: false }, // Store photo as a binary buffer
    photoType: { type: String, required: false }, // Store the photo MIME type (e.g., 'image/png', 'image/jpeg')
    // timestamps: true //createdAt, updatedAt
});

const Admin = demographicConn.model("Amin", adminSchema);

export default Admin;
