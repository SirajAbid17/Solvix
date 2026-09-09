import express from "express";

import uploadPDF from "../middleware/multer.js";

import {
  generateInterview,
  getMyInterviews,
  getInterviewById,
  deleteInterview,
} from "../controllers/mockInterview.controller.js";

const router = express.Router();


// Generate AI Interview

router.post(
  "/generate",
  uploadPDF.single("resume"),
  generateInterview
);


// Get interviews

router.get(
  "/my-interviews",
  getMyInterviews
);


// Get single interview

router.get(
  "/:id",
  getInterviewById
);


// Delete

router.delete(
  "/:id",
  deleteInterview
);


export default router;