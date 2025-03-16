import express from "express";
import multer from "multer";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import { addStaff, getStaffDetails, uploadStaffPhoto } from "../controllers/staff.js";

const router = express.Router();


// Multer configuration
const storage = multer.memoryStorage(); // Store file in memory as a Buffer
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/", authenticateToken, addStaff);
router.get("/:employeeId", authenticateToken, authorizeRole("staff"), getStaffDetails);
router.patch("/:employeeId/photo", authenticateToken, authorizeRole("staff"), upload.single("photo"), uploadStaffPhoto);

export default router;
