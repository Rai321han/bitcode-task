import express from "express";
import dotenv from "dotenv";
import roadmapRouter from "./routes/roadmap.routes.js";
import commentsRouter from "./routes/comments.route.js";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.js";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";

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

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1); // Exit to prevent an unstable state
});

// Handle unhandled promise rejections (async errors outside Express)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err.message);
  process.exit(1);
});

const server = createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: isProduction ? process.env.FRONTEND_URL : "http://localhost:3000",
    credentials: true, // allow cookies (credentials)
  },
});

io.on("connection", (socket) => {
  // roadmap joining
  socket.on("join_roadmap", (roadmapId) => {
    socket.join(roadmapId);
  });

  // making new comment
  socket.on("new_comment", ({ roadmapId, comment }) => {
    socket.to(roadmapId).emit("new_comment", comment);
  });

  // like comment
  socket.on("like_comment", ({ roadmapId, commentId }) => {
    socket.to(roadmapId).emit("like_comment", commentId);
  });

  // delete comment
  socket.on("delete_comment", ({ roadmapId, commentId }) => {
    socket.to(roadmapId).emit("delete_comment", commentId);
  });

  // upvote roadmap
  socket.on("upvote_roadmap", ({ roadmapId, newUpvoteCount }) => {
    socket.to(roadmapId).emit("upvote_roadmap", newUpvoteCount);
  });

  socket.on("leave_roadmap", (roadmapId) => {
    socket.leave(roadmapId);
  });

  // on disconnect
  socket.on("disconnect", () => {});
});

const port = process.env.PORT || 5100;
server.listen(port, () => {
  console.log("Server running on port: ", port);
});

export { io };
