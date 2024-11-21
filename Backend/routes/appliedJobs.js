import express from "express";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import { 
    addApplication,
    addView,
    getApplications,
    getAppliedStudents
} from "../controllers/jobApplications.js";

const router = express.Router();

// Only authenticated users can access these routes
router.post("/", authenticateToken, authorizeRole("student"), addApplication);
router.post("/view", authenticateToken, authorizeRole("student"), addView);
router.get("/allDetails", authenticateToken, authorizeRole("admin"), getAppliedStudents); // Admin-only access
router.get("/:rollNumber", authenticateToken, authorizeRole("student"), getApplications);

export default router;
