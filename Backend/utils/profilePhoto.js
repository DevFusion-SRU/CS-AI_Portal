import sharp from "sharp";
import StudentFiles from "../models/Students/Student.Files.js";
import StaffDetails from "../models/Staff/Staff.Details.js "; // Assuming staff has a profile photo field

export const getProfilePhoto = async (userId, userType, size = 50) => {
    try {
        let profilePhoto = null;

        if (userType === "Student") {
            const studentFile = await StudentFiles.findOne({ rollNumber: userId }).select("profilePhoto");
            if (studentFile?.profilePhoto?.data) {
                profilePhoto = studentFile.profilePhoto;
            }
        } else if (userType === "Staff") {
            const staff = await StaffDetails.findOne({ employeeId: userId }).select("photo photoType");
            if (staff?.photo) {
                profilePhoto = staff.photo;
                contentType = staff.photoType;
            }
        }

        if (!profilePhoto) {
            return null; // No profile photo exists
        }

        // Resize and convert to Base64
        const resizedBuffer = await sharp(profilePhoto.data)
            .resize(size, size, { fit: "cover", position: "center" })
            .toBuffer();

        return `data:${profilePhoto.contentType};base64,${resizedBuffer.toString("base64")}`;
    } catch (error) {
        console.error("Error fetching profile photo:", error.message);
        return null; // Return null in case of error
    }
};
