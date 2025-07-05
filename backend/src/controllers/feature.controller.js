import Feature from "../models/feature.model.js";
import { connectDB } from "../db/db.js";

export async function getFeatures(req, res, next) {
  try {
    await connectDB();
    const filters = req.query?.filter || [];
    const sort = req.query?.sort || "";

    let query = {};

    if (filters.length > 0) query.status = { $in: filters };

    let cursor = Feature.find(query);

    if (sort === "highest-voted") cursor = cursor.sort({ upvotes: -1 });
    else if (sort === "lowest-voted") cursor = cursor.sort({ upvotes: 1 });

    let features = await cursor;

    return res.status(200).json({
      success: true,
      features: features || [],
    });
  } catch (error) {
    console.error("error", error);
    next(error);
  }
}

export async function getFeatureById(req, res, next) {
  const featureId = req.params.id;

  try {
    await connectDB();
    const feature = await Feature.findById(featureId);
    return res.status(200).json({
      success: true,
      feature,
    });
  } catch (error) {
    console.error("error", error);
    next(error);
  }
}

export async function likeFeature(req, res, next) {
  const featureId = req.params.id;
  const upvoterId = req.body.upvoterId;

  try {
    await connectDB();
    await Feature.findByIdAndUpdate(featureId, {
      $inc: { upvotes: 1 },
      $addToSet: { likers: upvoterId },
    });
    return res.status(204).end();
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function unlikeFeature(req, res, next) {
  const featureId = req.params.id;
  const upvoterId = req.body.upvoterId;
  try {
    await connectDB();
    await Feature.findByIdAndUpdate(featureId, {
      $inc: { upvotes: -1 },
      $pull: { likers: upvoterId },
    });
    return res.status(204).end();
  } catch (error) {
    console.error(error);
    next(error);
  }
}
