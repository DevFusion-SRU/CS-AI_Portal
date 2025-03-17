import express from "express";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import {
  addJob,
  addJobsBatch,
  deleteJob,
  getJobs,
  getJobById,
  searchCompanies,
} from "../controllers/Jobs/job.js";
import { getInDemandSkills } from "../controllers/Jobs/jobAnalytics.js";
import {
  getApplications,
  getSavedJobs,
  getMostAppliedJobs,
} from "../controllers/Jobs/jobApplications.js";
import Job from "../models/Jobs/Job.js";

const router = express.Router();

// Public routes
router.get("/", getJobs);
router.get("/searchCompanies", searchCompanies);

// Authenticated routes
router.get("/:jobId", authenticateToken, getJobById);
router.get("/applications/:rollNumber", authenticateToken, getApplications);
router.get("/saved/:rollNumber", authenticateToken, getSavedJobs);
router.get("/analytics/mostApplied", authenticateToken, getMostAppliedJobs);
router.get("/analytics/topskills", getInDemandSkills);

// Custom route for Recent Jobs
router.get("/recent", authenticateToken, async (req, res) => {
  console.log("Reached /api/jobs/recent"); // Debug log
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).limit(10);
    console.log("Jobs found:", jobs); // Debug log
    if (!jobs.length) {
      return res.status(200).json({ success: true, data: [], message: "No recent jobs found" });
    }
    res.json({ success: true, data: jobs });
  } catch (error) {
    console.error("Error fetching recent jobs:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Custom route for Job Details by IDs
router.post("/details", authenticateToken, async (req, res) => {
  const { jobIds } = req.body;
  if (!jobIds || !Array.isArray(jobIds)) {
    return res.status(400).json({ success: false, message: "jobIds array is required" });
  }
  try {
    const jobs = await Job.find({ jobId: { $in: jobIds } });
    res.json({ success: true, data: jobs });
  } catch (error) {
    console.error("Error fetching job details:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Admin/Staff routes
router.post("/", authenticateToken, authorizeRole("staff"), addJob);
router.post("/batch", authenticateToken, authorizeRole("staff"), addJobsBatch);
router.delete("/:jobId", authenticateToken, authorizeRole("staff"), deleteJob);

export default router;