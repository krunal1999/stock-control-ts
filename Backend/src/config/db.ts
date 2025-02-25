import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    console.log(process.env.DB_NAME);
    const DB_NAME = process.env.DB_NAME || "test";
    const DB_URL = process.env.MONGO_URL || "";
    const connection = await mongoose.connect(`${DB_URL}/${DB_NAME}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
