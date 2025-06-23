import express from "express";
import {
  getRoadmapById,
  getRoadmaps,
} from "../controllers/roadmap.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();
// @desc    Get all roadmaps
// @route   GET /api/roadmaps
// @access  Public
router.get("/roadmaps", protect, getRoadmaps);
router.get("/roadmaps/:id", protect, getRoadmapById);

export default router;
