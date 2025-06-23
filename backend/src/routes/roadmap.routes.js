import express from "express";
import {
  getRoadmapById,
  getRoadmaps,
} from "../controllers/roadmap.controller.js";

const router = express.Router();
// @desc    Get all roadmaps
// @route   GET /api/roadmaps
// @access  Public
router.get("/roadmaps", getRoadmaps);
router.get("/roadmaps/:id", getRoadmapById);

export default router;
