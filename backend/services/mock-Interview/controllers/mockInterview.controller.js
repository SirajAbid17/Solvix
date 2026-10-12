import MockInterview from "../models/mockInterview.model.js";
import { extractTextFromPDF } from "../services/pdf.service.js";
import { uploadPDFToCloudinary } from "../services/cloudinary.service.js";
import { generateMockInterview } from "../services/mockInterview.service.js";
import redis from "../../../shared/redis/redis.js";

export const generateInterview = async (req, res) => {
  try {
   
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

   

    const extractedText = await extractTextFromPDF(req.file.buffer);


    const uploadedPDF = await uploadPDFToCloudinary(req.file.buffer, req.file.originalname);

    

    const interview = await generateMockInterview(extractedText);

   

    const totalQuestions =
      interview.dsaQuestions.length +
      interview.technicalQuestions.length +
      interview.projectQuestions.length +
      interview.behavioralQuestions.length +
      interview.hrQuestions.length;

  
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

    
    const cacheKey = `mock-interview:${savedInterview._id}`;
    await redis.set(
      cacheKey,
      JSON.stringify(savedInterview.toObject()),
      "EX",
      60 * 60 * 24 
    );

    
    await redis.del(`mock-interviews:${userId}`);

    return res.status(201).json({
      success: true,
      message: "Mock interview generated successfully",
      data: savedInterview,
    });

  } catch (error) {
    console.error("??? MOCK INTERVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


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

    
    const cached = await redis.get(cacheKey);

    if (cached) {
      const interview = JSON.parse(cached);

      
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

  
    if (String(interview.userId) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    
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

  
    if (String(interview.userId) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    await MockInterview.findByIdAndDelete(id);

    
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


export const generateNextBatch = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User ID required",
      });
    }

    const { id } = req.params;

    
    const existing = await MockInterview.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    if (String(existing.userId) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

  
    console.log("???? Fetching resume PDF for next batch...");

  
    const pdfResponse = await fetch(existing.pdf.url);
    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());

    const { extractTextFromPDF } = await import(
      "../services/pdf.service.js"
    );
    const extractedText = await extractTextFromPDF(pdfBuffer);

   
    const previousTopics = [
      ...existing.dsaQuestions.map((q) => `DSA: ${q.question}`),
      ...existing.technicalQuestions.map((q) => `Tech: ${q.question}`),
      ...existing.projectQuestions.map((q) => `Project: ${q.question}`),
      ...existing.behavioralQuestions.map((q) => `Behavioral: ${q.question}`),
      ...existing.hrQuestions.map((q) => `HR: ${q.question}`),
    ];

    
    const currentBatch = Math.floor(previousTopics.length / 15) + 1;

    console.log(`???? Generating batch #${currentBatch + 1}...`);


    const { generateMockInterview } = await import(
      "../services/mockInterview.service.js"
    );

    const newBatch = await generateMockInterview(extractedText, {
      batchNumber: currentBatch + 1,
      previousTopics,
    });

    
    existing.dsaQuestions.push(...newBatch.dsaQuestions);
    existing.technicalQuestions.push(...newBatch.technicalQuestions);
    existing.projectQuestions.push(...newBatch.projectQuestions);
    existing.behavioralQuestions.push(...newBatch.behavioralQuestions);
    existing.hrQuestions.push(...newBatch.hrQuestions);

    existing.totalQuestions =
      existing.dsaQuestions.length +
      existing.technicalQuestions.length +
      existing.projectQuestions.length +
      existing.behavioralQuestions.length +
      existing.hrQuestions.length;

    await existing.save();

    
    await redis.del(`mock-interview:${id}`);
    await redis.del(`mock-interviews:${userId}`);

    console.log(`??? Batch #${currentBatch + 1} added. Total now: ${existing.totalQuestions}`);

    return res.status(200).json({
      success: true,
      message: `Batch ${currentBatch + 1} generated successfully`,
      data: existing,
    });
  } catch (error) {
    console.error("??? Generate Next Batch Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};