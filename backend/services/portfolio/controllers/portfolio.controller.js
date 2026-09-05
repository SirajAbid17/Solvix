// controllers/portfolio.controller.js

import { uploadPdf } from "../services/upload.service.js";
import { extractPdfText } from "../services/pdf.service.js";
import Portfolio from "../models/portfolio.models.js";
import { analyzePortfolio } from "../services/analysis.service.js";
import redis from "../../../shared/redis/redis.js";
import mongoose from "mongoose";

const CACHE_TIME = 60 * 60;

// ============================================================
// Helper
// ============================================================

const getUserId = (req) => {
  return req.user?.userId || req.headers["x-user-id"];
};

// ============================================================
// 1. UPLOAD PORTFOLIO
// ============================================================

export const uploadPortfolio = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User ID not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF is required",
      });
    }

    console.log("Portfolio PDF:", req.file.originalname);
    console.log("PDF Size:", req.file.size);

    // ========================================================
    // Extract PDF
    // ========================================================

    const { text, chunks } = await extractPdfText(req.file.buffer);

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Could not extract text from PDF",
      });
    }

    console.log("Pages:", chunks?.length || 0);
    console.log("Characters:", text.length);

    // ========================================================
    // Upload PDF
    // ========================================================

    const uploadedPdf = await uploadPdf(req.file.buffer);

    if (!uploadedPdf) {
      throw new Error("PDF upload failed");
    }

    // ========================================================
    // Generate Slug
    // ========================================================

    const originalName = req.file.originalname
      .replace(/\.pdf$/i, "")
      .trim();

    const cleanTitle = originalName || "My Portfolio";

    const slug = `portfolio-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)}`
      .toLowerCase();

    // ========================================================
    // Create Portfolio
    // ========================================================

    const portfolio = await Portfolio.create({
      userId,
      title: cleanTitle,
      slug,
      pdf: {
        url: uploadedPdf.secure_url,
        publicId: uploadedPdf.public_id,
        originalName: req.file.originalname,
        size: req.file.size,
      },
      extractedText: text,
      status: "uploaded",
      analysisStatus: "pending",
    });

    // ========================================================
    // Clear User Cache
    // ========================================================

    await redis.del(`user-portfolios:${userId}`);

    // ========================================================
    // Response
    // ========================================================

    return res.status(201).json({
      success: true,
      message: "Portfolio uploaded successfully",
      portfolioId: portfolio._id,
      slug: portfolio.slug,
      title: portfolio.title,
      totalPages: chunks?.length || 0,
      extractedCharacters: text.length,
      status: portfolio.status,
      analysisStatus: portfolio.analysisStatus,
    });

  } catch (error) {
    console.error("Upload Portfolio Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// 2. ANALYZE PORTFOLIO
// ============================================================

export const analyzePortfolioController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    // ========================================================
    // Validate User
    // ========================================================

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User ID not found",
      });
    }

    // ========================================================
    // Validate Portfolio ID
    // ========================================================

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Portfolio ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid portfolio ID",
      });
    }

    // ========================================================
    // Find Portfolio
    // ========================================================

    const portfolio = await Portfolio.findOne({
      _id: id,
      userId,
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found or unauthorized",
      });
    }

    // ========================================================
    // Check Extracted Text
    // ========================================================

    if (!portfolio.extractedText || !portfolio.extractedText.trim()) {
      return res.status(400).json({
        success: false,
        message: "Portfolio extracted text not found",
      });
    }

    // ========================================================
    // Prevent Duplicate Analysis
    // ========================================================

    if (portfolio.analysisStatus === "processing") {
      return res.status(409).json({
        success: false,
        message: "Portfolio analysis is already in progress",
      });
    }

    // ========================================================
    // Start Analysis
    // ========================================================

    console.log("Starting portfolio analysis:", portfolio._id.toString());

    const result = await analyzePortfolio(portfolio._id);

    // ========================================================
    // Clear Redis Cache
    // ========================================================

    await redis.del(`portfolio:${portfolio.slug}`);
    await redis.del(`user-portfolios:${userId}`);

    // ========================================================
    // Response
    // ========================================================

    return res.status(200).json({
      success: true,
      message: "Portfolio generated successfully",
      portfolioId: result.portfolioId || portfolio._id,
      slug: result.slug || portfolio.slug,
      title: result.title || portfolio.title,
      analysis: result.analysis || null,
      generatedCode: {
        html: result.generatedCode?.html || "",
        css: result.generatedCode?.css || "",
        js: result.generatedCode?.js || "",
        generatedAt: result.generatedCode?.generatedAt || null,
      },
    });

  } catch (error) {
    console.error("Analyze Portfolio Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Portfolio analysis failed",
    });
  }
};

// ============================================================
// 3. GET PORTFOLIO BY SLUG
// ============================================================

export const getPortfolioBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = getUserId(req);
    const cacheKey = `portfolio:${slug}`;

    // ========================================================
    // Redis Cache
    // ========================================================

    const cached = await redis.get(cacheKey);

    if (cached) {
      const data = JSON.parse(cached);
      const isOwner = userId && String(data.userId) === String(userId);

      if (!isOwner && !data.isPublic) {
        return res.status(403).json({
          success: false,
          message: "This portfolio is private",
        });
      }

      return res.status(200).json({
        success: true,
        fromCache: true,
        portfolio: {
          id: data._id,
          title: data.title,
          slug: data.slug,
          analysis: data.analysis,
          generatedCode: data.generatedCode,
          isPublic: data.isPublic,
          status: data.status,
          analysisStatus: data.analysisStatus,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        },
      });
    }

    // ========================================================
    // Database
    // ========================================================

    const portfolio = await Portfolio.findOne({
      slug,
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    // ========================================================
    // Ownership Check
    // ========================================================

    const isOwner = userId && portfolio.userId.toString() === String(userId);

    if (!isOwner && !portfolio.isPublic) {
      return res.status(403).json({
        success: false,
        message: "This portfolio is private",
      });
    }

    // ========================================================
    // Cache
    // ========================================================

    await redis.set(
      cacheKey,
      JSON.stringify(portfolio.toObject()),
      "EX",
      CACHE_TIME
    );

    // ========================================================
    // Response
    // ========================================================

    return res.status(200).json({
      success: true,
      fromCache: false,
      portfolio: {
        id: portfolio._id,
        title: portfolio.title,
        slug: portfolio.slug,
        analysis: portfolio.analysis,
        generatedCode: portfolio.generatedCode,
        isPublic: portfolio.isPublic,
        status: portfolio.status,
        analysisStatus: portfolio.analysisStatus,
        createdAt: portfolio.createdAt,
        updatedAt: portfolio.updatedAt,
      },
    });

  } catch (error) {
    console.error("Get Portfolio Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// 4. GET ALL USER PORTFOLIOS
// ============================================================

export const getAllUserPortfolios = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User ID not found",
      });
    }

    const cacheKey = `user-portfolios:${userId}`;

    // ========================================================
    // Redis Cache
    // ========================================================

    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.status(200).json({
        ...JSON.parse(cached),
        fromCache: true,
      });
    }

    // ========================================================
    // Database
    // ========================================================

    const portfolios = await Portfolio.find({
      userId,
    })
      .select(
        "title slug isPublic status analysisStatus createdAt updatedAt generatedCode error"
      )
      .sort({
        createdAt: -1,
      });

    console.log(`Found ${portfolios.length} portfolios for user ${userId}`);

    // ========================================================
    // Response Object
    // ========================================================

    const response = {
      success: true,
      total: portfolios.length,
      portfolios: portfolios.map((portfolio) => ({
        id: portfolio._id,
        title: portfolio.title,
        slug: portfolio.slug,
        isPublic: portfolio.isPublic,
        status: portfolio.status,
        analysisStatus: portfolio.analysisStatus,
        createdAt: portfolio.createdAt,
        updatedAt: portfolio.updatedAt,
        error: portfolio.error || "",
        generatedCode: {
          html: portfolio.generatedCode?.html || "",
          css: portfolio.generatedCode?.css || "",
          js: portfolio.generatedCode?.js || "",
        },
      })),
    };

    // ========================================================
    // Cache
    // ========================================================

    await redis.set(
      cacheKey,
      JSON.stringify(response),
      "EX",
      CACHE_TIME
    );

    return res.status(200).json({
      ...response,
      fromCache: false,
    });

  } catch (error) {
    console.error("Get All Portfolios Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// 5. DELETE PORTFOLIO
// ============================================================

export const deletePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    // ========================================================
    // Validate User
    // ========================================================

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User ID not found",
      });
    }

    // ========================================================
    // Validate ID
    // ========================================================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid portfolio ID",
      });
    }

    // ========================================================
    // Find Portfolio
    // ========================================================

    const portfolio = await Portfolio.findOne({
      _id: id,
      userId,
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    // ========================================================
    // Delete
    // ========================================================

    await Portfolio.findOneAndDelete({
      _id: id,
      userId,
    });

    // ========================================================
    // Clear Cache
    // ========================================================

    await redis.del(`portfolio:${portfolio.slug}`);
    await redis.del(`user-portfolios:${userId}`);

    // ========================================================
    // Response
    // ========================================================

    return res.status(200).json({
      success: true,
      message: "Portfolio deleted successfully",
    });

  } catch (error) {
    console.error("Delete Portfolio Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};