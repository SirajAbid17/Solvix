import express from "express";
import { Agents } from "../controllers/agent.controllers.js";
import { uploadRateLimit } from "../../../shared/rateLimit.js";



const router = express.Router();

router.post('/chat',uploadRateLimit,Agents);

export default router;