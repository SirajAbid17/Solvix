import api from "../utlis/axios";

export const createCustomAgent = async (data) => {
  try {
    const payload = {
      ...data,
      tools:
        Array.isArray(data?.tools) && data.tools.length > 0
          ? data.tools
          : ["chat"],
    };

    const { data: res } = await api.post("/agent/custom-agents", payload);
    
    return res;
  } catch (error) {
    console.error(
      "createCustomAgent Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const getCustomAgents = async ({
  category,
  search,
  page = 1,
  limit = 100,
} = {}) => {
  try {
    const params = new URLSearchParams();
    if (category && category !== "all") params.append("category", category);
    if (search && search.trim()) params.append("search", search.trim());
    params.append("page", page);
    params.append("limit", limit);

    const { data } = await api.get(
      `/agent/custom-agents?${params.toString()}`
    );
    

    if (data?.success && Array.isArray(data.agents)) {
      data.agents = data.agents.map((a) => ({
        ...a,
        tools:
          Array.isArray(a.tools) && a.tools.length > 0 ? a.tools : ["chat"],
      }));
    }

    return data;
  } catch (error) {
    console.error(
      "getCustomAgents Error:",
      error.response?.data || error.message
    );
    return { success: false, agents: [], total: 0 };
  }
};


export const getCustomAgent = async (id) => {
  try {
    const { data } = await api.get(`/agent/custom-agents/${id}`);
    return data;
  } catch (error) {
    console.error(
      "getCustomAgent Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateCustomAgent = async (id, updates) => {
  try {
    const payload = {
      ...updates,
      tools:
        Array.isArray(updates?.tools) && updates.tools.length > 0
          ? updates.tools
          : ["chat"],
    };

    const { data } = await api.put(`/agent/custom-agents/${id}`, payload);
    console.log("updateCustomAgent:", data);
    return data;
  } catch (error) {
    console.error(
      "updateCustomAgent Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteCustomAgent = async (id) => {
  try {
    const { data } = await api.delete(`/agent/custom-agents/${id}`);
    console.log("deleteCustomAgent:", data);
    return data;
  } catch (error) {
    console.error(
      "deleteCustomAgent Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const chatWithCustomAgent = async (
  id,
  prompt,
  conversationId,
  history = [],
  forceTool = null,
  attachedFile = null
) => {
  try {
    const payload = {
      prompt,
      conversationId,
      messages: history,
      forceTool: forceTool || null,
      fileId: attachedFile?.fileId || null,
      fileContext:
        attachedFile?.fullText || attachedFile?.textPreview || null,
      fileName: attachedFile?.fileName || null,
      fileType: attachedFile?.fileType || null,
      imageBase64: attachedFile?.imageBase64 || null,
      imageMimeType: attachedFile?.imageMimeType || null,
    };

    console.log("chatWithCustomAgent payload:", {
      prompt: prompt?.slice(0, 60),
      forceTool,
      hasFile: !!attachedFile,
      fileName: attachedFile?.fileName,
      fileContextLen: payload.fileContext?.length || 0,
    });

    const { data } = await api.post(
      `/agent/custom-agents/${id}/chat`,
      payload,
      { timeout: 180000 }
    );

    console.log("chatWithCustomAgent response:", {
      success: data?.success,
      hasResponse: !!data?.response,
      responseLen: data?.response?.length || 0,
      hasPdf: data?.pdfGenerated,
      pdfUrl: data?.pdfUrl || null,
      pdfBase64Len: data?.pdfBase64?.length || data?.pdf?.length || 0,
      hasPpt: data?.pptGenerated,
      pptUrl: data?.pptUrl || null,
      pptBase64Len: data?.pptBase64?.length || data?.ppt?.length || 0,
      imagesCount: Array.isArray(data?.images) ? data.images.length : 0,
      toolExecuted: data?.toolExecuted || null,
    });

    const normalized = {
      success: data?.success === true,
      response: data?.response || "",

      
      pdfGenerated: data?.pdfGenerated === true,
      pdfUrl: data?.pdfUrl || null,
      pdfBase64: data?.pdfBase64 || null,
      pdf: data?.pdf || null,

     
      pptGenerated: data?.pptGenerated === true,
      pptUrl: data?.pptUrl || null,
      pptBase64: data?.pptBase64 || null,
      ppt: data?.ppt || null,
      pptFileName: data?.pptFileName || "solvix-presentation.pptx",
      pptData: data?.pptData || null,

     
      images: Array.isArray(data?.images) ? data.images : [],

     
      toolExecuted: data?.toolExecuted || null,
      model: data?.model || null,
      temperature: data?.temperature || null,
      tools: Array.isArray(data?.tools) ? data.tools : ["chat"],
      agentId: data?.agentId || id,
      agentName: data?.agentName || null,
      conversationId: data?.conversationId || conversationId,
      creditsRemaining: data?.creditsRemaining || null,
    };

    return normalized;
  } catch (error) {
    console.error(
      "chatWithCustomAgent Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const clearCustomAgentChat = async (id, conversationId) => {
  try {
    const { data } = await api.delete(
      `/agent/custom-agents/${id}/chat/${conversationId}`
    );
    return data;
  } catch (error) {
    console.error(
      "clearCustomAgentChat Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const getCustomAgentChatHistory = async (id, conversationId) => {
  try {
    const { data } = await api.get(
      `/agent/custom-agents/${id}/chat/${conversationId}`
    );
    

    if (data?.success && Array.isArray(data.messages)) {
      data.messages = data.messages.map((m) => ({
        ...m,
        pdfGenerated: m.pdfGenerated === true,
        pdfUrl: m.pdfUrl || null,
        pdfBase64: m.pdfBase64 || null,
        pdf: m.pdf || null,

        pptGenerated: m.pptGenerated === true,
        pptUrl: m.pptUrl || null,
        pptBase64: m.pptBase64 || null,
        ppt: m.ppt || null,
        pptFileName: m.pptFileName || "solvix-presentation.pptx",
        pptData: m.pptData || null,

        images: Array.isArray(m.images) ? m.images : [],
      }));
    }

    return data;
  } catch (error) {
    console.error(
      "getCustomAgentChatHistory Error:",
      error.response?.data || error.message
    );
    return { success: false, messages: [] };
  }
};