import express from "express";
import uploadPDF from "../middleware/multer.js";
import {
  generateInterview,
  getMyInterviews,
  getInterviewById,
  deleteInterview,
} from "../controllers/mockInterview.controller.js";

const router = express.Router();

// ✅ Generate Interview - PAID (2 credits)
router.post("/generate", uploadPDF.single("resume"), generateInterview);

// ✅ Get interviews - FREE
router.get("/my-interviews", getMyInterviews);

// ✅ Get single interview - FREE
router.get("/:id", getInterviewById);

// ✅ Delete interview - FREE
router.delete("/:id", deleteInterview);

export default router;