import mongoose from "mongoose";
import { studentDB } from "../../config/db.js";

const studentFilesSchema = new mongoose.Schema({
    rollNumber: { type: String, required: true, unique: true }, // Reference to StudentDetails

    profilePhoto: {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        data: Buffer,
        contentType: String
    },

    resumes: [{
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        data: Buffer,
        contentType: String,
        uploadedAt: { type: Date, default: Date.now }
    }],

    experienceCertificates: [{
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        data: Buffer,
        contentType: String,
        uploadedAt: { type: Date, default: Date.now }
    }],

    courseCertifications: [{
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        data: Buffer,
        contentType: String,
        uploadedAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const StudentFiles = studentDB.model("StudentFiles", studentFilesSchema);
export default StudentFiles;
