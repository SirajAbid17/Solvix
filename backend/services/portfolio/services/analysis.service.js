import Portfolio from "../models/portfolio.models.js";
import { analyzeChunk, generatePortfolioCode } from "./gemini.service.js";
import { parseGroqResponse } from "./parser.service.js";
import { buildPortfolioAnalysis } from "./portfolio-analysis.service.js";

const CHUNK_SIZE = 3000;
const CHUNK_OVERLAP = 200;
const INTER_CHUNK_DELAY_MS = 1500;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const chunkText = (text) => {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);
    const chunk = text.slice(start, end);
    if (chunk.trim()) chunks.push(chunk);
    if (end === text.length) break;
    start += CHUNK_SIZE - CHUNK_OVERLAP;
  }

  return chunks;
};


const markCodeGenerationFailed = async (portfolioId, message) => {
  await Portfolio.updateOne(
    { _id: portfolioId },
    {
      $set: {
        status: "code_generation_failed",
        analysisStatus: "completed",
        error: message || "Code generation failed",
      },
    },
    { runValidators: false, strict: false }
  );
};


export const analyzePortfolio = async (portfolioId) => {
  let portfolio;

  try {
    if (!portfolioId) throw new Error("Portfolio ID is required");

    portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio) throw new Error("Portfolio not found");

    portfolio.analysisStatus = "processing";
    portfolio.status = "analyzing";
    portfolio.error = "";
    await portfolio.save();

    const text = portfolio.extractedText;
    if (!text || typeof text !== "string" || !text.trim()) {
      throw new Error("Extracted portfolio text not found");
    }

    console.log("Starting portfolio analysis:", String(portfolioId));
    console.log("Portfolio text length:", text.length);

    const chunks = chunkText(text);
    if (chunks.length === 0) throw new Error("No readable resume chunks found");
    console.log("Portfolio analysis chunks:", chunks.length);

   
    const responses = [];
    for (let i = 0; i < chunks.length; i++) {
      console.log(`Analyzing portfolio chunk ${i + 1}/${chunks.length}`);

      const rawResponse = await analyzeChunk(chunks[i]);
      if (!rawResponse || !rawResponse.trim()) {
        throw new Error(`Empty analysis response for chunk ${i + 1}`);
      }

      responses.push(parseGroqResponse(rawResponse));
      console.log(`Chunk ${i + 1} parsed successfully`);

      if (i < chunks.length - 1) await sleep(INTER_CHUNK_DELAY_MS);
    }

    const finalAnalysis = buildPortfolioAnalysis(responses);
    if (
      !finalAnalysis ||
      typeof finalAnalysis !== "object" ||
      Array.isArray(finalAnalysis)
    ) {
      throw new Error("Failed to build portfolio analysis");
    }

    console.log("Portfolio analysis merged successfully");

   
    portfolio.analysis = finalAnalysis;
    portfolio.analysisStatus = "completed";
    portfolio.status = "generating";
    portfolio.error = "";
    await portfolio.save();


    console.log("Generating portfolio website code");

    let websiteCode = null;
    let codeGenError = null;

    try {
      websiteCode = await generatePortfolioCode(finalAnalysis);

      if (!websiteCode?.html?.trim() || !websiteCode?.css?.trim()) {
        throw new Error("Code generator returned incomplete HTML/CSS");
      }
    } catch (err) {
      codeGenError = err;
      console.error("Portfolio code generation failed:", err.message);
    }

    
    if (codeGenError) {
      await markCodeGenerationFailed(portfolio._id, codeGenError.message);

      console.warn(
        "Analysis completed but code generation failed:",
        String(portfolioId)
      );

      return {
        portfolioId: portfolio._id,
        slug: portfolio.slug,
        title: portfolio.title,
        analysis: finalAnalysis,
        generatedCode: null,
        warning: "Analysis succeeded; code generation failed (retryable)",
      };
    }

    const generatedAt = new Date().toISOString();

    portfolio.generatedCode = {
      html: websiteCode.html,
      css: websiteCode.css,
      js: websiteCode.js || "",
      generatedAt,
    };
    portfolio.analysisStatus = "completed";
    portfolio.status = "completed";
    portfolio.error = "";
    await portfolio.save();

    console.log("Portfolio analysis completed:", String(portfolioId));

    return {
      portfolioId: portfolio._id,
      slug: portfolio.slug,
      title: portfolio.title,
      analysis: finalAnalysis,
      generatedCode: {
        html: websiteCode.html,
        css: websiteCode.css,
        js: websiteCode.js || "",
        generatedAt,
      },
    };
  } catch (error) {
    console.error("Portfolio Analysis Error:", error);

    try {
      const update = {
        status: "failed",
        analysisStatus: "failed",
        error: error.message || "Portfolio analysis failed",
      };
      if (portfolioId) {
        await Portfolio.updateOne(
          { _id: portfolioId },
          { $set: update },
          { runValidators: false }
        );
      }
    } catch (updateError) {
      console.error("Failed to update portfolio status:", updateError);
    }

    throw error;
  }
};


export const regeneratePortfolioCode = async (portfolioId) => {
  if (!portfolioId) throw new Error("Portfolio ID is required");

  const portfolio = await Portfolio.findById(portfolioId);
  if (!portfolio) throw new Error("Portfolio not found");

  if (!portfolio.analysis || Object.keys(portfolio.analysis).length === 0) {
    throw new Error("Portfolio analysis not found; run full analysis first");
  }

  portfolio.status = "generating";
  portfolio.analysisStatus = "completed";
  portfolio.error = "";
  await portfolio.save();

  try {
    const websiteCode = await generatePortfolioCode(portfolio.analysis);

    if (!websiteCode?.html?.trim() || !websiteCode?.css?.trim()) {
      throw new Error("Code generator returned incomplete HTML/CSS");
    }

    portfolio.generatedCode = {
      html: websiteCode.html,
      css: websiteCode.css,
      js: websiteCode.js || "",
      generatedAt: new Date().toISOString(),
    };
    portfolio.status = "completed";
    portfolio.analysisStatus = "completed";
    portfolio.error = "";
    await portfolio.save();

    return {
      portfolioId: portfolio._id,
      slug: portfolio.slug,
      title: portfolio.title,
      generatedCode: portfolio.generatedCode,
    };
  } catch (err) {
    await markCodeGenerationFailed(portfolio._id, err.message);
    throw err;
  }
};