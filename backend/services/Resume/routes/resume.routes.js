import express from "express";

import upload from "../middleware/multer.js";

import {
  myResumes,
  uploadResume,
} from "../controller/resume.controller.js";
import { uploadRateLimit } from "../../../shared/rateLimit.js";



const router = express.Router();

router.post(
  "/upload",
  uploadRateLimit,
  upload.single("resume"),
  uploadResume
);

router.get(
  "/my-resumes",
  myResumes
);

export default router;