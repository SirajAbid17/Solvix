import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
};

const messageSlice = createSlice({
  name: "message",
  initialState,

  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload.map((msg) => ({
        ...msg,
        images: Array.isArray(msg.images) ? msg.images : [],
        pdf: msg.pdf || null,
        pdfUrl: msg.pdfUrl || null,
        pdfGenerated: msg.pdfGenerated || false,
        ppt: msg.ppt || null,
        pptUrl: msg.pptUrl || null,
        pptGenerated: msg.pptGenerated || false,
        pptFileName: msg.pptFileName || "solvix-presentation.pptx",
        pptData: msg.pptData || null,
      
        attachedFile: msg.attachedFile || null,
        ragUsed: msg.ragUsed || false,
        ragSources: msg.ragSources || [],
      }));
    },

    addMessage: (state, action) => {
      const images = Array.isArray(action.payload.images)
        ? action.payload.images
        : [];

      const message = {
        ...action.payload,
        images: images,
        pdf: action.payload.pdf || null,
        pdfUrl: action.payload.pdfUrl || null,
        pdfGenerated: action.payload.pdfGenerated || false,
        ppt: action.payload.ppt || null,
        pptUrl: action.payload.pptUrl || null,
        pptGenerated: action.payload.pptGenerated || false,
        pptFileName: action.payload.pptFileName || "solvix-presentation.pptx",
        pptData: action.payload.pptData || null,
      
        attachedFile: action.payload.attachedFile || null,
        ragUsed: action.payload.ragUsed || false,
        ragSources: action.payload.ragSources || [],
      };
      state.messages.push(message);
    },

    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { setMessages, addMessage, clearMessages } = messageSlice.actions;

export default messageSlice.reducer;