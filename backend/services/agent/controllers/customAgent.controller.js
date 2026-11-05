import CustomAgent from "../models/CustomAgent.js";
import { CustomAgentNode } from "../AllAgents/customAgent.agent.js";
import {
  getAgentChatHistory,
  saveAgentChatMessage,
} from "../utlis/customAgentMemory.js";

const MAX_AGENTS_PER_USER = 50;
const DEFAULT_USER_ID = "test-user"; 


const getUserId = (req) =>
  req.headers["x-user-id"] ||
  req.user?._id ||
  req.user?.userId ||
  DEFAULT_USER_ID;

const sanitize = (str, max = 2000) => {
  if (typeof str !== "string") return "";
  return str.trim().slice(0, max);
};

const validateAgentInput = (body, { partial = false } = {}) => {
  const errors = {};

  if (!partial || body.name !== undefined) {
    if (!body.name || sanitize(body.name).length < 2) {
      errors.name = "Name is required (min 2 chars)";
    } else if (body.name.length > 60) {
      errors.name = "Name must be under 60 chars";
    }
  }
  if (!partial || body.description !== undefined) {
    if (!body.description || sanitize(body.description).length < 5) {
      errors.description = "Description is required (min 5 chars)";
    } else if (body.description.length > 300) {
      errors.description = "Description must be under 300 chars";
    }
  }
  if (!partial || body.systemPrompt !== undefined) {
    if (!body.systemPrompt || sanitize(body.systemPrompt).length < 20) {
      errors.systemPrompt = "System prompt is required (min 20 chars)";
    } else if (body.systemPrompt.length > 8000) {
      errors.systemPrompt = "System prompt must be under 8000 chars";
    }
  }
  return errors;
};


export const createCustomAgent = async (req, res) => {
  try {
    const userId = getUserId(req);

    const errors = validateAgentInput(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const count = await CustomAgent.countDocuments({ userId });
    if (count >= MAX_AGENTS_PER_USER) {
      return res.status(400).json({
        success: false,
        message: `Limit reached — max ${MAX_AGENTS_PER_USER} agents per user`,
      });
    }

    const agent = await CustomAgent.create({
      userId,
      name: sanitize(req.body.name, 60),
      description: sanitize(req.body.description, 300),
      systemPrompt: sanitize(req.body.systemPrompt, 8000),
      category: req.body.category || "general",
      model: req.body.model || "openai/gpt-oss-20b",
      temperature:
        typeof req.body.temperature === "number"
          ? Math.min(1, Math.max(0, req.body.temperature))
          : 0.7,
    });

    return res.status(201).json({
      success: true,
      message: "Agent created successfully",
      agent,
    });
  } catch (error) {
    console.error("createCustomAgent error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create agent",
    });
  }
};


export const listCustomAgents = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { category, search, page = 1, limit = 50 } = req.query;

    const query = { userId };
    if (category && category !== "all") query.category = category;
    if (search && search.trim()) {
      const q = search.trim();
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));

    const [agents, total] = await Promise.all([
      CustomAgent.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      CustomAgent.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      agents: agents.map((a) => ({
        _id: a._id.toString(),
        name: a.name,
        description: a.description,
        systemPrompt: a.systemPrompt,
        category: a.category,
        model: a.model,
        temperature: a.temperature,
        totalChats: a.totalChats || 0,
        lastUsedAt: a.lastUsedAt,
        createdAt: a.createdAt,
      })),
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error("listCustomAgents error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to list agents",
    });
  }
};


export const getCustomAgent = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const agent = await CustomAgent.findOne({ _id: id, userId });
    if (!agent) {
      return res
        .status(404)
        .json({ success: false, message: "Agent not found" });
    }

    return res.status(200).json({ success: true, agent });
  } catch (error) {
    console.error("getCustomAgent error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch agent",
    });
  }
};


export const updateCustomAgent = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const agent = await CustomAgent.findOne({ _id: id, userId });
    if (!agent) {
      return res
        .status(404)
        .json({ success: false, message: "Agent not found" });
    }

    const errors = validateAgentInput(req.body, { partial: true });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    if (req.body.name !== undefined) agent.name = sanitize(req.body.name, 60);
    if (req.body.description !== undefined)
      agent.description = sanitize(req.body.description, 300);
    if (req.body.systemPrompt !== undefined)
      agent.systemPrompt = sanitize(req.body.systemPrompt, 8000);
    if (req.body.category !== undefined) agent.category = req.body.category;
    if (req.body.model !== undefined) agent.model = req.body.model;
    if (typeof req.body.temperature === "number") {
      agent.temperature = Math.min(1, Math.max(0, req.body.temperature));
    }
    if (typeof req.body.isActive === "boolean") {
      agent.isActive = req.body.isActive;
    }

    await agent.save();

    return res.status(200).json({
      success: true,
      message: "Agent updated successfully",
      agent,
    });
  } catch (error) {
    console.error("updateCustomAgent error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update agent",
    });
  }
};


export const deleteCustomAgent = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const result = await CustomAgent.deleteOne({ _id: id, userId });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Agent not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Agent deleted successfully",
    });
  } catch (error) {
    console.error("deleteCustomAgent error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete agent",
    });
  }
};


export const chatWithCustomAgent = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const { prompt, conversationId } = req.body;
    const remainingCredits = req.headers["x-remaining-credits"];

    if (!prompt || !String(prompt).trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Prompt is required" });
    }

    const agent = await CustomAgent.findOne({ _id: id, userId });
    if (!agent) {
      return res
        .status(404)
        .json({ success: false, message: "Agent not found" });
    }

    if (!agent.isActive) {
      return res
        .status(400)
        .json({ success: false, message: "This agent is disabled" });
    }

    
    const conversationKey = conversationId || `conv_${Date.now()}`;
    const history = await getAgentChatHistory(
      userId,
      agent._id.toString(),
      conversationKey
    );

    
    await saveAgentChatMessage(userId, agent._id.toString(), conversationKey, {
      role: "user",
      content: String(prompt).trim(),
    });

  
    const result = await CustomAgentNode({
      prompt: String(prompt).trim(),
      messages: history,
      customAgent: agent,
      userId,
    });

   
    await saveAgentChatMessage(userId, agent._id.toString(), conversationKey, {
      role: "assistant",
      content: result.aiResponse,
    });

    
    CustomAgent.updateOne(
      { _id: agent._id },
      {
        $inc: { totalChats: 1 },
        $set: { lastUsedAt: new Date() },
      }
    ).catch((err) => console.warn("Usage update failed:", err.message));

    return res.status(200).json({
      success: true,
      response: result.aiResponse,
      model: agent.model,
      temperature: agent.temperature,
      creditsRemaining: remainingCredits || null,
      agentId: agent._id.toString(),
      agentName: agent.name,
      conversationId: conversationKey,
    });
  } catch (error) {
    console.error("chatWithCustomAgent error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to chat with agent",
    });
  }
};


export const clearCustomAgentChat = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id, conversationId } = req.params;

    const { clearAgentChatHistory } = await import(
      "../utlis/customAgentMemory.js"
    );
    await clearAgentChatHistory(userId, id, conversationId);

    return res.status(200).json({
      success: true,
      message: "Chat history cleared",
    });
  } catch (error) {
    console.error("clearCustomAgentChat error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to clear chat",
    });
  }
};


export const getCustomAgentChatHistory = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id, conversationId } = req.params;

    if (!id || !conversationId) {
      return res.status(400).json({
        success: false,
        message: "Agent ID and conversation ID required",
      });
    }

    const messages = await getAgentChatHistory(userId, id, conversationId);

    return res.status(200).json({
      success: true,
      messages: messages || [],
      conversationId,
    });
  } catch (error) {
    console.error("getCustomAgentChatHistory error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch chat history",
    });
  }
};