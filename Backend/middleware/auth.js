import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

// Middleware to check if the user is authenticated
export const authenticateToken = (req, res, next) => {
    let token;

    // Check for token in Authorization header (Bearer token)
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    } 
    // Check for token in cookies
    else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    // If no token found, return an error
    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, SECRET_KEY);

        // Attach the user info from the token to the request object
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return res.status(403).json({ success: false, message: "Invalid or expired token." });
    }
};

// Middleware to check if the user has the correct role (admin or student)
export const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role; // Get the user role from the decoded token

        // Check if the user role is in the list of allowed roles
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ success: false, message: "Access denied. Insufficient permissions." });
        }

        // Proceed if the user has the correct role
        next();
    };
};
