import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    // ============================================================
    // User
    // ============================================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    // ============================================================
    // Basic Information
    // ============================================================

    title: {
      type: String,
      default: "My Portfolio",
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },

    // ============================================================
    // Uploaded PDF
    // ============================================================

    pdf: {
      url: {
        type: String,
        required: true,
      },

      publicId: {
        type: String,
        required: true,
      },

      originalName: {
        type: String,
        default: "",
      },

      size: {
        type: Number,
        default: 0,
      },
    },

    // ============================================================
    // Extracted Resume Text
    // ============================================================

    extractedText: {
      type: String,
      default: "",
    },

    // ============================================================
    // AI Analysis
    // ============================================================

    analysis: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    analysisStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "completed",
        "failed",
      ],
      default: "pending",
    },

    // ============================================================
    // Generated Portfolio Code
    // ============================================================

    generatedCode: {
      html: {
        type: String,
        default: "",
      },

      css: {
        type: String,
        default: "",
      },

      js: {
        type: String,
        default: "",
      },

      generatedAt: {
        type: Date,
        default: null,
      },
    },

    // ============================================================
    // Generated Code Path
    // ============================================================

    generatedCodePath: {
      type: String,
      default: "",
    },

    // ============================================================
    // Preview
    // ============================================================

    previewUrl: {
      type: String,
      default: "",
    },

    // ============================================================
    // Build Logs
    // ============================================================

    buildLogs: {
      type: String,
      default: "",
    },

    // ============================================================
    // Portfolio Status
    // ============================================================

    status: {
      type: String,

      enum: [
        "uploaded",
        "extracting",
        "analyzing",
        "generating",
        "building",
        "completed",
        "failed",
      ],

      default: "uploaded",
    },

    // ============================================================
    // Error
    // ============================================================

    error: {
      type: String,
      default: "",
    },

    // ============================================================
    // Public / Private
    // ============================================================

    isPublic: {
      type: Boolean,
      default: false,
    },

    // ============================================================
    // Share Token
    // ============================================================

    shareToken: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// ============================================================
// NO PRE-SAVE HOOK
// ============================================================

const Portfolio = mongoose.model(
  "Portfolio",
  portfolioSchema
);

export default Portfolio;

