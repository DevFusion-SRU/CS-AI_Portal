import mongoose from 'mongoose';

// Connection for the Job Database
export const jobConn = mongoose.createConnection(process.env.JOB_MONGO_URI);
jobConn.on('connected', () => console.log(`Job database Connected: ${jobConn.host}`));
jobConn.on('error', (error) => console.error(`Job DB Connection Error: ${error.message}`));

// Connection for the Student Database
export const studentConn = mongoose.createConnection(process.env.STUDENT_MONGO_URI);
studentConn.on('connected', () => console.log(`Student database Connected: ${studentConn.host}`));
studentConn.on('error', (error) => console.error(`Student DB Connection Error: ${error.message}`));
