import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { forumDB } from "../../config/db.js";

const replySchema = new mongoose.Schema(
    {
        replyId: { type: String, default: uuidv4, unique: true }, // Unique Reply ID
        commentId: { type: String, required: true, ref: "Comment" }, // Comment unqId
        repliedBy: { type: String, required: true, refPath: "userType" }, // rollNumber or employeeId
        userType: { type: String, required: true, enum: ["Student", "Staff"] },
        text: { type: String, required: true },
        likes: [{ type: String, refPath: "likedUserType" }],
        likedUserType: [{ type: String, enum: ["Student", "Staff"] }],
    },
    { timestamps: true }
);

const Reply = forumDB.model("Reply", replySchema);
export default Reply;
