import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_SECRET;

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Invalid token :", error);
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};
