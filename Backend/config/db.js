import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Establish a single MongoDB connection
const mainConnection = mongoose.createConnection(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
});

// Log connection status
mainConnection.on("connected", () => {
  console.log(`MongoDB Connected: ${mainConnection.host}`);
});

mainConnection.on("error", (error) => {
  console.error(`MongoDB Connection Error: ${error.message}`);
});

// Use different databases
// export const authenticateDB = mainConnection.useDb("authentication");
export const jobDB = mainConnection.useDb("jobs");
export const studentsDB = mainConnection.useDb("Students");
export const staffDB= mainConnection.useDb("Staff");

// Export the function to call it in server.js
export default mainConnection;
