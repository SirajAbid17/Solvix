import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  uploadedFiles: [],
  activeFileId: null,
  activeFileContext: null,
  activeImageBase64: null,
  activeImageMimeType: null,
  isUploading: false,
  uploadError: null,
};

const fileSlice = createSlice({
  name: "file",
  initialState,

  reducers: {
   
    addUploadedFile: (state, action) => {
      const file = action.payload;
      if (!file || !file.fileId) return;
      state.uploadedFiles = state.uploadedFiles.filter(
        (f) => f.fileId !== file.fileId
      );

    
      state.uploadedFiles.unshift(file);

    
      state.activeFileId = file.fileId;
      state.activeFileContext = file.fullText || null;

    
      if (file.fileType === "image") {
        state.activeImageBase64 = file.imageBase64 || null;
        state.activeImageMimeType = file.imageMimeType || null;
      } else {
        state.activeImageBase64 = null;
        state.activeImageMimeType = null;
      }
    },

  
    setActiveFile: (state, action) => {
      const { fileId, fullText, imageBase64, imageMimeType } = action.payload;
      state.activeFileId = fileId;
      state.activeFileContext = fullText || null;
      state.activeImageBase64 = imageBase64 || null;
      state.activeImageMimeType = imageMimeType || null;
    },

    
    removeUploadedFile: (state, action) => {
      const fileId = action.payload;
      state.uploadedFiles = state.uploadedFiles.filter(
        (f) => f.fileId !== fileId
      );

      if (state.activeFileId === fileId) {
        state.activeFileId = null;
        state.activeFileContext = null;
        state.activeImageBase64 = null;
        state.activeImageMimeType = null;
      }
    },

   
    clearUploadedFiles: (state) => {
      state.uploadedFiles = [];
      state.activeFileId = null;
      state.activeFileContext = null;
      state.activeImageBase64 = null;
      state.activeImageMimeType = null;
    },

    setUploading: (state, action) => {
      state.isUploading = action.payload;
    },

    setUploadError: (state, action) => {
      state.uploadError = action.payload;
    },

    clearUploadError: (state) => {
      state.uploadError = null;
    },
  },
});

export const {
  addUploadedFile,
  setActiveFile,
  removeUploadedFile,
  clearUploadedFiles,
  setUploading,
  setUploadError,
  clearUploadError,
} = fileSlice.actions;

export default fileSlice.reducer;