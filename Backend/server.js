import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

// Routes
app.get("/", (req, res) => {
    res.send("Server is ready!");
});

const PORT = 5000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server Started at Port at http://localhost:${PORT}`);
});
