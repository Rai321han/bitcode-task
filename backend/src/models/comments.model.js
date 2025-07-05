import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    commenterId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    featureId: {
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
    hasChild: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Number,
      default: 0,
    },

    likers: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
    chain: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
