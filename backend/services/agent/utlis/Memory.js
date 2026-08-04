export const buildConversationMemory = (messages = []) => {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .slice(-10)
    .map((message) => ({
      role: message.role,
      content: message.content,
    }))
    .filter(
      (message) =>
        message.role &&
        message.content
    );
};