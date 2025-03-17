import express from "express";
import mongoose from "mongoose";
import { jobDB } from "../../Backend/config/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

const noticeSchema = new mongoose.Schema({
  message: String,
  date: { type: Date, default: Date.now },
});
const Notice = jobDB.model("Notice", noticeSchema);

router.get("/latest", authenticateToken, async (req, res) => {
//   console.log("Reached /api/notices/latest"); // Debug log
  try {
    const latestNotice = await Notice.findOne().sort({ date: -1 });
    // console.log("Notice found:", latestNotice); // Debug log
    if (!latestNotice) {
      return res.status(200).json({ success: true, data: null, message: "No notices found" });
    }
    // Format date as "day month year"
    const formattedDate = latestNotice.date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    res.json({
      success: true,
      data: {
        message: latestNotice.message,
        date: formattedDate, // e.g., "14 March 2025"
      },
    });
  } catch (error) {
    console.error("Error fetching latest notice:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;