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

// export const getJobs = async (req, res) => {
//     const filters = {};
    

//     const type = req.query.type;
//     if (type && type !== "all") {
//         filters.type = type;
//     }
   
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
//         // Pagination setup
//         const page = parseInt(req.query.page) || 1; // Default to page 1
//         const limit = parseInt(req.query.limit) || 25; // Default to 25 jobs per page
//         const skip = (page - 1) * limit;

//         // Parallelize querying jobs and counting documents to reduce response time
//         const [jobs, totalJobs] = await Promise.all([
//             Job.find(filters).skip(skip).limit(limit),  // Jobs query with pagination
//             Job.countDocuments(filters)  // Count the filtered documents (optional but helps with pagination info)
//         ]);

//         if (jobs.length === 0) {
//             return res.status(404).json({ success: false, message: "No jobs found matching the search criteria." });
//         }

//         // Send the response with the total pages and current page information
//         res.status(200).json({
//             success: true,
//             data: jobs,
//             totalPages: Math.ceil(totalJobs / limit),  // Total pages based on filtered jobs
//             currentPage: page,
//         });
//     } catch (error) {
//         console.error("Error in fetching Jobs:", error.message);
//         res.status(500).json({ success: false, message: "Server Error" });
//     }
// };


export const getJobs = async (req, res) => {
    const filters = {};

      // ✅ Type filter (supports multiple values)
      if (req.query.type) {
        filters.type = { $in: req.query.type.split(",") };
    }

    // ✅ Company filter (case-insensitive search)
    if (req.query.company) {
        const companyQuery = req.query.company.trim().replace(/\s+/g, " ");
        filters.company = { $regex: new RegExp(companyQuery, "i") };  // Case-insensitive regex search
    }

    // ✅ Title filter (case-insensitive search)
    if (req.query.title) {
        filters.title = { $regex: new RegExp(req.query.title.trim(), "i") };
    }

    // ✅ Job ID filter (only **one** value, exact match)
    if (req.query.jobId) {
        filters.jobId = req.query.jobId.trim();
    }

    // ✅ Category filter (supports multiple values)
    if (req.query.category) {
        filters.category = { $in: req.query.category.split(",") };
    }

    // ✅ Mode of Work filter (supports multiple values)
    if (req.query.modeOfWork) {
        filters.modeOfWork = { $in: req.query.modeOfWork.split(",") };
    }

    // ✅ Compensation Type filter (supports multiple values)
    if (req.query.compensationType) {
        filters.compensationType = { $in: req.query.compensationType.split(",") };
    }

    // ✅ Skills filter (checks if ANY skill in the query exists in the job's `description.skills` array)
    if (req.query.skills) {
        filters["description.skills"] = { $in: req.query.skills.split(",") };
    }
    // try {
    //     // Pagination setup
    //     const page = parseInt(req.query.page) || 1; // Default to page 1
    //     const limit = parseInt(req.query.limit) || 25; // Default to 25 jobs per page
    //     const skip = (page - 1) * limit;

    //     // Parallelize querying jobs and counting documents
    //     const [jobs, totalJobs] = await Promise.all([
    //         Job.find(filters).skip(skip).limit(limit),  // Jobs query with pagination
    //         Job.countDocuments(filters)  // Count filtered jobs (for pagination info)
    //     ]);

    //     if (jobs.length === 0) {
    //         return res.status(404).json({ success: false, message: "No jobs found matching the search criteria." });
    //     }

    //     // Sending paginated response
    //     res.status(200).json({
    //         success: true,
    //         data: jobs,
    //         totalPages: Math.ceil(totalJobs / limit),  // Calculate total pages
    //         currentPage: page,
    //     });
    // } catch (error) {
    //     console.error("Error in fetching Jobs:", error.message);
    //     res.status(500).json({ success: false, message: "Server Error" });
    // }


    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;

    try {
        const result = await Job.aggregate([
            { $match: filters },  // 🔹 Apply Filters First
            {
                $facet: {
                    metadata: [{ $count: "total" }],  // 🔹 Get total count
                    data: [{ $skip: skip }, { $limit: limit }]  // 🔹 Apply Pagination
                }
            }
        ]);

        // Extract jobs and total count
        const jobs = result[0].data;
        const totalJobs = result[0].metadata[0]?.total || 0;

        res.status(200).json({
            success: true,
            data: jobs,
            totalPages: Math.ceil(totalJobs / limit),  // 🔹 Calculate total pages
            currentPage: page
        });
    } catch (error) {
        console.error("Error fetching jobs: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }




};



export const searchCompanies = async (req, res) => {
    try {
        const { query } = req.query;  // Get search input from query parameter

        if (!query || query.trim() === "") {
            return res.status(400).json({ success: false, message: "Query parameter is required" });
        }

        // Case-insensitive regex search for companies containing the query
        const companies = await Job.distinct("company", { 
            company: { $regex: new RegExp("^" + query, "i") }  // ✅ Matches "Google" but NOT "BlogXS" 
        });

        res.status(200).json({ success: true, data: companies });
    } catch (error) {
        console.error("Error fetching company names:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};





export const addJob = async (req, res) => {
    const job = req.body;
    if (!job.modeOfWork || !job.jobId || !job.title || !job.type || !job.company || !job.location || !job.description.text || !job.applyLink) {
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
        if (!job.modeOfWork ||!job.jobId || !job.title || !job.type || !job.company || !job.location || !job.description.text || !job.applyLink) {
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
