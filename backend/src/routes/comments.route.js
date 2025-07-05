import express from "express";
import {
  createComment,
  deleteComment,
  getCommentById,
  getComments,
  likeComment,
  unlikeComment,
  editComment,
} from "../controllers/comments.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const comments = express.Router();
comments.get("/roadmaps/:roadmapId/comments", protect, getComments);
comments.get("/comment/:commentId", protect, getCommentById);
comments.post("/:roadmapId/comment", protect, createComment);
comments.patch("/comments/:commentId/like", protect, likeComment);
comments.patch("/comments/:commentId/unlike", protect, unlikeComment);
comments.patch("/comments/:commentId", protect, editComment);
comments.post("/comments", protect, deleteComment);

export default comments;
