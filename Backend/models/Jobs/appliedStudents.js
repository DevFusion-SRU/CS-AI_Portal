import mongoose from "mongoose";
import { jobDB } from "../../config/db.js";

const appliedStudentsSchema = new mongoose.Schema({
    jobId: { type: String, required: true, unique: true, ref: "Job" },
    views: [ { type: String, ref: "Student" } ],
    applications: [ { type: String, ref: "Student" } ],

}, { timestamps: true } // Enables createdAt and updatedAt
);

const AppliedStudents = jobDB.model("AppliedStudents", appliedStudentsSchema);

export default AppliedStudents;
