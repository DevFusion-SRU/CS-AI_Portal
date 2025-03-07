import mongoose from "mongoose";
import { jobDB } from "../../config/db.js";

const jobSchema = new mongoose.Schema({
    jobId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    type: { 
        type: String, 
        required: true,
        enum: ["Full-time", "Internship", "Hackathon","part-time"]  // 🔹 Job type filter
    },
    company: { type: String, required: true },

    location: { type: String, required:false },
    deadline: { type: String, required: false },
    stipend: { type: Number, required: false },

    category: {
        type: String,
        required: false, // 🔹 Industry / Category filter
    },

    modeOfWork: {
        type: String,
        enum: ["In-office", "Remote", "Hybrid"],
        required: true, // 🔹 Mode of work filter
    },

    compensationType: {
        type: String,
        enum: ["Paid", "Unpaid", "Stipend-based"],
        required: false, // 🔹 Compensation type filter
    },

    description: {
        type: {
            text: { type: String, required: true },  // General job description
            requirements: { type: [String], required: false },  // List of job requirements
            skills: { type: [String], required: false },  // List of required skills
        },
        required: false,
    },

    applyLink: { type: String, required: true },
}, { timestamps: true } // Enables createdAt and updatedAt
);

const Job = jobDB.model("Job", jobSchema);

export default Job;
