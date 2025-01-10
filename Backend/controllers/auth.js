import bcrypt from "bcrypt";
import Authenticate from "../models/authentication.js";
import Student from "../models/student.js";
import Admin from "../models/admin.js";
import { generateToken, verifyToken } from "../utils/jwt.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Function to generate OTP (6 digits)
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString(); // 6 digit OTP
};

// Function to send OTP to user's email using Nodemailer
const sendEmail = async (to, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail", // or use another email service provider
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_APP_PASS, // Your email password or application-specific password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER, // Your email address
        to: to,
        subject: "Password Reset OTP - Job Portal",
        text: `Your OTP for resetting your password is: ${otp}. It is valid for 10 minutes.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("OTP sent successfully!");
    } catch (error) {
        console.error("Error sending email: ", error);
        throw new Error("Error sending email");
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await Authenticate.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials!" });
        }

        // Generate JWT
        const token = generateToken(user);

        // Set cookie with the JWT
        res.cookie("token", token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "None", // Allows cookies to be sent in cross-site requests
            partitioned: true, // Enable partitioned cookies (for better privacy on some browsers)
            maxAge: 60 * 60 * 24000, // 24 hour
        });

        res.status(200).json({ success: true, message: "Login successful!", token });
    } catch (error) {
        console.error("Error during login: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully!" });
};

// Reset password controller to verify OTP and reset password
export const resetPassword = async (req, res) => {
    const { username, otp, newPassword } = req.body;

    try {
        // Find the user by username
        const user = await Authenticate.findOne({ username });
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found in Authentication!" });
        }

        // Step 1: Forgot password request (Generate OTP and send it)
        if (!otp && !newPassword) {
            // Check role and fetch the user details
            let userDetails;
            if (user.role === 'student') {
                userDetails = await Student.findOne({ rollNumber: username });
            } else if (user.role === 'admin') {
                userDetails = await Admin.findOne({ employeeId: username });
            } else {
                return res.status(400).json({ success: false, message: "Invalid role" });
            }

            if (!userDetails) {
                return res.status(404).json({ success: false, message: "No details found!" });
            }

            // Fetch the email from the user
            const email = userDetails.email;

            // Generate OTP and set expiration time (10 minutes)
            const otpGenerated = generateOTP();
            const otpExpiration = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

            // Store OTP and expiration time in the user document
            user.resetOtp = otpGenerated;
            user.resetOtpExpiration = otpExpiration;
            await user.save();

            // Send OTP to user's email
            await sendEmail(email, otpGenerated);

            return res.status(200).json({ success: true, message: "OTP sent to your email!" });
        }

        // Step 2: Verify OTP
        if (otp && !newPassword) {
            if (user.resetOtp !== otp) {
                return res.status(400).json({ success: false, message: "Invalid OTP!" });
            }

            if (user.resetOtpExpiration < Date.now()) {
                return res.status(400).json({ success: false, message: "OTP has expired!" });
            }

            return res.status(200).json({ success: true, message: "OTP verified successfully!" });
        }

        // Step 3: Reset password
        if (newPassword) {
            // Hash the new password before saving it
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            user.resetOtp = undefined; // Clear OTP after use
            user.resetOtpExpiration = undefined; // Clear OTP expiration time
            await user.save();

            return res.status(200).json({ success: true, message: "Password has been reset successfully!" });
        }

        return res.status(400).json({ success: false, message: "Invalid request!" });

    } catch (error) {
        console.error("Error in resetPassword:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Controller to change the password
export const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const username = req.user.username; // Assuming `user.id` is set from the JWT token

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const user = await Authenticate.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Current password is incorrect" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        const token = generateToken(user);

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
            token,
        });
    } catch (error) {
        console.error("Error changing password:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const verifyTokenController = (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = verifyToken(token); // Using the utility function
        return res.status(200).json({ success: true, user: decoded });
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};
