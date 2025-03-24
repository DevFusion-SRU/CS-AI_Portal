import express from "express";
import multer from "multer";
import { uploadImage, uploadResume, uploadCertificate } from "../middleware/multer.js";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import {
  addStudent,
  addStudentBatch,
  deleteStudent,
  getStudentDetails,
  getStudents,
  uploadStudentPhoto,
  uploadStudentResume,
  deleteStudentResume,
  deleteStudentSectionItem,
  uploadCertificateFile,
  editStudent,
} from "../controllers/student.js";

const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Admin-only routes (staff role)
router.get("/", authenticateToken, authorizeRole("staff"), getStudents);
router.post("/", authenticateToken, authorizeRole("staff"), addStudent);
router.post("/batch", authenticateToken, authorizeRole("staff"), addStudentBatch);
router.delete("/:rollNumber", authenticateToken, authorizeRole("staff"), deleteStudent);


// Accessible by both staff and students

router.get("/:rollNumber", authenticateToken, authorizeRole(["staff", "student"]), getStudentDetails);

// Student-only routes
router.patch(
  "/:rollNumber/photo",
  authenticateToken,
  authorizeRole("student"),
  uploadImage.single("photo"),
  uploadStudentPhoto
);
router.post(
  "/:rollNumber/resume",
  authenticateToken,
  authorizeRole("student"),
  uploadResume.single("file"), // Handle file upload
  async (req, res) => {
    try {
      const { rollNumber } = req.params;
      const { title, url } = req.body;

      let resumeUrl = url;
      if (req.file) {
        // If a file is uploaded, use the Cloudinary URL
        resumeUrl = req.file.path;
      }

      // Save the attachment to the database
      const student = await Student.findOne({ rollNumber });
      if (!student) {
        return res.status(404).json({ success: false, message: "Student not found" });
      }

      student.resumes.push({
        title,
        resumeUrl,
        size: req.file ? `${(req.file.size / 1024).toFixed(2)} KB` : "N/A",
        uploadedAt: new Date(),
      });
      await student.save();

      res.status(200).json({
        success: true,
        message: "Attachment saved successfully",
        data: student.resumes,
      });
    } catch (error) {
      console.error("Error saving attachment:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
);
router.delete(
  "/resume/:rollNumber/:resumeId",
  authenticateToken,
  authorizeRole("student"),
  deleteStudentResume
);

router.patch(
  "/profile/:rollNumber/:section/:id/certificate",
  authenticateToken,
  authorizeRole("student"),
  uploadCertificate.single("certificate"),
  uploadCertificateFile
);

router.patch(
  "/edit/:rollNumber",
  authenticateToken,
  authorizeRole("student"),
  editStudent
);

router.delete(
  "/:rollNumber/:section/:id",
  authenticateToken,
  authorizeRole("student"),
  deleteStudentSectionItem
);

export default router;