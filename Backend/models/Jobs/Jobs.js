import mongoose from "mongoose";
import { jobDB } from "../../config/db.js";

const jobSchema = new mongoose.Schema({
    jobId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    company: { type: String, required: true },

    location: { type: String, required: true },
    deadline: { type: Date, required: false },
    stipend: { type: Number, required: false },

    description: {
        type: {
            text: { type: String, required: true },  // General job description
            requirements: { type: [String], required: false },  // List of job requirements
            skills: { type: [String], required: false },  // List of required skills
        },
        required: false,
    },

    applyLink: { type: String, required: true },
}, { timestamps: true }); // Enables createdAt and updatedAt

const Job = jobDB.model("Job", jobSchema);

export default Job;
