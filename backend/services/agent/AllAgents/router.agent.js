import { GetModels } from "../config/aimodels.js";

export const routerAgent = async (state) => {
  const prompt = String(state.prompt || "").trim();
  const hasImage = !!state.imageBase64;
  const hasFileContext = !!(state.fileContext && state.fileContext.trim());
  const hasFileId = !!state.fileId;

  console.log("Router detection:", {
    hasImage,
    hasFileContext,
    hasFileId,
    selectedAgent: state.agent,
    prompt: prompt.slice(0, 80),
  });

  
  if (hasImage) {
    console.log("Image detected → forcing 'file' agent (vision)");
    return { ...state, agent: "file" };
  }

 
  if (hasFileContext || hasFileId) {
    console.log("File context detected → forcing 'file' agent");
    return { ...state, agent: "file" };
  }

  
  if (
    state.agent &&
    state.agent !== "Auto" &&
    state.agent !== "auto" &&
    state.agent !== "chat"
  ) {
    console.log(` User selected agent: ${state.agent}`);
    return { ...state, agent: state.agent };
  }


  const llm = await GetModels("router");

  const routerPrompt = `You are a Router Agent. Analyze the user's query and route to the most appropriate agent.

Available agents:
1. chat - General conversation, casual questions, general knowledge
2. search - Web search for current/up-to-date info
3. coding - Programming, debugging, coding
4. pdf - PDF creation (creates NEW file)
5. ppt - PowerPoint creation (creates NEW file)
6. image - Image generation
7. resume - Resume creation/analysis

User Query: ${prompt}

Return ONLY ONE WORD from this list: chat, search, coding, pdf, ppt, image, resume
No explanation. Just the word.`;

  try {
    const response = await llm.invoke(routerPrompt);
    const raw = (response?.content || "").toString();
    const choice = raw
      .trim()
      .toLowerCase()
      .split(/\s+/)[0]
      .replace(/[^a-z]/g, "");

    const valid = [
      "chat",
      "search",
      "coding",
      "pdf",
      "ppt",
      "image",
      "resume",
    ];
    const finalAgent = valid.includes(choice) ? choice : "chat";

    console.log(` Router LLM: "${raw.slice(0, 40)}" → ${finalAgent}`);
    return { ...state, agent: finalAgent };
  } catch (error) {
    console.error(" Router LLM failed:", error.message);
    return { ...state, agent: "chat" };
  }
};