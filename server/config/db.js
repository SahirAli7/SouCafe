import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/sou_cafe");
    console.log("Database connected!");
  } catch (error) {
    console.error("Error connecting to database:", error.message);
  }
};

export default connectDB;
