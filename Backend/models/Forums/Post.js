import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { forumDB } from "../../config/db.js";

const postSchema = new mongoose.Schema(
    {
        postId: { type: String, default: uuidv4, unique: true }, // Unique Post ID
        title: { type: String, required: true },
        description: { type: String, required: false },
        photo: { type: String }, // Image URL
        postedBy: { type: String, required: true, refPath: "userType" }, // rollNumber or employeeId
        userType: { type: String, required: true, enum: ["Student", "Staff"] }, // Differentiates between students & staff
        likes: [{ type: String, refPath: "likedUserType" }], // Who liked the post
        likedUserType: [{ type: String, enum: ["Student", "Staff"] }], // Stores user type for likes
        comments: [{ type: String, ref: "Comment" }], // Array of Comment commentIds
        jobId: { type: String, ref: "Job", default: null}, // Links post to a specific job (optional)
    },
    { timestamps: true }
);

const Post = forumDB.model("Post", postSchema);
export default Post;
