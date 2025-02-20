import express from "express";
import multer from "multer";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";

import { createPost, getAllPosts, getPostById, editPost, deletePost, toggleLikePost, reportPost } from "../controllers/Forums/posts.js";
import { addComment, getComments, editComment, deleteComment, likeUnlikeComment, reportComment } from "../controllers/Forums/comments.js";

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
// -- Protected routes (Only Students & Staff can create/like posts)
router.post("/posts", authenticateToken, authorizeRole(["student", "staff"]), postUpload.single("photo"), createPost);
router.post("/posts/:postId/like", authenticateToken, authorizeRole(["student", "staff"]), toggleLikePost);
// -- Author-protected routes (Only author can edit/delete, staff can delete)
router.put("/posts/:postId", authenticateToken, postUpload.single("photo"), editPost);
router.delete("/posts/:postId", authenticateToken, deletePost);
router.post("/posts/:postId/report", authenticateToken, reportPost);

// Comments
router.post("/comments/:postId", authenticateToken, commentUpload, addComment);
router.get("/comments/:postId", authenticateToken, getComments);
router.patch("/comments/:commentId", authenticateToken, authorizeRole(["student", "staff"]), commentUpload, editComment);
router.delete("/comments/:commentId", authenticateToken, authorizeRole(["student", "staff"]), deleteComment);
router.post("/comments/:commentId/like", authenticateToken, authorizeRole(["student", "staff"]), likeUnlikeComment);
router.post("/comments/:commentId/report", authenticateToken, authorizeRole(["student", "staff"]), reportComment);

export default router;
