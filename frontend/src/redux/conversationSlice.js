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

    // Add this new reducer
    updateConversationTitle: (state, action) => {
      const { id, title } = action.payload;
      
      // Update in conversations list
      const conversationIndex = state.conversations.findIndex(
        (conv) => conv._id === id
      );
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].title = title;
      }
      
      // Update selected conversation if it's the same
      if (state.selectedConversation?._id === id) {
        state.selectedConversation.title = title;
      }
    },
  },
});

export const {
  setConversations,
  addConversation,
  setSelectedConversation,
  clearConversations,
  updateConversationTitle, // Export this
} = ConversationSlice.actions;

export default ConversationSlice.reducer;