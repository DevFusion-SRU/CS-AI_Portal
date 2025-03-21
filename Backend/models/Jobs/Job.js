import mongoose from "mongoose";
import { jobDB } from "../../config/db.js";

const jobSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ["Full-time", "Internship", "Hackathon", "part-time"]
  },
  company: { type: String, required: true },
  location: { type: String, required: false },
  deadline: { type: String, required: false },
  stipend: { type: Number, required: false },
  category: { type: String, required: false },
  modeOfWork: {
    type: String,
    enum: ["In-office", "Remote", "Hybrid"],
    required: true,
  },
  compensationType: {
    type: String,
    enum: ["Paid", "Unpaid", "Stipend-based"],
    required: false,
  },
  description: {
    type: {
      text: { type: String, required: true },        
      requirements: {                                   
        experience: { type: String, required: false },  
        tools: { type: [String], required: false },    
        skills: { type: [String], required: false },    
        platforms: { type: [String], required: false }, 
        team: { type: String, required: false },        
        bonus: { type: [String], required: false },  
      },
      benefits: {                                       
        salary: { type: String, required: false },   
        health: { type: String, required: false },      
        learning: { type: String, required: false },   
        workOptions: { type: String, required: false }, 
      },
    },
    required: false,
  },
  applyLink: { type: String, required: true },
}, { timestamps: true });

const Job = jobDB.model("Job", jobSchema);
export default Job;