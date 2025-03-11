import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let jobDB, studentDB, staffDB, forumDB;

// Connect to the database
const connectDB = async () => {
  try {
    // Attempt to connect to the MongoDB database
    const dbConnection = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${dbConnection.connection.host}`);

    // Setup the additional databases and assign to the outer variables
    jobDB = dbConnection.connection.useDb("jobs");
    studentDB = dbConnection.connection.useDb("students");
    staffDB = dbConnection.connection.useDb("staff");
    forumDB = dbConnection.connection.useDb("forums");

  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
  }
};

await connectDB();
export default connectDB;
export { jobDB, studentDB, staffDB, forumDB };
