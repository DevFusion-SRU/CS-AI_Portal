import Reply from "../../models/Forums/Reply.js";
import Comment from "../../models/Forums/Comment.js";
import Report from "../../models/Forums/Report.js";

export const addReply = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { text } = req.body;
        const { username, role } = req.user;

        // Check if the comment exists
        const commentExists = await Comment.exists({ commentId });
        if (!commentExists) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        // Create reply
        const reply = new Reply({
            commentId,
            text,
            repliedBy: username,
            userType: role === "student" ? "Student" : role === "staff" ? "Staff" : undefined
        });

        await reply.save();

        // Add reply to comment's replies array
        await Comment.findOneAndUpdate({ commentId }, { $push: { replies: reply.replyId } });

        res.status(201).json({ success: true, message: "Reply added successfully", reply });

    } catch (error) {
        console.error("Error adding reply:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getReplies = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { page = 1, limit = 5 } = req.query;

        const commentExists = await Comment.exists({ commentId });
        if (!commentExists) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        const replies = await Reply.find({ commentId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .lean();

        res.status(200).json({ success: true, replies });

    } catch (error) {
        console.error("Error fetching replies:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const editReply = async (req, res) => {
    try {
        const { replyId } = req.params;
        const { text } = req.body;
        const { username } = req.user;

        const reply = await Reply.findOne({ replyId });
        if (!reply) {
            return res.status(404).json({ success: false, message: "Reply not found" });
        }

        // Ensures only the author can edit
        if (reply.repliedBy !== username) {
            return res.status(403).json({ success: false, message: "Unauthorized to edit this reply" });
        }

        reply.text = text;
        await reply.save();

        res.status(200).json({ success: true, message: "Reply updated successfully", reply });

    } catch (error) {
        console.error("Error editing reply:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const deleteReply = async (req, res) => {
    try {
        const { replyId } = req.params;
        const { username, role } = req.user;

        const reply = await Reply.findOne({ replyId });
        if (!reply) {
            return res.status(404).json({ success: false, message: "Reply not found" });
        }

        // Ensures only the author or a moderator can delete
        if (reply.repliedBy !== username && role !== "staff") {
            return res.status(403).json({ success: false, message: "Unauthorized to delete this reply" });
        }

        await Reply.deleteOne({ replyId });

        // Removes from comment's replies array
        await Comment.findOneAndUpdate({ commentId: reply.commentId }, { $pull: { replies: replyId } });

        res.status(200).json({ success: true, message: "Reply deleted successfully" });

    } catch (error) {
        console.error("Error deleting reply:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const likeUnlikeReply = async (req, res) => {
    try {
        const { replyId } = req.params;
        const { username, role } = req.user;

        const reply = await Reply.findOne({ replyId });
        if (!reply) {
            return res.status(404).json({ success: false, message: "Reply not found" });
        }

        const likedIndex = reply.likes.indexOf(username);
        if (likedIndex === -1) {
            reply.likes.push(username);
            reply.likedUserType.push(role === "student" ? "Student" : role === "staff" ? "Staff" : undefined);
            await reply.save();
            return res.status(200).json({ success: true, message: "Reply liked" });
        } else {
            reply.likes.splice(likedIndex, 1);
            reply.likedUserType.splice(likedIndex, 1);
            await reply.save();
            return res.status(200).json({ success: true, message: "Reply unliked" });
        }

    } catch (error) {
        console.error("Error liking/unliking reply:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const reportReply = async (req, res) => {
    try {
        const { replyId } = req.params;
        const { reason } = req.body;
        const { username, role } = req.user;

        if (!reason || reason.trim() === '') {
            return res.status(400).json({ success: false, message: "Reason is required" });
        }

        const replyExists = await Reply.exists({ replyId });
        if (!replyExists) {
            return res.status(404).json({ success: false, message: "Reply not found" });
        }

        let report = await Report.findOne({ type: "Reply", typeId: replyId });

        if (report) {
            // Check if the user has already reported this reply
            const alreadyReported = report.reports.some(r => r.reportedBy === username);
            if (alreadyReported) {
                return res.status(400).json({ success: false, message: "You have already reported this reply." });
            }

            report.reports.push({
                reportedBy: username,
                userType: role === "student" ? "Student" : role === "staff" ? "Staff" : undefined,
                reason
            });
        } else {
            report = new Report({
                type: "Reply",
                typeId: replyId,
                reports: [{
                    reportedBy: username,
                    userType: role === "student" ? "Student" : role === "staff" ? "Staff" : undefined,
                    reason
                }],
                status: "Pending",
            });
        }


        await report.save();

        res.status(201).json({ success: true, message: "Reply reported successfully" });
    } catch (error) {
        console.error("Error reporting reply:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
