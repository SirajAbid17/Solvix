
import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";


const groqmodel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-20b",
  temperature: 0.3,
});


const googlemodel = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-3.8-flash",
  temperature: 0.4,
  maxOutputTokens: 8192,
});

export const GetModels = async (agent) => {
  switch (agent) {
    case "chat":
      return groqmodel;
    case "search":
      return groqmodel;
    case "router":
      return groqmodel;
    case "image":
      return groqmodel;

    case "coding":
      return googlemodel;
    case "pdf":
      return googlemodel;
    case "ppt":
      return googlemodel;

    default:
      return groqmodel;
  }
};