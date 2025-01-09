import express from "express";
import {
    login,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    verifyTokenController
} from "../controllers/auth.js";
import { authenticateToken, authorizeRole } from "../middleware/auth.js"; // optional for logout to check if the user is logged in

const router = express.Router();

router.post("/login", login);
router.post("/logout", authenticateToken, logout); // Use `authenticateToken` for logout (optional)

router.post("/forgot-password", forgotPassword); // Forgot password route (sends OTP to email)
router.post("/reset-password", resetPassword); // Reset password route (validates OTP and resets password)
router.put("/change-password", authenticateToken, authorizeRole(["admin", "student"]), changePassword); // Change password route (validates current, new passwords and changes)

router.get('/verify', verifyTokenController); // Route for token verification

export default router;
