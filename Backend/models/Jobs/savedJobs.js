import mongoose from "mongoose";
import { jobDB } from "../../config/db.js";

const savedJobsSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true,
    index: true // Adding index for faster queries
  },
  jobIds: [{
    type: String,
    required: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
savedJobsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});


const SavedJobs = jobDB.model("SavedJobs", savedJobsSchema);
export default SavedJobs;