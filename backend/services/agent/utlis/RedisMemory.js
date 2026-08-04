import redis from "../../../shared/redis/redis.js";

const getRedisKey = (conversationId) => {
  return `conversation:${conversationId}`;
};


export const getConversationMessages = async (
  conversationId
) => {
  const key = getRedisKey(conversationId);

  const messages = await redis.get(key);

  if (!messages) {
    return [];
  }

  return JSON.parse(messages);
};


export const saveConversationMessage = async (
  conversationId,
  message
) => {
  const key = getRedisKey(conversationId);

  const messages =
    await getConversationMessages(
      conversationId
    );

  messages.push({
    role: message.role,
    content: message.content,
  });

  await redis.set(
    key,
    JSON.stringify(messages)
  );

  return messages;
};

export const saveConversationMessages = async (
  conversationId,
  messages
) => {
  const key = getRedisKey(conversationId);

  const formattedMessages = messages.map(
    (message) => ({
      role: message.role,
      content: message.content,
    })
  );

  await redis.set(
    key,
    JSON.stringify(formattedMessages)
  );

  return formattedMessages;
};