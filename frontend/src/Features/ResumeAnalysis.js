import api from "../utlis/axios";

export const uploadResume = async (formData) => {
  const { data } = await api.post("/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const getMyResumes = async () => {
  const { data } = await api.get("/resume/my-resumes");
  return data;
};