import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema(
  {
    id: String,
    title: String,
    description: String,
    url: String,
    type: String,
    domain: String,
    keywords: String,
  },
  { _id: false }
);

const PhaseSchema = new mongoose.Schema(
  {
    id: Number,
    title: String,
    duration: String,
    description: String,
    tasks: [String],
    searchKeywords: [String],
    resources: [ResourceSchema],  
  },
  { _id: false }
);

const RoadmapSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    topic: { type: String, required: true },
    title: String,
    totalWeeks: Number,
    phases: [PhaseSchema],        
    completedTasks: { type: Map, of: Boolean, default: {} },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Roadmap", RoadmapSchema);