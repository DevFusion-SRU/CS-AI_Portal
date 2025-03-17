// import multer from "multer";
// import pdfParse from "pdf-parse";
// // import mammoth from "mammoth";

// // Set up memory storage in Multer
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // ATS Compliance Checker Function
// const checkATSCompliance = (text) => {
//     const issues = [];

//     // Standard fonts check (Basic check, real ATS uses OCR for fonts)
//     const standardFonts = ["Arial", "Times New Roman", "Calibri"];
//     const fontRegex = new RegExp(standardFonts.join("|"), "i");
//     if (!fontRegex.test(text)) {
//         issues.push("Use standard fonts like Arial, Times New Roman, or Calibri.");
//     }

//     // Check for tables, graphics (basic check for ASCII characters)
//     if (text.includes("│") || text.includes("═") || text.includes("┌")) {
//         issues.push("Avoid tables, text boxes, or images.");
//     }

//     // Section Headers Check
//     const requiredSections = ["experience", "education", "skills", "projects"];
//     const foundSections = requiredSections.filter((section) => text.toLowerCase().includes(section));
//     if (foundSections.length < 2) {
//         issues.push("Ensure resume includes Experience, Education, and Skills sections.");
//     }

//     // Bullet Points Check
//     if (!text.includes("•") && !text.includes("- ")) {
//         issues.push("Use bullet points instead of paragraphs for work experience.");
//     }

//     return issues.length > 0 ? { success: false, issues } : { success: true, message: "ATS-friendly resume!" };
// };

// // Middleware for ATS Resume Checking
// export const atsResumeChecker = async (req, res, next) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ success: false, message: "No file uploaded" });
//         }

//         let extractedText = "";

//         // Handle PDF Files
//         if (req.file.mimetype === "application/pdf") {
//             const pdfData = await pdfParse(req.file.buffer);
//             extractedText = pdfData.text;
//         }
//         // Handle DOCX Files
//         // else if (req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
//         //     const docxData = await mammoth.extractRawText({ buffer: req.file.buffer });
//         //     extractedText = docxData.value;
//         // } 
//         else {
//             return res.status(400).json({ success: false, message: "Invalid file format. Upload PDF or DOCX only." });
//         }

//         // Check ATS Compliance
//         const atsResult = checkATSCompliance(extractedText);

//         if (!atsResult.success) {
//             return res.status(400).json({ success: false, atsResult });
//         }

//         // Store extracted text in req for further processing
//         req.extractedResumeText = extractedText;

//         next();
//     } catch (error) {
//         console.error("Error processing resume:", error);
//         res.status(500).json({ success: false, message: "Server error while processing resume" });
//     }
// };

// // Export Multer Upload Config
// export const uploadResume = upload.single("resume");
