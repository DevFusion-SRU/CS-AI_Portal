import mongoose from "mongoose";
import axios from "axios";
import Job from "../../models/Jobs/Job.js";
import SavedJobs from "../../models/Jobs/savedJobs.js";

// import AppliedJobs from "../../models/Jobs/appliedJobs.js";

import StudentDetails from "../../models/Students/Student.Details.js"; // StudentDetails model using studentDB
import AppliedStudents from "../../models/Jobs/appliedStudents.js"; // AppliedStudents model using jobDB
// controllers/Jobs/jobApplications.js
export const addApplication = async (req, res) => {
    const { rollNumber, jobId } = req.body;
  
    if (!rollNumber || !jobId) {
      return res.status(400).json({ success: false, message: "Provide rollNumber and jobId!" });
    }
  
    try {
      let appliedStudentsEntry = await AppliedStudents.findOne({ jobId });
  
      if (!appliedStudentsEntry) {
        appliedStudentsEntry = new AppliedStudents({ jobId, applications: [rollNumber] });
      } else if (!appliedStudentsEntry.applications.includes(rollNumber)) {
        appliedStudentsEntry.applications.push(rollNumber);
      } else {
        return res.status(400).json({ success: false, message: "This student has already applied for this job!" });
      }
  
      await appliedStudentsEntry.save();
  
      // Return only the relevant data
      res.status(201).json({ success: true, data: appliedStudentsEntry });
    } catch (error) {
      console.error("Error in adding applied job:", error.message);
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


export const addSavedJob = async (req, res) => {
    const { rollNumber, jobId } = req.body;
  
    if (!rollNumber || !jobId) {
      return res.status(400).json({ success: false, message: "Provide rollNumber and jobId!" });
    }
  
    try {
      let savedJobsEntry = await SavedJobs.findOne({ rollNumber });
  
      if (!savedJobsEntry) {
        // Create new entry if it doesn't exist
        savedJobsEntry = new SavedJobs({ rollNumber, jobIds: [jobId] });
      } else if (!savedJobsEntry.jobIds.includes(jobId)) {
        // Add jobId if not already saved
        savedJobsEntry.jobIds.push(jobId);
      } else {
        return res.status(400).json({ success: false, message: "This job is already saved!" });
      }
  
      await savedJobsEntry.save();
  
      res.status(201).json({ success: true, data: savedJobsEntry });
    } catch (error) {
      console.error("Error in adding saved job:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  
  export const getSavedJobs = async (req, res) => {
    const { rollNumber } = req.params;
  
    try {
      const savedJobsEntry = await SavedJobs.findOne({ rollNumber });
      if (!savedJobsEntry || !savedJobsEntry.jobIds.length) {
        return res.status(404).json({ success: false, message: "No saved jobs found!" });
      }
  
      // Fetch job details for saved jobIds
      const jobDetails = await Job.find({ jobId: { $in: savedJobsEntry.jobIds } });
  
      res.status(200).json({ success: true, data: jobDetails });
    } catch (error) {
      console.error("Error fetching saved jobs:", error.message);
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

         // 🔹 Process each student to fetch their Base64 image
         const peersDetails = await Promise.all(
            peers.map(async (peer) => {
                let base64Image = null;

                if (peer.photoUrl) {
                    try {
                        //  Resize image dynamically using Cloudinary URL transformation (50x50)
                        const resizedImageUrl = peer.photoUrl.replace(
                            "/upload/",
                            "/upload/w_50,h_50,c_fill,q_auto/"
                        );

                        //  Fetch the resized image from Cloudinary
                        const imgResponse = await axios.get(resizedImageUrl, {
                            responseType: "arraybuffer",
                        });

                        //  Extract MIME type dynamically
                        const contentType = imgResponse.headers["content-type"];

                        //  Convert image to Base64 format
                        base64Image = `data:${contentType};base64,${Buffer.from(imgResponse.data).toString("base64")}`;
                    } catch (error) {
                        console.error(`Error fetching image for ${peer.rollNumber}:`, error.message);
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
// Get Most Applied Jobs (New)
export const getMostAppliedJobs = async (req, res) => {
    try {
      const topJobs = await AppliedStudents.aggregate([
        { $unwind: "$applications" }, // Unwind applications array
        { $group: { _id: "$jobId", totalApplications: { $sum: 1 } } }, // Count applications per job
        { $sort: { totalApplications: -1 } }, // Sort by application count descending
        { $limit: 15 }, // Limit to top 15
      ]);
  
      // Fetch job details for the top jobIds
      const jobIds = topJobs.map(job => job._id);
      const jobDetails = await Job.find({ jobId: { $in: jobIds } });
  
      // Merge job details with application counts
      const enrichedTopJobs = topJobs.map(topJob => {
        const jobDetail = jobDetails.find(job => job.jobId === topJob._id) || {};
        return {
          _id: topJob._id,
          company: jobDetail.company || "Unknown",
          title: jobDetail.title || "Untitled",
          totalApplications: topJob.totalApplications,
        };
      });
  
      res.status(200).json({ success: true, topJobs: enrichedTopJobs });
    } catch (error) {
      console.error("Error fetching most applied jobs:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  
  // Get In-Demand Skills (New)
  export const getInDemandSkills = async (req, res) => {
    try {
      const inDemandSkills = await Job.aggregate([
        { $unwind: { path: "$description.skills", preserveNullAndEmptyArrays: true } }, // Unwind skills array
        { $group: { _id: "$description.skills", count: { $sum: 1 } } }, // Count occurrences of each skill
        { $match: { _id: { $ne: null } } }, // Exclude null skills
        { $sort: { count: -1 } }, // Sort by count descending
        { $limit: 5 }, // Limit to top 5 skills
      ]);
  
      res.status(200).json({
        success: true,
        message: "In-demand skills fetched successfully",
        inDemandSkills,
      });
    } catch (error) {
      console.error("Error fetching in-demand skills:", error.message);
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
