import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
};

const messageSlice = createSlice({
  name: "message",
  initialState,

  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload.map(msg => ({
        ...msg,
        // ✅ Ensure images array exists and has valid URLs
        images: Array.isArray(msg.images) ? msg.images : [],
        pdf: msg.pdf || null,
        pdfUrl: msg.pdfUrl || null,
        pdfGenerated: msg.pdfGenerated || false,
        ppt: msg.ppt || null,
        pptUrl: msg.pptUrl || null,
        pptGenerated: msg.pptGenerated || false,
        pptFileName: msg.pptFileName || "solvix-presentation.pptx",
        pptData: msg.pptData || null,
      }));
    },

    addMessage: (state, action) => {
      // ✅ Ensure images are properly stored
      const images = Array.isArray(action.payload.images) ? action.payload.images : [];
      
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
      };
      state.messages.push(message);
    },

    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const {
  setMessages,
  addMessage,
  clearMessages,
} = messageSlice.actions;

export default messageSlice.reducer;