import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { forumDB } from "../../config/db.js";


const jobForumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  jobForumId: { type: String, default: uuidv4, unique: true }, // Unique Forum ID  
  jobId: { type: String, ref: "Job", required: true }, // Null for general discussion
  members: [{ type: String, required: false }], // Stores an array of rollNumbers
  posts: [{ type: String, ref: "Post" }], // Store only postId instead of full post object
});

const JobForum = forumDB.model("JobForum", jobForumSchema);
export default JobForum;




