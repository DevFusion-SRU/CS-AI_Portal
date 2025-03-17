import Post from "../../models/Forums/Post.js";
import Comment from "../../models/Forums/Comment.js";
import Reply from "../../models/Forums/Reply.js";
import Report from "../../models/Forums/Report.js";
import { getProfilePhoto } from "../../utils/profilePhoto.js";
import StudentDetails from "../../models/Students/Student.Details.js";
import StaffDetails from "../../models/Staff/Staff.Details.js";
/**
 * @desc Create a new post
 * @route POST /api/forums/posts
 * @access Students & Staff (Authenticated)
 */
export const createPost = async (req, res) => {
    try {
        const { username, role } = req.user; // Extracted from middleware
        const { title, description } = req.body;

        if (!title) return res.status(400).json({ success: false, message: "Title is required" });

        // Handles image upload if provided
        let photo = null;
        if (req.file) {
            photo = req.file.buffer.toString("base64"); // Convert Buffer to base64 string
        }

        const newPost = new Post({
            title,
            description,
            photo,
            postedBy: username,
            userType: role === "student" ? "Student" : role === "staff" ? "Staff" : undefined,
        });

        await newPost.save();
        res.status(201).json({ success: true, data: newPost });
    } catch (error) {
        console.error("Error creating post:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * @desc Fetch all posts (pagination, filtering, sorting)
 * @route GET /api/forums/posts
 * @access Private
 */
export const getAllPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = "latest" } = req.query;
        const sortOptions = {
            latest: { createdAt: -1 },
            mostLiked: { likes: -1 },
            mostCommented: { comments: -1 },
        };

        const posts = await Post.find({ jobId: { $exists: false } })
            // .populate('postedBy')
            .select("-comments -__v -likedUserType -_id") // Exclude `comments` directly
            .sort(sortOptions[sort] || sortOptions.latest)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .lean();

       // Fetch user details based on userType
       for (const post of posts) {
        post.likesCount = post.likes.length;

        if (post.userType === "Student") {
            const student = await StudentDetails.findOne({ rollNumber: post.postedBy }).select("firstName lastName ");
            if (student) {
                post.firstName = student.firstName;
                post.lastName = student.lastName;
                post.profilePhoto = await getProfilePhoto(post.postedBy, post.userType, 50);
            }
        } else if (post.userType === "Staff") {
            const staff = await StaffDetails.findOne({ employeeId: post.postedBy }).select("firstName lastName");
            if (staff) {
                post.firstName = staff.firstName;
                post.lastName = staff.lastName;
                post.profilePhoto = await getProfilePhoto(post.postedBy, post.userType, 50);
            }
        }


    }
        // const totalPages = Math.ceil(posts / limit);


        // Calculate total pages
        const totalPosts = await Post.countDocuments({ jobId: { $exists: false } });
        const totalPages = Math.ceil(totalPosts / limit);

        res.status(200).json({ success: true, data: posts, pagination: { totalPages, currentPage: page } });
    } catch (error) {
        console.error("Error fetching posts:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * @desc Fetch a single post with comments & replies
 * @route GET /api/forums/posts/:id
 * @access Private
 */
export const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const { page = 1, limit = 5, sort = "latest" } = req.query; // Default: Page 1, 5 comments per page
        const sortOptions = {
            latest: { createdAt: -1 },
            mostLiked: { likes: -1 },
            mostReplied: { replies: -1 },
        };

        // Fetch post details
        const post = await Post.findOne({ postId }).lean();
        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

        // Fetch user details for post author
        if (post.userType === "Student") {
            const student = await StudentDetails.findOne({ rollNumber: post.postedBy }).select("firstName lastName");
            if (student) {
                post.firstName = student.firstName;
                post.lastName = student.lastName;
                post.profilePhoto = await getProfilePhoto(post.postedBy, post.userType, 50);
            }
        } else if (post.userType === "Staff") {
            const staff = await StaffDetails.findOne({ employeeId: post.postedBy }).select("firstName lastName");
            if (staff) {
                post.firstName = staff.firstName;
                post.lastName = staff.lastName;
                post.profilePhoto = await getProfilePhoto(post.postedBy, post.userType, 50);
            }
        }

        // Fetch paginated comments
        const comments = await Comment.find({ postId })
            .sort(sortOptions[sort] || sortOptions.latest) // Sort comments
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .lean();

        // Fetch user details for each commenter
        for (const comment of comments) {
            if (comment.userType === "Student") {
                const student = await StudentDetails.findOne({ rollNumber: comment.commentedBy }).select("firstName lastName");
                if (student) {
                    comment.firstName = student.firstName;
                    comment.lastName = student.lastName;
                    comment.profilePhoto = await getProfilePhoto(comment.commentedBy, comment.userType, 50);
                }
            } else if (comment.userType === "Staff") {
                const staff = await StaffDetails.findOne({ employeeId: comment.commentedBy }).select("firstName lastName");
                if (staff) {
                    comment.firstName = staff.firstName;
                    comment.lastName = staff.lastName;
                    comment.profilePhoto = await getProfilePhoto(comment.commentedBy, comment.userType, 50);
                }
            }
        }

        // Calculate total pages for comments
        const totalComments = await Comment.countDocuments({ postId });
        const totalPages = Math.ceil(totalComments / limit);

        res.status(200).json({
            success: true,
            data: { post, comments },
            pagination: { totalPages, currentPage: page },
        });

    } catch (error) {
        console.error("Error fetching post:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};



/**
 * @desc Edit a post
 * @route PUT /api/forums/posts/:id
 * @access Only Author
 */
export const editPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { username } = req.user;
        const { title, description } = req.body;

        const post = await Post.findOne({ postId });
        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

        if (post.postedBy !== username) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        // Handle image update (if new image is provided)
        let photo = post.photo; // Keep existing image if no new image is uploaded
        if (req.file) {
            photo = req.file.buffer.toString("base64"); // Convert Buffer to base64 string
        }

        // Update only provided fields
        post.title = title || post.title;
        post.description = description || post.description;
        post.photo = photo;

        await post.save();

        res.status(200).json({ success: true, data: post });
    } catch (error) {
        console.error("Error editing post:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * @desc Delete a post
 * @route DELETE /api/forums/posts/:id
 * @access Only Author or Moderator (Staff)
 */
export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { username, role } = req.user;

        const post = await Post.findOne({ postId });
        if (!post) return { success: false, status: 404, message: "Post not found" };

        if (post.postedBy !== username && role !== "staff") {
            return { success: false, status: 403, message: "Not authorized" };
        }

        // Find and delete all comments associated with the post
        const comments = await Comment.find({ postId });

        if (comments.length > 0) {
            const commentIds = comments.map(comment => comment.commentId);

            // Delete all replies associated with these comments
            await Reply.deleteMany({ commentId: { $in: commentIds } });

            // Delete all comments of this post
            await Comment.deleteMany({ postId });
        }

        // Delete the post
        await Post.deleteOne({ postId });

        return { success: true, status: 200, message: "Post and all associated comments & replies deleted" };
    } catch (error) {
        console.error("Error deleting post:", error.message);
        return { success: false, status: 500, message: "Server error" };
    }
};

/**
 * @desc Like/Unlike a post
 * @route POST /api/forums/posts/:id/like
 * @access Students & Staff
 */
export const toggleLikePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { username, role } = req.user;

        const post = await Post.findOne({ postId });
        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

        const index = post.likes.indexOf(username);
        if (index === -1) {
            post.likes.push(username);
            post.likedUserType.push(role === "student" ? "Student" : role === "staff" ? "Staff" : undefined);
        } else {
            post.likes.splice(index, 1);
            post.likedUserType.splice(index, 1);
        }

        await post.save();
        res.status(200).json({ success: true, message: index === -1 ? "Liked post" : "Unliked post" });
    } catch (error) {
        console.error("Error liking post:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const summarizePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { page = 1, limit = 5 } = req.query;

        // Fetch post details
        const post = await Post.findOne({ postId })
            .select("title description -_id") // Exclude _id
            .lean();

        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

        // Fetch paginated comments (include commentId for internal use but remove later)
        const comments = await Comment.find({ postId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .select("text commentId -_id") // Fetch commentId temporarily
            .lean();

        // Fetch replies for each comment
        const commentsWithReplies = await Promise.all(
            comments.map(async (comment) => {
                const replies = await Reply.find({ commentId: comment.commentId }) // Correct lookup
                    .sort({ createdAt: -1 })
                    .limit(3)
                    .select("text -_id") // Exclude _id
                    .lean();

                // Remove `commentId` before returning
                const { commentId, ...filteredComment } = comment;
                return { ...filteredComment, replies };
            })
        );

        res.status(200).json({
            success: true,
            data: { post, comments: commentsWithReplies }
        });

    } catch (error) {
        console.error("Error fetching post:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


