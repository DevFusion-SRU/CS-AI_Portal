import mongoose from "mongoose";
import { jobConn } from "../config/db.js";

const appliedJobsSchema = new mongoose.Schema({
    rollNumber: { type: String, required: true, unique: true, ref: "Student" },
    jobIds: [ { type: String, ref: "Job" } ],
    // timestamps: true //createdAt, updatedAt
});

const AppliedJobs = jobConn.model("AppliedJobs", appliedJobsSchema);

export default AppliedJobs;
