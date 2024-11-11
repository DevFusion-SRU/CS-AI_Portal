import mongoose from "mongoose";

import Job from "../models/job.js"; // Job model using jobConn
import AppliedJobs from "../models/appliedJobs.js"; // AppliedJobs model using jobConn

export const addAppliedJob = async (req, res) => {
    const { rollNumber, jobId } = req.body;

    if (!rollNumber || !jobId) {
        return res.status(400).json({ success: false, message: "Provide rollNumber and jobId!" });
    }

    try {
        // Find the existing appliedJobs document for the student
        let appliedJobsEntry = await AppliedJobs.findOne({ rollNumber });

        if (!appliedJobsEntry) {
            // Create a new entry if it doesn't exist
            appliedJobsEntry = new AppliedJobs({ rollNumber, jobIds: [jobId] });
        } else {
            // Add the jobId to the array if it doesn't already exist
            if (!appliedJobsEntry.jobIds.includes(jobId)) {
                appliedJobsEntry.jobIds.push(jobId);
            } else {
                return res.status(400).json({ success: false, message: "Job ID already exists for this student!" });
            }
        }

        await appliedJobsEntry.save();
        res.status(201).json({ success: true, data: appliedJobsEntry });
    } catch (error) {
        console.error("Error in adding applied job: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getAppliedJob = async (req, res) => {
    const { rollNumber } = req.params;
    try {
        const appliedJobsEntry = await AppliedJobs.findOne({ rollNumber });
        if (!appliedJobsEntry) {
            return res.status(404).json({ success: false, message: "No applied jobs found for this student!" });
        }

        // Manually fetching job details
        const jobDetails = await Job.find({ id: { $in: appliedJobsEntry.jobIds } });
        
        res.status(200).json({ success: true, data: jobDetails });
    } catch (error) {
        console.error("Error fetching applied jobs: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
