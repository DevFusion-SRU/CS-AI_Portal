import Report from "../../models/Forums/Report.js";
import Post from "../../models/Forums/Post.js";
import Comment from "../../models/Forums/Comment.js";
import Reply from "../../models/Forums/Reply.js";

import { deletePost } from "./posts.js";
import { deleteComment } from "./comments.js";
import { deleteReply } from "./replies.js";

/**
 * Common function to handle reporting posts, comments, and replies.
 */
const handleReport = async (req, res, type, model, paramKey) => {
    try {
        const { [paramKey]: id } = req.params; // Extracts postId, commentId, or replyId dynamically
        const { reason } = req.body;
        const { username, role } = req.user;

        if (!reason || reason.trim() === '') {
            return res.status(400).json({ success: false, message: "Reason is required" });
        }

        // Check if the entity exists
        const entityExists = await model.exists({ [paramKey]: id });
        if (!entityExists) {
            return res.status(404).json({ success: false, message: `${type} not found` });
        }

        let report = await Report.findOne({ type, typeId: id });

        if (report) {
            const alreadyReported = report.reports.some(r => r.reportedBy === username);
            if (alreadyReported) {
                return res.status(400).json({ success: false, message: `You have already reported this ${type.toLowerCase()}.` });
            }

            report.reports.push({
                reason,
                reportedBy: username,
                userType: role === "student" ? "Student" : role === "staff" ? "Staff" : undefined
            });
        } else {
            report = new Report({
                type,
                typeId: id,
                reports: [{
                    reason,
                    reportedBy: username,
                    userType: role === "student" ? "Student" : role === "staff" ? "Staff" : undefined
                }],
                status: "Pending",
            });
        }

        await report.save();
        res.status(201).json({ success: true, message: `${type} reported successfully` });

    } catch (error) {
        console.error(`Error reporting ${type.toLowerCase()}:`, error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * Report a post.
 */
export const reportPost = async (req, res) => {
    await handleReport(req, res, "Post", Post, "postId");
};


/**
 * Report a comment.
 */
export const reportComment = async (req, res) => {
    await handleReport(req, res, "Comment", Comment, "commentId");
};

/**
 * Report a reply.
 */
export const reportReply = async (req, res) => {
    await handleReport(req, res, "Reply", Reply, "replyId");
};

/**
 * Fetch all reported items (for moderation).
 */
export const fetchReportedItems = async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 });

        if (!reports.length) {
            return res.status(404).json({ success: false, message: "No reports found" });
        }

        res.status(200).json({ success: true, reports });
    } catch (error) {
        console.error("Error fetching reports:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * Delete a reported item (moderator action).
 */
export const deleteReportedItem = async (req, res) => {
    try {
        const { reportId, type, typeId } = req.params;
        const { username, role } = req.user;

        // Create a mock request object to pass to deletePost/deleteComment/deleteReply
        const mockReq = {
            params: { postId: typeId, commentId: typeId, replyId: typeId }, // Assign typeId based on what is needed
            user: { username, role }
        };
        

        let deletionResponse;

        if (type === "Post") {
            deletionResponse = await deletePost(mockReq);
        } 
        else if (type === "Comment") {
            deletionResponse = await deleteComment(mockReq);
        } 
        else if (type === "Reply") {
            deletionResponse = await deleteReply(mockReq);
        } 
        else {
            return res.status(400).json({ success: false, message: "Invalid type" });
        }

        if (!deletionResponse.success) {
            return res.status(deletionResponse.status).json({ success: false, message: deletionResponse.message });
        }

        await Report.deleteOne({ reportId });

        return res.status(200).json({ success: true, message: `${type} deleted and report removed.` });

    } catch (error) {
        console.error("Error deleting reported item:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
