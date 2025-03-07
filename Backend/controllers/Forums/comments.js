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
            return { success: false, status: 404, message: "Comment not found" };
        }

        // Allow deletion if the user is the author or a staff moderator
        if (comment.commentedBy !== username && role !== "staff") {
            return { success: false, status: 403, message: "Unauthorized to delete this comment" };
        }

        // Delete all replies associated with this comment
        await Reply.deleteMany({ commentId });

        // Delete the comment
        await Comment.deleteOne({ commentId });

        // Remove the comment ID from the associated post
        await Post.updateOne({ postId: comment.postId }, { $pull: { comments: comment.commentId } });

        return { success: true, status: 200, message: "Comment and all associated replies deleted" };
    } catch (error) {
        console.error("Error deleting comment:", error.message);
        return { success: false, status: 500, message: "Server error" };
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
