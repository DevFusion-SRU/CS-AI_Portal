import mongoose from "mongoose";
import bcrypt from "bcrypt"; // Import bcrypt for password hashing

import Admin from "../models/admin.js"; // Admin model using adminConn
import Authenticate from "../models/authentication.js"; // Authenticate model using authenticateConn

export const addAdmin = async (req, res) => {
    const admin = req.body;
    if (!admin.employeeId || !admin.firstName || !admin.email || !admin.department) {
        return res.status(400).json({ success: false, message: "Provide all required fields!" });
    }

    const newAdmin = new Admin(admin);

    try {
        // Save admin in the Admin collection
        await newAdmin.save();

        // Add admin entry to Authentication collection
        const hashedPassword = await bcrypt.hash("Admin@2025", 10); // Hash the default password
        const newAuthentication = new Authenticate({
            username: admin.employeeId,
            password: hashedPassword,
            role: "admin",
        });
        await newAuthentication.save();

        res.status(201).json({ success: true, data: newAdmin });
    } catch (error) {
        console.error("Error in adding Admin details: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getAdminDetails = async (req, res) => {
    const { employeeId } = req.params;
    try {
        const adminDetails = await Admin.findOne({ employeeId });
        if (!adminDetails) {
            return res.status(404).json({ success: false, message: "No details found for this admin!" });
        }

        const response = {
            employeeId: adminDetails.employeeId,
            firstName: adminDetails.firstName,
            lastName: adminDetails.lastName,
            department: adminDetails.department,
            email: adminDetails.email,
            mobile: adminDetails.mobile,
        };

        if (adminDetails.photo && adminDetails.photoType) {
            response.photo = `data:${adminDetails.photoType};base64,${adminDetails.photo.toString("base64")}`;
        }

        res.status(200).json({ success: true, data: response });
    } catch (error) {
        console.error("Error fetching admin details: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};