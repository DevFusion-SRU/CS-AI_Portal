import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { forumDB } from "../../config/db.js";

const commentSchema = new mongoose.Schema(
    {
        commentId: { type: String, default: uuidv4, unique: true }, // Unique Comment ID
        postId: { type: String, required: true, ref: "Post" }, // Post unqId
        commentedBy: { type: String, required: true, refPath: "userType" }, // rollNumber or employeeId
        userType: { type: String, required: true, enum: ["Student", "Staff"] },
        text: { type: String, required: true },
        likes: [{ type: String, refPath: "likedUserType" }],
        likedUserType: [{ type: String, enum: ["Student", "Staff"] }],
        replies: [{ type: String, ref: "Reply" }], // Replies to this comment
    },
    { timestamps: true }
);

const Comment = forumDB.model("Comment", commentSchema);
export default Comment;
