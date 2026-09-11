import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema(
  {
    input: String,
    output: String,
  },
  { _id: false }
);

const dsaQuestionSchema = new mongoose.Schema(
  {
    question: String,
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
    },
    topic: String,
    description: String,
    expectedApproach: String,
    timeComplexity: String,
    spaceComplexity: String,
    javascript: String,
    python: String,
    testCases: [testCaseSchema],
  },
  { _id: false }
);

const technicalQuestionSchema = new mongoose.Schema(
  {
    question: String,
    technology: String,
    whatInterviewerTests: String,
    expectedAnswerPoints: [String],
    followUps: [String],
  },
  { _id: false }
);

const projectQuestionSchema = new mongoose.Schema(
  {
    question: String,
    project: String,
    whatInterviewerTests: String,
    expectedAnswerPoints: [String],
    followUps: [String],
  },
  { _id: false }
);

const behavioralQuestionSchema = new mongoose.Schema(
  {
    question: String,
    whatInterviewerTests: String,
    expectedAnswerPoints: [String],
  },
  { _id: false }
);

const hrQuestionSchema = new mongoose.Schema(
  {
    question: String,
    whatInterviewerTests: String,
    expectedAnswerPoints: [String],
  },
  { _id: false }
);

const mockInterviewSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: "AI Mock Interview",
    },
    pdf: {
      originalName: String,
      url: String,
      publicId: String,
    },
    candidateSummary: String,
    candidateLevel: {
      type: String,
      enum: ["Junior", "Mid-Level", "Senior"],
    },
    detectedSkills: [String],
    dsaQuestions: [dsaQuestionSchema],
    technicalQuestions: [technicalQuestionSchema],
    projectQuestions: [projectQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    hrQuestions: [hrQuestionSchema],
    totalQuestions: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["generated", "in-progress", "completed"],
      default: "generated",
    },
    score: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

mockInterviewSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("MockInterview", mockInterviewSchema);