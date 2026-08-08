// controllers/cv.controller.js
import cvModel from "../models/cv.model.js";
import { CacheService } from "../services/cache.service.js";
import { CVBuilder } from "../services/cvBuilder.service.js";
import { deleteImage } from "../services/cloudinary.service.js";
import {
  parseBody,
  parseSkills,
  parseStructuredData,
  parseCertifications,
  parseLanguages,
  parseAwards,
  parsePublications,
  parseReferences,
  parseCustomSections,
  parseArrayData,
} from "../utils/parsers.js";

const checkUserId = (req, res) => {
  const userId = req.headers["x-user-id"];
  if (!userId) {
    res.status(401).json({ 
      success: false, 
      message: "Unauthorized - User ID required" 
    });
    return null;
  }
  return userId;
};

const handleCacheResponse = async (res, cacheKey, data) => {
  await CacheService.set(cacheKey, data);
  return res.status(200).json({ ...data, fromCache: true });
};

export const createCV = async (req, res) => {
  try {
    const userId = checkUserId(req, res);
    if (!userId) return;

    const body = parseBody(req.body);
    console.log("Received body:", JSON.stringify(body, null, 2));

    if (!body.fullName) {
      return res.status(400).json({ 
        success: false, 
        message: "Full name is required" 
      });
    }

    // Parse all data
    const parsedData = {
      skills: parseSkills(body.skills),
      workExperience: parseStructuredData(body.workExperience, "workExperience"),
      education: parseStructuredData(body.education, "education"),
      projects: parseStructuredData(body.projects, "projects"),
      certifications: parseCertifications(body.certifications),
      languages: parseLanguages(body.languages),
      interests: parseArrayData(body.interests),
      hobbies: parseArrayData(body.hobbies),
      tags: parseArrayData(body.tags),
      awards: parseAwards(body.awards),
      publications: parsePublications(body.publications),
      references: parseReferences(body.references),
      customSections: parseCustomSections(body.customSections),
      volunteering: parseStructuredData(body.volunteering, "volunteering"),
    };

    // Handle profile image
    let profileImage = null;
    if (req.file) {
      profileImage = await CVBuilder.handleProfileImageUpload(
        req.file,
        userId,
        body.fullName
      );
    }

    // Generate AI resume
    const aiResume = await CVBuilder.generateAIResume({
      ...body,
      ...parsedData,
    });

    // Build CV data
    const cvData = CVBuilder.buildCVData(
      { ...body, ...parsedData },
      userId,
      profileImage,
      aiResume
    );

    const cv = await cvModel.create(cvData);
    await CacheService.clearCaches(userId);

    return res.status(201).json({
      success: true,
      message: "CV created successfully",
      data: cv,
      ai: aiResume,
    });
  } catch (error) {
    console.error("Create CV Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create CV",
      details: error.errors || error,
    });
  }
};

export const getMyCVs = async (req, res) => {
  try {
    const userId = checkUserId(req, res);
    if (!userId) return;

    const cacheKey = CacheService.buildCacheKey("my-cvs", userId);
    const cached = await CacheService.get(cacheKey);
    if (cached) {
      return handleCacheResponse(res, cacheKey, cached);
    }

    const cvs = await cvModel
      .find({ userId, status: { $ne: "deleted" } })
      .select("-generatedResume -previousVersions -ai")
      .sort({ isPrimary: -1, createdAt: -1 });

    const response = { success: true, total: cvs.length, data: cvs };
    await CacheService.set(cacheKey, response);

    return res.status(200).json(response);
  } catch (error) {
    console.error("Get CVs Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch CVs",
    });
  }
};

export const getCVById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = checkUserId(req, res);
    if (!userId) return;

    const cacheKey = CacheService.buildCacheKey("cv-detail", userId, id);
    const cached = await CacheService.get(cacheKey);
    if (cached) {
      return handleCacheResponse(res, cacheKey, cached);
    }

    const cv = await cvModel.findOne({
      _id: id,
      userId,
      status: { $ne: "deleted" },
    });

    if (!cv) {
      return res.status(404).json({ 
        success: false, 
        message: "CV not found" 
      });
    }

    // Update analytics
    cv.analytics = cv.analytics || {};
    cv.analytics.views = (cv.analytics.views || 0) + 1;
    cv.analytics.lastViewed = new Date();
    await cv.save();

    const response = { success: true, data: cv };
    await CacheService.set(cacheKey, response);

    return res.status(200).json(response);
  } catch (error) {
    console.error("Get CV Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch CV",
    });
  }
};

export const updateCV = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = checkUserId(req, res);
    if (!userId) return;

    const body = parseBody(req.body);
    const existingCV = await cvModel.findOne({ _id: id, userId });
    if (!existingCV) {
      return res.status(404).json({ 
        success: false, 
        message: "CV not found" 
      });
    }

    // Parse all data
    const parsedData = {
      skills: parseSkills(body.skills),
      workExperience: parseStructuredData(body.workExperience, "workExperience"),
      education: parseStructuredData(body.education, "education"),
      projects: parseStructuredData(body.projects, "projects"),
      certifications: parseCertifications(body.certifications),
      languages: parseLanguages(body.languages),
      interests: parseArrayData(body.interests),
      hobbies: parseArrayData(body.hobbies),
      tags: parseArrayData(body.tags),
      awards: parseAwards(body.awards),
      publications: parsePublications(body.publications),
      references: parseReferences(body.references),
      customSections: parseCustomSections(body.customSections),
      volunteering: parseStructuredData(body.volunteering, "volunteering"),
    };

    // Handle profile image
    let profileImage = existingCV.profileImage;
    if (req.file) {
      if (existingCV.profileImage?.publicId) {
        try {
          await deleteImage(existingCV.profileImage.publicId);
        } catch (error) {
          console.error("Delete old image error:", error);
        }
      }
      profileImage = await CVBuilder.handleProfileImageUpload(
        req.file,
        userId,
        body.fullName || existingCV.personal?.fullName
      );
    }

    if (body.removeImage === true) {
      if (existingCV.profileImage?.publicId) {
        try {
          await deleteImage(existingCV.profileImage.publicId);
        } catch (error) {
          console.error("Delete image error:", error);
        }
      }
      profileImage = null;
    }

    // Generate AI resume if content changed
    let aiResume = null;
    const contentChanged = !!(body.fullName || body.skills || body.workExperience || body.summary || body.objective);

    if (contentChanged) {
      aiResume = await CVBuilder.generateAIResume({
        ...existingCV.toObject(),
        ...body,
        ...parsedData,
      });
    }

    // Build update data
    let updateData = CVBuilder.buildUpdateData(
      { ...body, ...parsedData },
      existingCV,
      profileImage,
      aiResume
    );

    // Handle versioning
    updateData = await CVBuilder.handleVersioning(
      existingCV, 
      updateData, 
      contentChanged,
      body.versionReason
    );

    const updatedCV = await cvModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    await CacheService.clearCaches(userId, id);

    return res.status(200).json({
      success: true,
      message: "CV updated successfully",
      data: updatedCV,
      ai: aiResume,
    });
  } catch (error) {
    console.error("Update CV Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update CV",
    });
  }
};

export const deleteCV = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = checkUserId(req, res);
    if (!userId) return;

    const cv = await cvModel.findOne({ _id: id, userId });
    if (!cv) {
      return res.status(404).json({ 
        success: false, 
        message: "CV not found" 
      });
    }

    cv.status = "deleted";
    cv.archivedAt = new Date();
    await cv.save();

    await CacheService.clearCaches(userId, id);
    return res.status(200).json({
      success: true,
      message: "CV deleted successfully",
    });
  } catch (error) {
    console.error("Delete CV Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete CV",
    });
  }
};

export const removeProfileImage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = checkUserId(req, res);
    if (!userId) return;

    const cv = await cvModel.findOne({ _id: id, userId });
    if (!cv) {
      return res.status(404).json({ 
        success: false, 
        message: "CV not found" 
      });
    }

    if (cv.profileImage?.publicId) {
      await deleteImage(cv.profileImage.publicId);
    }

    cv.profileImage = null;
    await cv.save();

    await CacheService.clearCaches(userId, id);
    return res.status(200).json({
      success: true,
      message: "Profile image removed successfully",
      data: cv,
    });
  } catch (error) {
    console.error("Remove Image Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to remove image",
    });
  }
};