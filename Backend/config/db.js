import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Connection for the Authentication Database
export const authenticateConn = mongoose.createConnection(process.env.AUTHENTICATION_MONGO_URI);
authenticateConn.on('connected', () => console.log(`Authentication database Connected: ${authenticateConn.host}`));
authenticateConn.on('error', (error) => console.error(`Authentication DB Connection Error: ${error.message}`));

// Connection for the Demographics Database
export const demographicConn = mongoose.createConnection(process.env.DEMOGRAPHIC_MONGO_URI);
demographicConn.on('connected', () => console.log(`Demographics database Connected: ${demographicConn.host}`));
demographicConn.on('error', (error) => console.error(`Demographics DB Connection Error: ${error.message}`));

// Connection for the Job Database
export const jobConn = mongoose.createConnection(process.env.JOB_MONGO_URI);
jobConn.on('connected', () => console.log(`Job database Connected: ${jobConn.host}`));
jobConn.on('error', (error) => console.error(`Job DB Connection Error: ${error.message}`));

// Connection for the Forum Database
export const forumDB = mongoose.createConnection(process.env.FORUM_MONGO_URI);
forumDB.on('connected', () => console.log(`forum DB database Connected: ${forumDB.host}`));
forumDB.on('error', (error) => console.error(`forum DB Connection Error: ${error.message}`));

