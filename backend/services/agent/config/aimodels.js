import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const groqmodel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY, 
  model: "openai/gpt-oss-20b",
});

const googlemodel = new ChatGoogleGenerativeAI({
  model: "gemini-3.6-flash",
});
const pdfModel = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  temperature: 0.3, // Lower temperature for consistent JSON
});
export const GetModels=async(agent)=>{
switch(agent){
  case "chat":
    return groqmodel;
  case "search":
    return groqmodel;  
  case "coding":
    return googlemodel;
    
  default:
    return groqmodel;  
}
}