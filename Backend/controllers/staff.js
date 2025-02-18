import mongoose from "mongoose";
import bcrypt from "bcrypt"; // Import bcrypt for password hashing
import dotenv from "dotenv";
dotenv.config();

import StaffDetails from "../models/Staff/Staff.Details.js"; // StaffDetails model using staffDB
import StaffCredentials from "../models/Staff/Staff.Credentials.js"; // StaffCredentials model using staffDB

export const addStaff = async (req, res) => {
    const staff = req.body;
    if (!staff.employeeId || !staff.firstName || !staff.email || !staff.department) {
        return res.status(400).json({ success: false, message: "Provide all required fields!" });
    }

    const newStaff = new StaffDetails(staff);

    try {
        // Save admin in the Admin collection
        await newStaff.save();

        // Add admin entry to Authentication collection
        const hashedPassword = await bcrypt.hash(process.env.STAFF_PASSWORD, 10); // Hash the default password
        const newAuthentication = new StaffCredentials({
            username: staff.employeeId,
            password: hashedPassword,
            role: "staff",
        });
        await newAuthentication.save();

        res.status(201).json({ success: true, data: newStaff });
    } catch (error) {
        console.error("Error in adding Staff details: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getStaffDetails = async (req, res) => {
    const { employeeId } = req.params;
    try {
        const staffDetails = await StaffDetails.findOne({ employeeId });
        if (!staffDetails) {
            return res.status(404).json({ success: false, message: "No details found for this admin!" });
        }

        const response = {
            employeeId: staffDetails.employeeId,
            firstName: staffDetails.firstName,
            lastName: staffDetails.lastName,
            department: staffDetails.department,
            email: staffDetails.email,
            mobile: staffDetails.mobile,
        };

        if (staffDetails.photo && staffDetails.photoType) {
            response.photo = `data:${staffDetails.photoType};base64,${staffDetails.photo.toString("base64")}`;
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
        const staff = await StaffDetails.findOne({ employeeId });
        if (!staff) {
            return res.status(404).json({ success: false, message: "Admin not found!" });
        }

        staff.photo = buffer;
        staff.photoType = mimetype;

        await staff.save();
        res.status(200).json({ success: true, message: "Photo uploaded successfully!" });
    } catch (error) {
        console.error("Error uploading photo: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
