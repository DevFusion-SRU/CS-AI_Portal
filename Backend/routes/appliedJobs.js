import express from "express";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import { 
    addApplication,
    addView,
    getApplications,
    getAppliedStudents,
    getAppliedPeers,
    getRecommendedJobs
} from "../controllers/Jobs/jobApplications.js";

const router = express.Router();

// Only authenticated users can access these routes
router.post("/", authenticateToken, authorizeRole("student"), addApplication);
router.post("/view", authenticateToken, authorizeRole("student"), addView);
router.get("/allDetails", authenticateToken, authorizeRole("staff"), getAppliedStudents); // Admin-only access
router.get("/student/:rollNumber", authenticateToken, authorizeRole("student"), getApplications);
router.get("/job/:jobId", authenticateToken, authorizeRole("student"),  getAppliedPeers);
router.get("/recommendedJobs", authenticateToken, authorizeRole("student"), getRecommendedJobs);

export default router;
