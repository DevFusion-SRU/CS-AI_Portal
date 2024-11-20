import mongoose from "mongoose";
import { authenticateConn } from "../config/db.js";

const AuthenticationSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Add Reference to Student, Admin
    password: { type: String, required: true },
    role: { type: String, required: true },
    // timestamps: true //createdAt, updatedAt
});

const Authenticate = authenticateConn.model("Authenticate", AuthenticationSchema);

export default Authenticate;
