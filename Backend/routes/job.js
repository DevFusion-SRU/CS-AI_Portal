import express from "express";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import {
    addJob,
    addJobsBatch,
    deleteJob,
    getJobs,
    getJobById,
    searchCompanies
} from "../controllers/Jobs/job.js";

const router = express.Router();

// Public route
router.get("/", getJobs);
router.get("/searchCompanies", searchCompanies);

// Protected routes
router.get("/:jobId", authenticateToken, getJobById);

// Protected routes for admin
router.post("/", authenticateToken, authorizeRole("staff"), addJob);
router.post("/batch", authenticateToken, authorizeRole("staff"), addJobsBatch);
router.delete("/:jobId", authenticateToken, authorizeRole("staff"), deleteJob);

export default router;
