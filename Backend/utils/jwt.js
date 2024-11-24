import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

// Generate a JWT
export const generateToken = (user) => {
    const payload = {
        username: user.username,
        role: user.role,
    };
    return jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" }); // Token expires in 24 hours
};

// Verify a JWT
export const verifyToken = (token) => {
    return jwt.verify(token, SECRET_KEY);
};
