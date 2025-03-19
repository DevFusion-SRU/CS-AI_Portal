import express from "express";
import multer from "multer";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import {
    addJob,
    addJobsBatch,
    deleteJob,
    getJobs,
    getJobById,
    searchCompanies,
    updateJob
} from "../controllers/Jobs/job.js";

const router = express.Router();

// Multer configuration for handling image uploads
const storage = multer.memoryStorage(); // Stores image in memory as Buffer
const upload = multer({ storage });

// Public route
router.get("/", getJobs);
router.get("/searchCompanies", searchCompanies);

// Protected routes
router.get("/:jobId", authenticateToken, getJobById);

// Protected routes for admin
router.post("/", authenticateToken, authorizeRole("staff"),upload.single("logo") ,addJob);
router.post("/batch", authenticateToken, authorizeRole("staff"), addJobsBatch);
router.delete("/:jobId", authenticateToken, authorizeRole("staff"), deleteJob);
router.patch("/:jobId", authenticateToken, authorizeRole("staff"), updateJob);

export default router;
