import mongoose from "mongoose";

import Job from "../../models/Jobs/Job.js"; // Job model using jobDB

export const getJobById = async (req, res) => {
    const { jobId } = req.params;  // Assuming jobId is passed as a route parameter

    if (!jobId) {
        return res.status(400).json({ success: false, message: "Job ID is required." });
    }

    try {
        const job = await Job.findOne({ jobId: jobId.trim() })
            .select('-_id -__v')  // Excluding _id and __v from the main document
            .lean();  // Converting the Mongoose document to a plain JavaScript object

        if (job) {
            // Removing _id from the description field if present
            if (job.description && job.description._id) {
                delete job.description._id;
            }

            return res.status(200).json({
                success: true,
                data: job,
            });
        } else {
            return res.status(404).json({ success: false, message: "Job not found." });
        }
    } catch (error) {
        console.error("Error in fetching Job:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getJobs = async (req, res) => {
    const filters = {};
    

    const type = req.query.type;
    if (type && type !== "all") {
        filters.type = type;
    }
   
    if (req.query.company) {
        const companyQuery = req.query.company.trim().replace(/\s+/g, " ");
        filters.company = { $regex: new RegExp(companyQuery, "i") };  // Case-insensitive regex search
    }
    if (req.query.title) {
        const nameQuery = req.query.title.trim().replace(/\s+/g, " ");
        filters.title = { $regex: new RegExp(nameQuery, "i") };
    }
    if (req.query.jobId) {
        const jobIdQuery = req.query.jobId.trim().replace(/\s+/g, " ");
        filters.jobId = { $regex: new RegExp(jobIdQuery, "i") };
    }
    
    try {
        // Pagination setup
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 25; // Default to 25 jobs per page
        const skip = (page - 1) * limit;

        // Parallelize querying jobs and counting documents to reduce response time
        const [jobs, totalJobs] = await Promise.all([
            Job.find(filters).skip(skip).limit(limit),  // Jobs query with pagination
            Job.countDocuments(filters)  // Count the filtered documents (optional but helps with pagination info)
        ]);

        if (jobs.length === 0) {
            return res.status(404).json({ success: false, message: "No jobs found matching the search criteria." });
        }

        // Send the response with the total pages and current page information
        res.status(200).json({
            success: true,
            data: jobs,
            totalPages: Math.ceil(totalJobs / limit),  // Total pages based on filtered jobs
            currentPage: page,
        });
    } catch (error) {
        console.error("Error in fetching Jobs:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const addJob = async (req, res) => {
    const job = req.body;
    if (!job.jobId || !job.title || !job.type || !job.company || !job.location || !job.description.text || !job.applyLink) {
        return res.status(400).json({ success: false, message: "Provide all required fields!!" });
    }

    const newJob = new Job(job);
    try {
        await newJob.save();
        res.status(201).json({ success: true, data: newJob });
    } catch (error) {
        // Check if it's a duplicate key error (unique constraint violation)
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Job with this id already exists!" });
        }
        console.error("Error in entering Job details: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const addJobsBatch = async (req, res) => {
    const jobs = req.body;

    // Check if the request body is an array
    if (!Array.isArray(jobs) || jobs.length === 0) {
        return res.status(400).json({ success: false, message: "Provide an array of jobs with all required fields!" });
    }

    // Validate each job in the array
    for (const job of jobs) {
        if (!job.jobId || !job.title || !job.type || !job.company || !job.location || !job.description.text || !job.applyLink) {
            return res.status(400).json({ success: false, message: "Each job must include all required details!" });
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
};

export const deleteJob = async (req, res) => {
    const { jobId } = req.params;

    try {
        const job = await Job.findOneAndDelete({ jobId: jobId });

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found!" });
        }

        res.status(200).json({ success: true, message: "Job deleted" });
    } catch (error) {
        console.error("Error deleting job: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
