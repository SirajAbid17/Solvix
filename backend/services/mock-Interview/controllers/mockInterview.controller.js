import MockInterview from "../models/mockInterview.model.js";

import {
  extractTextFromPDF,
} from "../services/pdf.service.js";

import {
  uploadPDFToCloudinary,
} from "../services/cloudinary.service.js";

import {
  generateMockInterview,
} from "../services/mockInterview.service.js";


// ============================================
// Generate Interview
// ============================================

export const generateInterview = async (req, res) => {
  try {
    console.log("========== MOCK INTERVIEW START ==========");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF",
      });
    }

    console.log("1️⃣ PDF received:", req.file.originalname);
    console.log("2️⃣ PDF size:", req.file.size);

    console.log("3️⃣ Starting PDF extraction...");

    const extractedText = await extractTextFromPDF(
      req.file.buffer
    );

    console.log(
      "4️⃣ PDF extraction completed. Text length:",
      extractedText.length
    );

    console.log("5️⃣ Starting Cloudinary upload...");

    const uploadedPDF = await uploadPDFToCloudinary(
      req.file.buffer,
      req.file.originalname
    );

    console.log(
      "6️⃣ Cloudinary upload completed:",
      uploadedPDF.secure_url
    );

    console.log("7️⃣ Starting LangChain/Groq...");

    const interview = await generateMockInterview(
      extractedText
    );

    console.log("8️⃣ AI generation completed");

    const totalQuestions =
      interview.dsaQuestions.length +
      interview.technicalQuestions.length +
      interview.projectQuestions.length +
      interview.behavioralQuestions.length +
      interview.hrQuestions.length;

    console.log(
      "9️⃣ Total questions:",
      totalQuestions
    );

    const savedInterview =
      await MockInterview.create({
        userId: req.headers["x-user-id"] || null,

        title:
          interview.title || "AI Mock Interview",

        pdf: {
          originalName: req.file.originalname,
          url: uploadedPDF.secure_url,
          publicId: uploadedPDF.public_id,
        },

        candidateSummary:
          interview.candidateSummary,

        candidateLevel:
          interview.candidateLevel,

        detectedSkills:
          interview.detectedSkills,

        dsaQuestions:
          interview.dsaQuestions,

        technicalQuestions:
          interview.technicalQuestions,

        projectQuestions:
          interview.projectQuestions,

        behavioralQuestions:
          interview.behavioralQuestions,

        hrQuestions:
          interview.hrQuestions,

        totalQuestions,

        status: "generated",
      });

    console.log("🔟 MongoDB save completed");

    return res.status(201).json({
      success: true,
      message:
        "Mock interview generated successfully",
      data: savedInterview,
    });

  } catch (error) {
    console.error(
      "❌ MOCK INTERVIEW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// Get My Interviews
// ============================================

export const getMyInterviews = async (
  req,
  res
) => {
  try {
    const userId =
      req.headers["x-user-id"];

    const filter = userId
      ? { userId }
      : {};

    const interviews =
      await MockInterview.find(filter)
        .select(
          "-dsaQuestions -technicalQuestions -projectQuestions -behavioralQuestions -hrQuestions"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      total: interviews.length,
      data: interviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ============================================
// Get Single Interview
// ============================================

export const getInterviewById =
  async (req, res) => {
    try {
      const {
        id,
      } = req.params;

      const interview =
        await MockInterview.findById(id);

      if (!interview) {
        return res.status(404).json({
          success: false,
          message:
            "Interview not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: interview,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


// ============================================
// Delete Interview
// ============================================

export const deleteInterview =
  async (req, res) => {
    try {
      const {
        id,
      } = req.params;

      const interview =
        await MockInterview.findById(id);

      if (!interview) {
        return res.status(404).json({
          success: false,
          message:
            "Interview not found",
        });
      }

      await MockInterview.findByIdAndDelete(
        id
      );

      return res.status(200).json({
        success: true,
        message:
          "Interview deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };