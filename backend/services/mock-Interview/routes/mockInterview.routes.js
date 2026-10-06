import express from "express";

import uploadPDF from "../middleware/multer.js";

import {
  generateInterview,
  getMyInterviews,
  getInterviewById,
  deleteInterview,
  generateNextBatch,
} from "../controllers/mockInterview.controller.js";
import { uploadRateLimit } from "../../../shared/rateLimit.js";



const router = express.Router();

// Generate Interview - rate limited
router.post(
  "/generate",
  uploadRateLimit,
  uploadPDF.single("resume"),
  generateInterview
);

// Generate next batch - rate limited
router.post(
  "/:id/next-batch",
  uploadRateLimit,
  generateNextBatch
);

// Get interviews - FREE
router.get("/my-interviews", getMyInterviews);

// Get single interview - FREE
router.get("/:id", getInterviewById);

// Delete interview - FREE
router.delete("/:id", deleteInterview);

export default router;