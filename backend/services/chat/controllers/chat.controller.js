import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const CreateConversion = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    console.log("userid", userId);
    const conversation = await Conversation.create({
      userId: userId
    });
    return res.status(200).json(conversation);
  } catch (error) {
    return res.status(500).json({
      message: "Conversation Create error"
    });
  }
};

export const UpdatedConversions = async (req, res) => {
  try {
    const { id, title } = req.body;
    const userId = req.headers["x-user-id"];
    console.log("userid", userId);
    const conversation = await Conversation.findByIdAndUpdate(id, {
      title
    });
    return res.status(200).json(conversation);
  } catch (error) {
    return res.status(500).json({
      message: "Conversation update error"
    });
  }
};

export const GetConversions = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    console.log("userid", userId);
    const conversation = await Conversation.find({
      userId: userId
    }).sort({ updatedAt: -1 });
    return res.status(200).json(conversation);
  } catch (error) {
    return res.status(500).json({
      message: "Conversation Get error"
    });
  }
};


export const SaveMessage = async (req, res) => {
  try {
    const { 
      conversationId, 
      role, 
      content, 
      images,
      pdf,
      pdfUrl,
      pdfGenerated,
      ppt,
      pptUrl,
      pptGenerated,
      pptFileName,
      pptData
    } = req.body;
    
    console.log("Saving message:", {
      conversationId,
      role,
      contentLength: content?.length || 0,
      imagesCount: images?.length || 0,
      pptGenerated,
      pdfGenerated
    });
    
    const message = await Message.create({
      conversationId,
      role,
      content,
      images: images || [],
      pdf: pdf || null,
      pdfUrl: pdfUrl || null,
      pdfGenerated: pdfGenerated || false,
      ppt: ppt || null,
      pptUrl: pptUrl || null,
      pptGenerated: pptGenerated || false,
      pptFileName: pptFileName || null,
      pptData: pptData || null,
    });
    
    return res.status(200).json(message);
  } catch (error) {
    console.error("SaveMessage error:", error);
    return res.status(500).json({
      message: "Messages error",
      error: error.message
    });
  }
};

export const GetMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId
    }).sort({ updatedAt: 1 });
    
  
    const messagesWithFields = messages.map(msg => ({
      ...msg.toObject(),
      images: msg.images || [],
      pdf: msg.pdf || null,
      pdfUrl: msg.pdfUrl || null,
      pdfGenerated: msg.pdfGenerated || false,
      ppt: msg.ppt || null,
      pptUrl: msg.pptUrl || null,
      pptGenerated: msg.pptGenerated || false,
      pptFileName: msg.pptFileName || null,
      pptData: msg.pptData || null,
    }));
    
    return res.status(200).json(messagesWithFields);
  } catch (error) {
    console.error("GetMessages error:", error);
    return res.status(500).json({
      message: "Get Messages error"
    });
  }
};

