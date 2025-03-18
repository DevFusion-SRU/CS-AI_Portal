import mongoose from "mongoose";
import axios from "axios";
import sharp from "sharp";
import streamifier from "streamifier";
import csvParser from "csv-parser";
import Job from "../../models/Jobs/Job.js";
import JobForum from "../../models/Forums/jobForum.js"; // Import JobForum model
import StaffDetails from "../../models/Staff/Staff.Details.js";
// import AppliedJobs from "../../models/Jobs/appliedJobs.js";

import StudentDetails from "../../models/Students/Student.Details.js"; // StudentDetails model using studentDB
import AppliedStudents from "../../models/Jobs/appliedStudents.js"; // AppliedStudents model using jobDB

export const addApplication = async (req, res) => {
    const { rollNumber, jobId } = req.body;

    if (!rollNumber || !jobId) {
        return res.status(400).json({ success: false, message: "Provide rollNumber and jobId!" });
    }

    try {
        // Updating the job's applied students in AppliedStudents collection
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

        // 🔹 Check if a JobForum exists for this jobId
        let jobForum = await JobForum.findOne({ jobId });

        if (jobForum) {
            // Add student to the forum if not already a member
            if (!jobForum.members.includes(rollNumber)) {
                jobForum.members.push(rollNumber);
                await jobForum.save();
            }
        }

        res.status(201).json({ 
            success: true, 
            message: "Application submitted successfully!", 
            AppliedStudents: appliedStudentsEntry 
        });

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


// export const getApplications = async (req, res) => {
//     const { rollNumber } = req.params;
//     const filters = {};

//     // Type filter passed in query param
//     const type = req.query.type;
//     if (type && type !== "all") {
//         filters.type = type;
//     }
//     // Normalize and handle case-insensitive search for company, id, and name
//     if (req.query.company) {
//         const companyQuery = req.query.company.trim().replace(/\s+/g, " ");
//         filters.company = { $regex: new RegExp(companyQuery, "i") };  // Case-insensitive regex search
//     }
//     if (req.query.title) {
//         const nameQuery = req.query.title.trim().replace(/\s+/g, " ");
//         filters.title = { $regex: new RegExp(nameQuery, "i") };
//     }
//     if (req.query.jobId) {
//         const jobIdQuery = req.query.jobId.trim().replace(/\s+/g, " ");
//         filters.jobId = { $regex: new RegExp(jobIdQuery, "i") };
//     }
//     try {
//         const appliedJobsEntry = await AppliedJobs.findOne({ rollNumber });
//         if (!appliedJobsEntry) {
//             return res.status(404).json({ success: false, message: "No applied jobs found for this student!" });
//         }

//         // Pagination setup
//         const page = parseInt(req.query.page) || 1; // Default to page 1
//         const limit = parseInt(req.query.limit) || 25; // Default to 25 jobs per page
//         const skip = (page - 1) * limit;

//         // Parallelize querying applied jobs details to reduce response time
//         const [jobDetails, totalJobs] = await Promise.all([
//             Job.find({ jobId: { $in: appliedJobsEntry.jobIds }, ...filters })  // Fetch jobs with applied filters
//                 .skip(skip)
//                 .limit(limit),
//             Job.countDocuments({ jobId: { $in: appliedJobsEntry.jobIds }, ...filters })  // Count the filtered documents
//         ]);

//         if (jobDetails.length === 0) {
//             return res.status(404).json({ success: false, message: "No job details found matching the criteria." });
//         }
        
//         // // Send the applied jobs with all their respective details, including pagination info
//         res.status(200).json({
//             success: true,
//             data: jobDetails,
//             totalPages: Math.ceil(totalJobs / limit),  // Total pages based on filtered jobs
//             currentPage: page,
//         });
//     } catch (error) {
//         console.error("Error fetching applied jobs: ", error.message);
//         res.status(500).json({ success: false, message: "Server Error" });
//     }
// };


export const getApplications = async (req, res) => {
    const { rollNumber } = req.params;
    const filters = {};

    // Apply type filter if provided
    if (req.query.type && req.query.type !== "all") {
        filters.type = req.query.type;
    }

    // Apply company filter (case-insensitive search)
    if (req.query.company) {
        const companyQuery = req.query.company.trim().replace(/\s+/g, " ");
        filters.company = { $regex: new RegExp(companyQuery, "i") };
    }

    // Apply title filter (case-insensitive search)
    if (req.query.title) {
        const titleQuery = req.query.title.trim().replace(/\s+/g, " ");
        filters.title = { $regex: new RegExp(titleQuery, "i") };
    }

    // Apply jobId filter (case-insensitive search)
    if (req.query.jobId) {
        const jobIdQuery = req.query.jobId.trim().replace(/\s+/g, " ");
        filters.jobId = { $regex: new RegExp(jobIdQuery, "i") };
    }

    // Apply category filter if provided
    if (req.query.category && req.query.category !== "all") {
        filters.category = req.query.category;
    }

    // Apply mode of work filter if provided
    if (req.query.modeOfWork && req.query.modeOfWork !== "all") {
        filters.modeOfWork = req.query.modeOfWork;
    }

    // Apply compensation type filter if provided
    if (req.query.compensationType && req.query.compensationType !== "all") {
        filters.compensationType = req.query.compensationType;
    }

    // Apply skills filter (check if the skills exist in the job description)
    if (req.query.skills) {
        const skillsArray = req.query.skills.split(",").map(skill => skill.trim());
        filters["description.skills"] = { $in: skillsArray }; // Match any of the provided skills
    }

    try {
        // 🔹 Fetch all jobIds where the student has applied
        const appliedJobs = await AppliedStudents.find({ applications: rollNumber }).select("jobId");

        if (!appliedJobs.length) {
            return res.status(404).json({ success: false, message: "No applied jobs found for this student!" });
        }

        // Extract jobIds from AppliedStudents
        const jobIds = appliedJobs.map(job => job.jobId);

        // Pagination setup
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 25;
        const skip = (page - 1) * limit;

        // 🔹 Find jobs that match the applied jobIds and additional filters
        const jobQuery = { jobId: { $in: jobIds }, ...filters };

        const [jobDetails, totalJobs] = await Promise.all([
            Job.find(jobQuery).skip(skip).limit(limit),
            Job.countDocuments(jobQuery)
        ]);

        if (!jobDetails.length) {
            return res.status(404).json({ success: false, message: "No job details found matching the criteria." });
        }

        res.status(200).json({
            success: true,
            data: jobDetails,
            totalPages: Math.ceil(totalJobs / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error("Error fetching applied jobs:", error.message);
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
        
        const peers = await StudentDetails.find({
            rollNumber: { $in: applications }  // Find students whose rollNumbers are in the applications array
        });

        // 🔹 Process each student to fetch and resize their Base64 image
        const peersDetails = await Promise.all(
            peers.map(async (peer) => {
                let base64Image = null;

                if (peer.photo && peer.photoType) {
                    try {
                        // ✅ Resize the image to 50x50 pixels using sharp
                        const resizedImageBuffer = await sharp(peer.photo)
                            .resize({ width: 50, height: 50, fit: "cover" }) // Center cropping
                            .toBuffer();

                        // ✅ Convert resized image to Base64
                        base64Image = `data:${peer.photoType};base64,${resizedImageBuffer.toString("base64")}`;
                    } catch (error) {
                        console.error(`Error processing image for ${peer.rollNumber}:`, error.message);
                    }
                }

                return {
                    rollNumber: peer.rollNumber,
                    firstName: peer.firstName,
                    lastName: peer.lastName,
                    photo: base64Image, // 🔹 Base64 image (null if no image)
                };
            })
        );

        // Send the response with student details
        return res.status(200).json({ success: true, peersDetails });

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
            const appliedStudentsEntry = appliedStudentsEntries.find(entry => entry.jobId.toString() === job.jobId.toString());

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
 


export const getRecommendedJobs = async (req, res) => {
    try {
        const { username } = req.user; // Student's rollNumber from request
        const { limit = 5, page = 1 } = req.query;

        // Fetch student details & extract skill names
        const student = await StudentDetails.findOne({ rollNumber: username }).select("skills");
        if (!student || !student.skills || student.skills.length === 0) {
            return res.status(404).json({ success: false, message: "No skills found for recommendations" });
        }

        // Extract skill names from objects
        const studentSkills = student.skills.map(skill => skill.name);
        // console.log("Extracted Skills:", studentSkills);

        // Find jobs that match any of the student's skills
        const matchingJobs = await Job.find({ "description.skills": { $in: studentSkills } })
            .sort({ createdAt: -1 }) // Latest jobs first
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .lean();

        // console.log("Matching Jobs:", matchingJobs);

        // Add total pages calculation
        const totalJobs = await Job.countDocuments({ "description.skills": { $in: studentSkills } });
        const totalPages = Math.ceil(totalJobs / limit);

        res.status(200).json({
            success: true,
            data: matchingJobs,
            pagination: { totalPages, currentPage: Number(page) }
        });

    } catch (error) {
        console.error("Error fetching recommended jobs:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};



/**
 * Controller to update shortlisted or placed students for a job
 * @route PATCH /jobs/:jobId/update-applications
 */





// Controller to update job status


export const updateJobStatus = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { statusType } = req.body; // "shortlisted" or "placed"

        if (!["shortlisted", "placed"].includes(statusType)) {
            return res.status(400).json({ success: false, message: "Invalid status type" });
        }

        // Fetch job details
        const job = await Job.findOne({ jobId });
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        // const isOnCampus = job.category === "On-Campus"; // Check if job is on-campus
        const appliedData = await AppliedStudents.findOne({ jobId });

        if (!appliedData) {
            return res.status(404).json({ success: false, message: "No applications found for this job" });
        }

        // Parse CSV to get roll numbers
        const rollNumbers = await parseCSV(req.file.buffer);

        // if (isOnCampus) {
            // On-campus: Only Admin can update
            const admin = await StaffDetails.findOne({ employeeId: req.user.username });
            if (!admin) {
                return res.status(403).json({ success: false, message: "Only admin can update on-campus jobs" });
            }

            // Ensure roll numbers exist in `applications`
            const validRollNumbers = rollNumbers.filter(roll => appliedData.applications.includes(roll));

            if (validRollNumbers.length === 0) {
                return res.status(400).json({ success: false, message: "No valid applicants found in the applications list" });
            }

            await AppliedStudents.updateOne({ jobId }, { $addToSet: { [statusType]: { $each: validRollNumbers } } });

        // } else {
        //     // Off-campus: Students must submit recruiter email proof
        //     const student = await StudentDetails.findOne({ rollNumber: req.user.username });

        //     if (!student) {
        //         return res.status(403).json({ success: false, message: "Only students can update off-campus job status" });
        //     }

        //     const emailVerified = await storeRecruiterEmail(req.user.email, jobId);
        //     if (!emailVerified) {
        //         return res.status(400).json({ success: false, message: "Verification failed. Submit recruiter email proof." });
        //     }

        //     // Ensure student is in applications list before adding them
        //     if (!appliedData.applications.includes(student.rollNumber)) {
        //         return res.status(400).json({ success: false, message: "You have not applied for this job" });
        //     }

        //     await AppliedStudents.updateOne({ jobId }, { $addToSet: { [statusType]: student.rollNumber } });
        // }

        res.status(200).json({ success: true, message: `${statusType} list updated successfully` });
    } catch (error) {
        console.error("Error updating job status:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};



// Function to parse CSV and extract roll numbers
const parseCSV = async (buffer) => {
    return new Promise((resolve, reject) => {
        const rollNumbers = [];
        streamifier.createReadStream(buffer)
            .pipe(csvParser())
            .on("data", (row) => {
                if (row.rollNumber) {
                    rollNumbers.push(row.rollNumber.trim());
                }
            })
            .on("end", () => resolve(rollNumbers))
            .on("error", (error) => reject(error));
    });
};







