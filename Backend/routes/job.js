import express from "express";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import {
    addJob,
    addJobsBatch,
    deleteJob,
    getJobs
} from "../controllers/job.js";

const router = express.Router();

// Public route
router.get("/", getJobs);

// Protected routes for admin
router.post("/", authenticateToken, authorizeRole("admin"), addJob);
router.post("/batch", authenticateToken, authorizeRole("admin"), addJobsBatch);
router.delete("/:id", authenticateToken, authorizeRole("admin"), deleteJob);

export default router;
