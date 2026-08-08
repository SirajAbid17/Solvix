// services/cvBuilder.service.js
import { generateResume } from "./cv.service.js";
import {
  uploadProfileImage,
  deleteImage,
} from "./cloudinary.service.js";

export class CVBuilder {
  static async handleProfileImageUpload(file, userId, fullName) {
    if (!file) return null;
    try {
      const uploaded = await uploadProfileImage(
        file.buffer,
        file.originalname,
        userId,
      );
      return {
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
        alt: `${fullName || "User"}'s profile image`,
      };
    } catch (error) {
      console.error("Profile image upload error:", error);
      return null;
    }
  }

  static async generateAIResume(data) {
    try {
      const aiData = {
        fullName: data.fullName,
        jobTitle: data.jobTitle,
        email: data.email,
        phone: data.phone,
        country: data.country,
        city: data.city,
        summary: data.summary,
        objective: data.objective,
        skills: data.skills,
        workExperience: data.workExperience,
        education: data.education,
        projects: data.projects,
        certifications: data.certifications?.map((c) => c.title) || [],
        languages: data.languages?.map((l) => l.language) || [],
        interests: data.interests || [],
        hobbies: data.hobbies || [],
        linkedin: data.linkedin,
        github: data.github,
        portfolio: data.portfolio,
        website: data.website,
        twitter: data.twitter,
      };
      return await generateResume(aiData);
    } catch (error) {
      console.error("AI Generation Error:", error);
      return null;
    }
  }

  static normalizeVolunteering(volunteering) {
    if (!volunteering || !Array.isArray(volunteering)) return [];
    
    return volunteering.map(item => ({
      organization: item.organization || "",
      role: item.role || "",
      startDate: item.startDate || null,
      endDate: item.endDate || null,
      current: item.current || false,
      description: item.description || "",
    }));
  }

  static buildCVData(body, userId, profileImage, aiResume) {
    return {
      userId,
      title: body.fullName || "My Resume",
      templateId: body.templateId || 1,

      personal: this.buildPersonalInfo(body),
      social: this.buildSocialLinks(body),

      summary: body.summary || "",
      objective: body.objective || "",

      skills: body.skills || { technical: [], soft: [], tools: [], frameworks: [], databases: [], cloud: [], languages: [] },
      workExperience: body.workExperience || [],
      education: body.education || [],
      projects: body.projects || [],
      certifications: body.certifications || [],
      languages: body.languages || [],
      awards: body.awards || [],
      publications: body.publications || [],
      interests: body.interests || [],
      hobbies: body.hobbies || [],
      volunteering: this.normalizeVolunteering(body.volunteering),
      references: body.references || [],
      customSections: body.customSections || [],

      profileImage: profileImage,

      resumeSettings: this.buildResumeSettings(body),
      ai: this.buildAIData(aiResume),
      generatedResume: aiResume?.resume || null,
      htmlContent: aiResume?.htmlContent || null,
      aiModel: "gpt-3.5-turbo",

      visibility: body.visibility || "private",
      status: body.status || "completed",
      isPrimary: body.isPrimary || false,
      tags: body.tags || [],
      notes: body.notes || "",
      lastActivity: new Date(),
      version: 1,
    };
  }

  static buildPersonalInfo(body) {
    return {
      fullName: body.fullName || "",
      jobTitle: body.jobTitle || "",
      email: body.email || "",
      phone: body.phone || "",
      alternatePhone: body.alternatePhone || "",
      country: body.country || "",
      city: body.city || "",
      address: body.address || "",
      postalCode: body.postalCode || "",
      nationality: body.nationality || "",
      dateOfBirth: body.dateOfBirth || null,
      maritalStatus: body.maritalStatus || "Single",
      gender: body.gender || "Prefer not to say",
      drivingLicense: body.drivingLicense || "",
    };
  }

  static buildSocialLinks(body) {
    return {
      linkedin: body.linkedin || "",
      github: body.github || "",
      portfolio: body.portfolio || "",
      website: body.website || "",
      twitter: body.twitter || "",
      stackoverflow: body.stackoverflow || "",
      medium: body.medium || "",
      kaggle: body.kaggle || "",
      leetcode: body.leetcode || "",
      hackerrank: body.hackerrank || "",
      codeforces: body.codeforces || "",
      devto: body.devto || "",
      behance: body.behance || "",
      dribbble: body.dribbble || "",
      youtube: body.youtube || "",
    };
  }

  static buildResumeSettings(body) {
    return {
      font: body.resumeSettings?.font || "Inter",
      fontSize: body.resumeSettings?.fontSize || 11,
      color: body.resumeSettings?.color || "#2563eb",
      template: body.resumeSettings?.template || "modern",
      pageSize: body.resumeSettings?.pageSize || "A4",
      margins: body.resumeSettings?.margins || {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      },
      lineSpacing: body.resumeSettings?.lineSpacing || 1.5,
      showPhoto: true,
      showSocialLinks: true,
      showLanguages: true,
      showAwards: true,
      showPublications: true,
      showVolunteering: false,
      showInterests: true,
      sectionOrder: [],
    };
  }

  static buildAIData(aiResume) {
    return {
      generatedSummary: aiResume?.professionalSummary || "",
      atsScore: aiResume?.atsScore || 0,
      strengths: aiResume?.strengths || [],
      weaknesses: aiResume?.weaknesses || [],
      suggestions: aiResume?.suggestions || [],
      missingKeywords: aiResume?.missingKeywords || [],
      improvedSkills: aiResume?.improvedSkills || [],
      optimizedResume: aiResume || null,
      keywordMatch: [],
      grammarCheck: [],
      improvementScore: 0,
    };
  }

  static buildUpdateData(body, existingCV, profileImage, aiResume) {
    const updateData = {
      title: body.fullName || existingCV.title,
      templateId: body.templateId || existingCV.templateId || 1,

      personal: {
        ...existingCV.personal,
        ...this.buildPersonalInfo(body),
      },

      social: {
        ...existingCV.social,
        ...this.buildSocialLinks(body),
      },

      summary: body.summary || existingCV.summary || "",
      objective: body.objective || existingCV.objective || "",

      skills: body.skills || existingCV.skills || { technical: [], soft: [], tools: [], frameworks: [], databases: [], cloud: [], languages: [] },
      workExperience: body.workExperience || existingCV.workExperience || [],
      education: body.education || existingCV.education || [],
      projects: body.projects || existingCV.projects || [],
      certifications: body.certifications || existingCV.certifications || [],
      languages: body.languages || existingCV.languages || [],
      awards: body.awards || existingCV.awards || [],
      publications: body.publications || existingCV.publications || [],
      interests: body.interests || existingCV.interests || [],
      hobbies: body.hobbies || existingCV.hobbies || [],
      volunteering: this.normalizeVolunteering(body.volunteering) || existingCV.volunteering || [],
      references: body.references || existingCV.references || [],
      customSections: body.customSections || existingCV.customSections || [],

      profileImage: profileImage,

      resumeSettings: {
        ...existingCV.resumeSettings,
        ...(body.resumeSettings || {}),
      },

      visibility: body.visibility || existingCV.visibility,
      status: body.status || existingCV.status,
      isPrimary: body.isPrimary || existingCV.isPrimary,
      tags: body.tags || existingCV.tags || [],
      notes: body.notes || existingCV.notes,
      lastActivity: new Date(),
    };

    if (aiResume) {
      updateData.generatedResume = aiResume.resume;
      updateData.htmlContent = aiResume.htmlContent || null;
      updateData.ai = {
        ...existingCV.ai,
        ...this.buildAIData(aiResume),
      };
      updateData.aiModel = "gpt-3.5-turbo";
    }

    return updateData;
  }

  static async handleVersioning(existingCV, updateData, contentChanged, versionReason) {
    if (contentChanged) {
      updateData.version = (existingCV.version || 1) + 1;
      if (!existingCV.previousVersions) {
        existingCV.previousVersions = [];
      }
      existingCV.previousVersions.push({
        version: existingCV.version || 1,
        data: existingCV.toObject(),
        updatedAt: new Date(),
        reason: versionReason || "Updated content",
      });
    }
    return updateData;
  }
}