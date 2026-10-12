import { createSlice } from "@reduxjs/toolkit";





const initialState = {
  portfolios: [],
  currentPortfolio: null,

  isLoading: false,
  isAnalyzing: false,

  error: null,
  analysisError: null,
};





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
    
    
    

    setPortfolios: (state, action) => {
      state.portfolios = action.payload || [];
    },

    
    
    

    addPortfolio: (state, action) => {
      const newPortfolio = action.payload;

      if (!newPortfolio) return;

      const newId =
        getPortfolioId(newPortfolio);

      
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

    
    
    

    clearPortfolios: (state) => {
      state.portfolios = [];
      state.currentPortfolio = null;
    },

    
    
    

    setCurrentPortfolio: (
      state,
      action
    ) => {
      state.currentPortfolio =
        action.payload;
    },

    
    
    

    clearCurrentPortfolio: (
      state
    ) => {
      state.currentPortfolio = null;
    },

    
    
    

    setPortfolioLoading: (
      state,
      action
    ) => {
      state.isLoading =
        action.payload;
    },

    
    
    

    setPortfolioAnalyzing: (
      state,
      action
    ) => {
      state.isAnalyzing =
        action.payload;
    },

    
    
    

    setPortfolioError: (
      state,
      action
    ) => {
      state.error =
        action.payload;
    },

    
    
    

    setPortfolioAnalysisError: (
      state,
      action
    ) => {
      state.analysisError =
        action.payload;
    },

    
    
    

    clearPortfolioError: (
      state
    ) => {
      state.error = null;
    },

    
    
    

    clearPortfolioAnalysisError: (
      state
    ) => {
      state.analysisError = null;
    },

    
    
    

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

    
    
    

    resetPortfolioState: () => {
      return initialState;
    },
  },
});





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





export default portfolioSlice.reducer;