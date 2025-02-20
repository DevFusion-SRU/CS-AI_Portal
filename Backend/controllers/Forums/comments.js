import Comment from "../../models/Forums/Comment.js";
import Post from "../../models/Forums/Post.js";
import Report from "../../models/Forums/Report.js";

export const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { text } = req.body;
        const { username, role } = req.user;

        // Check if the post exists
        const postExists = await Post.exists({ postId });
        if (!postExists) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Create and save comment
        const comment = new Comment({
            postId,
            text,
            commentedBy: username,
            userType: role === "student" ? "Student" : role === "staff" ? "Staff" : undefined
        });
        await comment.save();

        // Add comment ID to the post
        await Post.updateOne({ postId }, { $push: { comments: comment.commentId } });

        res.status(201).json({ success: true, message: "Comment added successfully", comment });
    } catch (error) {
        console.error("Error adding comment:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        // Check if post exists
        const postExists = await Post.exists({ postId });
        if (!postExists) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Fetch comments with pagination
        const comments = await Comment.find({ postId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .lean();

        res.json({ success: true, comments, page, limit });
    } catch (error) {
        console.error("Error fetching comments:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const editComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { text } = req.body;
        const { username } = req.user;

        // Find and update the comment
        const comment = await Comment.findOneAndUpdate(
            { commentId, commentedBy: username },
            { text },
            { new: true }
        );

        if (!comment) {
            return res.status(403).json({ success: false, message: "Unauthorized to edit this comment" });
        }

        res.json({ success: true, message: "Comment updated", comment });
    } catch (error) {
        console.error("Error editing comment:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { username, role } = req.user;

        // Find the comment
        const comment = await Comment.findOne({ commentId });

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        // Allow deletion if the user is the author or a staff moderator
        if (comment.commentedBy !== username && role !== "staff") {
            return res.status(403).json({ success: false, message: "Unauthorized to delete this comment" });
        }

        // Delete the comment
        await Comment.deleteOne({ commentId });

        // Remove the comment ID from the associated post
        await Post.updateOne({ postId: comment.postId }, { $pull: { comments: comment.commentId } });

        res.json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const likeUnlikeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { username, role } = req.user;

        const comment = await Comment.findOne({ commentId });

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        const likeIndex = comment.likes.indexOf(username);

        if (likeIndex === -1) {
            // Like comment
            comment.likes.push(username);
            comment.likedUserType.push(role === "student" ? "Student" : role === "staff" ? "Staff" : undefined);
        } else {
            // Unlike comment
            comment.likes.splice(likeIndex, 1);
            comment.likedUserType.splice(likeIndex, 1);
        }

        await comment.save();
        res.json({ success: true, message: "Like status updated", likes: comment.likes.length });
    } catch (error) {
        console.error("Error liking comment:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const reportComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { reason } = req.body;
        const { username, role } = req.user;

        // Check if the comment exists
        const commentExists = await Comment.exists({ commentId });
        if (!commentExists) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        // Check if a report already exists for this comment
        let report = await Report.findOne({ type: "Comment", typeId: commentId });

        if (report) {
            // Check if the user has already reported this comment
            const alreadyReported = report.reports.some(r => r.reportedBy === username);
            if (alreadyReported) {
                return res.status(400).json({ success: false, message: "You have already reported this comment." });
            }

            // Add new report entry
            report.reports.push({
                reportedBy: username,
                userType: role === "student" ? "Student" : role === "staff" ? "Staff" : undefined,
                reason
            });
        } else {
            // Create a new report if it doesn't exist
            report = new Report({
                type: "Comment",
                typeId: commentId,
                reports: [{
                    reportedBy: username,
                    userType: role === "student" ? "Student" : role === "staff" ? "Staff" : undefined,
                    reason
                }],
                status: "Pending",
            });
        }

        await report.save();
        res.status(201).json({ success: true, message: "Comment reported successfully" });

    } catch (error) {
        console.error("Error reporting comment:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
