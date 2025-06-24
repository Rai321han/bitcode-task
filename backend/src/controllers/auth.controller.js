import { connectDB } from "../db/db.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

// user registration
export const sendVerificationEmail = async function (email, token) {
  try {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      },
    });

    await transporter.sendMail({
      from: `"Task Manager" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email Address",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #333;">Welcome to YourApp Name!</h2>
      <p style="font-size: 16px; color: #555;">
        Thanks for signing up. To complete your registration, please verify your email address by clicking the button below:
      </p>
      <p style="text-align: center; margin: 30px 0;">
        <a 
          href="${verifyUrl}" 
          style="background-color: #2563eb; color: white; text-decoration: lax; padding: 12px 24px; border-radius: 5px; font-weight: bold; display: inline-block;"
          target="_blank"
          rel="noopener noreferrer"
        >
          Verify Email
        </a>
      </p>
      <p style="font-size: 14px; color: #777;">
        If you did not create an account, you can safely ignore this email.
      </p>
      <hr style="border: lax; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="font-size: 12px; color: #aaa;">
        Task Manager Team<br>
        &copy; ${new Date().getFullYear()} Task Manager. All rights reserved.
      </p>
    </div>
  `,
    });
  } catch (error) {
    console.log("Error sending email ", error);
    throw error;
  }
};

export const register = async function (req, res) {
  try {
    const { username, email, password } = req.body;

    await connectDB();
    let exists = await User.findOne({ email });

    if (exists)
      return res.status(409).json({
        message: "User already exists",
      });

    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //   const verificationToken = crypto.randomBytes(32).toString("hex");

    //   const user = await User.create({
    //     username,
    //     email,
    //     password: hashedPassword,
    //     isVerified: false,
    //     verificationToken,
    //     verificationTokenExpires: Date.now() + 1000 * 60 * 60, // 1 hour
    //   });

    //   console.log("HERE");

    //   await sendVerificationEmail(email, verificationToken);

    //   console.log("AFTER SEND");

    //   res.status(201).json({
    //     message: "Verification email sent.",
    //     redirectTo: "/verify-reminder?email=" + encodeURIComponent(email),
    //   });
    // } catch (err) {
    //   console.error("Register error:", err);
    //   res.status(500).json({ message: "Server error" });
    // }

    // if (!user)
    //   return res.status(400).json({ message: "Token invalid or expired" });

    // create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: true,
      verificationToken: undefined,
      verificationTokenExpires: undefined,
    });

    // generate tokens
    const accessToken = jwt.sign(
      { id: user._id, username: user.username },
      ACCESS_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: user._id, username: user.username },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // required for localhost
      sameSite: "lax", // required for localhost to allow cross-origin
      path: "/", // allow on all routes
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // required for localhost
      sameSite: "lax", // required for localhost to allow cross-origin
      path: "/", // allow on all routes
      maxAge: 15 * 60 * 1000, // 15 mins
    });
    res.status(200).json({
      code: "SUCCESS",
      message: "registration success",
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// login function
export const login = async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    await connectDB();
    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return res.status(401).json({
        message: "Invalid credentials",
      });
    // verify password
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched)
      return res.status(401).json({ message: "Invalid credentials" });

    // generating tokens
    const refreshToken = jwt.sign(
      { id: user._id, username: user.username },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    const accessToken = jwt.sign(
      { id: user._id, username: user.username },
      ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    user.refreshToken = refreshToken;

    await user.save();

    //set cookie

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // required for localhost
      sameSite: "lax", // required for localhost to allow cross-origin
      path: "/", // allow on all routes
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // required for localhost
      sameSite: "lax", // required for localhost to allow cross-origin
      path: "/", // allow on all routes
      maxAge: 15 * 60 * 1000, // 15 mins
    });

    res.status(200).json({
      message: "login success",
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    console.error("Login error", error);
    res.status(500).json({ message: "Server error" });
  }
};

// for getting new accesstoken
export const refresh = async function (req, res) {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res
        .status(401)
        .json({ code: "NO TOKEN", message: "No refresh token provided" });
    }

    // refresh token verification
    const decoded = jwt.verify(token, REFRESH_SECRET);

    await connectDB();
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({
        message: "Invalid refresh token",
      });
    }

    // refresh token rotation
    const newRefreshToken = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const accessToken = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      ACCESS_SECRET,
      {
        expiresIn: "15m",
      }
    );

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false, // required for localhost
      sameSite: "lax", // required for localhost to allow cross-origin
      path: "/", // allow on all routes
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // required for localhost
      sameSite: "lax", // required for localhost to allow cross-origin
      path: "/", // allow on all routes
      maxAge: 15 * 60 * 1000, // 15 mins
    });

    res.status(200).json({
      message: "new access token",
    });
  } catch (error) {
    console.error("Refresh error:", error);
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

// for login out user
export const logout = async function (req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
      return res.status(204).json({
        message: "Already logged out",
      });

    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

    await connectDB();

    const user = await User.findById(decoded.id);

    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({
      message: "Logged out successfully!",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUser = async function (req, res) {
  try {
    const token = req.cookies.accessToken;

    if (!token)
      return res
        .status(401)
        .json({ code: "NO_TOKEN", message: "Token malformed" });

    const decoded = jwt.verify(token, ACCESS_SECRET);

    if (!decoded) return res.status(401).json({ message: "Invalid token" });

    await connectDB();

    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user: { id: user._id, username: user.username } });
  } catch (error) {
    console.error("GetMe error:", error);
    if (error.name === "TokenExpiredError")
      return res.status(401).json({ message: "Token expired" });
    res.status(401).json({ message: "User unauthorized" });
  }
};
// email verification
export const verify = async function (req, res) {
  try {
    const { token } = req.query;
    await connectDB();
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Token invalid or expired" });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    // generating tokens
    const accessToken = jwt.sign(
      { id: user._id, username: user.username },
      ACCESS_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: user._id, username: user.username },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // saving user
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // required for localhost
      sameSite: "lax", // required for localhost to allow cross-origin
      path: "/", // allow on all routes
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // required for localhost
      sameSite: "lax", // required for localhost to allow cross-origin
      path: "/", // allow on all routes
      maxAge: 15 * 60 * 1000, // 15 mins
    });
    res.status(200).json({
      code: "EMAIL_VERIFIED",
      message: "registration success",
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
