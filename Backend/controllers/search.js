import mongoose from "mongoose";

import Job from "../models/job.js";
import Student from "../models/student.js";
import AppliedStudents from "../models/appliedStudents.js";

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

export const searchStudents = async (req, res) => {
    const { rollNumber, firstName, lastName } = req.query;

    // Ensure only one filter is applied at a time
    if ((rollNumber && firstName) || (rollNumber && lastName) || (firstName && lastName)) {
        return res.status(400).json({
            success: false,
            message: "Only one search filter (rollNumber, firstName, or lastName) is allowed at a time.",
        });
    }

    const filters = {};
    if (rollNumber) {
        filters.rollNumber = rollNumber.trim();
    } else if (firstName) {
        filters.firstName = new RegExp(firstName.trim(), "i"); // Case-insensitive search
    } else if (lastName) {
        filters.lastName = new RegExp(lastName.trim(), "i"); // Case-insensitive search
    } else {
        return res.status(400).json({
            success: false,
            message: "Provide at least one search filter (rollNumber, firstName, or lastName).",
        });
    }

    try {
        const students = await Student.find(filters);

        if (students.length === 0) {
            return res.status(404).json({ success: false, message: "No students found matching the criteria." });
        }

        res.status(200).json({ success: true, data: students });
    } catch (error) {
        console.error("Error searching students:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const searchAllDetails = async (req, res) => {
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
        
        // Fetch all entries from the AppliedStudents collection
        const appliedStudentsEntries = await AppliedStudents.find();

        if (!allJobs || allJobs.length === 0) {
            return res.status(404).json({ success: false, message: "No jobs found!" });
        }

        // Initialize an empty array to store details for each job
        const allDetails = [];

        // Loop over each job and check its related students in AppliedStudents collection
        for (const job of allJobs) {
            // Find the AppliedStudents entry for this job by comparing jobId to job.id
            const appliedStudentsEntry = appliedStudentsEntries.find(entry => entry.jobId === job.id);

            // If no AppliedStudents entry is found, initialize empty arrays and counts
            let appliedStudents = [];
            let viewedStudents = [];
            let appliedCount = 0;
            let viewedCount = 0;

            if (appliedStudentsEntry) {
                // If there is an AppliedStudents entry for this job, use its data
                appliedStudents = appliedStudentsEntry.applications || [];
                viewedStudents = appliedStudentsEntry.views || [];
                appliedCount = appliedStudents.length;
                viewedCount = viewedStudents.length;
            }

            // Push the result with job details and students count
            allDetails.push({
                jobDetails: job,  // Return the full job details
                appliedStudentsCount: appliedCount,
                appliedStudentsDetails: appliedStudents,  // Array of student IDs or populated student details
                viewedStudentsCount: viewedCount,
                viewedStudentsDetails: viewedStudents  // Array of student IDs or populated student details
            });
        }

        // Send the response with all the jobs and their respective details
        res.status(200).json({ success: true, data: allDetails });
    } catch (error) {
        console.error("Error fetching applied students: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
