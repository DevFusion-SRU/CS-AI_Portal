import bcrypt from "bcrypt";
import Authenticate from "../models/authentication.js";
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

// Forgot password controller to generate and send OTP
export const forgotPassword = async (req, res) => {
    const { username } = req.body;

    try {
        const user = await Authenticate.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        // Generate OTP and set expiration time (10 minutes)
        const otp = generateOTP();
        const otpExpiration = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

        // Store OTP and expiration time in the user document (You could also store this in a separate collection)
        user.resetOtp = otp;
        user.resetOtpExpiration = otpExpiration;
        await user.save();

        // Send OTP to user's email
        const mailid = "2203a51l92@sru.edu.in";
        await sendEmail(mailid, otp);

        return res.status(200).json({ success: true, message: "OTP sent to your email!" });
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Reset password controller to verify OTP and reset password
export const resetPassword = async (req, res) => {
    const { username, otp, newPassword } = req.body;

    try {
        const user = await Authenticate.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        // Check if the OTP matches and if it has expired
        if (user.resetOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP!" });
        }

        if (user.resetOtpExpiration < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP has expired!" });
        }

        // Hash the new password before saving it
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = undefined; // Clear OTP after use
        user.resetOtpExpiration = undefined; // Clear OTP expiration time
        await user.save();

        return res.status(200).json({ success: true, message: "Password has been reset successfully!" });
    } catch (error) {
        console.error("Error in resetPassword:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Controller to change the password
export const changePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const username = req.user.username; // Assuming `user.id` is set from the JWT token
    console.log(username);

    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ success: false, message: "New passwords do not match" });
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
