import mongoose from "mongoose";

const AVAILABLE_TOOLS = [
  "chat",
  "search",
  "coding",
  "pdf",
  "ppt",
  "image",
  "file",
  "rag",
];

const CustomAgentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 60 },
    description: { type: String, required: true, trim: true, maxlength: 300 },
    systemPrompt: { type: String, required: true, trim: true, maxlength: 8000 },
    category: {
      type: String,
      enum: [
        "general",
        "coding",
        "writing",
        "resume",
        "interview",
        "research",
        "productivity",
        "custom",
      ],
      default: "general",
      index: true,
    },
    model: {
      type: String,
      enum: [
        "openai/gpt-oss-120b",
        "openai/gpt-oss-20b",
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
      ],
      default: "openai/gpt-oss-20b",
    },
    temperature: { type: Number, min: 0, max: 1, default: 0.7 },

   
    tools: {
      type: [String],
      enum: AVAILABLE_TOOLS,
      default: ["chat"],
    },

    isActive: { type: Boolean, default: true },
    totalChats: { type: Number, default: 0 },
    lastUsedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

CustomAgentSchema.index({ userId: 1, createdAt: -1 });
CustomAgentSchema.index({ userId: 1, category: 1 });

CustomAgentSchema.virtual("id").get(function () {
  return this._id.toString();
});

CustomAgentSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret._id = ret._id.toString();
    delete ret.__v;
    return ret;
  },
});

const CustomAgent = mongoose.model("CustomAgent", CustomAgentSchema);
export default CustomAgent;