import mongoose from "mongoose";
import dotenv from "dotenv";
import { AppError } from "../utils/AppError.js";
dotenv.config();

let uri = process.env.MONGODB_URI;

if (!uri) throw new AppError("MongoDB URI is missing!", 500);

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    await mongoose.connect(uri);
  } catch (error) {
    console.log("Error while connecting to MongoDB", error);
  }
}
