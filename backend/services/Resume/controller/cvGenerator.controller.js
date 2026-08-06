// controller/cv.controller.js
import cvModel from "../models/cv.model.js";
import { generateResume } from "../services/cv.service.js";
import { uploadProfileImage, deleteImage } from "../services/cloudinary.service.js";
import redis from "../../../shared/redis/redis.js";

const CACHE_TIME = 60 * 60; // 1 hour

// Create CV with optional profile image
export const createCV = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User ID required",
      });
    }

    // Parse body (handle both JSON and form-data)
    let body = req.body;
    if (req.body.data) {
      try {
        body = JSON.parse(req.body.data);
      } catch (e) {
        body = req.body;
      }
    }

    // Validate required fields
    if (!body.fullName) {
      return res.status(400).json({
        success: false,
        message: "Full name is required",
      });
    }

    // Handle profile image upload if present
    let profileImage = null;
    if (req.file) {
      try {
        const uploadedImage = await uploadProfileImage(
          req.file.buffer,
          req.file.originalname,
          userId
        );
        profileImage = {
          url: uploadedImage.secure_url,
          publicId: uploadedImage.public_id,
          alt: `${body.fullName}'s profile image`,
        };
      } catch (error) {
        console.error("Image Upload Error:", error);
        // Continue without image if upload fails
      }
    }

    // Generate cache key
    const cacheKey = `cv:${userId}:${JSON.stringify(body).slice(0, 100)}`;

    // Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json({
        ...JSON.parse(cached),
        fromCache: true,
      });
    }

    // Generate AI resume
    const aiResume = await generateResume(body);

    // Create CV in database
    const cv = await cvModel.create({
      userId,
      ...body,
      profileImage,
      generatedResume: aiResume.resume,
      aiModel: "llama-3.3-70b-versatile",
    });

    const response = {
      success: true,
      message: "CV generated successfully",
      cv,
      ai: aiResume,
    };

    // Cache the response
    await redis.set(cacheKey, JSON.stringify(response), "EX", CACHE_TIME);
    await redis.del(`my-cvs:${userId}`);

    return res.status(201).json(response);
  } catch (error) {
    console.error("CV Generation Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate CV",
    });
  }
};

// Update CV with image
export const updateCV = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User ID required",
      });
    }

    // Parse body
    let body = req.body;
    if (req.body.data) {
      try {
        body = JSON.parse(req.body.data);
      } catch (e) {
        body = req.body;
      }
    }

    // Check if CV exists and belongs to user
    const existingCV = await cvModel.findOne({ _id: id, userId });
    if (!existingCV) {
      return res.status(404).json({
        success: false,
        message: "CV not found",
      });
    }

    // Handle profile image upload if present
    let profileImage = existingCV.profileImage;
    if (req.file) {
      // Delete old image if exists
      if (existingCV.profileImage?.publicId) {
        try {
          await deleteImage(existingCV.profileImage.publicId);
        } catch (error) {
          console.error("Delete old image error:", error);
        }
      }

      // Upload new image
      try {
        const uploadedImage = await uploadProfileImage(
          req.file.buffer,
          req.file.originalname,
          userId
        );
        profileImage = {
          url: uploadedImage.secure_url,
          publicId: uploadedImage.public_id,
          alt: `${body.fullName || existingCV.fullName}'s profile image`,
        };
      } catch (error) {
        console.error("Image Upload Error:", error);
      }
    }

    // Remove image from body if it's a string (from form-data)
    if (body.profileImage === "undefined" || body.profileImage === "null") {
      delete body.profileImage;
    }

    // Regenerate AI resume if content changed
    let aiResume = null;
    if (body.fullName || body.skills || body.workExperience) {
      const updatedData = { ...existingCV.toObject(), ...body };
      aiResume = await generateResume(updatedData);
      body.generatedResume = aiResume.resume;
    }

    const updatedCV = await cvModel.findByIdAndUpdate(
      id,
      { 
        ...body, 
        profileImage,
        aiModel: "llama-3.3-70b-versatile" 
      },
      { new: true, runValidators: true }
    );

    // Clear caches
    await redis.del(`cv:${userId}:*`);
    await redis.del(`my-cvs:${userId}`);

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

// Delete CV with image
export const deleteCV = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User ID required",
      });
    }

    const cv = await cvModel.findOne({ _id: id, userId });

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: "CV not found",
      });
    }

    // Delete profile image from Cloudinary
    if (cv.profileImage?.publicId) {
      try {
        await deleteImage(cv.profileImage.publicId);
      } catch (error) {
        console.error("Delete image error:", error);
      }
    }

    await cvModel.findByIdAndDelete(id);

    // Clear caches
    await redis.del(`my-cvs:${userId}`);
    await redis.del(`cv:${userId}:*`);

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

// Remove profile image only
export const removeProfileImage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User ID required",
      });
    }

    const cv = await cvModel.findOne({ _id: id, userId });

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: "CV not found",
      });
    }

    // Delete image from Cloudinary
    if (cv.profileImage?.publicId) {
      await deleteImage(cv.profileImage.publicId);
    }

    // Remove image from database
    cv.profileImage = undefined;
    await cv.save();

    // Clear caches
    await redis.del(`my-cvs:${userId}`);
    await redis.del(`cv:${userId}:*`);

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

// Get my CVs (existing)
export const getMyCVs = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User ID required",
      });
    }

    const cacheKey = `my-cvs:${userId}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.status(200).json({
        ...JSON.parse(cached),
        fromCache: true,
      });
    }

    const cvs = await cvModel
      .find({ userId })
      .select("-generatedResume")
      .sort({ createdAt: -1 });

    const response = {
      success: true,
      total: cvs.length,
      data: cvs,
    };

    await redis.set(cacheKey, JSON.stringify(response), "EX", CACHE_TIME);

    return res.status(200).json(response);
  } catch (error) {
    console.error("Get CVs Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch CVs",
    });
  }
};

// Get single CV (existing)
export const getCVById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User ID required",
      });
    }

    const cv = await cvModel.findOne({ _id: id, userId });

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: "CV not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: cv,
    });
  } catch (error) {
    console.error("Get CV Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch CV",
    });
  }
};