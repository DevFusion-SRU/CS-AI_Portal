import express from "express";
import multer from 'multer';
const upload = multer()
// import { protectRoute } from "../middleware/protectRoute.js";
import {
	commentOnPost,
	createPost,
	deletePost,
	getAllPosts,
	// getFollowingPosts,
	// getLikedPosts,
	getUserPosts,
	// likeUnlikePost,
} from "../controllers/Posts.js";

const router = express.Router();

router.get("/all", getAllPosts);
// router.get("/likes/:id", getLikedPosts);
router.get("/user/:username", getUserPosts);
router.post("/create",upload.none(), createPost);
// router.post("/like/:id", likeUnlikePost);
router.post("/comment/:id",upload.none(), commentOnPost);
router.delete("/:id", deletePost);

export default router;