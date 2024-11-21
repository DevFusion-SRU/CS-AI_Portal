import express from "express";

import { addApplication, addView, getApplications, getAppliedStudents } from "../controllers/jobApplications.js";

const router = express.Router();

router.post("/", addApplication);
router.post("/view", addView);
router.get("/allDetails", getAppliedStudents);
router.get("/:rollNumber", getApplications);

export default router;
