import { Annotation } from "@langchain/langgraph";

export const agentState = Annotation.Root({
  prompt: Annotation({ default: () => "" }),
  aiResponse: Annotation({ default: () => "" }),
  agent: Annotation({ default: () => "" }),
  messages: Annotation({ default: () => [] }),
  conversationId: Annotation({ default: () => null }),
  userId: Annotation({ default: () => null }),

  searchResults: Annotation({ default: () => [] }),
  images: Annotation({ default: () => [] }),


  fileId: Annotation({ default: () => null }),
  fileContext: Annotation({ default: () => "" }),
  fileMetadata: Annotation({ default: () => null }),
  ragUsed: Annotation({ default: () => false }),
  ragSources: Annotation({ default: () => [] }),


  imageBase64: Annotation({ default: () => null }),
  imageMimeType: Annotation({ default: () => null }),
  imageFileName: Annotation({ default: () => null }),
  imageContext: Annotation({ default: () => null }),

 
  pdfBuffer: Annotation({ default: () => null }),
  pdfGenerated: Annotation({ default: () => false }),
  document: Annotation({ default: () => null }),
  isPartialData: Annotation({ default: () => false }),
  pdfUrl: Annotation({ default: () => null }),
  pdfBase64: Annotation({ default: () => null }),


  ppt: Annotation({ default: () => null }),
  pptBuffer: Annotation({ default: () => null }),
  pptGenerated: Annotation({ default: () => false }),
  pptFileName: Annotation({ default: () => null }),
  pptData: Annotation({ default: () => null }),
  pptUrl: Annotation({ default: () => null }),
  pptBase64: Annotation({ default: () => null }),
});