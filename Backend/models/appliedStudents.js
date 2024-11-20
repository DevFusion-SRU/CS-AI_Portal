import mongoose from "mongoose";
import { jobConn } from "../config/db.js";

const appliedStudentsSchema = new mongoose.Schema({
    jobId: { type: String, required: true, unique: true, ref: "Job" },
    views: [ { type: String, ref: "Student" } ],
    applications: [ { type: String, ref: "Student" } ],

    // timestamps: true //createdAt, updatedAt
});

const AppliedStudents = jobConn.model("AppliedStudents", appliedStudentsSchema);

export default AppliedStudents;
