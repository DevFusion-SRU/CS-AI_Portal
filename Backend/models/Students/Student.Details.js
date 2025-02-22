import mongoose from "mongoose";
import { studentDB } from "../../config/db.js";

const studentSchema = new mongoose.Schema({
    rollNumber: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    course: { type: String, required: true },
    graduationYear: {type: Number, required: true},
    email: { type: String, required: true },
    gender:{type: String, required: false},
    Address:{type: String, required: false},
    personalMail: { type: String, required: false },
    mobile: { type: Number, required: false },
    website: { type: String, required: false },
    about: { type: String, required: false },
    // Experiences stored as an array of objects
    experiences: [{
        title: { type: String, required: true },
        company: { type: String, required: true },
        duration: { type: String, required: true },
        location: { type: String, required: false },
        description: { type: String, required: false }
    }],

    // Education stored as an array of objects
    education: [{
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        duration: { type: String, required: true },
        cgpa: { type: String, required: false }
    }],

    // Certifications stored as an array of objects
    certifications: [{
        title: { type: String, required: true },
        issuer: { type: String, required: true },
        certificateId: { type: String, required: false }
    }],
    
    // Skills stored as an array of objects
    skills: [{
        name: { type: String, required: true },
        level: { type: String, required: false }
    }],
    



    photoUrl: { type: String, required: false }, // URL of uploaded image in Cloudinary
    // photoPublicId: { type: String, required: false } // To track & delete images in Cloudinary
    

    // Resumes stored as an array of objects
    resumes: [{
        resumeUrl: { type: String, required: true }, // Cloudinary URL
        uploadedAt: { type: Date, default: Date.now }
    }]
},{timestamps:true});


const StudentDetails = studentDB.model("Profile", studentSchema);

export default StudentDetails;
