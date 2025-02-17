import express from "express";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import {
    addJob,
    addJobsBatch,
    deleteJob,
    getJobs
} from "../controllers/Jobs/job.js";

const router = express.Router();

// Public route
router.get("/", getJobs);

// Protected routes for admin
router.post("/", authenticateToken, authorizeRole("staff"), addJob);
router.post("/batch", authenticateToken, authorizeRole("staff"), addJobsBatch);
router.delete("/:id", authenticateToken, authorizeRole("staff"), deleteJob);

export default router;
