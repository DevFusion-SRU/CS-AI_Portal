import express from "express";
import multer from "multer";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import {
    createPost,
    getAllPosts,
    getPostById,
    editPost,
    deletePost,
    toggleLikePost,
    reportPost
} from "../controllers/Forums/posts.js";

const router = express.Router();

// Multer configuration for handling image uploads
const storage = multer.memoryStorage(); // Stores image in memory as Buffer
const upload = multer({ storage });

// Posts

// -- Protected routes (Accessible by all authenticated users)
router.get("/posts", authenticateToken, getAllPosts);
router.get("/posts/:id", authenticateToken, getPostById);
// -- Protected routes (Only Students & Staff can create/like posts)
router.post("/posts", authenticateToken, authorizeRole(["student", "staff"]), upload.single("photo"), createPost);
router.post("/posts/:id/like", authenticateToken, authorizeRole(["student", "staff"]), toggleLikePost);
// -- Author-protected routes (Only author can edit/delete, staff can delete)
router.put("/posts/:id", authenticateToken, upload.single("photo"), editPost);
router.delete("/posts/:id", authenticateToken, deletePost);
router.post("/posts/:id/report", authenticateToken, reportPost);

export default router;
