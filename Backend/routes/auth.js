import express from "express";
import { login, logout, verifyTokenController } from "../controllers/auth.js";
import { authenticateToken } from "../middleware/auth.js"; // optional for logout to check if the user is logged in

const router = express.Router();

router.post("/login", login);
router.post("/logout", authenticateToken, logout); // Use `authenticateToken` for logout (optional)
router.get('/verify', verifyTokenController); // Route for token verification

export default router;
