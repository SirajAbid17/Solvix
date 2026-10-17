import api from "../utlis/axios";

export const DeleteFileRAG = async (fileId, userId) => {
  try {
    const { data } = await api.delete(`/agent/file/${fileId}`, {
      headers: {
        "x-user-id": userId,
      },
    });

    console.log("Delete Response:", data);

    return data;
  } catch (error) {
    console.error("DeleteFileRAG Error:", error.response?.data || error.message);
    throw error;
  }
};