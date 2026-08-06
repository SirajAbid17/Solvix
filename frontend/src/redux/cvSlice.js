import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cvs: [],
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
    },

    removeCV: (state, action) => {
      state.cvs = state.cvs.filter((cv) => cv._id !== action.payload);
    },

    clearCVs: (state) => {
      state.cvs = [];
    },
  },
});

export const {
  setCVs,
  addCV,
  updateCVInStore,
  removeCV,
  clearCVs,
} = cvSlice.actions;

export default cvSlice.reducer;