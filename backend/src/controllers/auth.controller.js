import { connectDB } from "../db/db.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

// user registration
export const register = async function (req, res) {
  try {
    const { username, email, password } = req.body;

    await connectDB();
    const existing = await User.findOne({ email });

    if (existing)
      return res.status(409).json({
        message: "User already exists",
      });

    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // creating new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

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
      secure: true,
      sameSite: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "registration success",
      accessToken,
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
      secure: true,
      sameSite: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "login success", accessToken });
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
      return res.status(401).json({ message: "No refresh token provided" });
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

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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

    res.status(200).json({
      message: "new access token",
      accessToken,
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
      secure: true,
      sameSite: true,
    });

    res.status(200).json({
      message: "Logged out successfully!",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// email verification
export const verify = async function () {};
