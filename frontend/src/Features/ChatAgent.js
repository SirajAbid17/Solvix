import api from "../utlis/axios";

export default async function ChatAgent(payload) {
  try {
    console.log(" ChatAgent sending:", {
      prompt: payload.prompt?.slice(0, 50),
      agent: payload.agent,
      hasFile: !!payload.fileId,
    });

    const response = await api.post("/agent/chat", payload, {
      timeout: 300000,
    });

    console.log("ChatAgent received:", {
      hasResponse: !!response?.data?.response,
      responseLength: response?.data?.response?.length || 0,
      keys: response?.data ? Object.keys(response.data) : [],
    });

    return response.data;
  } catch (error) {
    console.error("ChatAgent Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      isTimeout: error.code === "ECONNABORTED",
    });
    throw error;
  }
}