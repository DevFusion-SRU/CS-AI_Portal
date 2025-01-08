import mongoose from "mongoose";
import { jobConn } from "../config/db.js";

const jobSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: false },
    company: { type: String, required: true },
    description: { type: String, required: false },
    applyLink: { type: String, required: true },
    // timestamps: true //createdAt, updatedAt
});

const Job = jobConn.model("Job", jobSchema);

export default Job;
