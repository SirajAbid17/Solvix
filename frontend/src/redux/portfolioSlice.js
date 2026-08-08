import { createSlice } from "@reduxjs/toolkit";

// ============================================================
// Initial State
// ============================================================

const initialState = {
  portfolios: [],
  currentPortfolio: null,

  isLoading: false,
  isAnalyzing: false,

  error: null,
  analysisError: null,
};

// ============================================================
// Helper
// ============================================================

const getPortfolioId = (portfolio) => {
  if (!portfolio) return null;

  return String(
    portfolio._id ||
      portfolio.id ||
      ""
  );
};

// ============================================================
// Portfolio Slice
// ============================================================

const portfolioSlice = createSlice({
  name: "portfolio",

  initialState,

  reducers: {
    // ========================================================
    // Set All Portfolios
    // ========================================================

    setPortfolios: (state, action) => {
      state.portfolios = action.payload || [];
    },

    // ========================================================
    // Add Portfolio
    // ========================================================

    addPortfolio: (state, action) => {
      const newPortfolio = action.payload;

      if (!newPortfolio) return;

      const newId =
        getPortfolioId(newPortfolio);

      // Prevent duplicate portfolio
      const exists = state.portfolios.some(
        (portfolio) =>
          getPortfolioId(portfolio) === newId
      );

      if (exists) {
        state.portfolios =
          state.portfolios.map(
            (portfolio) =>
              getPortfolioId(portfolio) === newId
                ? {
                    ...portfolio,
                    ...newPortfolio,
                  }
                : portfolio
          );

        return;
      }

      state.portfolios.unshift(
        newPortfolio
      );
    },

    // ========================================================
    // Update Portfolio
    // ========================================================

    updatePortfolioInStore: (
      state,
      action
    ) => {
      const updatedPortfolio =
        action.payload;

      if (!updatedPortfolio) return;

      const updatedId =
        getPortfolioId(
          updatedPortfolio
        );

      state.portfolios =
        state.portfolios.map(
          (portfolio) =>
            getPortfolioId(portfolio) ===
            updatedId
              ? {
                  ...portfolio,
                  ...updatedPortfolio,
                }
              : portfolio
        );

      if (
        state.currentPortfolio &&
        getPortfolioId(
          state.currentPortfolio
        ) === updatedId
      ) {
        state.currentPortfolio = {
          ...state.currentPortfolio,
          ...updatedPortfolio,
        };
      }
    },

    // ========================================================
    // Remove Portfolio
    // ========================================================

    removePortfolio: (
      state,
      action
    ) => {
      const id = String(
        action.payload
      );

      state.portfolios =
        state.portfolios.filter(
          (portfolio) =>
            getPortfolioId(
              portfolio
            ) !== id
        );

      if (
        state.currentPortfolio &&
        getPortfolioId(
          state.currentPortfolio
        ) === id
      ) {
        state.currentPortfolio = null;
      }
    },

    // ========================================================
    // Clear All Portfolios
    // ========================================================

    clearPortfolios: (state) => {
      state.portfolios = [];
      state.currentPortfolio = null;
    },

    // ========================================================
    // Set Current Portfolio
    // ========================================================

    setCurrentPortfolio: (
      state,
      action
    ) => {
      state.currentPortfolio =
        action.payload;
    },

    // ========================================================
    // Clear Current Portfolio
    // ========================================================

    clearCurrentPortfolio: (
      state
    ) => {
      state.currentPortfolio = null;
    },

    // ========================================================
    // Loading
    // ========================================================

    setPortfolioLoading: (
      state,
      action
    ) => {
      state.isLoading =
        action.payload;
    },

    // ========================================================
    // Analysis Loading
    // ========================================================

    setPortfolioAnalyzing: (
      state,
      action
    ) => {
      state.isAnalyzing =
        action.payload;
    },

    // ========================================================
    // Error
    // ========================================================

    setPortfolioError: (
      state,
      action
    ) => {
      state.error =
        action.payload;
    },

    // ========================================================
    // Analysis Error
    // ========================================================

    setPortfolioAnalysisError: (
      state,
      action
    ) => {
      state.analysisError =
        action.payload;
    },

    // ========================================================
    // Clear Error
    // ========================================================

    clearPortfolioError: (
      state
    ) => {
      state.error = null;
    },

    // ========================================================
    // Clear Analysis Error
    // ========================================================

    clearPortfolioAnalysisError: (
      state
    ) => {
      state.analysisError = null;
    },

    // ========================================================
    // Update Analysis Result
    // ========================================================

    updatePortfolioAnalysis: (
      state,
      action
    ) => {
      if (!state.currentPortfolio) {
        return;
      }

      const currentId =
        getPortfolioId(
          state.currentPortfolio
        );

      state.currentPortfolio = {
        ...state.currentPortfolio,
        ...action.payload,

        // Preserve generated code
        generatedCode:
          action.payload
            ?.generatedCode ||
          state.currentPortfolio
            ?.generatedCode,
      };

      state.portfolios =
        state.portfolios.map(
          (portfolio) =>
            getPortfolioId(
              portfolio
            ) === currentId
              ? {
                  ...portfolio,
                  ...state.currentPortfolio,
                }
              : portfolio
        );
    },

    // ========================================================
    // Set Generated Code
    // ========================================================

    setGeneratedCode: (
      state,
      action
    ) => {
      if (!state.currentPortfolio) {
        return;
      }

      state.currentPortfolio.generatedCode =
        {
          html:
            action.payload?.html ||
            "",
          css:
            action.payload?.css ||
            "",
          js:
            action.payload?.js ||
            "",
        };

      const currentId =
        getPortfolioId(
          state.currentPortfolio
        );

      state.portfolios =
        state.portfolios.map(
          (portfolio) =>
            getPortfolioId(
              portfolio
            ) === currentId
              ? {
                  ...portfolio,
                  generatedCode:
                    state
                      .currentPortfolio
                      .generatedCode,
                }
              : portfolio
        );
    },

    // ========================================================
    // Set Analysis
    // ========================================================

    setPortfolioAnalysis: (
      state,
      action
    ) => {
      if (!state.currentPortfolio) {
        return;
      }

      state.currentPortfolio.analysis =
        action.payload;

      const currentId =
        getPortfolioId(
          state.currentPortfolio
        );

      state.portfolios =
        state.portfolios.map(
          (portfolio) =>
            getPortfolioId(
              portfolio
            ) === currentId
              ? {
                  ...portfolio,
                  analysis:
                    action.payload,
                }
              : portfolio
        );
    },

    // ========================================================
    // Reset State
    // ========================================================

    resetPortfolioState: () => {
      return initialState;
    },
  },
});

// ============================================================
// Actions
// ============================================================

export const {
  setPortfolios,
  addPortfolio,
  updatePortfolioInStore,
  removePortfolio,
  clearPortfolios,

  setCurrentPortfolio,
  clearCurrentPortfolio,

  setPortfolioLoading,
  setPortfolioAnalyzing,

  setPortfolioError,
  setPortfolioAnalysisError,

  clearPortfolioError,
  clearPortfolioAnalysisError,

  updatePortfolioAnalysis,

  setGeneratedCode,
  setPortfolioAnalysis,

  resetPortfolioState,
} = portfolioSlice.actions;

// ============================================================
// Reducer
// ============================================================

export default portfolioSlice.reducer;