// Get all comments for a roadmap
// GET	/api/roadmaps/:roadmapId/comments

// Get a single comment
// GET	/api/comments/:commentId

// Create a comment or reply
// POST	/api/comment

// Like a comment
// POST	/api/comments/:commentId/like

// Delete a comment
// DELETE	/api/comments/:commentId

import express from "express";
import {
  createComment,
  deleteComment,
  getCommentById,
  getComments,
  likeComment,
} from "../controllers/comments.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const comments = express.Router();
comments.get("/roadmaps/:roadmapId/comments", protect, getComments);
comments.get("/comment/:commentId", protect, getCommentById);
comments.post("/comment", protect, createComment);
comments.post("/comments/:commentId/like", protect, likeComment);
comments.delete("/comments/:commentId", protect, deleteComment);

export default comments;
