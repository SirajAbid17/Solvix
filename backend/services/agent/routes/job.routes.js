import express from "express";
import {
  searchJobs,
  getJobSearchStatus,
} from "../controllers/job.controller.js";

const router = express.Router();

router.post("/search", searchJobs);
router.get("/status", getJobSearchStatus);

export default router;