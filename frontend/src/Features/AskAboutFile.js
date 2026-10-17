
import api from "../utlis/axios";

export const AskAboutFile = async ({ fileId, question, userId }) => {
  try {
    const { data } = await api.post(
      "/agent/file/ask",
      { fileId, question },
      {
        headers: {
          "x-user-id": userId,
        },
      }
    );

    console.log("RAG Answer:", data);

    return data;
  } catch (error) {
    console.error("AskAboutFile Error:", error.response?.data || error.message);
    throw error;
  }
};