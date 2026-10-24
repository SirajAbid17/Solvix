import express from "express";
import {
  searchJobs,
  getJobSearchStatus,
  applyToJob,
} from "../controllers/job.controller.js";

const router = express.Router();

router.post("/search", searchJobs);
router.get("/status", getJobSearchStatus);
router.post("/apply", applyToJob);

export default router;