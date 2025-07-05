import Roadmap from "../models/roadmap.model.js";
import { connectDB } from "../db/db.js";

export async function getRoadmaps(req, res, next) {
  try {
    await connectDB();
    const filters = req.query?.filter || [];
    const sort = req.query?.sort || "";

    console.log("params", { filters, sort });

    let query = {};

    if (filters.length > 0) query.status = { $in: filters };

    let cursor = Roadmap.find(query);

    if (sort === "highest-voted") cursor = cursor.sort({ upvotes: -1 });
    else if (sort === "lowest-voted") cursor = cursor.sort({ upvotes: 1 });

    let roadmaps = await cursor;
    console.log("roadmaps", roadmaps);

    return res.status(200).json({
      success: true,
      roadmaps: roadmaps || [],
    });
  } catch (error) {
    console.error("error", error);
    next(error);
  }
}

export async function getRoadmapById(req, res, next) {
  const roadmapId = req.params.id;

  try {
    await connectDB();
    const roadmap = await Roadmap.findById(roadmapId);
    return res.status(200).json({
      success: true,
      roadmap,
    });
  } catch (error) {
    console.error("error", error);
    next(error);
  }
}

export async function likeRoadmap(req, res, next) {
  const roadmapId = req.params.id;
  const upvoterId = req.body.upvoterId;

  try {
    await connectDB();
    await Roadmap.findByIdAndUpdate(roadmapId, {
      $inc: { upvotes: 1 },
      $addToSet: { likers: upvoterId },
    });
    return res.status(204).end();
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function unlikeRoadmap(req, res, next) {
  const roadmapId = req.params.id;
  const upvoterId = req.body.upvoterId;
  try {
    await connectDB();
    await Roadmap.findByIdAndUpdate(roadmapId, {
      $inc: { upvotes: -1 },
      $pull: { likers: upvoterId },
    });
    return res.status(204).end();
  } catch (error) {
    console.error(error);
    next(error);
  }
}
