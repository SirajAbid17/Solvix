
import { GetModels } from "../config/aimodels.js";
import { buildConversationMemory } from "../utlis/Memory.js";

export const ChatAgent = async (state) => {
  try {
    const llm = await GetModels("chat");

    let webSearchContext = "";
    if (state.searchResults && state.searchResults.length > 0) {
      webSearchContext = `
### Web Search Results:
${state.searchResults
  .map(
    (result, index) => `
${index + 1}. ${result.title || "Result"}
   - Source: ${result.url || "N/A"}
   - Content: ${result.content || result.snippet || ""}
`
  )
  .join("\n")}
`;
    }

    const systemPrompt = `
You are Solvix AI, a helpful, friendly, intelligent AI assistant.

${webSearchContext ? `## Web Search Context:\n${webSearchContext}\n` : ""}

## Style:
- Friendly, natural, professional
- Answer directly and concisely
- Use Markdown formatting
- Use code blocks for programming
- Never hallucinate
`;

    const conversationHistory = buildConversationMemory(state.messages || []);

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: state.prompt },
    ];

    const response = await llm.invoke(messages);

    
    let aiResponse = response?.content;

    if (Array.isArray(aiResponse)) {
      aiResponse = aiResponse
        .map((i) => (typeof i === "string" ? i : i?.text || ""))
        .join("");
    }

    aiResponse = String(aiResponse || "").trim();

    if (!aiResponse) {
      aiResponse = "Sorry, I couldn't generate a response. Please try again.";
    }

    return {
      ...state,
      aiResponse,
      ragUsed: false,
      ragSources: [],
    };
  } catch (error) {
    console.error("ChatAgent error:", error);
    return {
      ...state,
      aiResponse: "Sorry, I couldn't process your request. Please try again.",
    };
  }
};