import { createSlice } from "@reduxjs/toolkit";

const ConversationSlice = createSlice({
  name: "conversation",

  initialState: {
    conversations: [],
    selectedConversation: null,
  },

  reducers: {
    setConversations: (state, action) => {
      state.conversations = Array.isArray(action.payload)
        ? action.payload
        : [];
    },

    addConversation: (state, action) => {
      state.conversations.unshift(action.payload);
    },

    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },

    clearConversations: (state) => {
      state.conversations = [];
      state.selectedConversation = null;
    },
  },
});

export const {
  setConversations,
  addConversation,
  setSelectedConversation,
  clearConversations,
} = ConversationSlice.actions;

export default ConversationSlice.reducer;