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
  console.error(err);

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
  socket.on("join_feature", (featureId) => {
    socket.join(featureId);
  });

  // making new comment
  socket.on("new_comment", ({ featureId, comment }) => {
    socket.to(featureId).emit("new_comment", comment);
  });

  // like comment
  socket.on("edit_comment", ({ featureId, comment }) => {
    socket.to(featureId).emit("edit_comment", comment);
  });

  // like comment
  socket.on("like_comment", ({ featureId, commentId, userId }) => {
    socket.to(featureId).emit("like_comment", { commentId, userId });
  });

  // like comment
  socket.on("unlike_comment", ({ featureId, commentId, userId }) => {
    socket.to(featureId).emit("unlike_comment", { commentId, userId });
  });

  // delete comment
  socket.on("delete_comment", ({ featureId, comment }) => {
    socket.to(featureId).emit("delete_comment", { comment });
  });

  // upvote roadmap
  socket.on("upvote_feature", ({ featureId, upvoterId }) => {
    socket.to(featureId).emit("upvote_feature", { featureId, upvoterId });
  });

  // upvote roadmap
  socket.on("remove_upvote_feature", ({ featureId, upvoterId }) => {
    socket
      .to(featureId)
      .emit("remove_upvote_feature", { featureId, upvoterId });
  });

  socket.on("leave_feature", (featureId) => {
    socket.leave(featureId);
  });

  // on disconnect
  socket.on("disconnect", () => {});
});

const port = process.env.PORT || 5100;
server.listen(port, () => {
  console.log("Server running on port: ", port);
});

export { io };
