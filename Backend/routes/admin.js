import express from "express";
import multer from "multer";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import { addAdmin, getAdminDetails } from "../controllers/admin.js";

const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage(); // Store file in memory as a Buffer
const upload = multer({ storage });

router.post("/", addAdmin);
router.get("/:employeeId", getAdminDetails);

export default router;