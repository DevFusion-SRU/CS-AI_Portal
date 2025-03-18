import mongoose from "mongoose";

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

// Ensure unique combination of rollNumber and jobIds
savedJobsSchema.index({ rollNumber: 1, jobIds: 1 }, { unique: true });

const SavedJobs = mongoose.model("SavedJobs", savedJobsSchema);
export default SavedJobs;