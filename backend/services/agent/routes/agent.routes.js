import express from "express";
import { Agents } from "../controllers/agent.controllers.js";
import fileRoutes from "./file.routes.js";
import jobRoutes from "./job.routes.js";
import { uploadRateLimit } from "../../../shared/rateLimit.js";
import roadmapRoutes from "./roadmap.routes.js";

const router = express.Router();
router.use("/roadmap", roadmapRoutes);
router.post("/chat", uploadRateLimit, Agents);


router.use("/file", fileRoutes);


router.use("/jobs", jobRoutes);

export default router;