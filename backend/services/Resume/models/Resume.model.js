import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    originalName: String,
    fileUrl: String,
    extractedText: String,
    status: {
      type: String,
      default: "completed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", ResumeSchema);