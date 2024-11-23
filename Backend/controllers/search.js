import mongoose from "mongoose";

import Job from "../models/job.js";

export const searchJobs = async (req, res) => {
    try {
        const filters = {};

        // Normalize and handle case-insensitive search for company, id, and type
        if (req.query.company) {
            const companyQuery = req.query.company.trim().replace(/\s+/g, " "); // Normalize spaces
            filters.company = { $regex: new RegExp(companyQuery, "i") };  // Case-insensitive regex search
        }
        if (req.query.id) {
            const idQuery = req.query.id.trim().replace(/\s+/g, " "); // Normalize spaces
            filters.id = { $regex: new RegExp(idQuery, "i") };  // Case-insensitive regex search
        }
        if (req.query.type) {
            const typeQuery = req.query.type.trim().replace(/\s+/g, " "); // Normalize spaces
            filters.type = { $regex: new RegExp(typeQuery, "i") };  // Case-insensitive regex search
        }

        // Fetch jobs based on the filters (company, id, type)
        const jobs = await Job.find(filters);  // MongoDB automatically applies $and between filters

        if (jobs.length === 0) {
            return res.status(404).json({ success: false, message: "No jobs found matching the search criteria." });
        }

        res.status(200).json({ success: true, jobs });
    } catch (error) {
        console.error("Error searching jobs:", error.message);
        res.status(500).json({ success: false, message: "Server error." });
    }
};
