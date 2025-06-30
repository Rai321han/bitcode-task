import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

const ACCESS_SECRET = process.env.ACCESS_SECRET;

export const protect = (req, res, next) => {
  const authHeader = req.headers?.authorization;
  let token;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }
  if (!token) {
    throw new AppError("Unautorized: no token provided", 401);
  }

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(error)
  }
};
