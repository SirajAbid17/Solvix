import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  resumes: [],
};

const resumeSlice = createSlice({
  name: "resume",
  initialState,

  reducers: {
    setResumes: (state, action) => {
      state.resumes = action.payload;
    },

    addResume: (state, action) => {
      state.resumes.unshift(action.payload);
    },

    clearResumes: (state) => {
      state.resumes = [];
    },
  },
});

export const {
  setResumes,
  addResume,
  clearResumes,
} = resumeSlice.actions;

export default resumeSlice.reducer;