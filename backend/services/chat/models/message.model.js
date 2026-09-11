// chat/models/message.model.js
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
    type: [mongoose.Schema.Types.Mixed],  // ✅ String se Mixed karo
    default: []
  },
  // ✅ PDF fields bhi add karo (warna PDF refresh pe gayab hoga)
  pdf: { type: String, default: null },
  pdfUrl: { type: String, default: null },
  pdfGenerated: { type: Boolean, default: false },
  // ✅ PPT fields
  ppt: { type: String, default: null },
  pptUrl: { type: String, default: null },
  pptGenerated: { type: Boolean, default: false },
  pptFileName: { type: String, default: null },
  pptData: { type: mongoose.Schema.Types.Mixed, default: null },
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
export default Message;