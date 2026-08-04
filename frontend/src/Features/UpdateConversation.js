import api from "../utlis/axios";

export default async function UpdateConversation(payload) {
  try {
    const { data } = await api.post(
      "/chat/update-conversation",
      payload
    );

    return data;
  } catch (error) {
    console.error(
      "Update Conversation Error:",
      error.response?.data || error.message
    );

    throw error;
  }
}