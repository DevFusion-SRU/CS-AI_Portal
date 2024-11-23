import bcrypt from "bcrypt";
import Authenticate from "../models/authentication.js";
import { generateToken, verifyToken } from "../utils/jwt.js";

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
            httpOnly: false, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "strict", // Prevent CSRF
            maxAge: 60 * 60 * 24000, // 24 hour
        });

        res.status(200).json({ success: true, message: "Login successful!" });
    } catch (error) {
        console.error("Error during login: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully!" });
};

export const verifyTokenController = (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = verifyToken(token); // Using the utility function
        console.log("Token verification successful:", decoded);
        return res.status(200).json({ success: true, user: decoded });
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};
