import Portfolio from "../models/portfolio.models.js";

import {
  analyzeChunk,
  generatePortfolioCode,
} from "./gemini.service.js";

import { parseGeminiResponse } from "./parser.service.js";

import {
  buildPortfolioAnalysis,
} from "./portfolio-analysis.service.js";

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

    
    const responses = [];

    for (
      let i = 0;
      i < chunks.length;
      i++
    ) {
    

      const rawResponse =
        await analyzeChunk(
          chunks[i]
        );

      const parsedResponse =
        parseGeminiResponse(
          rawResponse
        );

     

      responses.push(
        parsedResponse
      );
    }

   
    if (
      !responses.length
    ) {
      throw new Error(
        "Gemini returned no analysis responses"
      );
    }

    

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

    
    portfolio.status =
      "generating";

    await portfolio.save();

    const websiteCode =
      await generatePortfolioCode(
        finalAnalysis
      );

    portfolio.analysis =
      finalAnalysis;

    portfolio.generatedCode = {
      html:
        websiteCode?.html || "",

      css:
        websiteCode?.css || "",

      js:
        websiteCode?.js || "",

      
      generatedAt:
        new Date().toISOString(),
    };

    
    portfolio.analysisStatus =
      "completed";

    portfolio.status =
      "completed";

    portfolio.error = "";

    await portfolio.save();

   
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