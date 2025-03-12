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
        title: { type: String, required: false },
        company: { type: String, required: false },
        duration: {
            startDate: { type: Date, required: false },
            endDate: { type: Date, required: false }
        },
        location: { type: String, required: false },
        description: { type: String, required: false },
        certificateId: { type: String, required: false },
        certificate: { type: Buffer, required: false }, 
        certificateType: { type: String, required: false },
    }],

    // Education stored as an array of objects
    education: [{
        institution: { type: String, required: false },
        degree: { type: String, required:false  },
        specialization: { type: String, required: true },
        duration: {
            startDate: { type: Date, required: false },
            endDate: { type: Date, required: false }
        },
        cgpa: { type: String, required: false }
    }],

    // Certifications stored as an array of objects
    certifications: [{
        title: { type: String, required: true },
        issuer: { type: String, required: true },
        courseName: { type: String, required: false },
        validTime: {
            startDate: { type: Date, required: false },
            endDate: { type: Date, required: false }
        },
        certificateId: { type: String, required: false },
        certificate: { type: Buffer, required: false }, 
        certificateType: { type: String, required: false },
    }],
    
    // Skills stored as an array of objects
    skills: [{
        name: { type: String, required: true },
        level: { type: String, required: false }
    }],
    
    photo: { type: Buffer }, // 🔹 Binary image data if stored locally
    photoType: { type: String }, // 🔹 MIME type (e.g., image/png, image/jpeg)   


    photoUrl: { type: String, required: false }, // URL of uploaded image in Cloudinary
    // photoPublicId: { type: String, required: false } // To track & delete images in Cloudinary
    

    // Resumes stored as an array of objects
    resumes: [{
        title: { type: String, required: false },
        resume: { type: Buffer, required: false }, // Cloudinary URL
        resumeType: { type: String, required: false },
        uploadedAt: { type: Date, default: Date.now }
    }]
},{timestamps:true});


const StudentDetails = studentDB.model("Profile", studentSchema);

export default StudentDetails;
