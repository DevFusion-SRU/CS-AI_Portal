import express from "express";

import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import StudentCredentials from "../models/Students/Student.Credentials.js";
import StaffCredentials from "../models/Staff/Staff.Credentials.js";
import {
    login,
    logout,
    resetPassword,
    changePassword,
    verifyTokenController
} from "../controllers/auth.js";

const router = express.Router();

router.post("/login", (req, res) => login(req, res, StudentCredentials));
router.post("/slogin", (req, res) => login(req, res, StaffCredentials));
router.post("/logout", authenticateToken, logout); // Use `authenticateToken` for logout (optional)

router.post("/reset-password", resetPassword); // Reset password route (validates OTP and resets password)
router.put("/change-password", authenticateToken, authorizeRole(["admin", "student"]), changePassword); // Change password route (validates current, new passwords and changes)

router.get('/verify', verifyTokenController); // Route for token verification

export default router;
