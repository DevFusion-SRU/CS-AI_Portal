import express from "express";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import { 
    addApplication,
    addView,
    getApplications,
    getAppliedStudents,
    getAppliedPeers,
    addSavedJob, 
  getSavedJobs
} from "../controllers/Jobs/jobApplications.js";

const router = express.Router();

// Only authenticated users can access these routes
router.post("/addApplication", authenticateToken, authorizeRole("student"), addApplication); // Changed from "/" to "/addApplication"
router.post("/view", authenticateToken, authorizeRole("student"), addView);
router.get("/allDetails", authenticateToken, authorizeRole("staff"), getAppliedStudents);
router.get("/student/:rollNumber", authenticateToken, authorizeRole("student"), getApplications);
router.get("/job/:jobId", authenticateToken, authorizeRole("student"), getAppliedPeers);
router.post("/saveJob", authenticateToken, authorizeRole("student"), addSavedJob); // New endpoint
router.get("/saved/:rollNumber", authenticateToken, authorizeRole("student"), getSavedJobs);


export default router;
