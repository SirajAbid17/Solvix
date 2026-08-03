import { GetModels } from "../config/aimodels.js";
export const routerAgent=async (state)=>{
 const llm=await GetModels("router")
 const prompt = ` You are a Router Agent. Your job is to analyze the user's query and route it to the most appropriate agent.
  Available agents: 
  1. chat - Handles general conversation, casual questions, and general knowledge.
2. search - Performs web searches and retrieves current or up-to-date information. 
3. coding - Handles programming, debugging, and coding-related questions. 
4. pdf - Handles PDF creation, reading, analysis, and document-related tasks. 5. ppt - Handles PowerPoint presentation creation and related tasks. 
6. image - Handles image generation, editing, and image-related tasks. 
7. resume - Handles resume creation, analysis, optimization, and career-related tasks. 

rules:
chat: If the user query is casual, conversational, or general knowledge-related, route to the chat agent.

search: If the user query requires up-to-date information, web search, or current events, route to the search agent.

pdf: If the user query is related to PDF creation, reading, analysis, or document-related tasks, route to the pdf agent.

ppt: If the user query is related to PowerPoint presentation creation or related tasks, route to the ppt agent.

image: If the user query is related to image generation, editing, or image-related tasks, route to the image agent.

resume: If the user query is related to resume creation, analysis, optimization, or career-related tasks, route to the resume agent.

coding: If the user query is related to programming, coding, or debugging, route to the coding agent.

return only one word:

chat, search, coding, pdf, ppt, image, resume

User Query: ${state.prompt} Return ONLY one of these exact agent names: chat search coding pdf ppt image resume Do not provide any explanation or additional text.`;
 
const response=await llm.invoke(prompt)
console.log(response)

return {
    ...state,
    agent:response.content.trim().toLowerCase()
}

}