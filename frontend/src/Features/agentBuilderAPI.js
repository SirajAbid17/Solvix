import api from "../utlis/axios";

export const createCustomAgent = async (data) => {
  try {
    const { data: res } = await api.post("/agent/custom-agents", data);
    console.log("createCustomAgent:", res);
    return res;
  } catch (error) {
    console.error("createCustomAgent Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getCustomAgents = async ({ category, search, page = 1, limit = 100 } = {}) => {
  try {
    const params = new URLSearchParams();
    if (category && category !== "all") params.append("category", category);
    if (search && search.trim()) params.append("search", search.trim());
    params.append("page", page);
    params.append("limit", limit);

    const { data } = await api.get(`/agent/custom-agents?${params.toString()}`);
    console.log("getCustomAgents:", data);
    return data;
  } catch (error) {
    console.error("getCustomAgents Error:", error.response?.data || error.message);
    return { success: false, agents: [], total: 0 };
  }
};


export const getCustomAgent = async (id) => {
  try {
    const { data } = await api.get(`/agent/custom-agents/${id}`);
    return data;
  } catch (error) {
    console.error("getCustomAgent Error:", error.response?.data || error.message);
    throw error;
  }
};


export const updateCustomAgent = async (id, updates) => {
  try {
    const { data } = await api.put(`/agent/custom-agents/${id}`, updates);
    console.log("updateCustomAgent:", data);
    return data;
  } catch (error) {
    console.error("updateCustomAgent Error:", error.response?.data || error.message);
    throw error;
  }
};


export const deleteCustomAgent = async (id) => {
  try {
    const { data } = await api.delete(`/agent/custom-agents/${id}`);
    console.log("deleteCustomAgent:", data);
    return data;
  } catch (error) {
    console.error("deleteCustomAgent Error:", error.response?.data || error.message);
    throw error;
  }
};


export const chatWithCustomAgent = async (id, prompt, conversationId, history = []) => {
  try {
    const { data } = await api.post(
      `/agent/custom-agents/${id}/chat`,
      { prompt, conversationId, messages: history },
      { timeout: 120000 }
    );
    console.log("chatWithCustomAgent:", data);
    return data;
  } catch (error) {
    console.error("chatWithCustomAgent Error:", error.response?.data || error.message);
    throw error;
  }
};


export const clearCustomAgentChat = async (id, conversationId) => {
  try {
    const { data } = await api.delete(`/agent/custom-agents/${id}/chat/${conversationId}`);
    return data;
  } catch (error) {
    console.error("clearCustomAgentChat Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getCustomAgentChatHistory = async (id, conversationId) => {
  try {
    const { data } = await api.get(
      `/agent/custom-agents/${id}/chat/${conversationId}`
    );
    console.log("getCustomAgentChatHistory:", data);
    return data;
  } catch (error) {
    console.error(
      "getCustomAgentChatHistory Error:",
      error.response?.data || error.message
    );
    return { success: false, messages: [] };
  }
};