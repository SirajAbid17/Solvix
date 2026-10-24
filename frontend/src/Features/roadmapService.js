import api from "../utlis/axios";

export const generateRoadmap = async ({ topic, level }) => {
  const { data } = await api.post("/agent/roadmap/generate", { topic, level }, { timeout: 120000 });
  return data;
};

export const getRoadmap = async (topic) => {
  const { data } = await api.get("/agent/roadmap", { params: { topic } });
  return data;
};

export const toggleTask = async ({ roadmapId, taskKey, completed }) => {
  const { data } = await api.post("/agent/roadmap/toggle-task", { roadmapId, taskKey, completed });
  return data;
};