import express from "express";
import dotenv from "dotenv";
import roadmapRouter from "./routes/roadmap.routes.js";
import commentsRouter from "./routes/comments.route.js";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.js";

const isProduction = process.env.NODE_ENV === "production";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: isProduction ? process.env.FRONTEND_URL : "http://localhost:3000",
    credentials: true, // allow cookies (credentials)
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/api", roadmapRouter);
app.use("/api", commentsRouter);
app.use("/api", authRouter);

app.use(errorHandler);

// process.on("uncaughtException", (err) => {
//   console.error("Uncaught Exception:", err.message);
//   process.exit(1); // Exit to prevent an unstable state
// });

// // Handle unhandled promise rejections (async errors outside Express)
// process.on("unhandledRejection", (err) => {
//   console.error("Unhandled Promise Rejection:", err.message);
//   process.exit(1);
// });

const port = process.env.PORT || 5100;
app.listen(port, () => {
  console.log("Server running on port: ", port);
});
