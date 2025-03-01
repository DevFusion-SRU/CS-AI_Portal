// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import cloudinary from "../config/cloudinary.js";

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: "CS-AI_PORTAL", // Folder name in Cloudinary
//         resource_type: "auto", // Convert images to PNG
//         public_id: (req, file) => `${Date.now()}-${file.originalname}`, // Unique file name
//     },
// });

// // Set limits for Multer (file size in bytes)
// const upload = multer({
//     storage,
//     limits: {
//         fileSize: 2 * 1024 * 1024, // 2 MB limit
//     }
// });

// export default upload;


import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// 🔹 Storage for Profile Photos (Images only)
const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "CS-AI_PORTAL/profile_photos", // Separate folder for images
        format: async (req, file) => file.mimetype.split("/")[1], // Keep original format (jpg, png, etc.)
        public_id: (req, file) => `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`, // Remove existing extension
    },
});

// 🔹 Storage for Resumes (PDF, DOCX, DOC)
const resumeStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "CS-AI_PORTAL/resumes",
      resource_type: "auto", // Supports images, PDFs, docs
      public_id: (req, file) => `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`,
    },
  });



// 🔹 Storage for Certificates (Supports Images & PDFs)
const certificateStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "CS-AI_PORTAL/certificates", // Separate folder for certificates
        resource_type: "auto", // Supports both images & PDFs
        public_id: (req, file) => `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`, // Remove existing extension
    },
});



// 🔹 Allowed Image Types: jpg, jpeg, png, webp
const imageFileFilter = (req, file, cb) => {
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedImageTypes.includes(file.mimetype)) {
        return cb(new Error("Invalid image type"), false);
    }
    cb(null, true);
};

// Allowed Resume Types: JPG, PNG, WebP, PDF, DOC, DOCX
const resumeFileFilter = (req, file, cb) => {
    const allowedResumeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
      "application/msword", // DOC
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
    ];
    if (!allowedResumeTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Allowed: JPG, PNG, WebP, PDF, DOC, DOCX"), false);
    }
    cb(null, true);
  };


// 🔹 Allowed Certificate Types: JPG, PNG, WebP, PDF
const certificateFileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "application/pdf"
    ];
    
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Invalid file type. Allowed: JPG, PNG, WebP, PDF"), false);
    }
    cb(null, true);
};


// 🔹 Image Upload Middleware (Limit: 2MB)
export const uploadImage = multer({
    storage: imageStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: imageFileFilter,
});

// 🔹 Resume Upload Middleware (Limit: 5MB)
export const uploadResume = multer({
    storage: resumeStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: resumeFileFilter,
  });


// 🔹 Certificate Upload Middleware (Limit: 5MB)
export const uploadCertificate = multer({
    storage: certificateStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: certificateFileFilter,
});