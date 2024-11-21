import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

// Middleware to check if the user is authenticated
export const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; // Read token from cookies
    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Attach user info to the request object
        next();
    } catch (error) {
        res.status(403).json({ success: false, message: "Invalid or expired token." });
    }
};

// Middleware to check user role
export const authorizeRole = (requiredRole) => (req, res, next) => {
    if (req.user.role !== requiredRole) {
        return res.status(403).json({ success: false, message: "Access denied. Insufficient permissions." });
    }
    next();
};
