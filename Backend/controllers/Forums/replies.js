import Reply from "../../models/Forums/Reply.js";
import Comment from "../../models/Forums/Comment.js";
import Report from "../../models/Forums/Report.js";
import { getProfilePhoto } from "../../utils/profilePhoto.js";
import StudentDetails from "../../models/Students/Student.Details.js";
import StaffDetails from "../../models/Staff/Staff.Details.js";

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

        // Check if the comment exists
        const commentExists = await Comment.exists({ commentId });
        if (!commentExists) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        // Fetch paginated replies
        const replies = await Reply.find({ commentId })
            .sort({ createdAt: -1 }) // Latest first
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .lean();

        // Fetch user details for each reply
        for (const reply of replies) {
            if (reply.userType === "Student") {
                const student = await StudentDetails.findOne({ rollNumber: reply.repliedBy }).select("firstName lastName");
                if (student) {
                    reply.firstName = student.firstName;
                    reply.lastName = student.lastName;
                    reply.profilePhoto = await getProfilePhoto(reply.repliedBy, reply.userType, 50);
                }
            } else if (reply.userType === "Staff") {
                const staff = await StaffDetails.findOne({ employeeId: reply.repliedBy }).select("firstName lastName");
                if (staff) {
                    reply.firstName = staff.firstName;
                    reply.lastName = staff.lastName;
                    reply.profilePhoto = await getProfilePhoto(reply.repliedBy, reply.userType, 50);
                }
            }
        }

        // Calculate total pages for replies
        const totalReplies = await Reply.countDocuments({ commentId });
        const totalPages = Math.ceil(totalReplies / limit);

        res.status(200).json({
            success: true,
            data: replies,
            pagination: { totalPages, currentPage: page },
        });

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
            return { success: false, status: 404, message: "Reply not found" };
        }

        // Ensures only the author or a moderator can delete
        if (reply.repliedBy !== username && role !== "staff") {
            return { success: false, status: 403, message: "Unauthorized to delete this reply" };
        }

        await Reply.deleteOne({ replyId });

        // Removes from comment's replies array
        await Comment.findOneAndUpdate({ commentId: reply.commentId }, { $pull: { replies: replyId } });

        return { success: true, status: 200, message: "Reply deleted successfully" };

    } catch (error) {
        console.error("Error deleting reply:", error.message);
        return { success: false, status: 500, message: "Server error" };
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
