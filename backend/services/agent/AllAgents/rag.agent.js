import { GetModels } from "../config/aimodels.js";
import { queryRAG } from "../utlis/ragStore.js";

export const RagAgent = async (state) => {
  try {
    const llm = await GetModels("chat");
    const userId = state.userId;

    if (!userId) {
      return {
        ...state,
        aiResponse: "User authentication required for document Q&A.",
      };
    }

    const { matches } = await queryRAG({
      userId,
      query: state.prompt,
      fileId: state.fileId || null,
      topK: 6,
    });

    if (!matches || matches.length === 0) {
      const fallbackLLM = await GetModels("chat");
      const res = await fallbackLLM.invoke([
        {
          role: "system",
          content:
            "You are Solvix AI. The user asked a question about their file but no relevant content was found. Politely inform them.",
        },
        { role: "user", content: state.prompt },
      ]);

      let fallbackResponse = res?.content;
      if (Array.isArray(fallbackResponse)) {
        fallbackResponse = fallbackResponse
          .map((i) => (typeof i === "string" ? i : i?.text || ""))
          .join("");
      }

      return {
        ...state,
        aiResponse:
          String(fallbackResponse || "").trim() ||
          "I couldn't find that in your uploaded documents.",
        ragUsed: false,
      };
    }

    const context = matches
      .map((m, i) => `[Source ${i + 1}: ${m.fileName}]\n${m.text}`)
      .join("\n\n---\n\n");

    const systemPrompt = `You are Solvix AI, an expert document assistant.

The user has uploaded document(s) and is asking questions about them.

## Retrieved Context:
${context}

## Rules:
1. Answer ONLY based on the context above.
2. If the answer isn't in the context, say: "I couldn't find that in your uploaded documents."
3. Cite sources like [Source 1], [Source 2] when referencing.
4. Use markdown formatting for readability.
5. Be concise but thorough.
6. Never hallucinate information.`;

    const response = await llm.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: state.prompt },
    ]);

   
    let aiResponse = response?.content;

    if (Array.isArray(aiResponse)) {
      aiResponse = aiResponse
        .map((i) => (typeof i === "string" ? i : i?.text || ""))
        .join("");
    }

    aiResponse = String(aiResponse || "").trim();

    if (!aiResponse) {
      aiResponse = "I couldn't find that in your uploaded documents.";
    }

    return {
      ...state,
      aiResponse,
      ragUsed: true,
      ragSources: matches.map((m) => ({
        fileName: m.fileName,
        score: m.score,
      })),
    };
  } catch (error) {
    console.error("RagAgent error:", error);
    return {
      ...state,
      aiResponse: "Sorry, I couldn't search your documents. Please try again.",
    };
  }
};