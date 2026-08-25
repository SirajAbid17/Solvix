import { Annotation } from "@langchain/langgraph";

export const agentState = Annotation.Root({
  prompt: Annotation({
    default: () => "",
  }),

  aiResponse: Annotation({
    default: () => "",
  }),

  agent: Annotation({
    default: () => "",
  }),

  messages: Annotation({
    default: () => [],
  }),

  conversationId: Annotation({
    default: () => null,
  }),

  searchResults: Annotation({
    default: () => [],
  }),

  images: Annotation({
    default: () => [],
  }),

  // ✅ ADD PDF FIELDS
  pdfBuffer: Annotation({
    default: () => null,
  }),

  pdfGenerated: Annotation({
    default: () => false,
  }),

  document: Annotation({
    default: () => null,
  }),

  isPartialData: Annotation({
    default: () => false,
  }),
});