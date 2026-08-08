// models/cv.model.js
import mongoose from "mongoose";

// ============================================
// Embedded Sub-Schemas
// ============================================

const socialSchema = new mongoose.Schema({
  linkedin: { type: String, trim: true },
  github: { type: String, trim: true },
  portfolio: { type: String, trim: true },
  website: { type: String, trim: true },
  twitter: { type: String, trim: true },
  stackoverflow: { type: String, trim: true },
  medium: { type: String, trim: true },
  kaggle: { type: String, trim: true },
  leetcode: { type: String, trim: true },
  hackerrank: { type: String, trim: true },
  codeforces: { type: String, trim: true },
  devto: { type: String, trim: true },
  behance: { type: String, trim: true },
  dribbble: { type: String, trim: true },
  youtube: { type: String, trim: true },
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  employmentType: {
    type: String,
    enum: ["Full-time", "Part-time", "Internship", "Freelance", "Contract", "Temporary", "Volunteer"],
    default: "Full-time",
  },
  location: { type: String, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  currentlyWorking: { type: Boolean, default: false },
  responsibilities: [{ type: String, trim: true }],
  achievements: [{ type: String, trim: true }],
  technologies: [{ type: String, trim: true }],
  teamSize: { type: Number, min: 0 },
  reportingTo: { type: String, trim: true },
  industry: { type: String, trim: true },
  description: { type: String, trim: true },
}, { _id: false, timestamps: true });

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true, trim: true },
  degree: { type: String, required: true, trim: true },
  field: { type: String, required: true, trim: true },
  grade: { type: String, trim: true },
  cgpa: { type: String, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  currentlyStudying: { type: Boolean, default: false },
  description: { type: String, trim: true },
  achievements: [{ type: String, trim: true }],
  location: { type: String, trim: true },
  website: { type: String, trim: true },
}, { _id: false, timestamps: true });

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  role: { type: String, trim: true },
  description: { type: String, required: true, trim: true },
  technologies: [{ type: String, trim: true }],
  github: { type: String, trim: true },
  liveDemo: { type: String, trim: true },
  screenshots: [{ type: String, trim: true }],
  achievements: [{ type: String, trim: true }],
  startDate: { type: Date },
  endDate: { type: Date },
  teamSize: { type: Number, min: 0 },
  challenges: [{ type: String, trim: true }],
  outcomes: [{ type: String, trim: true }],
  repository: { type: String, trim: true },
  documentation: { type: String, trim: true },
}, { _id: false, timestamps: true });

const certificationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  organization: { type: String, required: true, trim: true },
  issueDate: { type: Date, required: true },
  expiryDate: { type: Date },
  credentialId: { type: String, trim: true },
  credentialUrl: { type: String, trim: true },
  skills: [{ type: String, trim: true }],
  isActive: { type: Boolean, default: true },
}, { _id: false, timestamps: true });

const languageSchema = new mongoose.Schema({
  language: { type: String, required: true, trim: true },
  level: {
    type: String,
    enum: ["Native", "Fluent", "Professional", "Intermediate", "Basic", "Beginner"],
    default: "Intermediate",
  },
  proficiency: {
    type: Number,
    min: 0,
    max: 100,
    validate: {
      validator: Number.isInteger,
      message: "Proficiency must be an integer between 0 and 100",
    },
  },
  isNative: { type: Boolean, default: false },
}, { _id: false });

const referenceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  designation: { type: String, trim: true },
  company: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  relationship: { type: String, trim: true },
  isProfessional: { type: Boolean, default: true },
}, { _id: false });

const awardSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  organization: { type: String, required: true, trim: true },
  year: { type: String, trim: true },
  description: { type: String, trim: true },
  date: { type: Date },
  category: { type: String, trim: true },
}, { _id: false });

const publicationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  publisher: { type: String, required: true, trim: true },
  url: { type: String, trim: true },
  date: { type: Date, required: true },
  authors: [{ type: String, trim: true }],
  doi: { type: String, trim: true },
  citationCount: { type: Number, default: 0 },
  abstract: { type: String, trim: true },
}, { _id: false });

const skillCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  skills: [{ type: String, trim: true }],
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
    default: "Intermediate",
  },
}, { _id: false });

const volunteeringSchema = new mongoose.Schema({
  organization: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  startDate: { type: Date },
  endDate: { type: Date },
  currentlyVolunteering: { type: Boolean, default: false },
  cause: { type: String, trim: true },
  achievements: [{ type: String, trim: true }],
}, { _id: false, timestamps: true });

const customSectionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true, trim: true },
  items: [{ type: String, trim: true }],
  order: { type: Number, default: 0 },
}, { _id: false });

// ============================================
// Main CV/Resume Schema
// ============================================

const cvSchema = new mongoose.Schema({
  // User & Basic Information
  userId: {
    type: String,
    required: [true, "User ID is required"],
    index: true,
  },
  
  templateId: {
    type: Number,
    default: 1,
    min: 1,
    max: 50,
  },
  
  title: {
    type: String,
    default: "My Resume",
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"],
  },

  // ============================================
  // Personal Information
  // ============================================
  personal: {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    jobTitle: {
      type: String,
      trim: true,
      maxlength: [100, "Job title cannot exceed 100 characters"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s-()]+$/, "Please enter a valid phone number"],
    },
    alternatePhone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s-()]+$/, "Please enter a valid phone number"],
    },
    country: { type: String, trim: true },
    city: { type: String, trim: true },
    address: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    nationality: { type: String, trim: true },
    dateOfBirth: { type: Date },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed", "Other"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Non-binary", "Prefer not to say"],
    },
    drivingLicense: { type: String, trim: true },
  },

  // ============================================
  // Social & Links
  // ============================================
  social: socialSchema,

  // ============================================
  // Professional Summary
  // ============================================
  summary: {
    type: String,
    trim: true,
    maxlength: [5000, "Summary cannot exceed 5000 characters"],
  },
  
  objective: {
    type: String,
    trim: true,
    maxlength: [2000, "Objective cannot exceed 2000 characters"],
  },

  // ============================================
  // Skills - Enhanced Structure
  // ============================================
  skills: {
    technical: [{ type: String, trim: true }],
    soft: [{ type: String, trim: true }],
    tools: [{ type: String, trim: true }],
    frameworks: [{ type: String, trim: true }],
    databases: [{ type: String, trim: true }],
    cloud: [{ type: String, trim: true }],
    languages: [{ type: String, trim: true }],
    categories: [skillCategorySchema],
    topSkills: [{ type: String, trim: true }],
    skillRatings: [{
      name: { type: String, trim: true },
      rating: { type: Number, min: 0, max: 100 },
      category: { type: String, trim: true },
    }],
  },

  // ============================================
  // Work Experience
  // ============================================
  workExperience: [experienceSchema],
  
  // ============================================
  // Education
  // ============================================
  education: [educationSchema],

  // ============================================
  // Projects
  // ============================================
  projects: [projectSchema],

  // ============================================
  // Certifications
  // ============================================
  certifications: [certificationSchema],

  // ============================================
  // Languages
  // ============================================
  languages: [languageSchema],

  // ============================================
  // Awards & Honors
  // ============================================
  awards: [awardSchema],

  // ============================================
  // Publications
  // ============================================
  publications: [publicationSchema],

  // ============================================
  // Interests & Hobbies
  // ============================================
  interests: [{ type: String, trim: true }],
  hobbies: [{ type: String, trim: true }],

  // ============================================
  // Volunteering
  // ============================================
  volunteering: [volunteeringSchema],

  // ============================================
  // References
  // ============================================
  references: [referenceSchema],

  // ============================================
  // Custom Sections
  // ============================================
  customSections: [customSectionSchema],

  // ============================================
  // Profile Image
  // ============================================
  profileImage: {
    url: { type: String, trim: true },
    publicId: { type: String, trim: true },
    alt: { type: String, trim: true },
    size: { type: Number },
    format: { type: String, trim: true },
  },

  // ============================================
  // Resume Settings & Customization
  // ============================================
  resumeSettings: {
    font: {
      type: String,
      enum: ["Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Arial", "Times New Roman"],
      default: "Inter",
    },
    fontSize: {
      type: Number,
      min: 8,
      max: 16,
      default: 11,
    },
    color: {
      type: String,
      default: "#2563eb",
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Please enter a valid hex color"],
    },
    template: {
      type: String,
      enum: ["modern", "classic", "minimal", "creative", "executive", "compact"],
      default: "modern",
    },
    pageSize: {
      type: String,
      enum: ["A4", "Letter", "Legal"],
      default: "A4",
    },
    margins: {
      top: { type: Number, default: 20 },
      bottom: { type: Number, default: 20 },
      left: { type: Number, default: 20 },
      right: { type: Number, default: 20 },
    },
    lineSpacing: {
      type: Number,
      min: 1,
      max: 3,
      default: 1.5,
    },
    showPhoto: { type: Boolean, default: true },
    showSocialLinks: { type: Boolean, default: true },
    showLanguages: { type: Boolean, default: true },
    showAwards: { type: Boolean, default: true },
    showPublications: { type: Boolean, default: true },
    showVolunteering: { type: Boolean, default: false },
    showInterests: { type: Boolean, default: true },
    sectionOrder: [{
      section: { type: String, trim: true },
      order: { type: Number },
    }],
  },

  // ============================================
  // AI & Optimization Data
  // ============================================
  ai: {
    generatedSummary: { type: String, trim: true },
    atsScore: { 
      type: Number, 
      min: 0, 
      max: 100,
      validate: {
        validator: Number.isInteger,
        message: "ATS Score must be an integer between 0 and 100",
      },
    },
    strengths: [{ type: String, trim: true }],
    weaknesses: [{ type: String, trim: true }],
    suggestions: [{ type: String, trim: true }],
    missingKeywords: [{ type: String, trim: true }],
    improvedSkills: [{ type: String, trim: true }],
    optimizedResume: mongoose.Schema.Types.Mixed,
    keywordMatch: [{
      keyword: { type: String, trim: true },
      found: { type: Boolean, default: false },
      context: { type: String, trim: true },
    }],
    grammarCheck: [{
      type: { type: String, enum: ["Grammar", "Spelling", "Style"] },
      suggestion: { type: String, trim: true },
      context: { type: String, trim: true },
    }],
    improvementScore: { type: Number, min: 0, max: 100 },
  },

  // ============================================
  // Generated Outputs
  // ============================================
  generatedResume: mongoose.Schema.Types.Mixed,
  
  pdfUrl: { type: String, trim: true },
  
  docxUrl: { type: String, trim: true },
  
  htmlContent: { type: String, trim: true },

  // ============================================
  // AI Model Tracking
  // ============================================
  aiModel: {
    type: String,
    enum: ["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo", "claude-3", "gemini-pro", "custom"],
    default: "gpt-3.5-turbo",
  },

  // ============================================
  // Visibility & Sharing
  // ============================================
  visibility: {
    type: String,
    enum: ["private", "public", "unlisted", "shareable"],
    default: "private",
  },
  
  shareToken: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
  },
  
  shareExpiry: { type: Date },

  // ============================================
  // Versioning & History
  // ============================================
  version: {
    type: Number,
    default: 1,
    min: 1,
  },
  
  previousVersions: [{
    version: { type: Number },
    data: mongoose.Schema.Types.Mixed,
    updatedAt: { type: Date, default: Date.now },
    reason: { type: String, trim: true },
  }],
  
  isLatestVersion: { type: Boolean, default: true },

  // ============================================
  // Analytics & Usage
  // ============================================
  analytics: {
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    printCount: { type: Number, default: 0 },
    lastViewed: { type: Date },
    lastDownloaded: { type: Date },
    uniqueViewers: [{
      ip: { type: String },
      timestamp: { type: Date, default: Date.now },
      userAgent: { type: String },
    }],
  },

  // ============================================
  // Status & Metadata
  // ============================================
  status: {
    type: String,
    enum: ["draft", "in-progress", "completed", "archived", "deleted"],
    default: "draft",
  },
  
  isPrimary: {
    type: Boolean,
    default: false,
  },
  
  tags: [{ type: String, trim: true }],
  
  notes: { type: String, trim: true },

  // ============================================
  // Timestamps
  // ============================================
  lastActivity: { type: Date },
  
  publishedAt: { type: Date },
  
  archivedAt: { type: Date },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// ============================================
// Indexes for Performance
// ============================================
cvSchema.index({ userId: 1, createdAt: -1 });
cvSchema.index({ userId: 1, isPrimary: 1 });
cvSchema.index({ shareToken: 1 }, { sparse: true });
cvSchema.index({ visibility: 1, updatedAt: -1 });
cvSchema.index({ "personal.fullName": "text", title: "text", summary: "text" });

export default mongoose.model("CV", cvSchema);