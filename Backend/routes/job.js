import express from "express";
import mongoose from "mongoose";

import Job from "../models/job.js"; // Job model using jobConn

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const jobs = await Job.find({});
        res.status(200).json({ success: true, data: jobs });
    } catch (error) {
        console.error("Error in fetching Jobs: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.post("/", async (req, res) => {
    const job = req.body;
    if (!job.id || !job.name || !job.company || !job.applyLink) {
        return res.status(400).json({ success: false, message: "Provide all required fields!!" });
    }

    const newJob = new Job(job);
    try {
        await newJob.save();
        res.status(201).json({ success: true, data: newJob });
    } catch (error) {
        console.error("Error in entering Job details: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.post("/batch", async (req, res) => {
    const jobs = req.body;

    // Check if the request body is an array
    if (!Array.isArray(jobs) || jobs.length === 0) {
        return res.status(400).json({ success: false, message: "Provide an array of jobs with all required fields!" });
    }

    // Validate each job in the array
    for (const job of jobs) {
        if (!job.id || !job.name || !job.company || !job.applyLink) {
            return res.status(400).json({ success: false, message: "Each job must include id, name, company, and applyLink!" });
        }
    }

    try {
        // Save all jobs in bulk using `insertMany`
        const newJobs = await Job.insertMany(jobs);
        res.status(201).json({ success: true, data: newJobs });
    } catch (error) {
        console.error("Error in entering Job details: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const job = await Job.findOneAndDelete({ id: id });
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found!" });
        }

        res.status(200).json({ success: true, message: "Job deleted" });
    } catch (error) {
        console.error("Error deleting job: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

export default router;
