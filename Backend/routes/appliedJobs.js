import express from "express";

import { addApplication, addView, getApplications } from "../controllers/jobApplications.js";

const router = express.Router();

router.post("/", addApplication);
router.post("/view", addView);
router.get("/:rollNumber", getApplications);

export default router;
