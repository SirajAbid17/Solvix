
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
    
    setCVs: (state, action) => {
      state.cvs = action.payload;
    },

    
    addCV: (state, action) => {
      state.cvs.unshift(action.payload);
    },

    
    updateCVInStore: (state, action) => {
      state.cvs = state.cvs.map((cv) =>
        cv._id === action.payload._id ? action.payload : cv
      );
      if (state.currentCV?._id === action.payload._id) {
        state.currentCV = action.payload;
      }
    },

    
    removeCV: (state, action) => {
      state.cvs = state.cvs.filter((cv) => cv._id !== action.payload);
      if (state.currentCV?._id === action.payload) {
        state.currentCV = null;
      }
    },

    
    clearCVs: (state) => {
      state.cvs = [];
      state.currentCV = null;
    },

    
    setCurrentCV: (state, action) => {
      state.currentCV = action.payload;
    },

    
    clearCurrentCV: (state) => {
      state.currentCV = null;
    },

    
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    
    setError: (state, action) => {
      state.error = action.payload;
    },

    
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