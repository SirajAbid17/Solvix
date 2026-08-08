import api from "../utlis/axios";

// ============================================================
// UPLOAD PORTFOLIO
// ============================================================

export const uploadPortfolio = async (formData) => {
  try {
    const { data } = await api.post(
      "/portfolio/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Portfolio Upload Response:", data);

    return data;
  } catch (error) {
    console.error(
      "Portfolio Upload Error:",
      error
    );

    console.error(
      "Error Response:",
      error.response?.data
    );

    throw error;
  }
};

// ============================================================
// ANALYZE PORTFOLIO
// ============================================================

export const analyzePortfolio = async (id) => {
  try {
    const { data } = await api.post(
      `/portfolio/${id}/analyze`
    );

    console.log(
      "Portfolio Analysis Response:",
      data
    );

    return data;
  } catch (error) {
    console.error(
      "Portfolio Analysis Error:",
      error
    );

    console.error(
      "Error Response:",
      error.response?.data
    );

    throw error;
  }
};

// ============================================================
// GET ALL USER PORTFOLIOS
// ============================================================

export const getAllPortfolios = async () => {
  try {
    const { data } = await api.get(
      "/portfolio/user/all"
    );

    console.log(
      "All Portfolios Response:",
      data
    );

    return data;
  } catch (error) {
    console.error(
      "Get All Portfolios Error:",
      error
    );

    console.error(
      "Error Response:",
      error.response?.data
    );

    throw error;
  }
};

// ============================================================
// BACKWARD COMPATIBILITY
// ============================================================

export const getMyPortfolios =
  getAllPortfolios;

// ============================================================
// GET PORTFOLIO BY SLUG
// ============================================================

export const getPortfolioBySlug = async (
  slug
) => {
  try {
    const { data } = await api.get(
      `/portfolio/${slug}`
    );

    console.log(
      "Portfolio By Slug Response:",
      data
    );

    return data;
  } catch (error) {
    console.error(
      "Get Portfolio Error:",
      error
    );

    console.error(
      "Error Response:",
      error.response?.data
    );

    throw error;
  }
};

// ============================================================
// DELETE PORTFOLIO
// ============================================================

export const deletePortfolio = async (
  id
) => {
  try {
    const { data } = await api.delete(
      `/portfolio/${id}`
    );

    console.log(
      "Delete Portfolio Response:",
      data
    );

    return data;
  } catch (error) {
    console.error(
      "Delete Portfolio Error:",
      error
    );

    console.error(
      "Error Response:",
      error.response?.data
    );

    throw error;
  }
};