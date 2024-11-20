import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Connection for the Authentication Database
export const authenticateConn = mongoose.createConnection(process.env.AUTHENTICATION_MONGO_URI);
authenticateConn.on('connected', () => console.log(`Authentication database Connected: ${demographicConn.host}`));
authenticateConn.on('error', (error) => console.error(`Authentication DB Connection Error: ${error.message}`));

// Connection for the Job Database
export const jobConn = mongoose.createConnection(process.env.JOB_MONGO_URI);
jobConn.on('connected', () => console.log(`Job database Connected: ${jobConn.host}`));
jobConn.on('error', (error) => console.error(`Job DB Connection Error: ${error.message}`));

// Connection for the Student Database
export const demographicConn = mongoose.createConnection(process.env.STUDENT_MONGO_URI);
demographicConn.on('connected', () => console.log(`Student database Connected: ${demographicConn.host}`));
demographicConn.on('error', (error) => console.error(`Student DB Connection Error: ${error.message}`));
