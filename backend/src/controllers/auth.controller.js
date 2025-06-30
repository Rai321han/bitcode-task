import { connectDB } from "../db/db.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { AppError } from "../utils/AppError.js";

// ----------- TODO ------------------
// 1. unverified entry should be removed from database after token is expired (not done)

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

const isProduction = process.env.NODE_ENV === "production";

// user registration
export const sendVerificationEmail = async function (email, token, next) {
  try {
    // verify email -> route + randomly generated token as query
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
      from: `"BitCodeTask" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email Address",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #333;">Welcome to BitCodeTask!</h2>
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
        BitCodeTask Team<br>
        &copy; ${new Date().getFullYear()} BitCodeTask. All rights reserved.
      </p>
    </div>
  `,
    });
  } catch (error) {
    next(error);
  }
};

export const register = async function (req, res, next) {
  try {
    const { username, email, password } = req.body;

    await connectDB();
    let exists = await User.findOne({ email });

    if (exists) throw new AppError("User already exists", 409);

    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // token for generating verification email
    const verificationToken = crypto.randomUUID();

    // immediately saving the user - verify by comparing the token
    await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationTokenExpires: Date.now() + 1000 * 60 * 60,
      verificationToken: verificationToken,
    });

    await sendVerificationEmail(email, verificationToken);

    res.status(200).json({
      success: true,
      redirectTo: `/verify-reminder?email=${email}`,
    });
  } catch (error) {
    next(error);
  }
};

// email verification
export const verify = async function (req, res, next) {
  try {
    const { token } = req.query;
    await connectDB();
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) throw new AppError("Token invalid or expire", 400);

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    // generating tokens
    const accessToken = jwt.sign(
      { id: user._id, username: user.username },
      ACCESS_SECRET,
      { expiresIn: "2m" }
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
      secure: isProduction, // required for localhost
      sameSite: isProduction ? "None" : "lax", // required for localhost to allow cross-origin
      path: "/", // allow on all routes
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction, // required for localhost
      sameSite: isProduction ? "None" : "lax", // required for localhost to allow cross-origin
      path: "/", // allow on all routes
      maxAge: 2 * 60 * 1000, // 2 mins
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
    next(error);
  }
};

// login function
export const login = async function (req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      throw new AppError("Email and password are required", 400);
    await connectDB();
    const user = await User.findOne({ email }).select("+password"); // explicitly returning password

    if (!user) throw new AppError("Invalid credentials", 401);
    // verify password
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) throw new AppError("Invalid credentials", 401);

    // generating tokens
    const refreshToken = jwt.sign(
      { id: user._id, username: user.username },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    const accessToken = jwt.sign(
      { id: user._id, username: user.username },
      ACCESS_SECRET,
      { expiresIn: "2m" }
    );
    ///////////////////
    user.refreshToken = refreshToken;

    await user.save();

    //setting cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction, // required for localhost
      sameSite: isProduction ? "None" : "lax", // required for localhost to allow cross-origin
      path: "/", // allow on all routes
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction, // required for localhost
      sameSite: isProduction ? "None" : "lax", // required for localhost to allow cross-origin
      path: "/", // allow on all routes
      maxAge: 2 * 60 * 1000, // 2 mins
    });

    res.status(200).json({
      message: "login success",
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    console.error("Login error", error);
    next(error);
  }
};

// for getting new accesstoken
export const refresh = async function (req, res, next) {
  try {
    const token = req.cookies.refreshToken;

    if (!token) throw new AppError("No refresh token provided", 401);

    // refresh token verification
    const decoded = jwt.verify(token, REFRESH_SECRET);
    await connectDB();
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "lax",
        path: "/",
      });
      throw new AppError("Invalid refresh token", 403);
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
        expiresIn: "2m",
      }
    );

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: isProduction, // required for localhost
      sameSite: isProduction ? "None" : "lax", // required for localhost to allow cross-origin
      path: "/", // allow on all routes
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction, // required for localhost
      sameSite: isProduction ? "None" : "lax", // required for localhost to allow cross-origin
      path: "/", // allow on all routes
      maxAge: 2 * 60 * 1000, // 2 mins
    });

    res.status(200).json({
      message: "new access token",
    });
  } catch (error) {
    next(error);
  }
};

// for login out user
export const logout = async function (req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) throw new AppError("Already logged out", 200);

    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

    await connectDB();

    const user = await User.findById(decoded.id);

    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "lax",
    });

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "lax",
    });

    res.status(200).json({
      message: "Logged out successfully!",
    });
  } catch (error) {
    next(error);
  }
};

// get user data -> /api/me
export const getUser = async function (req, res, next) {
  try {
    const token = req.cookies.accessToken;

    if (!token) throw new AppError("Token not found", 401);

    const decoded = jwt.verify(token, ACCESS_SECRET);

    if (!decoded) throw new AppError("Invalid token", 401);

    await connectDB();

    const user = await User.findById(decoded.id);

    if (!user) throw new AppError("User not found", 404);

    res.json({ user: { id: user._id, username: user.username } });
  } catch (error) {
    next(error);
  }
};
