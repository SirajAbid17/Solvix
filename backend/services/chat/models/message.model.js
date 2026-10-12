import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  },
  role: {
    type: String,
    enum: ["user", "assistant"]
  },
  content: {
    type: String
  },
  images: {
    type: [mongoose.Schema.Types.Mixed],  
    default: []
  },
 
  pdf: { type: String, default: null },
  pdfUrl: { type: String, default: null },
  pdfGenerated: { type: Boolean, default: false },
  ppt: { type: String, default: null },
  pptUrl: { type: String, default: null },
  pptGenerated: { type: Boolean, default: false },
  pptFileName: { type: String, default: null },
  pptData: { type: mongoose.Schema.Types.Mixed, default: null },
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
export default Message;