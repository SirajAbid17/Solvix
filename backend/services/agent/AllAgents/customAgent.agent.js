import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { buildConversationMemory } from "../utlis/Memory.js";

const GROQ_MODELS = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
];

const buildModel = (modelName, temperature = 0.7) => {
  const safeTemp = Math.min(1, Math.max(0, Number(temperature) || 0.7));

  if (GROQ_MODELS.includes(modelName)) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY not configured in .env");
    }
    return new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: modelName,
      temperature: safeTemp,
      maxTokens: 4096,
      modelKwargs: {
        tool_choice: "none",
        parallel_tool_calls: false,
      },
    });
  }

  if (String(modelName).startsWith("gemini-")) {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY not configured in .env");
    }
    return new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: modelName,
      temperature: safeTemp,
      maxOutputTokens: 8192,
    });
  }

  throw new Error(`Unsupported model: ${modelName}`);
};

const normaliseContent = (content) => {
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part?.text) return part.text;
        return "";
      })
      .join("");
  }
  return String(content || "");
};

const ANTI_TOOL_GUARD = `##  HARD RULE 

You are a plain-text chat assistant. You do NOT have tool-calling API access.

-  NEVER output JSON like {"name": "web_search", "arguments": {...}}
-  NEVER output tool_call, function_call, tool_use objects
-  Use markers only: [NEEDS_SEARCH], [CREATE_PDF], [CREATE_PPT], [CREATE_IMAGE]
-  Otherwise reply in plain markdown text

---

`;

const buildToolsInstructions = (tools = []) => {
  if (!Array.isArray(tools) || tools.length === 0) {
    return "## Tools:\n- None (plain chat only)";
  }

  const lines = ["## Tools & Capabilities:"];

  if (tools.includes("chat")) lines.push("-  Chat: normal reply.");
  if (tools.includes("search"))
    lines.push("-  Search: `[NEEDS_SEARCH] <query>`");
  if (tools.includes("coding")) lines.push("-  Coding: fenced code blocks.");
  if (tools.includes("pdf")) lines.push("-  PDF: `[CREATE_PDF] <topic>`");
  if (tools.includes("ppt")) lines.push("- PPT: `[CREATE_PPT] <topic>`");
  if (tools.includes("image"))
    lines.push("-  Image: `[CREATE_IMAGE] <prompt>`");
  if (tools.includes("file"))
    lines.push("-  File: analyze attached file content.");
  if (tools.includes("rag"))
    lines.push("-  Doc Q&A: answer from uploaded documents.");

  lines.push(
    "\n## Marker Rules:",
    "- One marker per line.",
    "- Never show markers to user.",
    "- Never wrap in JSON.",
  );

  return lines.join("\n");
};

const detectToolCalls = (text) => {
  const t = String(text || "").trim();
  return {
    search: /\[NEEDS_SEARCH\]/i.test(t),
    pdf: /\[CREATE_PDF\]/i.test(t),
    ppt: /\[CREATE_PPT\]/i.test(t),
    image: /\[CREATE_IMAGE\]/i.test(t),
  };
};

const extractMarkerPayload = (text, marker) => {
  return String(text || "")
    .replace(new RegExp(`^${marker}`, "i"), "")
    .trim();
};

const invokeLLM = async (model, messages) => {
  try {
    return await model.invoke(messages);
  } catch (err) {
    const msg = String(err?.message || "");

    if (
      msg.includes("Tool choice is none") ||
      msg.includes("tool_use_failed") ||
      msg.includes("model called a tool")
    ) {
      console.warn(
        " Groq rejected fake tool call — retrying with stricter prompt",
      );

      const cleaned = messages.map((m) => {
        if (m.role === "assistant") {
          return {
            ...m,
            content: String(m.content || "")
              .replace(/\{[\s\S]*\}/g, "")
              .trim(),
          };
        }
        return m;
      });

      cleaned.push({
        role: "system",
        content:
          "REMINDER: Do NOT output JSON, tool_call, or {…} objects. Only plain text or [MARKER] lines.",
      });

      return await model.invoke(cleaned);
    }

    const isRateLimit =
      msg.includes("429") ||
      msg.toLowerCase().includes("rate limit") ||
      msg.toLowerCase().includes("quota");

    if (isRateLimit) {
      console.warn("Rate limit hit, retrying in 4s...");
      await new Promise((r) => setTimeout(r, 4000));
      return await model.invoke(messages);
    }

    throw err;
  }
};

export const CustomAgentNode = async (state) => {
  try {
    const agent = state.customAgent;

    if (!agent) {
      return { ...state, aiResponse: "Custom agent not provided." };
    }

    const model = buildModel(agent.model, agent.temperature);
    const conversationHistory = buildConversationMemory(state.messages || []);
    const enabledTools =
      Array.isArray(agent.tools) && agent.tools.length > 0
        ? agent.tools
        : ["chat"];
    const toolsInstructions = buildToolsInstructions(enabledTools);

    const finalSystemPrompt = `${ANTI_TOOL_GUARD}${agent.systemPrompt}\n\n${toolsInstructions}\n`;

    let messages = [
      { role: "system", content: finalSystemPrompt },
      ...conversationHistory,
      { role: "user", content: state.prompt },
    ];

    const hasFileContext =
      state.fileContext && String(state.fileContext).trim().length > 0;
    const hasFileId = !!state.fileId;

    if (hasFileContext || hasFileId) {
      console.log("📎 CustomAgent: file context detected", {
        fileId: state.fileId || "none",
        fileName: state.fileName || "none",
        contextLen: state.fileContext?.length || 0,
        forceTool: state.forceTool || "none",
      });

      if (hasFileId) {
        try {
          const { queryRAG } = await import("../utlis/ragStore.js");
          const ragResult = await queryRAG({
            userId: state.userId,
            query: state.prompt,
            fileId: state.fileId,
            topK: 6,
          });

          const matches = ragResult?.matches || [];
          console.log(`RAG returned ${matches.length} matches`);

          if (matches.length > 0) {
            const context = matches
              .map(
                (m, i) =>
                  `[Source ${i + 1}: ${m.fileName || state.fileName || "file"}]\n${m.text}`,
              )
              .join("\n\n---\n\n");

            const ragMessages = [
              {
                role: "system",
                content: `You are Solvix AI, an expert document assistant.

The user uploaded a file and is asking about it.

## File: ${state.fileName || "uploaded file"}

## Retrieved Context:
${context}

## Rules:
1. Answer ONLY from the context above.
2. If answer isn't in context, say "I couldn't find that in the file."
3. Cite sources like [Source 1].
4. Use markdown formatting.
5. Never hallucinate.`,
              },
              { role: "user", content: state.prompt },
            ];

            const ragResponse = await invokeLLM(model, ragMessages);
            const ragAnswer =
              normaliseContent(ragResponse?.content).trim() ||
              "I couldn't find that in the file.";

            return {
              ...state,
              aiResponse: ragAnswer,
              customAgentModel: agent.model,
              customAgentTemperature: agent.temperature,
              customAgentTools: enabledTools,
              toolExecuted: "rag",
              ragUsed: true,
              ragSources: matches.map((m) => ({
                fileName: m.fileName,
                score: m.score,
              })),
            };
          }
        } catch (ragErr) {
          console.warn(
            "RAG query failed, falling back to fileContext:",
            ragErr.message,
          );
        }
      }

      if (hasFileContext) {
        console.log(" Using full fileContext (not RAG)");

        const truncated =
          state.fileContext.length > 25000
            ? state.fileContext.slice(0, 25000) + "\n\n[...truncated]"
            : state.fileContext;

        const fileMessages = [
          {
            role: "system",
            content: `You are Solvix AI, an expert document analyst.

The user uploaded a file: **${state.fileName || "uploaded file"}**
File type: ${state.fileType || "unknown"}
Content length: ${state.fileContext.length} characters

## File Content:
${truncated}

## Rules:
1. Answer using ONLY the file content above.
2. If not in file, say so.
3. Use markdown.
4. Cite specific parts.
5. Never invent details.`,
          },
          { role: "user", content: state.prompt },
        ];

        const fileResponse = await invokeLLM(model, fileMessages);
        const fileAnswer =
          normaliseContent(fileResponse?.content).trim() ||
          "I couldn't find that in the file.";

        return {
          ...state,
          aiResponse: fileAnswer,
          customAgentModel: agent.model,
          customAgentTemperature: agent.temperature,
          customAgentTools: enabledTools,
          toolExecuted: "file",
        };
      }
    }

    let response = await invokeLLM(model, messages);
    let aiResponse = normaliseContent(response?.content).trim();

    if (!aiResponse) {
      aiResponse = "Sorry, I couldn't generate a response. Please try again.";
    }

    console.log(" CustomAgent raw response:", aiResponse.slice(0, 200));

    aiResponse = aiResponse
      .replace(/^\s*\{[\s\S]*"name"\s*:\s*"[^"]+"[\s\S]*\}\s*$/g, "")
      .trim();

    if (!aiResponse) {
      aiResponse = "Please ask again — I'll respond in plain text.";
    }

    const toolCalls = detectToolCalls(aiResponse);

    if (toolCalls.search && enabledTools.includes("search")) {
      const searchQuery =
        extractMarkerPayload(aiResponse, "\\[NEEDS_SEARCH\\]") || state.prompt;

      console.log(" CustomAgent executing web search:", searchQuery);

      try {
        const { tavilySearch } = await import("../config/websearchTavily.js");
        const searchRes = await tavilySearch.invoke({ query: searchQuery });

        const results = searchRes?.results || searchRes?.data || [];
        const images = searchRes?.images || searchRes?.Images || [];

        if (results.length > 0) {
          const searchContext = results
            .slice(0, 5)
            .map(
              (r, i) =>
                `${i + 1}. **${r.title || "Result"}**\n   URL: ${
                  r.url || "N/A"
                }\n   ${(r.content || r.snippet || "").slice(0, 500)}`,
            )
            .join("\n\n");

          messages = [
            ...messages,
            { role: "assistant", content: aiResponse },
            {
              role: "user",
              content: `Real web search results for "${searchQuery}":\n\n${searchContext}\n\nNow answer the user's original question. Use markdown, cite URLs. No JSON.`,
            },
          ];

          const secondResponse = await invokeLLM(model, messages);
          aiResponse = normaliseContent(secondResponse?.content).trim();

          return {
            ...state,
            aiResponse,
            images: images.length > 0 ? images : state.images || [],
            customAgentModel: agent.model,
            customAgentTemperature: agent.temperature,
            customAgentTools: enabledTools,
            toolExecuted: "search",
          };
        } else {
          aiResponse = `Mujhe live search mein "${searchQuery}" ke liye koi result nahi mila.`;
        }
      } catch (searchErr) {
        console.error("CustomAgent search error:", searchErr.message);
        aiResponse = `Web search execute nahi ho saka: **${searchErr.message}**`;
      }
    }

    if (toolCalls.pdf && enabledTools.includes("pdf")) {
      const topic =
        extractMarkerPayload(aiResponse, "\\[CREATE_PDF\\]") || state.prompt;
      console.log(" CustomAgent generating PDF for:", topic);

      try {
        const { PdfAgent } = await import("../AllAgents/pdf.agent.js");
        const pdfResult = await PdfAgent({
          prompt: topic,
          userId: state.userId,
          messages: state.messages || [],
        });

        return {
          ...state,
          aiResponse: pdfResult?.aiResponse || `PDF generate ho gaya: ${topic}`,
          pdfGenerated: pdfResult?.pdfGenerated || false,
          pdfUrl: pdfResult?.pdfUrl || null,
          pdfBase64: pdfResult?.pdfBase64 || null,
          pdfBuffer: pdfResult?.pdfBuffer || null,
          document: pdfResult?.document || null,
          customAgentModel: agent.model,
          customAgentTemperature: agent.temperature,
          customAgentTools: enabledTools,
          toolExecuted: "pdf",
        };
      } catch (pdfErr) {
        console.error("CustomAgent PDF error:", pdfErr.message);
        aiResponse = `PDF generate nahi ho saka: **${pdfErr.message}**`;
      }
    }

    if (toolCalls.ppt && enabledTools.includes("ppt")) {
      const topic =
        extractMarkerPayload(aiResponse, "\\[CREATE_PPT\\]") || state.prompt;
      console.log(" CustomAgent generating PPT for:", topic);

      try {
        const { pptAgent } = await import("../AllAgents/ppt.agent.js");
        const pptResult = await pptAgent({
          prompt: topic,
          userId: state.userId,
          messages: state.messages || [],
        });

        return {
          ...state,
          aiResponse: pptResult?.aiResponse || `PPT generate ho gaya: ${topic}`,
          pptGenerated: pptResult?.pptGenerated || false,
          pptUrl: pptResult?.pptUrl || null,
          pptBase64: pptResult?.pptBase64 || null,
          pptBuffer: pptResult?.pptBuffer || null,
          pptFileName: pptResult?.pptFileName || "solvix-presentation.pptx",
          pptData: pptResult?.pptData || null,
          ppt: pptResult?.ppt || null,
          customAgentModel: agent.model,
          customAgentTemperature: agent.temperature,
          customAgentTools: enabledTools,
          toolExecuted: "ppt",
        };
      } catch (pptErr) {
        console.error("CustomAgent PPT error:", pptErr.message);
        aiResponse = `PPT generate nahi ho saka: **${pptErr.message}**`;
      }
    }

    if (toolCalls.image && enabledTools.includes("image")) {
      const imagePrompt =
        extractMarkerPayload(aiResponse, "\\[CREATE_IMAGE\\]") || state.prompt;
      console.log(" CustomAgent generating image for:", imagePrompt);

      try {
        const { ImageAgent } = await import("../AllAgents/image.agent.js");
        const imgResult = await ImageAgent({
          prompt: imagePrompt,
          userId: state.userId,
        });

        return {
          ...state,
          aiResponse:
            imgResult?.aiResponse || `Image generate ho gayi: ${imagePrompt}`,
          images: imgResult?.images || [],
          customAgentModel: agent.model,
          customAgentTemperature: agent.temperature,
          customAgentTools: enabledTools,
          toolExecuted: "image",
        };
      } catch (imgErr) {
        console.error("CustomAgent Image error:", imgErr.message);
        aiResponse = `Image generate nahi ho saki: **${imgErr.message}**`;
      }
    }

    return {
      ...state,
      aiResponse,
      customAgentModel: agent.model,
      customAgentTemperature: agent.temperature,
      customAgentTools: enabledTools,
    };
  } catch (error) {
    console.error("CustomAgentNode error:", error);
    return {
      ...state,
      aiResponse: `Sorry, I couldn't process your request. ${
        error.message?.includes("API")
          ? "Please check API key."
          : "Please try again."
      }`,
    };
  }
};
