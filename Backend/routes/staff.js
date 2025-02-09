import express from "express";
import multer from "multer";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import { addStaff, getStaffDetails, uploadStaffPhoto } from "../controllers/staff.js";

const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage(); // Store file in memory as a Buffer
const upload = multer({ storage });

router.post("/", authenticateToken, authorizeRole("DBAdmin"), addStaff);
router.get("/:employeeId", authenticateToken, authorizeRole("admin"), getStaffDetails);
router.patch("/:employeeId/photo", authenticateToken, authorizeRole("admin"), upload.single("photo"), uploadStaffPhoto);

export default router;
