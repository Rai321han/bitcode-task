import mongoose from "mongoose";
import { connectDB } from "../db/db.js";
import Comments from "../models/comments.model.js";
import Comment from "../models/comments.model.js";
import Roadmap from "../models/roadmap.model.js";

import { AppError } from "../utils/AppError.js";

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
    const comments = await Comments.find(filter);

    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    throw new AppError("Failed to fetch comments", 500);
  }
}

export async function getCommentById(req, res) {
  try {
    await connectDB();
    const commentId = req.params?.commentId;
    if (!commentId) throw new AppError("'commentId id not found", 404);

    const comment = await Comments.findById(commentId);

    return res.status(200).json({
      success: true,
      comment,
    });
  } catch (error) {
    throw new AppError("Failed to fetch comment", 500);
  }
}

export async function likeComment(req, res) {
  const likerId = req.body.likerId;
  const commentId = req.params.commentId;

  if (!likerId || !commentId)
    return res.status(401).json({
      success: false,
      message: "id not found",
    });

  try {
    // database connection
    await connectDB();
    const queryObj = await Comment.updateOne(
      { _id: commentId },
      {
        $inc: { likes: 1 },
        $addToSet: { likers: likerId },
      }
    );

    res.status(204).end();
  } catch (error) {
    throw new AppError("internal server error", 500);
  }
}

export async function unlikeComment(req, res) {
  const unlikerId = req.body.unlikerId;
  const commentId = req.params.commentId;

  if (!unlikerId || !commentId) throw new AppError("id not found", 401);

  try {
    // database connection
    await connectDB();
    await Comment.updateOne(
      { _id: commentId },
      {
        $inc: { likes: -1 },
        $pull: { likers: unlikerId },
      }
    );

    res.status(204).end();
  } catch (error) {
    throw new AppError("internal server error", 500);
  }
}

export async function deleteComment() {}

export async function createComment(req, res) {
  const {
    commenterId,
    content,
    commenterName,
    parentCommentId = null,
  } = req.body;
  const roadmapId = req.params.roadmapId;

  if (!commenterId || !roadmapId || !commenterName)
    throw new AppError("missing required fields", 400);

  try {
    // database connection
    //---- A COMMENT ----
    // content:
    // roadmapId:
    // commenterName:
    // parentCommentId:
    // hasChild:
    // likes:
    // likers:
    // -------
    await connectDB();
    const newComment = await Comment.create({
      content,
      roadmapId,
      commenterName,
      commenterId,
      parentCommentId,
      hasChild: false,
      likes: 0,
      likers: [],
    });

    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        hasChild: true,
      });
    }

    const obj = await Roadmap.findByIdAndUpdate(roadmapId, {
      $inc: { comments: 1 },
    });

    res.status(201).json({
      success: true,
      message: "comment created",
      comment: newComment,
    });
  } catch (error) {
    throw new AppError("failed to save comment", 500);
  }
}
