import mongoose from "mongoose";

const ResumeAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
    },
    resumeScore: Number,
    atsScore: Number,
    summary: String,
    strengths: [
      {
        title: String,
      },
    ],
    improvements: [
      {
        title: String,
      },
    ],
    roadmap: [
      {
        step: Number,
        title: String,
        description: String,
        completed: Boolean,
      },
    ],
    skillsToImprove: [
      {
        name: String,
      },
    ],
    nextLearning: [
      {
        title: String,
        description: String,
      },
    ],
    missingKeywords: [String],
    recommendedRoles: [String],
    sectionScores: {
      type: mongoose.Schema.Types.Mixed,
    },
    jobs: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    aiResponse: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ResumeAnalysis", ResumeAnalysisSchema);