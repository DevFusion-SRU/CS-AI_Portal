import Post from "../../models/Forums/Post.js";
import Comment from "../../models/Forums/Comment.js";
import Reply from "../../models/Forums/Reply.js";
import Report from "../../models/Forums/Report.js";
import jobForum from "../../models/Forums/jobForum.js";




export const createJobForum = async (req, res) => {
    try {
        const { title, jobId } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }


         // Check if a job forum already exists for the given jobId
         if (jobId) {
            const existingForum = await jobForum.findOne({ jobId });
            if (existingForum) {
                return res.status(400).json({ success: false, message: "A forum for this job already exists" });
            }
        }


        // Create a new job forum
        const newForum = new jobForum({
            title,
            jobId: jobId || null, // Job-specific or general discussion
            members: [], // Initially, no members
            posts: [] // Initially, no posts
        });

        await newForum.save();

        res.status(201).json({ success: true, data: newForum });
    } catch (error) {
        console.error("Error creating job forum:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


/**
 * @desc Create a new post
 * @route POST /api/forums/posts
 * @access Students & Staff (Authenticated)
 */

export const createJobPost = async (req, res) => {
    try {
        const { username, role } = req.user; // Extracted from middleware
        const { title, description, jobId } = req.body;

        if (!title) return res.status(400).json({ success: false, message: "Title is required" });

        // Find the job forum to check if the user is a member
        const forum = await jobForum.findOne({ jobId });

        if (!forum) {
            return res.status(404).json({ success: false, message: "Job forum not found" });
        }

        if (role === "student" && !forum.members.includes(username)) {
            return res.status(403).json({ success: false, message: "Students must be members of the Pod" });
        }

        // Handles image upload if provided
        let photo = null;
        if (req.file) {
            photo = req.file.buffer.toString("base64"); // Convert Buffer to base64 string
        }

        // Create a new post
        const newPost = new Post({
            title,
            description,
            photo,
            postedBy: username,
            userType: role === "student" ? "Student" : role === "staff" ? "Staff" : undefined,
            jobId: jobId || null,
        });

        await newPost.save();

       // Ensure `forum.posts` is an array before pushing
       if (!Array.isArray(forum.posts)) {
        forum.posts = [];
        }

        // Store the new post ID in the forum's posts array
        forum.posts.push(newPost.postId);
        await forum.save();


        res.status(201).json({ success: true, data: newPost });

    } catch (error) {
        console.error("Error creating post:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const addMember = async (req, res) => {
    try {
        const { jobId, rollNumber } = req.body;

        if (!jobId || !rollNumber) {
            return res.status(400).json({ success: false, message: "Job ID and Roll Number are required" });
        }

        const forum = await jobForum.findOne({ jobId });

        if (!forum) {
            return res.status(404).json({ success: false, message: "Job forum not found" });
        }

        // Check if the user is already a member
        if (forum.members.includes(rollNumber)) {
            return res.status(400).json({ success: false, message: "User is already a member" });
        }

        forum.members.push(rollNumber);
        await forum.save();

        res.status(200).json({ success: true, data: forum.members });

    } catch (error) {
        console.error("Error adding member:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const getJobPosts = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { page = 1, limit = 10, sort = "latest" } = req.query;
        const sortOptions = {
            latest: { createdAt: -1 },
            mostLiked: { likes: -1 },
            mostCommented: { comments: -1 },
        };

        const forum = await jobForum.findOne({ jobId });

        if (!forum) {
            return res.status(404).json({ success: false, message: "Job forum not found" });
        }

        const posts = await Post.find({ jobId })
            .sort(sortOptions[sort] || sortOptions.latest)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .lean();

        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        console.error("Error fetching job posts:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};



export const deleteJobForum = async (req, res) => {
    try {
        const { jobId } = req.params;

        // Find the job forum
        const forum = await jobForum.findOne({ jobId });

        if (!forum) {
            return res.status(404).json({ success: false, message: "Job forum not found" });
        }

        // Get all postIds stored in the job forum (these are UUIDs, not ObjectIds)
        const postIds = forum.posts;

        if (postIds.length > 0) {
            // Find all comments related to these posts using postId (UUID)
            const comments = await Comment.find({ postId: { $in: postIds } });

            if (comments.length > 0) {
                const commentIds = comments.map(comment => comment.commentId);

                // Delete all replies linked to these comments
                await Reply.deleteMany({ commentId: { $in: commentIds } });

                // Delete all comments linked to these posts
                await Comment.deleteMany({ postId: { $in: postIds } });
            }

            // Delete all posts using postId (UUIDs, not ObjectIds)
            await Post.deleteMany({ postId: { $in: postIds } });
        }

        // Finally, delete the job forum itself
        await forum.deleteOne();

        res.status(200).json({ success: true, message: "Job forum and all associated posts, comments & replies deleted" });

    } catch (error) {
        console.error("Error deleting job forum:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};



export const searchByTitle = async (req, res) => {
    try {
        const { title } = req.query;
        const { page = 1, limit = 10 } = req.query; // Default: Page 1, 10 posts per page

        if (!title) {
            return res.status(400).json({ success: false, message: "Title is required for search" });
        }

        // Case-insensitive title search using regex
        const posts = await Post.find({
            title: { $regex: new RegExp(title, "i") } // "i" flag makes it case-insensitive
        })
        .sort({ createdAt: -1 }) // Sort by latest posts
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .lean();

        if (posts.length === 0) {
            return res.status(404).json({ success: false, message: "No posts found with the given title" });
        }

        res.status(200).json({ success: true, data: posts });

    } catch (error) {
        console.error("Error searching posts:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


