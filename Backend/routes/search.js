import express from "express";

import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import { searchAllDetails, searchJobs, searchStudents } from "../controllers/search.js";

const router = express.Router();

// Public route for now
router.post("/jobs", searchJobs);

router.post("/students", authenticateToken, authorizeRole("admin"), searchStudents);
router.post("/allDetails", authenticateToken, authorizeRole("admin"), searchAllDetails);

export default router;