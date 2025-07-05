import mongoose from "mongoose";
import { connectDB } from "../db/db.js";
import Comments from "../models/comments.model.js";
import Comment from "../models/comments.model.js";
import Roadmap from "../models/roadmap.model.js";

import { AppError } from "../utils/AppError.js";

export async function getComments(req, res, next) {
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
    console.error("error", error);
    next(error);
  }
}

export async function getCommentById(req, res, next) {
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
    console.error("error", error);
    next(error);
  }
}

export async function likeComment(req, res, next) {
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
    console.error("error", error);
    next(error);
  }
}

export async function unlikeComment(req, res, next) {
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
    console.error("error", error);
    next(error);
  }
}

export async function createComment(req, res, next) {
  const {
    commenterId,
    content,
    commenterName,
    parentComment = null,
  } = req.body;
  const roadmapId = req.params.roadmapId;

  if (!commenterId || !roadmapId || !commenterName)
    throw new AppError("missing required fields", 400);

  try {
    //---- A COMMENT ----
    // content:
    // roadmapId:
    // commenterName:
    // parentCommentId:
    // hasChild:
    // likes:
    // likers:
    // -------
    const parentCommentId = parentComment?._id || null;
    await connectDB();

    const chain = parentComment
      ? [...parentComment.chain, parentCommentId]
      : [];
    const newComment = await Comment.create({
      content,
      roadmapId,
      commenterName,
      commenterId,
      parentCommentId,
      hasChild: false,
      chain,
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
    console.error("error", error);
    next(error);
  }
}

export async function editComment(req, res, next) {
  try {
    const commentId = req.params?.commentId;
    const { content } = req.body;
    if (!commentId) throw new AppError("comment id not found", 401);

    await connectDB();

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      comment: updatedComment,
    });
  } catch (error) {
    console.error("Error ", error);
    next(error);
  }
}

export async function deleteComment(req, res, next) {
  try {
    const { comment } = req.body;
    if (!comment || !comment._id || !comment.roadmapId)
      throw new AppError("Invalid comment payload", 400);

    await connectDB();

    const commentId = new mongoose.Types.ObjectId(comment._id);

    // Delete the comment itself + all that have this commentId in their chain

    const parentCommentId = comment.parentCommentId || null;
    const result = await Comment.deleteMany({
      $or: [
        { _id: commentId },
        { chain: commentId }, // matches all descendants
      ],
    });

    // Decrease roadmap comment count
    await Roadmap.findByIdAndUpdate(comment.roadmapId, {
      $inc: { comments: -result.deletedCount },
    });

    if (parentCommentId) {
      const remainingChildren = await Comment.exists({
        parentCommentId: parentCommentId,
      });

      if (!remainingChildren) {
        await Comment.findByIdAndUpdate(parentCommentId, {
          hasChild: false,
        });
      }
    }

    return res.status(200).json({
      success: true,
      deletedCount: result.deletedCount,
      comment,
    });
  } catch (error) {
    console.error("Error ", error);
    next(error);
  }
}
