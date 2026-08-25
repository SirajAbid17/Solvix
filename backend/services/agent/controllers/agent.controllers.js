import dotenv from "dotenv";
import axios from "axios";
import { graph } from "../graph/AgentNodeGraph.js";
import {
  getConversationMessages,
  saveConversationMessage,
  saveConversationMessages,
} from "../utlis/RedisMemory.js";

dotenv.config();

export const Agents = async (req, res) => {
  try {
    const { prompt, conversationId, agent } = req.body;

    if (!prompt || !conversationId) {
      return res.status(400).json({
        error: "Prompt and conversationId are required",
      });
    }

    // 1. Get conversation history
    let previousMessages = await getConversationMessages(conversationId);

    if (!previousMessages || previousMessages.length === 0) {
      try {
        const messagesResponse = await axios.get(
          `${process.env.CHAT_SERVICES_URL}/chat/get-messages/${conversationId}`
        );
        previousMessages = messagesResponse.data || [];
        
        if (previousMessages.length > 0) {
          await saveConversationMessages(conversationId, previousMessages);
        }
      } catch (error) {
        console.error("Error fetching messages from MongoDB:", error.message);
        previousMessages = [];
      }
    }

    // 2. Save USER message in MongoDB
    try {
      await axios.post(
        `${process.env.CHAT_SERVICES_URL}/chat/save-messages`,
        {
          conversationId,
          role: "user",
          content: prompt,
        }
      );
    } catch (error) {
      console.error("Error saving user message to MongoDB:", error.message);
    }

    // 3. Save USER message in Redis
    await saveConversationMessage(conversationId, {
      role: "user",
      content: prompt,
    });

    // 4. Invoke the graph
    console.log("🚀 Invoking graph with:", { prompt, conversationId, agent });
    
    const result = await graph.invoke({
      prompt,
      messages: previousMessages,
      conversationId,
      agent: agent || "Auto",
    });

    console.log("🔍 Result from graph:", {
      hasPdfBuffer: !!result.pdfBuffer,
      pdfGenerated: result.pdfGenerated,
      hasAiResponse: !!result.aiResponse,
      resultKeys: Object.keys(result),
    });

    const aiResponse = result.aiResponse;
    const images = result.images || [];
    const pdfBuffer = result.pdfBuffer;
    const pdfGenerated = result.pdfGenerated || false;

    // ✅ Format images with full URLs
    const formattedImages = images.map(img => {
      if (typeof img === 'string') {
        if (img.startsWith('http')) {
          return img;
        } else {
          const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
          return img.startsWith('/') ? `${baseUrl}${img}` : `${baseUrl}/${img}`;
        }
      } else if (img.url) {
        if (!img.url.startsWith('http')) {
          const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
          img.url = img.url.startsWith('/') ? `${baseUrl}${img.url}` : `${baseUrl}/${img.url}`;
        }
        return img;
      }
      return img;
    });

    // ✅ Convert PDF buffer to Base64 for frontend
    let pdfBase64 = null;
    if (pdfBuffer && pdfGenerated === true) {
      try {
        const buffer = Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
        pdfBase64 = buffer.toString('base64');
        console.log(`✅ PDF converted to Base64, length: ${pdfBase64.length}`);
      } catch (error) {
        console.error("❌ Failed to convert PDF to Base64:", error);
        pdfBase64 = null;
      }
    } else {
      console.warn(`⚠️ No PDF buffer or pdfGenerated is ${pdfGenerated}`);
    }

    // 5. Save AI response in MongoDB
    if (aiResponse) {
      try {
        await axios.post(
          `${process.env.CHAT_SERVICES_URL}/chat/save-messages`,
          {
            conversationId,
            role: "assistant",
            content: aiResponse,
            images: formattedImages,
            pdfGenerated: pdfGenerated,
            pdf: pdfBase64,
          }
        );
        console.log("✅ Saved message with PDF:", pdfGenerated);
      } catch (error) {
        console.error("Error saving AI response to MongoDB:", error.message);
      }

      // 6. Save AI response in Redis
      await saveConversationMessage(conversationId, {
        role: "assistant",
        content: aiResponse,
        images: formattedImages,
        pdfGenerated: pdfGenerated,
        pdf: pdfBase64,
      });
    }

    // ✅ RETURN RESPONSE WITH PDF
    return res.status(200).json({
      response: aiResponse || "No response generated",
      images: formattedImages,
      pdf: pdfBase64,
      pdfGenerated: pdfGenerated,
    });

  } catch (error) {
    console.error("Agent error:", error.response?.data || error.message);

    return res.status(500).json({
      error: error.response?.data?.error || error.message,
    });
  }
};