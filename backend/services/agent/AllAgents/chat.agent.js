import { Getmodels } from "../config/aimodels.js";
export const ChatAgent=async (state)=>{ 
const llm=await Getmodels("chat")
const prompt=`
you are a solvix agent that can help user to find the answer of their question from the given context.
You are given a context and a question. Your task is to provide a concise and accurate answer based on the information in the context. If the answer is not present in the context, respond with "I don't know."`
const resposne=await llm.invoke([
    {role:"system",content:prompt},
    {role:"user",content:state.prompt}
])
return {
    ...state,
    aiResponse:resposne.content
} 
}