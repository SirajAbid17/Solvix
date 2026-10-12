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


router.post(
  "/generate",
  uploadRateLimit,
  uploadPDF.single("resume"),
  generateInterview
);


router.post(
  "/:id/next-batch",
  uploadRateLimit,
  generateNextBatch
);


router.get("/my-interviews", getMyInterviews);


router.get("/:id", getInterviewById);


router.delete("/:id", deleteInterview);

export default router;