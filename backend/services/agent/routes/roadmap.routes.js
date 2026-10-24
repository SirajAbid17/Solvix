import express from "express";
import {
  generateRoadmap,
  getRoadmap,
  toggleTask,
} from "../controllers/roadmap.controller.js";

const router = express.Router();

router.post("/generate", generateRoadmap);
router.get("/", getRoadmap);
router.post("/toggle-task", toggleTask);

export default router;