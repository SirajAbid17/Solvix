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

  // ✅ PDF FIELDS
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

  pdfUrl: Annotation({
    default: () => null,
  }),

  pdfBase64: Annotation({
    default: () => null,
  }),

  // ✅ PPT FIELDS
  ppt: Annotation({
    default: () => null,
  }),

  pptBuffer: Annotation({
    default: () => null,
  }),

  pptGenerated: Annotation({
    default: () => false,
  }),

  pptFileName: Annotation({
    default: () => null,
  }),

  pptData: Annotation({
    default: () => null,
  }),

  pptUrl: Annotation({
    default: () => null,
  }),

  pptBase64: Annotation({
    default: () => null,
  }),
});