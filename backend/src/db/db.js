import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let uri = process.env.MONGODB_URI;

if (!uri) throw new Error("MongoDB URI is missing!");

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    console.log("MongoDB already connected");
    return;
  }
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connection established");
  } catch (error) {
    console.log("Error while connecting to MongoDB", error);
  }
}
