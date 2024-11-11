import express from "express";

import { addAppliedJob, getAppliedJob } from "../controllers/appliedJobs.js";

const router = express.Router();

router.post("/", addAppliedJob);
router.get("/:rollNumber", getAppliedJob);

export default router;
