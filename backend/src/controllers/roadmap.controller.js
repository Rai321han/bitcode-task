import Roadmap from "../models/roadmap.model.js";
import { connectDB } from "../db/db.js";
// @desc    Get all roadmaps
// @route   GET /api/roadmaps
// @access  Public
export async function getRoadmaps(req, res) {
  try {
    await connectDB();
    const filters = req.query?.filter || [];
    const sort = req.query?.sort || "";

    let query = {};

    if (filters.length > 0) query.status = { $in: filters };

    let cursor = Roadmap.find(query);

    if (sort === "highest-voted") cursor = cursor.sort({ upvotes: -1 });
    else if (sort === "lowest-voted") cursor = cursor.sort({ upvotes: 1 });

    let roadmaps = await cursor;

    return res.status(200).json({
      success: true,
      roadmaps: roadmaps || [],
    });
  } catch (error) {
    console.error("Error fetching roadmaps:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch roadmaps",
      error: error.message,
    });
  }
}

export async function getRoadmapById(req, res) {
  const roadmapId = req.params.id;

  try {
    await connectDB();
    const roadmap = await Roadmap.findById(roadmapId);
    return res.status(200).json({
      success: true,
      roadmap,
    });
  } catch (error) {
    console.error("Error while fetching roadmap by id", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch roadmap by id",
      error: error.message,
    });
  }
}
