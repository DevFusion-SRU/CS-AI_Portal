import Job from "../../models/Jobs/Job.js";
import AppliedStudents from "../../models/Jobs/appliedStudents.js";

export const getInDemandSkills = async (req, res) => {
    try {
        const getInDemandSkills = await Job.aggregate([
            { $unwind: { path: "$description.skills", preserveNullAndEmptyArrays: true } }, // Avoid errors for empty skills
            { $group: { _id: "$description.skills", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        res.json({ 
            success: true, 
            message: "Job analytics data fetched successfully", 
            inDemandSkills: getInDemandSkills 
        });
    } catch (error) {
        console.error("Error fetching job analytics:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const getMostAppliedJobs = async (req, res) => {
    try {
        const topJobs = await AppliedStudents.aggregate([
            { $unwind: "$applications" },  // Convert array to individual entries
            { $group: { _id: "$jobId", totalApplications: { $sum: 1 } } },  // Count applications
            { $sort: { totalApplications: -1 } },  // Sort in descending order
            { $limit: 15 }  // Get top 5 jobs
        ]);

        res.status(200).json({ success: true, topJobs });
    } catch (error) {
        console.error("Error fetching most applied jobs:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const getMostAppliedCompanies = async (req, res) => {
    try {
        const topCompanies = await AppliedStudents.aggregate([
            { $unwind: "$applications" },  // Convert array to individual entries
            { 
                $lookup: {  // Join with Jobs collection to get company name
                    from: "jobs", 
                    localField: "jobId", 
                    foreignField: "jobId", 
                    as: "jobDetails"
                }
            },
            { $unwind: "$jobDetails" },  // Extract job details
            { 
                $group: { 
                    _id: "$jobDetails.company",  // Group by company
                    totalApplications: { $sum: 1 }  // Count applications
                } 
            },
            { $sort: { totalApplications: -1 } },  // Sort in descending order
            { $limit: 5 }  // Get top 5 companies
        ]);

        res.status(200).json({ success: true, topCompanies });
    } catch (error) {
        console.error("Error fetching most applied companies:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
