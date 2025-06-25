import Comment from "../models/comments.model.js";
import { connectDB } from "./db.js";

import mongoose from "mongoose";

const roadmapId = new mongoose.Types.ObjectId("6856fee59398f50b19c19fe0");

const user1 = new mongoose.Types.ObjectId();
const user2 = new mongoose.Types.ObjectId();
const user3 = new mongoose.Types.ObjectId();
const user4 = new mongoose.Types.ObjectId();

const commenterUser = new mongoose.Types.ObjectId("6859de9b6f35d99667d41280");
const anotherUser = new mongoose.Types.ObjectId("685ad96890e31cb1ae3680ea");

const commentId1 = new mongoose.Types.ObjectId(); // Level 1
const commentId2 = new mongoose.Types.ObjectId(); // Level 2 reply to 1
const commentId3 = new mongoose.Types.ObjectId(); // Level 3 reply to 2

const commentId4 = new mongoose.Types.ObjectId(); // Another thread level 1
const commentId5 = new mongoose.Types.ObjectId(); // reply to 4

export const commentSeedData = [
  // Level 1
  {
    _id: commentId1,
    content: "Really insightful roadmap. Helped me plan my learning.",
    roadmapId,
    commenterId: commenterUser,
    commenterName: "Alice",
    parentCommentId: null,
    hasChild: true,
    likes: 2,
    likers: [user1, user2],
  },
  // Level 2
  {
    _id: commentId2,
    content: "Absolutely! The way it's structured is great.",
    roadmapId,
    commenterName: "Bob",
    commenterId: anotherUser,
    parentCommentId: commentId1,
    hasChild: true,
    likes: 1,
    likers: [user3],
  },
  // Level 3
  {
    _id: commentId3,
    content: "Agree with you both — especially the project-based sections.",
    roadmapId,
    commenterName: "Charlie",
    commenterId: anotherUser,
    parentCommentId: commentId2,
    hasChild: false,
    likes: 2,
    likers: [user1, user4],
  },
  // Another top-level comment
  {
    _id: commentId4,
    content: "Could you also include DevOps in this roadmap?",
    roadmapId,
    commenterId: commenterUser,
    commenterName: "Dave",
    parentCommentId: null,
    hasChild: true,
    likes: 0,
    likers: [],
  },
  // Reply to the second thread
  {
    _id: commentId5,
    content: "That would be great! Maybe Docker and CI/CD tools?",
    roadmapId,
    commenterName: "Eve",
    commenterId: anotherUser,
    parentCommentId: commentId4,
    hasChild: false,
    likes: 1,
    likers: [user2],
  },
];

export async function seedDB() {
  try {
    await connectDB();
    const count = await Comment.countDocuments();

    if (count > 0) {
      console.log("👉 Database already has data. Skipped seeding!");
      process.exit(0);
    }

    await Comment.insertMany(commentSeedData);
    console.log("✅ Comments seeding complete!");
    process.exit(0);
  } catch (error) {
    console.log("Error while database seeding", error);
    throw error;
  }
}

seedDB();
