
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DbConnect = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL;

    if (!mongoUrl) {
      throw new Error("MONGODB_URL is missing from environment variables");
    }

    await mongoose.connect(mongoUrl);

    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default DbConnect;
