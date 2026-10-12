
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
      console.log("Selected conversation set:", action.payload?.title);
    },

    clearConversations: (state) => {
      state.conversations = [];
      state.selectedConversation = null;
    },

    updateConversationTitle: (state, action) => {
      const { id, title } = action.payload;
      console.log("Updating conversation title:", { id, title });
      
      
      const conversationIndex = state.conversations.findIndex(
        (conv) => conv._id === id
      );
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex] = {
          ...state.conversations[conversationIndex],
          title: title
        };
        console.log("Updated conversations list:", state.conversations[conversationIndex].title);
      } else {
        console.log("Conversation not found in list");
      }
      
      
      if (state.selectedConversation?._id === id) {
        state.selectedConversation = {
          ...state.selectedConversation,
          title: title
        };
        console.log("Updated selected conversation:", state.selectedConversation.title);
      }
    },
  },
});

export const {
  setConversations,
  addConversation,
  setSelectedConversation,
  clearConversations,
  updateConversationTitle,
} = ConversationSlice.actions;

export default ConversationSlice.reducer;