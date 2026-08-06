import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    title: String,

    company: String,

    location: String,

    workMode: {
      type: String,
      enum: ["Remote", "Hybrid", "On-site"],
    },

    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
    },

    applyUrl: String,

    matchScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Job", jobSchema);