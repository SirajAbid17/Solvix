import express from "express";
import {
  createCustomAgent,
  listCustomAgents,
  getCustomAgent,
  updateCustomAgent,
  deleteCustomAgent,
  chatWithCustomAgent,
  clearCustomAgentChat,
  getCustomAgentChatHistory,
} from "../controllers/customAgent.controller.js";

const router = express.Router();


router.post("/", createCustomAgent);
router.get("/", listCustomAgents);
router.get("/:id", getCustomAgent);
router.put("/:id", updateCustomAgent);
router.delete("/:id", deleteCustomAgent);

router.post("/:id/chat", chatWithCustomAgent);
router.get("/:id/chat/:conversationId", getCustomAgentChatHistory);
router.delete("/:id/chat/:conversationId", clearCustomAgentChat);

export default router;