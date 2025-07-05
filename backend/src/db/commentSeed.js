import Comment from "../models/comments.model.js";
import { connectDB } from "./db.js";

import mongoose from "mongoose";

export async function seedDB() {
  try {
    await connectDB();
    const count = await Comment.countDocuments();

    if (count > 0) {
      console.log("👉 Database already has data. Skipped seeding!");
      process.exit(0);
    }

    const roadmapId = new mongoose.Types.ObjectId("6856fee59398f50b19c19fe0");

    // Dummy IDs
    const userId = new mongoose.Types.ObjectId("6859de9b6f35d99667d41280");

    // Predefined comment IDs for nesting and referencing
    const commentAId = new mongoose.Types.ObjectId();
    const commentA1Id = new mongoose.Types.ObjectId();
    const commentA2Id = new mongoose.Types.ObjectId();
    const commentBId = new mongoose.Types.ObjectId();

    // Comment documents with all 9 fields
    const commentSeedData = [
      {
        _id: commentAId,
        content: "This is the first root comment",
        commenterId: userId,
        commenterName: "Raihan",
        roadmapId,
        parentCommentId: null,
        hasChild: true,
        likes: 1,
        likers: [userId],
        chain: [],
      },
      {
        _id: commentA1Id,
        content: "This is a reply to the first comment",
        commenterId: userId,
        commenterName: "Raihan",
        roadmapId,
        parentCommentId: commentAId,
        hasChild: true,
        likes: 0,
        likers: [],
        chain: [commentAId],
      },
      {
        _id: commentA2Id,
        content: "This is a nested reply to the reply",
        commenterId: userId,
        commenterName: "Raihan",
        roadmapId,
        parentCommentId: commentA1Id,
        hasChild: false,
        likes: 0,
        likers: [],
        chain: [commentAId, commentA1Id],
      },
      {
        _id: commentBId,
        content: "Another top-level comment",
        commenterId: userId,
        commenterName: "Alex",
        roadmapId,
        parentCommentId: null,
        hasChild: false,
        likes: 0,
        likers: [],
        chain: [],
      },
    ];

    await Comment.insertMany(commentSeedData);
    console.log("✅ Comments seeding complete!");
    process.exit(0);
  } catch (error) {
    console.log("Error while database seeding", error);
  }
}

seedDB();
