import express from "express";
import multer from "multer";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import { addAdmin, getAdminDetails, uploadAdminPhoto } from "../controllers/admin.js";

const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage(); // Store file in memory as a Buffer
const upload = multer({ storage });

router.post("/", authenticateToken, authorizeRole("DBadmin"), upload.single("photo"), addAdmin);
router.get("/:employeeId", authenticateToken, authorizeRole("admin"), upload.single("photo"), getAdminDetails);
router.patch("/:employeeId/photo", authenticateToken, authorizeRole("admin"), upload.single("photo"), uploadAdminPhoto);

export default router;