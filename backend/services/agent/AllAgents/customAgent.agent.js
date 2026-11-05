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

export const CustomAgentNode = async (state) => {
  try {
    const agent = state.customAgent;

    if (!agent) {
      return {
        ...state,
        aiResponse: "Custom agent not provided.",
      };
    }

    const model = buildModel(agent.model, agent.temperature);

    const conversationHistory = buildConversationMemory(state.messages || []);

    const messages = [
      { role: "system", content: agent.systemPrompt },
      ...conversationHistory,
      { role: "user", content: state.prompt },
    ];

    let response;

    try {
      response = await model.invoke(messages);
    } catch (err) {
      const msg = String(err?.message || "");
      const isRateLimit =
        msg.includes("429") ||
        msg.toLowerCase().includes("rate limit") ||
        msg.toLowerCase().includes("quota");

      if (isRateLimit) {
        console.warn("Rate limit hit, retrying in 3s...");
        await new Promise((r) => setTimeout(r, 3000));
        response = await model.invoke(messages);
      } else {
        throw err;
      }
    }

    let aiResponse = normaliseContent(response?.content).trim();

    if (!aiResponse) {
      aiResponse = "Sorry, I couldn't generate a response. Please try again.";
    }

    return {
      ...state,
      aiResponse,
      customAgentModel: agent.model,
      customAgentTemperature: agent.temperature,
    };
  } catch (error) {
    console.error("CustomAgentNode error:", error);
    return {
      ...state,
      aiResponse: `Sorry, I couldn't process your request. ${
        error.message?.includes("API") ? "Please check API key." : "Please try again."
      }`,
    };
  }
};