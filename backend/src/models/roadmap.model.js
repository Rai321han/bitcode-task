import mongoose, { Schema } from "mongoose";

const roadmapSchema = new Schema(
  {
    feature: {
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

const Roadmap = mongoose.model("Roadmap", roadmapSchema);
export default Roadmap;
