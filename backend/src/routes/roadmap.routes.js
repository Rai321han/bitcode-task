import express from "express";
import {
  getFeatureById,
  getFeatures,
  likeFeature,
  unlikeFeature,
} from "../controllers/feature.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/roadmap", protect, getFeatures);
router.get("/roadmap/features/:id", protect, getFeatureById);
router.patch("/roadmap/features/:id/like", protect, likeFeature);
router.patch("/roadmap/features/:id/unlike", protect, unlikeFeature);

export default router;
