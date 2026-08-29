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

    // =====================================================
    // GET PREVIOUS MESSAGES
    // =====================================================

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
        console.log("Previous messages fetch failed:", error.message);
        previousMessages = [];
      }
    }

    // =====================================================
    // SAVE USER MESSAGE
    // =====================================================

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
      console.log("Chat service user save failed:", error.message);
    }

    await saveConversationMessage(conversationId, {
      role: "user",
      content: prompt,
    });

    // =====================================================
    // RUN MULTI AGENT GRAPH
    // =====================================================

    const result = await graph.invoke({
      prompt,
      messages: previousMessages,
      conversationId,
      agent: agent || "Auto",
    });

    console.log("GRAPH RESULT:", result);

    const aiResponse = result?.aiResponse || "";
    const images = result?.images || [];

    // =====================================================
    // FORMAT IMAGES
    // =====================================================

    const formattedImages = images.map((img) => {
      if (typeof img === "string") {
        if (img.startsWith("http")) return img;
        const baseUrl = process.env.BASE_URL || "http://localhost:5003";
        return img.startsWith("/") ? `${baseUrl}${img}` : `${baseUrl}/${img}`;
      }
      if (img?.url) {
        if (!img.url.startsWith("http")) {
          const baseUrl = process.env.BASE_URL || "http://localhost:5003";
          img.url = img.url.startsWith("/")
            ? `${baseUrl}${img.url}`
            : `${baseUrl}/${img.url}`;
        }
        return img;
      }
      return img;
    });

    // =====================================================
    // PDF - Get URL and base64 from result
    // =====================================================

    const pdfGenerated = result?.pdfGenerated || false;
    const pdfUrl = result?.pdfUrl || null;
    const pdfBase64 = result?.pdfBase64 || result?.pdfBuffer ? Buffer.from(result.pdfBuffer).toString("base64") : null;

    // =====================================================
    // PPT - Get URL and base64 from result
    // =====================================================

    const pptGenerated = result?.pptGenerated || false;
    const pptFileName = result?.pptFileName || "solvix-presentation.pptx";
    const pptData = result?.pptData || result?.ppt || null;
    const pptUrl = result?.pptUrl || null;
    const pptBase64 = result?.pptBase64 || result?.pptBuffer ? Buffer.from(result.pptBuffer).toString("base64") : null;

    // =====================================================
    // SAVE ASSISTANT MESSAGE
    // =====================================================

    if (aiResponse) {
      try {
        await axios.post(
          `${process.env.CHAT_SERVICES_URL}/chat/save-messages`,
          {
            conversationId,
            role: "assistant",
            content: aiResponse,
            images: formattedImages,
            pdfGenerated,
            pdf: pdfUrl || pdfBase64, // ✅ Send URL if available, fallback to base64
            pptGenerated,
            ppt: pptUrl || pptBase64, // ✅ Send URL if available, fallback to base64
            pptFileName,
            pptData: pptData,
          },
          {
            timeout: 10000,
          }
        );
        console.log("✅ Assistant message saved to Chat Service");
      } catch (error) {
        console.log("⚠️ Chat service save skipped:", error.message);
      }

      await saveConversationMessage(conversationId, {
        role: "assistant",
        content: aiResponse,
        images: formattedImages,
        pdfGenerated,
        pdf: pdfUrl || pdfBase64,
        pptGenerated,
        ppt: pptUrl || pptBase64,
        pptFileName,
        pptData: pptData,
      });
      console.log("✅ Assistant message saved to Redis");
    }

    // =====================================================
    // FINAL RESPONSE
    // =====================================================

    return res.status(200).json({
      response: aiResponse || "No response generated",
      images: formattedImages,
      pdfUrl: pdfUrl,
      pdf: pdfBase64,
      pdfGenerated: pdfGenerated,
      pptUrl: pptUrl,
      ppt: pptBase64,
      pptGenerated: pptGenerated,
      pptFileName: pptFileName,
      pptData: pptData,
    });

  } catch (error) {
    console.error("AGENTS CONTROLLER ERROR:", error);
    return res.status(500).json({
      error: error.response?.data?.error || error.message,
    });
  }
};