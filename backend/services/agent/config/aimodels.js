import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const groqmodel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY, 
  model: "llama-3.3-70b-versatile",
});

const googlemodel = new ChatGoogleGenerativeAI({
  model: "gemini-3.6-flash",
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