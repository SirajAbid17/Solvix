import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
};

const messageSlice = createSlice({
  name: "message",
  initialState,

  reducers: {
    setMessages: (state, action) => {
      // ✅ Ensure all messages have PDF fields
      state.messages = action.payload.map(msg => ({
        ...msg,
        pdf: msg.pdf || null,
        pdfGenerated: msg.pdfGenerated || false,
        images: msg.images || []
      }));
    },

    addMessage: (state, action) => {
      // ✅ Ensure PDF fields exist
      const message = {
        ...action.payload,
        pdf: action.payload.pdf || null,
        pdfGenerated: action.payload.pdfGenerated || false,
        images: action.payload.images || [],
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