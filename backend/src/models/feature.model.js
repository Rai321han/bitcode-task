import mongoose, { Schema } from "mongoose";

const featureSchema = new Schema(
  {
    feature: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["in-progress", "planned", "completed"],
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    likers: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
    milestones: [
      {
        title: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ["completed", "incompleted"],
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Feature = mongoose.model("Feature", featureSchema);
export default Feature;
