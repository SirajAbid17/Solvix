import MockInterview from "../models/mockInterview.model.js";
import { extractTextFromPDF } from "../services/pdf.service.js";
import { uploadPDFToCloudinary } from "../services/cloudinary.service.js";
import { generateMockInterview } from "../services/mockInterview.service.js";
import redis from "../../../shared/redis/redis.js";


// ============================================
// Generate Interview (PAID)
// ============================================

export const generateInterview = async (req, res) => {
  try {
    console.log("========== MOCK INTERVIEW START ==========");

    // ✅ Get userId from headers (passed by gateway)
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User ID required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF",
      });
    }

    console.log("1️⃣ PDF received:", req.file.originalname);
    console.log("2️⃣ PDF size:", req.file.size);

    console.log("3️⃣ Starting PDF extraction...");

    const extractedText = await extractTextFromPDF(req.file.buffer);

    console.log("4️⃣ PDF extraction completed. Text length:", extractedText.length);

    console.log("5️⃣ Starting Cloudinary upload...");

    const uploadedPDF = await uploadPDFToCloudinary(req.file.buffer, req.file.originalname);

    console.log("6️⃣ Cloudinary upload completed:", uploadedPDF.secure_url);

    console.log("7️⃣ Starting LangChain/Groq...");

    const interview = await generateMockInterview(extractedText);

    console.log("8️⃣ AI generation completed");

    const totalQuestions =
      interview.dsaQuestions.length +
      interview.technicalQuestions.length +
      interview.projectQuestions.length +
      interview.behavioralQuestions.length +
      interview.hrQuestions.length;

    console.log("9️⃣ Total questions:", totalQuestions);

    // ✅ Store with userId
    const savedInterview = await MockInterview.create({
      userId: userId,
      title: interview.title || "AI Mock Interview",
      pdf: {
        originalName: req.file.originalname,
        url: uploadedPDF.secure_url,
        publicId: uploadedPDF.public_id,
      },
      candidateSummary: interview.candidateSummary,
      candidateLevel: interview.candidateLevel,
      detectedSkills: interview.detectedSkills,
      dsaQuestions: interview.dsaQuestions,
      technicalQuestions: interview.technicalQuestions,
      projectQuestions: interview.projectQuestions,
      behavioralQuestions: interview.behavioralQuestions,
      hrQuestions: interview.hrQuestions,
      totalQuestions,
      status: "generated",
    });

    console.log("🔟 MongoDB save completed");

    // ✅ Cache the interview in Redis
    const cacheKey = `mock-interview:${savedInterview._id}`;
    await redis.set(
      cacheKey,
      JSON.stringify(savedInterview.toObject()),
      "EX",
      60 * 60 * 24 // 24 hours cache
    );

    // ✅ Clear user's interviews cache
    await redis.del(`mock-interviews:${userId}`);

    return res.status(201).json({
      success: true,
      message: "Mock interview generated successfully",
      data: savedInterview,
    });

  } catch (error) {
    console.error("❌ MOCK INTERVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// Get My Interviews
// ============================================

export const getMyInterviews = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User ID required",
      });
    }

    const cacheKey = `mock-interviews:${userId}`;

    // Check Redis cache
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.status(200).json({
        success: true,
        fromCache: true,
        ...JSON.parse(cached),
      });
    }

    const interviews = await MockInterview.find({ userId })
      .select(
        "-dsaQuestions -technicalQuestions -projectQuestions -behavioralQuestions -hrQuestions"
      )
      .sort({ createdAt: -1 });

    const response = {
      success: true,
      total: interviews.length,
      data: interviews,
    };

    // Cache for 5 minutes
    await redis.set(cacheKey, JSON.stringify(response), "EX", 300);

    return res.status(200).json(response);
  } catch (error) {
    console.error("Get Interviews Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// Get Single Interview
// ============================================

export const getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User ID required",
      });
    }

    const cacheKey = `mock-interview:${id}`;

    // Check Redis cache
    const cached = await redis.get(cacheKey);

    if (cached) {
      const interview = JSON.parse(cached);

      // ✅ Verify ownership
      if (String(interview.userId) !== String(userId)) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access",
        });
      }

      return res.status(200).json({
        success: true,
        fromCache: true,
        data: interview,
      });
    }

    const interview = await MockInterview.findById(id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    // ✅ Verify ownership
    if (String(interview.userId) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Cache the interview
    await redis.set(cacheKey, JSON.stringify(interview.toObject()), "EX", 3600);

    return res.status(200).json({
      success: true,
      fromCache: false,
      data: interview,
    });
  } catch (error) {
    console.error("Get Interview Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// Delete Interview
// ============================================

export const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User ID required",
      });
    }

    const interview = await MockInterview.findById(id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    // ✅ Verify ownership
    if (String(interview.userId) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    await MockInterview.findByIdAndDelete(id);

    // ✅ Clear caches
    await redis.del(`mock-interview:${id}`);
    await redis.del(`mock-interviews:${userId}`);

    return res.status(200).json({
      success: true,
      message: "Interview deleted successfully",
    });
  } catch (error) {
    console.error("Delete Interview Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};