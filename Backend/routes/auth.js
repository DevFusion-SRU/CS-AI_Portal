import express from "express";

import { authenticateToken, authorizeRole } from "../middleware/auth.js";

import StudentCredentials from "../models/Students/Student.Credentials.js";
import StaffCredentials from "../models/Staff/Staff.Credentials.js";
import StudentDetails from "../models/Students/Student.Details.js";
import StaffDetails from "../models/Staff/Staff.Details.js";

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

router.post("/reset-password", (req, res) => resetPassword(req, res, StudentCredentials, StudentDetails)); // Reset password route (validates OTP and resets password)
router.post("/sreset-password", (req, res) => resetPassword(req, res, StaffCredentials, StaffDetails)); // Reset password route (validates OTP and resets password)

router.put("/change-password", authenticateToken, authorizeRole(["staff", "student"]), (req, res) => changePassword(req, res, StudentCredentials)); // Change password route (validates current, new passwords and changes)
router.put("/schange-password", authenticateToken, authorizeRole("staff"), (req, res) => changePassword(req, res, StaffCredentials)); // Change password route (validates current, new passwords and changes)

router.get('/verify', verifyTokenController); // Route for token verification

export default router;
