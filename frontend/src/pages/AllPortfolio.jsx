import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaGlobe,
  FaExternalLinkAlt,
  FaCode,
  FaEye,
  FaTrash,
  FaRedo,
} from "react-icons/fa";
import toast from "react-hot-toast";

import {
  setPortfolios,
  removePortfolio,
  setPortfolioLoading,
  setPortfolioError,
} from "../redux/portfolioSlice.js";

// IMPORTANT:
// Apne actual API function ka path/name yahan use karein.
// Agar aapke API service ka naam different hai,
// sirf is import ko change karna hai.
import {
  getAllPortfolios,
  deletePortfolio,
} from "../Features/portfolio.js";
import ResumeHeader from "../components/Resume/ResumeHeader.jsx";
import ResumeFooter from "../components/Resume/ResumeFooter.jsx";
import { useTheme } from "../BgContext/ThemeContext.jsx";

export default function AllPortfolio() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { dark } = useTheme();

  const {
    portfolios = [],
    isLoading = false,
    error = null,
  } = useSelector(
    (state) => state.portfolio
  );

  // ============================================================
  // LOAD PORTFOLIOS FROM DATABASE / REDIS
  // ============================================================

  const loadPortfolios = async () => {
    try {
      dispatch(setPortfolioLoading(true));
      dispatch(setPortfolioError(null));

      const response =
        await getAllPortfolios();

      console.log(
        "ALL PORTFOLIOS RESPONSE:",
        response
      );

      if (
        response?.success &&
        Array.isArray(response?.portfolios)
      ) {
        dispatch(
          setPortfolios(
            response.portfolios
          )
        );
      } else {
        dispatch(setPortfolios([]));

        throw new Error(
          response?.message ||
            "Failed to load portfolios"
        );
      }
    } catch (error) {
      console.error(
        "Load Portfolios Error:",
        error
      );

      dispatch(
        setPortfolioError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load portfolios"
        )
      );
    } finally {
      dispatch(
        setPortfolioLoading(false)
      );
    }
  };

  // ============================================================
  // LOAD ON PAGE REFRESH / MOUNT
  // ============================================================

  useEffect(() => {
    loadPortfolios();
  }, []);

  // ============================================================
  // VIEW WEBSITE
  // ============================================================

  const handleViewWebsite = (
    portfolio
  ) => {
    const portfolioId =
      portfolio?._id ||
      portfolio?.id;

    if (!portfolioId) {
      toast.error(
        "Portfolio ID not found"
      );
      return;
    }

    // Your WebsitePreview currently
    // works with /portfolio/:slug too.
    //
    // If your route is:
    // /portfolio/:slug
    //
    // then use slug.

    if (portfolio?.slug) {
      navigate(
        `/portfolio/${portfolio.slug}`,
        {
          state: {
            portfolio,
          },
        }
      );

      return;
    }

    navigate(
      `/portfolio/${portfolioId}`,
      {
        state: {
          portfolio,
        },
      }
    );
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDelete = async (
    portfolio
  ) => {
    const portfolioId =
      portfolio?._id ||
      portfolio?.id;

    if (!portfolioId) {
      toast.error(
        "Portfolio ID not found"
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${portfolio.title || "this portfolio"}"?`
      );

    if (!confirmed) return;

    try {
      await deletePortfolio(
        portfolioId
      );

      dispatch(
        removePortfolio(
          portfolioId
        )
      );

      toast.success(
        "Portfolio deleted successfully"
      );
    } catch (error) {
      console.error(
        "Delete Portfolio Error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete portfolio"
      );
    }
  };

  // ============================================================
  // RETRY
  // ============================================================

  const handleRetry = () => {
    loadPortfolios();
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (isLoading) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${
        dark ? "bg-black" : "bg-white"
      }`}>
        <p className={`text-lg font-semibold ${
          dark ? "text-white" : "text-gray-900"
        }`}>
          Loading...
        </p>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className={`min-h-screen px-6 py-16 transition-colors duration-300 ${
        dark ? "bg-black text-white" : "bg-white text-gray-900"
      }`}>
        <div className="mx-auto max-w-2xl rounded-3xl border border-red-500/20 bg-red-500/5 p-12 text-center">
          <FaGlobe
            size={45}
            className="mx-auto mb-5 text-red-400"
          />
          <h1 className="text-2xl font-bold">
            Failed to load websites
          </h1>
          <p className={`mt-3 ${
            dark ? "text-gray-400" : "text-gray-600"
          }`}>
            {error}
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className={`mt-7 flex mx-auto items-center gap-2 rounded-xl px-6 py-3 font-semibold transition ${
              dark 
                ? "bg-white text-black hover:bg-gray-200" 
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            <FaRedo />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <> 
      <ResumeHeader/> 
      <div className={`min-h-screen px-4 py-10 transition-colors duration-300 sm:px-6 ${
        dark ? "bg-black text-white" : "bg-gray-50 text-gray-900"
      }`}>
        <div className="mx-auto max-w-7xl">

          {/* ======================================================
              HEADER
          ====================================================== */}

          <div className="mb-10 text-center">
            <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg ${
              dark ? "bg-white text-black" : "bg-gray-900 text-white"
            }`}>
              <FaGlobe size={28} />
            </div>

            <h1 className={`text-4xl font-bold ${
              dark ? "text-white" : "text-gray-900"
            }`}>
              My Websites
            </h1>

            <p className={`mt-3 ${
              dark ? "text-gray-400" : "text-gray-600"
            }`}>
              All your AI-generated portfolio websites
            </p>

            {/* TOTAL */}
            {portfolios.length > 0 && (
              <p className={`mt-2 text-sm ${
                dark ? "text-gray-500" : "text-gray-500"
              }`}>
                {portfolios.length}{" "}
                {portfolios.length === 1
                  ? "website"
                  : "websites"}
              </p>
            )}
          </div>

          {/* ======================================================
              EMPTY
          ====================================================== */}

          {portfolios.length === 0 ? (
            <div className={`rounded-3xl border p-16 text-center ${
              dark 
                ? "border-white/10 bg-white/[0.03]" 
                : "border-gray-200 bg-white/[0.03]"
            }`}>
              <FaGlobe
                size={45}
                className={`mx-auto mb-5 ${
                  dark ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <h2 className={`text-2xl font-semibold ${
                dark ? "text-white" : "text-gray-900"
              }`}>
                No websites yet
              </h2>
              <p className={`mt-2 ${
                dark ? "text-gray-400" : "text-gray-600"
              }`}>
                Generate your first portfolio
                website to see it here.
              </p>
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/portfolio/create"
                  )
                }
                className={`mt-7 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition ${
                  dark 
                    ? "bg-white text-black hover:bg-gray-200" 
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                <FaCode />
                Create New Website
              </button>
            </div>
          ) : (
            /* ====================================================
               GRID
            ==================================================== */

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {portfolios.map(
                (portfolio) => {
                  const portfolioId =
                    portfolio?._id ||
                    portfolio?.id;

                  return (
                    <div
                      key={portfolioId}
                      className={`group overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
                        dark 
                          ? "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]" 
                          : "border-gray-200 bg-white/[0.04] hover:border-gray-300 hover:bg-white/[0.07]"
                      }`}
                    >
                      {/* ==================================================
                          PREVIEW
                      ================================================== */}

                      <div className={`relative flex h-52 items-center justify-center overflow-hidden ${
                        dark 
                          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black" 
                          : "bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300"
                      }`}>
                        <FaGlobe
                          size={55}
                          className={`transition-transform duration-300 group-hover:scale-110 ${
                            dark ? "text-gray-500" : "text-gray-400"
                          }`}
                        />

                        {/* STATUS */}
                        <div
                          className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-medium ${
                            portfolio.status === "completed"
                              ? dark 
                                ? "bg-green-500/10 text-green-400" 
                                : "bg-green-500/10 text-green-600"
                              : dark 
                                ? "bg-yellow-500/10 text-yellow-400" 
                                : "bg-yellow-500/10 text-yellow-600"
                          }`}
                        >
                          {portfolio.status === "completed"
                            ? "Generated"
                            : portfolio.status || "Processing"}
                        </div>
                      </div>

                      {/* ==================================================
                          CONTENT
                      ================================================== */}

                      <div className="p-6">
                        <h2 className={`truncate text-xl font-bold ${
                          dark ? "text-white" : "text-gray-900"
                        }`}>
                          {portfolio.title || "My Portfolio"}
                        </h2>

                        <p className={`mt-2 truncate text-sm ${
                          dark ? "text-gray-500" : "text-gray-500"
                        }`}>
                          {portfolio.slug || "portfolio-website"}
                        </p>

                        {/* DATE */}
                        {portfolio.createdAt && (
                          <p className={`mt-2 text-xs ${
                            dark ? "text-gray-600" : "text-gray-400"
                          }`}>
                            Created{" "}
                            {new Date(
                              portfolio.createdAt
                            ).toLocaleDateString()}
                          </p>
                        )}

                        {/* BUTTONS */}
                        <div className="mt-6 flex gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              handleViewWebsite(
                                portfolio
                              )
                            }
                            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition ${
                              dark 
                                ? "bg-white text-black hover:bg-gray-200" 
                                : "bg-gray-900 text-white hover:bg-gray-800"
                            }`}
                          >
                            <FaEye />
                            View Website
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleViewWebsite(
                                portfolio
                              )
                            }
                            className={`flex h-12 w-12 items-center justify-center rounded-xl border transition ${
                              dark 
                                ? "border-white/10 text-gray-400 hover:bg-white/10 hover:text-white" 
                                : "border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                            title="Open"
                          >
                            <FaExternalLinkAlt size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                portfolio
                              )
                            }
                            className={`flex h-12 w-12 items-center justify-center rounded-xl border transition ${
                              dark 
                                ? "border-red-500/10 text-red-400 hover:bg-red-500/10 hover:text-red-300" 
                                : "border-red-500/10 text-red-500 hover:bg-red-500/10 hover:text-red-600"
                            }`}
                            title="Delete"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}

          {/* ======================================================
              CREATE BUTTON
          ====================================================== */}

          {portfolios.length > 0 && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/portfolio/create"
                  )
                }
                className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition ${
                  dark 
                    ? "bg-white text-black hover:bg-gray-200" 
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                <FaCode />
                Create New Website
              </button>
            </div>
          )}
        </div>
      </div>
      <ResumeFooter/>  
    </>
  );
}