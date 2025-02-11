import { demographicConn } from "../config/db.js";
import Post from "../models/Posts/Post.js";
import Student from "../models/student.js";  // Updated import


export const createPost = async (req, res) => {
	try {
		console.log("Request Body:", req.body);  // Debugging output

		const { text, rollNumber } = req.body;  // Replace `username` with `rollNumber`

		if (!rollNumber) {
			return res.status(400).json({ error: "Roll Number is required" });
		}

		// Find student by rollNumber
		const student = await Student.findOne({ rollNumber });

		if (!student) return res.status(404).json({ message: "Student not found" });

		if (!text) {
			return res.status(400).json({ error: "Post must have text" });
		}

		const newPost = new Post({
			user: student._id,  // Use ObjectId of the student instead of rollNumber
			text,
		});

		await newPost.save();
		res.status(201).json(newPost);
	} catch (error) {
		console.log("Error in createPost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};


export const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		// if (post.user.toString() !== req.user._id.toString()) {
		// 	return res.status(401).json({ error: "You are not authorized to delete this post" });
		// }

		// if (post.img) {
		// 	const imgId = post.img.split("/").pop().split(".")[0];
		// 	await cloudinary.uploader.destroy(imgId);
		// }

		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		console.log("Error in deletePost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const commentOnPost = async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = "67a898d4df10bc2e477a0392";

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}
		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const comment = { user: userId, text };

		post.comments.push(comment);
		await post.save();

		res.status(200).json(post);
	} catch (error) {
		console.log("Error in commentOnPost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// export const likeUnlikePost = async (req, res) => {
// 	try {
// 		const userId = req.user._id;
// 		const { id: postId } = req.params;

// 		const post = await Post.findById(postId);

// 		if (!post) {
// 			return res.status(404).json({ error: "Post not found" });
// 		}

// 		const userLikedPost = post.likes.includes(userId);

// 		if (userLikedPost) {
// 			// Unlike post
// 			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
// 			await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

// 			const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
// 			res.status(200).json(updatedLikes);
// 		} else {
// 			// Like post
// 			post.likes.push(userId);
// 			await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
// 			await post.save();

// 			const notification = new Notification({
// 				from: userId,
// 				to: post.user,
// 				type: "like",
// 			});
// 			await notification.save();

// 			const updatedLikes = post.likes;
// 			res.status(200).json(updatedLikes);
// 		}
// 	} catch (error) {
// 		console.log("Error in likeUnlikePost controller: ", error);
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// };

export const getAllPosts = async (req, res) => {
	try {

		const Student = demographicConn.model("Student"); 

    const posts = await Post.find()
      .populate({ path: "user", model: Student })  // ✅ Use the correct model
	  .populate({
		path: "comments.user",   // Populating the user who commented
		model: Student,  // Explicitly using the Student model
		
	   })
	   .sort({ createdAt: -1 });


		if (posts.length === 0) {
			return res.status(200).json([]);
		}

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getAllPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// export const getLikedPosts = async (req, res) => {
// 	const userId = req.params.id;

// 	try {
// 		const user = await User.findById(userId);
// 		if (!user) return res.status(404).json({ error: "User not found" });

// 		const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
// 			.populate({
// 				path: "user",
// 				select: "-password",
// 			})
// 			.populate({
// 				path: "comments.user",
// 				select: "-password",
// 			});

// 		res.status(200).json(likedPosts);
// 	} catch (error) {
// 		console.log("Error in getLikedPosts controller: ", error);
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// };


export const getUserPosts = async (req, res) => {
	try {
		const { username } = req.params;
		const Student = demographicConn.model("Student"); 
		const user = await Student.findOne({ rollNumber: username });
		if (!user) return res.status(404).json({ error: "User not found" });

		const posts = await Post.find({ user: user._id })
		
		.populate({ path: "user", model: Student })  // ✅ Use the correct model
		.populate({
		  path: "comments.user",   // Populating the user who commented
		  model: Student,  // Explicitly using the Student model
		  
		 })
		 .sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getUserPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};