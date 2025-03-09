import express from "express";
import multer from "multer";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";

import { createPost, getAllPosts, getPostById, editPost, deletePost, toggleLikePost,summarizePost } from "../controllers/Forums/posts.js";
import { addComment, getComments, editComment, deleteComment, likeUnlikeComment } from "../controllers/Forums/comments.js";
import { addReply, getReplies, editReply, deleteReply, likeUnlikeReply } from "../controllers/Forums/replies.js";
import { reportPost, reportComment, reportReply, fetchReportedItems, deleteReportedItem } from "../controllers/Forums/report.js";
import { createJobForum, createJobPost, addMember, getJobPosts, deleteJobForum } from "../controllers/Forums/jobForum.js";

const router = express.Router();

// Multer configuration for handling image uploads
const storage = multer.memoryStorage(); // Stores image in memory as Buffer
const postUpload = multer({ storage });
const commentUpload = multer().none();
const replyUpload = multer().none();

// Posts
// -- Protected routes (Accessible by all authenticated users)
router.get("/posts", authenticateToken, getAllPosts);
router.get("/posts/:postId", authenticateToken, getPostById);
router.get("/posts/:postId/summarize",authenticateToken, summarizePost);

// -- Protected routes (Only Students & Staff can create/like posts)
router.post("/posts", authenticateToken, authorizeRole(["student", "staff"]), postUpload.single("photo"), createPost);
router.post("/posts/:postId/like", authenticateToken, authorizeRole(["student", "staff"]), toggleLikePost);
// -- Author-protected routes (Only author can edit/delete, staff can delete)
router.put("/posts/:postId", authenticateToken, postUpload.single("photo"), editPost);
router.delete("/posts/:postId", authenticateToken, deletePost);

// Comments
router.post("/comments/:postId", authenticateToken, commentUpload, addComment);
router.get("/comments/:postId", authenticateToken, getComments);
router.put("/comments/:commentId", authenticateToken, authorizeRole(["student", "staff"]), commentUpload, editComment);
router.delete("/comments/:commentId", authenticateToken, authorizeRole(["student", "staff"]), deleteComment);
router.post("/comments/:commentId/like", authenticateToken, authorizeRole(["student", "staff"]), likeUnlikeComment);

// Replies
router.post("/replies/:commentId", authenticateToken, replyUpload, addReply);
router.get("/replies/:commentId", authenticateToken, getReplies);
router.put("/replies/:replyId", authenticateToken, authorizeRole(["student", "staff"]), replyUpload, editReply);
router.delete("/replies/:replyId", authenticateToken, authorizeRole(["student", "staff"]), deleteReply);
router.post("/replies/:replyId/like", authenticateToken, authorizeRole(["student", "staff"]), likeUnlikeReply);

// Report Routes
router.post("/report/post/:postId", authenticateToken, authorizeRole(["student", "staff"]), reportPost);
router.post("/report/comment/:commentId", authenticateToken, authorizeRole(["student", "staff"]), reportComment);
router.post("/report/reply/:replyId", authenticateToken, authorizeRole(["student", "staff"]), reportReply);

// Moderation Routes (Admins/Staff only)
router.get("/moderation/reports", authenticateToken, authorizeRole(["admin", "staff"]), fetchReportedItems);
router.delete("/moderation/reports/:reportId/:type/:typeId", authenticateToken, authorizeRole(["admin", "staff"]), deleteReportedItem);


//Job Specific Disscussions
// -- Protected routes (Accessible by all authenticated users)
router.post("/jobforum/create", authenticateToken, authorizeRole(["admin", "staff"]),  createJobForum);
router.post("/jobforum/posts", authenticateToken, authorizeRole(["student", "staff"]), postUpload.single("photo"), createJobPost);
router.post("/jobforum/addmember", authenticateToken, authorizeRole(["admin", "staff"]), addMember);


router.get("/jobforum/posts/:jobId", authenticateToken, getJobPosts);
router.delete("/jobforum/delete/:jobId", authenticateToken, authorizeRole(["admin", "staff"]), deleteJobForum);

export default router;

