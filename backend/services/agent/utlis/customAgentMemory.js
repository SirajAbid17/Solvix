import redis from "../../../shared/redis/redis.js";

const KEY_PREFIX = "custom-agent:chat";
const TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const getKey = (userId, agentId, conversationId) =>
  `${KEY_PREFIX}:${userId}:${agentId}:${conversationId}`;

export const getAgentChatHistory = async (
  userId,
  agentId,
  conversationId
) => {
  try {
    if (!conversationId) return [];
    const key = getKey(userId, agentId, conversationId);
    const data = await redis.get(key);
    if (!data) return [];
    return JSON.parse(data);
  } catch (err) {
    console.warn("getAgentChatHistory error:", err.message);
    return [];
  }
};


export const saveAgentChatMessage = async (
  userId,
  agentId,
  conversationId,
  message
) => {
  try {
    if (!conversationId) return [];
    const key = getKey(userId, agentId, conversationId);
    const existing = await getAgentChatHistory(
      userId,
      agentId,
      conversationId
    );

    existing.push({
      role: message.role,
      content: message.content,
    });

   
    const trimmed = existing.slice(-30);

    await redis.set(key, JSON.stringify(trimmed), "EX", TTL_SECONDS);
    return trimmed;
  } catch (err) {
    console.warn("saveAgentChatMessage error:", err.message);
    return [];
  }
};


export const clearAgentChatHistory = async (
  userId,
  agentId,
  conversationId
) => {
  try {
    const key = getKey(userId, agentId, conversationId);
    await redis.del(key);
    return true;
  } catch (err) {
    console.warn("clearAgentChatHistory error:", err.message);
    return false;
  }
};