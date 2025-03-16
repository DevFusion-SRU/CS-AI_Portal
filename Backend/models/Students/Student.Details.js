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
    address: { type: String, required: false },
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
        certificationId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "StudentFiles", 
            default: null // Prevents errors from empty strings
        },
    }],

    // Education stored as an array of objects
    education: [{
        institution: { type: String, required: false },
        degree: { type: String, required: false },
        specialization: { type: String, required: true },
        duration: {
            startDate: { type: Date, required: false },
            endDate: { type: Date, required: false }
        },
        cgpa: { type: String, required: false }
    }],

    // // Certifications stored as an array of objects
    // certifications: [{
    //     title: { type: String, required: true },
    //     issuer: { type: String, required: true },
    //     courseName: { type: String, required: false },
    //     validTime: {
    //         startDate: { type: Date, required: false },
    //         endDate: { type: Date, required: false }
    //     },
    //     certificateId: { 
    //         type: mongoose.Schema.Types.ObjectId, 
    //         ref: "StudentFiles", 
    //         default: null // Prevents errors when certificateId is empty
    //     },
    // }],
    
    // Skills stored as an array of objects
    skills: [{
        name: { type: String, required: true },
        level: { type: String, required: false }
    }],

    profilePhotoId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "StudentFiles", 
        default: null // Ensures no empty string issue
    },

    // Resumes stored as an array of objects
    resumes: [{
        title: { type: String, required: false },
        resumeId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "StudentFiles",
            default: null // Fix for empty string issue
        }
    }]
}, { timestamps: true });

const StudentDetails = studentDB.model("Student", studentSchema);
export default StudentDetails;