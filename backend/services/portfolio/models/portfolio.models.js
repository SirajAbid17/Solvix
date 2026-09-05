import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
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
    extractedText: {
      type: String,
      default: "",
    },
    analysis: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    analysisStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
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
    generatedCodePath: {
      type: String,
      default: "",
    },
    previewUrl: {
      type: String,
      default: "",
    },
    buildLogs: {
      type: String,
      default: "",
    },
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
    error: {
      type: String,
      default: "",
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
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

const Portfolio = mongoose.model("Portfolio", portfolioSchema);
export default Portfolio;