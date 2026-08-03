import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "New Chat"  // ✅ Fixed: was "title" instead of "default"
    },
    userId: {
        type: String,
        required: true
    }
}, {
    timestamps: true  // ✅ Add this to track createdAt and updatedAt
});

const Conversation = mongoose.model("Conversation", ConversationSchema);
export default Conversation;