import mongoose from "mongoose";

import Job from "../../models/Jobs/jobs.js";
import AppliedJobs from "../../models/Jobs/appliedJobs.js";

import StudentDetails from "../../models/Students/Student.Details.js"; // StudentDetails model using studentDB
import AppliedStudents from "../../models/Jobs/appliedStudents.js"; // AppliedStudents model using jobDB

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
                // return res.status(400).json({ success: false, message: "This student has already viewed this job!" });
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
    const filters = {};

    // Type filter passed in query param
    const type = req.query.type;
    if (type && type !== "all") {
        filters.type = type;
    }
    // Normalize and handle case-insensitive search for company, id, and name
    if (req.query.company) {
        const companyQuery = req.query.company.trim().replace(/\s+/g, " ");
        filters.company = { $regex: new RegExp(companyQuery, "i") };  // Case-insensitive regex search
    }
    if (req.query.name) {
        const nameQuery = req.query.name.trim().replace(/\s+/g, " ");
        filters.name = { $regex: new RegExp(nameQuery, "i") };
    }
    if (req.query.id) {
        const idQuery = req.query.id.trim().replace(/\s+/g, " ");
        filters.id = { $regex: new RegExp(idQuery, "i") };
    }

    try {
        const appliedJobsEntry = await AppliedJobs.findOne({ rollNumber });
        if (!appliedJobsEntry) {
            return res.status(404).json({ success: false, message: "No applied jobs found for this student!" });
        }

        // Pagination setup
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 25; // Default to 25 jobs per page
        const skip = (page - 1) * limit;

        // Parallelize querying applied jobs details to reduce response time
        const [jobDetails, totalJobs] = await Promise.all([
            Job.find({ id: { $in: appliedJobsEntry.jobIds }, ...filters })  // Fetch jobs with applied filters
                .skip(skip)
                .limit(limit),
            Job.countDocuments({ id: { $in: appliedJobsEntry.jobIds }, ...filters })  // Count the filtered documents
        ]);

        if (jobDetails.length === 0) {
            return res.status(404).json({ success: false, message: "No job details found matching the criteria." });
        }
        
        // // Send the applied jobs with all their respective details, including pagination info
        res.status(200).json({
            success: true,
            data: jobDetails,
            totalPages: Math.ceil(totalJobs / limit),  // Total pages based on filtered jobs
            currentPage: page,
        });
    } catch (error) {
        console.error("Error fetching applied jobs: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getAppliedPeers = async (req, res) => {
    const { jobId } = req.params;

    try {
        const appliedPeers = await AppliedStudents.findOne({ jobId });
        if (!appliedPeers) {
            return res.status(404).json({ success: false, message: "Nobody has applied for this Job!" });
        }

        const { applications } = appliedPeers;
        
        const students = await Student.find({
            rollNumber: { $in: applications }  // Find students whose rollNumbers are in the applications array
        });

        // Map the results to return a list of objects with rollNumber, firstName, and lastName
        const studentDetails = students.map(student => ({
            rollNumber: student.rollNumber,
            firstName: student.firstName,
            lastName: student.lastName
        }));

        // Send the response with student details
        return res.status(200).json({ success: true, studentDetails });

    } catch (error) {
        console.error("Error fetching applied peers: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }

};

export const getAppliedStudents = async (req, res) => {
    const filters = {};

    // Type filter passed in query param
    const type = req.query.type;
    if (type && type !== "all") {
        filters.type = type;
    }
    // Normalize and handle case-insensitive search for company, id, and name
    if (req.query.company) {
        const companyQuery = req.query.company.trim().replace(/\s+/g, " ");
        filters.company = { $regex: new RegExp(companyQuery, "i") };  // Case-insensitive regex search
    }
    if (req.query.name) {
        const nameQuery = req.query.name.trim().replace(/\s+/g, " ");
        filters.name = { $regex: new RegExp(nameQuery, "i") };
    }
    if (req.query.id) {
        const idQuery = req.query.id.trim().replace(/\s+/g, " ");
        filters.id = { $regex: new RegExp(idQuery, "i") };
    }

    try {

        // Pagination setup
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 25; // Default to 25 jobs per page
        const skip = (page - 1) * limit;

        // Parallelize querying jobs, counting jobs, and querying applied students entries to reduce response time
        const [jobs, totalJobs, appliedStudentsEntries] = await Promise.all([
            Job.find(filters).skip(skip).limit(limit),  // Fetch filtered jobs with pagination
            Job.countDocuments(filters),  // Count total jobs matching the filters
            AppliedStudents.find(),  // Fetch all applied students entries
        ]);

        // If no jobs are found
        if (jobs.length === 0) {
            return res.status(404).json({ success: false, message: "No jobs found matching the search criteria." });
        }

        // Initialize an empty array to store details for each job
        const allDetails = [];

        // Loop over each job and check its related students in AppliedStudents collection
        for (const job of jobs) {
            // Find the AppliedStudents entry for this job by comparing jobId to job.id
            const appliedStudentsEntry = appliedStudentsEntries.find(entry => entry.jobId.toString() === job.id.toString());

            // Initialize variables for counts and student arrays
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

        // Send the response with all the jobs and their respective details, including pagination info
        res.status(200).json({
            success: true,
            data: allDetails,
            totalPages: Math.ceil(totalJobs / limit),  // Total pages based on filtered jobs
            currentPage: page,  // Current page
        });
    } catch (error) {
        console.error("Error fetching applied students: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
