import crypto from "crypto";
import Resume from "../models/resume.model.js";
import ResumeAnalysis from "../models/resumeAnalysis.model.js";
import { extractTextFromPDF } from "../services/pdf.service.js";
import { uploadPDFToCloudinary } from "../services/cloudinary.service.js";
import { analyzeResume, findJobs } from "../services/Gemini.service.js";
import redis from "../../../shared/redis/redis.js";

const CACHE_TIME = 60 * 60;

export const uploadResume = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload PDF",
      });
    }

    const pdfHash = crypto
      .createHash("sha256")
      .update(req.file.buffer)
      .digest("hex");

    const cacheKey = `resume:${userId}:${pdfHash}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.status(200).json({
        ...JSON.parse(cached),
        fromCache: true,
      });
    }

    const extractedText = await extractTextFromPDF(req.file.buffer);
    const uploadedFile = await uploadPDFToCloudinary(
      req.file.buffer,
      req.file.originalname
    );

    const resume = await Resume.create({
      userId,
      originalName: req.file.originalname,
      fileUrl: uploadedFile.secure_url,
      extractedText,
      status: "completed",
    });

    const analysis = await analyzeResume(extractedText);
    const jobs = await findJobs(analysis);

    const resumeAnalysis = await ResumeAnalysis.create({
      userId,
      resume: resume._id,
      resumeScore: analysis.resumeScore,
      atsScore: analysis.atsScore,
      summary: analysis.summary,
      strengths: analysis.strengths,
      improvements: analysis.improvements,
      roadmap: analysis.roadmap,
      skillsToImprove: analysis.skillsToImprove,
      nextLearning: analysis.nextLearning,
      missingKeywords: analysis.missingKeywords,
      recommendedRoles: analysis.recommendedRoles,
      sectionScores: analysis.sectionScores,
      jobs,
      aiResponse: analysis,
    });

    const response = {
      success: true,
      message: "Resume analyzed successfully",
      resume,
      analysis: resumeAnalysis,
      jobs,
    };

    await redis.set(cacheKey, JSON.stringify(response), "EX", CACHE_TIME);
    await redis.del(`my-resumes:${userId}`);

    return res.status(201).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const myResumes = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const cacheKey = `my-resumes:${userId}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.json({
        ...JSON.parse(cached),
        fromCache: true,
      });
    }

    const data = await ResumeAnalysis.find({
      userId,
    })
      .populate("resume")
      .sort({ createdAt: -1 });

    const response = {
      success: true,
      total: data.length,
      data,
    };

    await redis.set(cacheKey, JSON.stringify(response), "EX", CACHE_TIME);
    return res.json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};