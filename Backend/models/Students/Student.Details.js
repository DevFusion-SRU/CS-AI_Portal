import mongoose from "mongoose";
import { studentDB } from "../../config/db.js";

const studentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: false },
  course: { type: String, required: true },
  graduationYear: { type: Number, required: true },
  email: { type: String, required: true },
  gender: { type: String, required: false },
  address: { type: String, required: false }, // Maps to UI's 'location'
  personalMail: { type: String, required: false },
  mobile: { type: String, required: false }, // String to support formats like "+919876543210"
  website: { type: String, required: false },
  about: { type: String, required: false },

  experiences: [{
    title: { type: String, required: false },
    company: { type: String, required: false },
    duration: {
      startDate: { type: Date, required: false },
      endDate: { type: Date, required: false },
    },
    location: { type: String, required: false },
    description: { type: String, required: false },
    certificate: { type: String, required: false },
  }],

  education: [{
    institution: { type: String, required: false },
    degree: { type: String, required: false },
    specialization: { type: String, required: false },
    duration: {
      startDate: { type: Date, required: false },
      endDate: { type: Date, required: false },
    },
    cgpa: { type: String, required: false },
  }],

  certifications: [{
    title: { type: String, required: false }, // Frontend 'provider'
    issuer: { type: String, required: false },
    courseName: { type: String, required: false }, // Frontend 'title'
    validTime: {
      startDate: { type: Date, required: false },
      endDate: { type: Date, required: false },
    },
    certificateId: { type: String, required: false }, // Frontend 'certificateUrl'
  }],

  skills: [{
    name: { type: String, required: false }, // Relaxed to avoid validation errors
    level: { type: String, required: false },
  }],

  photoUrl: { type: String, required: false },

  resumes: [{
    title: { type: String, required: false },
    resumeUrl: { type: String, required: false },
    size: { type: String, required: false },
    uploadedAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

const StudentDetails = studentDB.model("Profile", studentSchema);

export default StudentDetails;