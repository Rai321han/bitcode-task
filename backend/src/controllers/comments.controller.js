import mongoose from "mongoose";
import { connectDB } from "../db/db.js";
import Comments from "../models/comments.model.js";

export async function getComments(req, res) {
  try {
    await connectDB();
    const roadmapId = req.params?.roadmapId;
    if (!roadmapId)
      return res.json({
        success: false,
        message: "Roadmap id not found",
      });
    const filter = {};
    const roadmapObjectId = new mongoose.Types.ObjectId(roadmapId);
    filter.roadmapId = roadmapObjectId;
    const parentCommentId = req.query.parentCommentId;
    filter.parentCommentId =
      parentCommentId === "null"
        ? null
        : new mongoose.Types.ObjectId(parentCommentId);
    console.log(filter);
    const comments = await Comments.find(filter);

    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error("Error while fetching comments", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
      error: error.message,
    });
  }
}
export async function getCommentById() {}
export async function likeComment() {}
export async function deleteComment() {}
export async function createComment() {}
