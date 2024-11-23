import express from "express";

import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import { searchJobs } from "../controllers/search.js";

const router = express.Router();

router.post("/jobs", searchJobs);

export default router;