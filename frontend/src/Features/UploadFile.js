import api from "../utlis/axios";

export const UploadFile = async (file, userId) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post("/agent/file/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-user-id": userId,
      },
      timeout: 120000, 
    });

    console.log("Upload Response:", data);

    return data;
  } catch (error) {
    console.error("Upload Error:", error.response?.data || error.message);
    throw error;
  }
};