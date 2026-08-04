import express from "express";
import { Agents } from "../controllers/agent.controllers.js";

const router=express.Router();

router.post('/chat',Agents)

export default router