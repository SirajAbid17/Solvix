import { END, START, StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";

import { routerAgent } from "../AllAgents/router.agent.js";
import { SearchAgent } from "../AllAgents/search.agent.js";
import { CodingAgent } from "../AllAgents/coding.agent.js";
import { PdfAgent } from "../AllAgents/pdf.agent.js";
import { pptAgent } from "../AllAgents/ppt.agent.js";
import { ImageAgent } from "../AllAgents/image.agent.js";
import { ChatAgent } from "../AllAgents/chat.agent.js";
import { RagAgent } from "../AllAgents/rag.agent.js";
import { FileAgent } from "../AllAgents/file.agent.js";

const workflow = new StateGraph(agentState);


workflow.addNode("router", routerAgent);
workflow.addNode("chat", ChatAgent);
workflow.addNode("search", SearchAgent);
workflow.addNode("coding", CodingAgent);
workflow.addNode("pdf", PdfAgent);
workflow.addNode("pptGenerator", pptAgent);
workflow.addNode("image", ImageAgent);
workflow.addNode("rag", RagAgent);
workflow.addNode("file", FileAgent);


workflow.addEdge(START, "router");


workflow.addConditionalEdges(
  "router",
  (state) => {
    const agent = state.agent || "chat";
    console.log(" Graph routing to:", agent);

    switch (agent) {
      case "chat":
        return "chat";
      case "search":
        return "search";
      case "coding":
        return "coding";
      case "pdf":
        return "pdf";
      case "ppt":
        return "pptGenerator";
      case "image":
        return "image";
      case "rag":
        return "rag";
      case "file":
        return "file";
      default:
        return "chat";
    }
  },
  {
    chat: "chat",
    search: "search",
    coding: "coding",
    pdf: "pdf",
    pptGenerator: "pptGenerator",
    image: "image",
    rag: "rag",
    file: "file",
  }
);


workflow.addEdge("chat", END);
workflow.addEdge("coding", END);
workflow.addEdge("pdf", END);
workflow.addEdge("pptGenerator", END);
workflow.addEdge("image", END);
workflow.addEdge("rag", END);
workflow.addEdge("file", END);

workflow.addEdge("search", "chat");

export const graph = workflow.compile();