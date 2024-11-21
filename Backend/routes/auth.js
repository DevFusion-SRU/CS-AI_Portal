import express from "express";
import { login, logout } from "../controllers/authentication.js";
import { authenticateToken } from "../middleware/auth.js"; // optional for logout to check if the user is logged in

const router = express.Router();

router.post("/login", login);
router.post("/logout", authenticateToken, logout); // Use `authenticateToken` for logout (optional)

export default router;
