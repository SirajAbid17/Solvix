import { END, START, StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { routerAgent } from "./Routeragent.js";
import { SearchAgent } from "../AllAgents/search.agent.js";
import { CodingAgent } from "../AllAgents/coding.agent.js";
import { PdfAgent } from "../AllAgents/pdf.agent.js";
import { pptAgent } from "../AllAgents/ppt.agent.js";
import { ImageAgent } from "../AllAgents/image.agent.js";
import { ChatAgent } from "../AllAgents/chat.agent.js";

const workflow = new StateGraph(agentState);


workflow.addNode("router", routerAgent);
workflow.addNode("chat", ChatAgent);
workflow.addNode("search", SearchAgent);
workflow.addNode("coding", CodingAgent);
workflow.addNode("pdf", PdfAgent);

workflow.addNode("pptGenerator", pptAgent);
workflow.addNode("image", ImageAgent);

workflow.addEdge(START, "router");

workflow.addConditionalEdges(
  "router",
  (state) => {
    console.log("Router selected agent:", state.agent);
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
        return "pptGenerator";
      case "image":
        return "image";
      default:
        return "chat";
    }
  }
);


workflow.addEdge("search", "chat");
workflow.addEdge("chat", END);
workflow.addEdge("coding", END);
workflow.addEdge("pdf", END);
workflow.addEdge("pptGenerator", END);
workflow.addEdge("image", END);

export const graph = workflow.compile();