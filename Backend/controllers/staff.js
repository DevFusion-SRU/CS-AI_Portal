import mongoose from "mongoose";
import bcrypt from "bcrypt"; // Import bcrypt for password hashing
import dotenv from "dotenv";
dotenv.config();

import StaffDetails from "../models/Staff/Staff.Details.js"; // StaffDetails model using staffDB
import StaffCredentials from "../models/Staff/Staff.Credentials.js"; // StaffCredentials model using staffDB

export const addStaff = async (req, res) => {
    const admin = req.body;
    if (!admin.employeeId || !admin.firstName || !admin.email || !admin.department) {
        return res.status(400).json({ success: false, message: "Provide all required fields!" });
    }

    const newAdmin = new StaffDetails(admin);

    try {
        // Save admin in the Admin collection
        await newAdmin.save();

        // Add admin entry to Authentication collection
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10); // Hash the default password
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

export const getStaffDetails = async (req, res) => {
    const { employeeId } = req.params;
    try {
        const adminDetails = await StaffDetails.findOne({ employeeId });
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

export const uploadStaffPhoto = async (req, res) => {
    const { employeeId } = req.params;

    if (!req.file) {
        return res.status(400).json({ success: false, message: "Photo file is required!" });
    }

    const { buffer, mimetype } = req.file;

    try {
        const admin = await StaffDetails.findOne({ employeeId });
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found!" });
        }

        admin.photo = buffer;
        admin.photoType = mimetype;

        await admin.save();
        res.status(200).json({ success: true, message: "Photo uploaded successfully!" });
    } catch (error) {
        console.error("Error uploading photo: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
