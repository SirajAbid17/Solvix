import { END, START, StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { routerAgent } from "./Routeragent.js";
import { SearchAgent } from "../AllAgents/search.agent.js";
import { CodingAgent } from "../AllAgents/coding.agent.js";
import { PdfAgent } from "../AllAgents/pdf.agent.js";
import { pptAgent } from "../AllAgents/ppt.agent.js";
import { ImageAgent } from "../AllAgents/image.agent.js";
import { ResumeAgent } from "../AllAgents/resume.agent.js";
import { ChatAgent } from "../AllAgents/chat.agent.js";
const workflow = new StateGraph(agentState);

workflow.addNode("router", routerAgent);
workflow.addNode("chat", ChatAgent);
workflow.addNode("search", SearchAgent);
workflow.addNode("coding", CodingAgent);
workflow.addNode("pdf", PdfAgent);
workflow.addNode("ppt", pptAgent);
workflow.addNode("image", ImageAgent);
workflow.addNode("resume", ResumeAgent);

workflow.addEdge(START, "router");
workflow.addConditionalEdges(
  "router",
  (state) => {
    switch (state.agent) {
      case "chat":
        return "chat";
      case "search":
        return "search";
      case "coding":
        return "coding";
      case "pdf":
        return "pdf";
      case "ppt":
        return "ppt";
      case "image":
        return "image";
      case "resume":
        return "resume";
      default:
        return "chat";
    }
  },
  {
    chat: "chat",
    search: "search",
    coding: "coding",
    pdf: "pdf",
    ppt: "ppt",
    image: "image",
    resume: "resume",
  },
);

workflow.addEdge("search", "chat");
workflow.addEdge("chat", END);
workflow.addEdge("coding", END);
workflow.addEdge("pdf", END);
workflow.addEdge("ppt", END);
workflow.addEdge("image", END);
workflow.addEdge("resume", END);

export const graph = workflow.compile();
