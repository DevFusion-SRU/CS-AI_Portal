// models/Jobs/savedJobs.js
import mongoose from "mongoose";

const savedJobsSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, index: true }, // Student's rollNumber
  jobIds: [{ type: String }], // Array of jobIds the student saved
});

export default mongoose.model("SavedJobs", savedJobsSchema);