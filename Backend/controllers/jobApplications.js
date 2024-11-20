import mongoose from "mongoose";

import Job from "../models/job.js";
import AppliedJobs from "../models/appliedJobs.js";
import AppliedStudents from "../models/appliedStudents.js";

export const addApplication = async (req, res) => {
    const { rollNumber, jobId } = req.body;

    if (!rollNumber || !jobId) {
        return res.status(400).json({ success: false, message: "Provide rollNumber and jobId!" });
    }

    try {
        // Step 1: Updating the student's applied jobs in AppliedJobs collection
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

        // Step 2: Updating the job's applied students in AppliedStudents collection
        let appliedStudentsEntry = await AppliedStudents.findOne({ jobId });

        if (!appliedStudentsEntry) {
            // If no entry exists for this job, create one
            appliedStudentsEntry = new AppliedStudents({ jobId, applications: [rollNumber] });
        } else {
            // If entry exists, add the student's rollNumber if not already present
            if (!appliedStudentsEntry.applications.includes(rollNumber)) {
                appliedStudentsEntry.applications.push(rollNumber);
            } else {
                return res.status(400).json({ success: false, message: "This student has already applied for this job!" });
            }
        }

        // Save the appliedStudentsEntry to the database
        await appliedStudentsEntry.save();

        res.status(201).json({ success: true, AppliedJobs: appliedJobsEntry, AppliedStudents: appliedStudentsEntry });
    } catch (error) {
        console.error("Error in adding applied job: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const addView = async (req, res) => {
    const { rollNumber, jobId } = req.body;

    if (!rollNumber || !jobId) {
        return res.status(400).json({ success: false, message: "Provide rollNumber and jobId!" });
    }

    try {

        let viewedStudentsEntry = await AppliedStudents.findOne({ jobId });

        if (!viewedStudentsEntry) {
            // If no entry exists for this job, create one
            viewedStudentsEntry = new AppliedStudents({ jobId, views: [rollNumber] });
        } else {
            // If entry exists, add the student's rollNumber if not already present
            if (!viewedStudentsEntry.views.includes(rollNumber)) {
                viewedStudentsEntry.views.push(rollNumber);
            } else {
                return res.status(400).json({ success: false, message: "This student has already viewed this job!" });
            }
        }

        // Save the appliedStudentsEntry to the database
        await viewedStudentsEntry.save();

        res.status(201).json({ success: true, views: viewedStudentsEntry });
    } catch (error) {
        console.error("Error in adding applied job: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}; 

export const getApplications = async (req, res) => {
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
