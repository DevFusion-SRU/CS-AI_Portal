import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { forumDB } from "../../config/db.js";


const reportSchema = new mongoose.Schema(
    {
        reportId: { type: String, default: uuidv4, unique: true }, // Unique Report ID
        type: { type: String, required: true, enum: ["Post", "Comment", "Reply"] }, // Type of reported content
        typeId: { type: String, required: true, unique: true }, // (Post, Comment, or Reply)'s Id
        reports: [
            {
                reportedBy: { type: String, required: true, refPath: "reports.userType" }, // rollNumber or employeeId
                userType: { type: String, required: true, enum: ["Student", "Staff"] }, // Student/Staff
                reason: { type: String, required: true },
                reportedAt: { type: Date, default: Date.now },
            }
        ],
        status: { type: String, default: "Pending", enum: ["Pending", "Reviewed", "Resolved"] },
    },
    { timestamps: true }
);

const Report = forumDB.model("Report", reportSchema);
export default Report;
