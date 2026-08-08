// store/cvSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cvs: [],
  currentCV: null,
  isLoading: false,
  error: null,
};

const cvSlice = createSlice({
  name: "cv",
  initialState,
  reducers: {
    // Set all CVs
    setCVs: (state, action) => {
      state.cvs = action.payload;
    },

    // Add single CV
    addCV: (state, action) => {
      state.cvs.unshift(action.payload);
    },

    // Update CV
    updateCVInStore: (state, action) => {
      state.cvs = state.cvs.map((cv) =>
        cv._id === action.payload._id ? action.payload : cv
      );
      if (state.currentCV?._id === action.payload._id) {
        state.currentCV = action.payload;
      }
    },

    // Remove CV
    removeCV: (state, action) => {
      state.cvs = state.cvs.filter((cv) => cv._id !== action.payload);
      if (state.currentCV?._id === action.payload) {
        state.currentCV = null;
      }
    },

    // Clear all CVs
    clearCVs: (state) => {
      state.cvs = [];
      state.currentCV = null;
    },

    // Set current CV
    setCurrentCV: (state, action) => {
      state.currentCV = action.payload;
    },

    // Clear current CV
    clearCurrentCV: (state) => {
      state.currentCV = null;
    },

    // Loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Error state
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCVs,
  addCV,
  updateCVInStore,
  removeCV,
  clearCVs,
  setCurrentCV,
  clearCurrentCV,
  setLoading,
  setError,
  clearError,
} = cvSlice.actions;

export default cvSlice.reducer;