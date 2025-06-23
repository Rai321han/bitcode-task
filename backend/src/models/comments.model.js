import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  roadmapId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  commenterName: {
    type: String,
    required: true,
  },
  parentCommentId: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  children: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  likes: {
    type: Number,
    default: 0,
  },
  likers: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
});

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
