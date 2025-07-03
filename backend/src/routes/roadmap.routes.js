import express from "express";
import {
  getRoadmapById,
  getRoadmaps,
  likeRoadmap,
  unlikeRoadmap
} from "../controllers/roadmap.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();
// @desc    Get all roadmaps
// @route   GET /api/roadmaps
// @access  Public
router.get("/roadmaps", protect, getRoadmaps);
router.get("/roadmaps/:id", protect, getRoadmapById);
router.patch("/roadmaps/:id/like", protect, likeRoadmap);
router.patch("/roadmaps/:id/unlike", protect, unlikeRoadmap);

export default router;
