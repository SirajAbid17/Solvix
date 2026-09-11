import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const groqmodel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY, 
  model: "openai/gpt-oss-20b",
});

const googlemodel = new ChatGoogleGenerativeAI({
  model: "gemini-3.6-flash",
   temperature: 0.4,
  maxOutputTokens: 8192,
});

export const GetModels = async (agent) => {
  switch (agent) {
    case "chat":
      return groqmodel;
    case "search":
      return groqmodel;
    case "coding":
      return googlemodel;
    case "pdf":                       // ✅ FIX — pdf ke liye Gemini
      return googlemodel;
    case "ppt":                       // ✅ FIX — ppt ke liye bhi Gemini
      return googlemodel;
    case "router":
      return groqmodel;
    case "image":
      return groqmodel;
    default:
      return groqmodel;
  }
};