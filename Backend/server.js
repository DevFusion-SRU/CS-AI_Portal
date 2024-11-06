import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Job from "./models/job.model.js";

dotenv.config();

const app = express();

app.use(express.json()); // Express middleware: to accpet JSON data in req.body

// Routes
app.get("/", async (req, res) => {
    res.send("Server is ready!");
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
