import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      min: [3, "Username cannot be empty!"],
      max: [40, "Too many characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      min: [6, "Password must be at least 6 characters long"],
      select: false, // exclude from query results by default
    },
    email: {
      required: [true, "Email is required!"],
      type: String,
      unique: true,
      min: [1, "Email is required!"],
    },
    refreshToken: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
