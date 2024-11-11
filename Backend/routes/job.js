import express from "express";

import { addJob, addJobsBatch, deleteJob, getJobs } from "../controllers/job.js";

const router = express.Router();

router.get("/", getJobs);
router.post("/", addJob);
router.post("/batch", addJobsBatch);
router.delete("/:id", deleteJob);

export default router;
