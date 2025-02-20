import mongoose from "mongoose";
import { forumDB } from "../../config/db.js";

const postSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Student",
			required: true,
		}, 
		text: {
			type: String,
            required: true,
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Student",
			},
		],
		comments: [
			{
				text: {
					type: String,
					required: true,
				},
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Student",
					required: true,
				},
			},
		],
	},
	{ timestamps: true }
);

const Post = forumDB.model("Post", postSchema);
console.log(`Post model created`);
export default Post;

