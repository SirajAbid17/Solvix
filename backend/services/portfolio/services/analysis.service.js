import Portfolio from "../models/portfolio.models.js";

import {
  analyzeChunk,
  generatePortfolioCode,
} from "./gemini.service.js";

import { parseGeminiResponse } from "./parser.service.js";

import {
  buildPortfolioAnalysis,
} from "./portfolio-analysis.service.js";

// ============================================================
// Analyze Portfolio
// ============================================================

export const analyzePortfolio = async (portfolioId) => {
  try {
    if (!portfolioId) {
      throw new Error(
        "Portfolio ID is required"
      );
    }
    const portfolio =
      await Portfolio.findById(
        portfolioId
      );

    if (!portfolio) {
      throw new Error(
        "Portfolio not found"
      );
    }

    portfolio.analysisStatus =
      "processing";

    portfolio.status =
      "analyzing";

    portfolio.error = "";

    await portfolio.save();
    
    const text =
      portfolio.extractedText;

    if (
      !text ||
      !text.trim()
    ) {
      throw new Error(
        "Extracted portfolio text not found"
      );
    }

    console.log(
      "Portfolio text length:",
      text.length
    );

    // ========================================================
    // Create Chunks
    // ========================================================

    const chunkSize = 3000;
    const overlap = 300;

    const chunks = [];

    let start = 0;

    while (
      start < text.length
    ) {
      const chunk =
        text.slice(
          start,
          start + chunkSize
        );

      if (chunk.trim()) {
        chunks.push(chunk);
      }

      start +=
        chunkSize - overlap;
    }

    console.log(
      "Analysis chunks:",
      chunks.length
    );

    // ========================================================
    // Gemini Analysis
    // ========================================================

    const responses = [];

    for (
      let i = 0;
      i < chunks.length;
      i++
    ) {
      console.log(
        `Analyzing chunk ${i + 1}/${chunks.length}`
      );

      const rawResponse =
        await analyzeChunk(
          chunks[i]
        );

      // ------------------------------------------------------
      // Parse Gemini Response
      // ------------------------------------------------------

      const parsedResponse =
        parseGeminiResponse(
          rawResponse
        );

      // ------------------------------------------------------
      // Debug Parsed Response
      // ------------------------------------------------------

      console.log(
        `Parsed chunk ${i + 1}:`,
        JSON.stringify(
          parsedResponse,
          null,
          2
        )
      );

      responses.push(
        parsedResponse
      );
    }

    // ========================================================
    // Validate Responses
    // ========================================================

    if (
      !responses.length
    ) {
      throw new Error(
        "Gemini returned no analysis responses"
      );
    }

    // ========================================================
    // Merge Analysis
    // ========================================================

    console.log(
      "Building final portfolio analysis..."
    );

    const finalAnalysis =
      buildPortfolioAnalysis(
        responses
      );

    if (
      !finalAnalysis ||
      typeof finalAnalysis !==
        "object"
    ) {
      throw new Error(
        "Failed to build portfolio analysis"
      );
    }

    // ========================================================
    // Update Generating Status
    // ========================================================

    portfolio.status =
      "generating";

    await portfolio.save();

    // ========================================================
    // Generate Portfolio Code
    // ========================================================

    console.log(
      "Generating portfolio website code..."
    );

    const websiteCode =
      await generatePortfolioCode(
        finalAnalysis
      );

    // ========================================================
    // Save Analysis
    // ========================================================

    portfolio.analysis =
      finalAnalysis;

    // ========================================================
    // Save Generated Code
    // ========================================================

    portfolio.generatedCode = {
      html:
        websiteCode?.html || "",

      css:
        websiteCode?.css || "",

      js:
        websiteCode?.js || "",

      // IMPORTANT:
      // Redux-friendly string
      generatedAt:
        new Date().toISOString(),
    };

    // ========================================================
    // Completed
    // ========================================================

    portfolio.analysisStatus =
      "completed";

    portfolio.status =
      "completed";

    portfolio.error = "";

    await portfolio.save();

    console.log(
      "Portfolio analysis completed:",
      portfolio._id.toString()
    );

    // ========================================================
    // Return
    // ========================================================

    return {
      portfolioId:
        portfolio._id,

      slug:
        portfolio.slug,

      title:
        portfolio.title,

      analysis:
        finalAnalysis,

      generatedCode: {
        html:
          websiteCode?.html || "",

        css:
          websiteCode?.css || "",

        js:
          websiteCode?.js || "",
      },
    };
  } catch (error) {
    console.error(
      "Portfolio Analysis Error:",
      error
    );

    // ========================================================
    // Update Failed Status
    // ========================================================

    try {
      if (portfolioId) {
        await Portfolio.findByIdAndUpdate(
          portfolioId,
          {
            status: "failed",

            analysisStatus:
              "failed",

            error:
              error.message ||
              "Portfolio analysis failed",
          }
        );
      }
    } catch (updateError) {
      console.error(
        "Failed to update portfolio status:",
        updateError
      );
    }

    throw error;
  }
};