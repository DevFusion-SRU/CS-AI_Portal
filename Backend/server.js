import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import { connectDB } from "./config/db.js";
import Job from "./models/job.model.js";

dotenv.config();
const corsOptions={
    origin:["http://localhost:5173"]
}
const app = express();
app.use(cors(corsOptions))
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Specify allowed origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Express middleware: to accpet JSON data in req.body

// Routes
app.get("/", async (req, res) => {
    res.send("Server is ready!");
});

app.get("/api/jobs", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 jobs per page
        const skip = (page - 1) * limit;
        const type = req.query.type; // Type passed in query param

        // If type is provided (other than 'all'), filter jobs by type
        const filter = type && type !== "all" ? { type } : {};

        // Fetch jobs based on type and paginate them
        const jobs = await Job.find(filter).skip(skip).limit(limit); 
        const totalJobs = await Job.countDocuments(filter); // Total jobs count based on type

        res.status(200).json({
            success: true,
            data: jobs,
            totalPages: Math.ceil(totalJobs / limit), // Total pages based on filtered jobs
            currentPage: page,
        });
    } catch (error) {
        console.error("Error in fetching Jobs:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});



app.post("/api/jobs", async (req, res) => {
    const job = req.body; // Admin will send this data
    if (!job.id || !job.name || !job.company || !job.applyLink) {
        return res.status(400).json({ success: false, message: "Provide all required fields!!" });
    }

    const newJob = new Job(job);
    try {
        await newJob.save();
        res.status(201).json({ success: true, data: newJob });
    } catch (error) {
        console.error("Error in entering Job details: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

app.delete("/api/jobs/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // await Job.findByIdAndDelete(id);
        const job = await Job.findOneAndDelete({ id: id });
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found!" });
        }

        res.status(200).json({ success: true, message: "Job deleted" });
    } catch (error) {
        console.error("Error deleting job: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server Started at Port at http://localhost:${PORT}`);
});
