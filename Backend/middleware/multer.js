import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "CS-AI_PORTAL", // Folder name in Cloudinary
        resource_type: "auto", // Convert images to PNG
        public_id: (req, file) => `${Date.now()}-${file.originalname}`, // Unique file name
    },
});

// Set limits for Multer (file size in bytes)
const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2 MB limit
    }
});

export default upload;
