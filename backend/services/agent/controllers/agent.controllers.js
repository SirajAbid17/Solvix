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
    const {
      prompt,
      conversationId,
      agent,
      fileId,
      fileContext,
      imageBase64,
      imageMimeType,
      fileName,
      fileType,
    } = req.body;

    if (!prompt || !conversationId) {
      return res.status(400).json({
        error: "Prompt and conversationId are required",
      });
    }

    const userId = req.headers["x-user-id"];
    const remainingCredits = req.headers["x-remaining-credits"];

   
    console.log(` User: ${userId}`);
    console.log(`Prompt: ${String(prompt).slice(0, 100)}`);
    console.log(`Selected Agent: ${agent || "Auto"}`);
    console.log(`File ID: ${fileId || "none"}`);
    console.log(
      `File Context: ${fileContext ? `${fileContext.length} chars` : "none"}`
    );
    console.log(`Image Base64: ${imageBase64 ? `${Math.round(imageBase64.length / 1024)}KB` : "no"}`);
    console.log(`File Name: ${fileName || "none"}`);

  
    let previousMessages = await getConversationMessages(conversationId);

    if (!previousMessages || previousMessages.length === 0) {
      try {
        const messagesResponse = await axios.get(
          `${
            process.env.CHAT_SERVICES_URL || "http://localhost:5002"
          }/chat/get-messages/${conversationId}`
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

   
    try {
      await axios.post(
        `${
          process.env.CHAT_SERVICES_URL || "http://localhost:5002"
        }/chat/save-messages`,
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

   
    const imageContext =
      imageBase64 && imageMimeType
        ? {
            imageBase64,
            imageMimeType,
            imageFileName: fileName || "image",
          }
        : null;

    
    const result = await graph.invoke({
      prompt,
      messages: previousMessages,
      conversationId,
      agent: agent || "Auto",
      userId,
      fileId: fileId || null,
      fileContext: fileContext || "",
      imageBase64: imageBase64 || null,
      imageMimeType: imageMimeType || null,
      imageFileName: fileName || null,
      imageContext,
      fileMetadata:
        fileId || imageBase64
          ? {
              fileName: fileName || "uploaded-file",
              fileType: fileType || (imageBase64 ? "image" : "document"),
            }
          : null,
    });

   
    console.log("Agent:", result?.agent);
    console.log("Has aiResponse:", !!result?.aiResponse);
    console.log(
      "aiResponse length:",
      String(result?.aiResponse || "").length
    );
    console.log(
      "aiResponse preview:",
      String(result?.aiResponse || "").slice(0, 200)
    );
   

    let aiResponse = result?.aiResponse;

    if (Array.isArray(aiResponse)) {
      aiResponse = aiResponse
        .map((i) => (typeof i === "string" ? i : i?.text || ""))
        .join("");
    }

    aiResponse = String(aiResponse || "").trim();

    if (!aiResponse) {
      aiResponse = "Sorry, I couldn't generate a response. Please try again.";
    }

    const images = result?.images || [];

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

    const pdfGenerated = result?.pdfGenerated || false;
    const pdfUrl = result?.pdfUrl || null;
    const pdfBase64 =
      result?.pdfBase64 ||
      (result?.pdfBuffer
        ? Buffer.from(result.pdfBuffer).toString("base64")
        : null);

    const pptGenerated = result?.pptGenerated || false;
    const pptFileName = result?.pptFileName || "solvix-presentation.pptx";
    const pptData = result?.pptData || result?.ppt || null;
    const pptUrl = result?.pptUrl || null;
    const pptBase64 =
      result?.pptBase64 ||
      (result?.pptBuffer
        ? Buffer.from(result.pptBuffer).toString("base64")
        : null);

    
    try {
      await axios.post(
        `${
          process.env.CHAT_SERVICES_URL || "http://localhost:5002"
        }/chat/save-messages`,
        {
          conversationId,
          role: "assistant",
          content: aiResponse,
          images: formattedImages,
          pdfGenerated,
          pdf: pdfUrl || pdfBase64,
          pptGenerated,
          ppt: pptUrl || pptBase64,
          pptFileName,
          pptData,
        },
        { timeout: 10000 }
      );
      console.log("Assistant message saved to Chat Service");
    } catch (error) {
      console.log("Chat service save skipped:", error.message);
    }

    await saveConversationMessage(conversationId, {
      role: "assistant",
      content: aiResponse,
    });
    console.log("Assistant message saved to Redis");

   
    return res.status(200).json({
      response: aiResponse,
      images: formattedImages,
      pdfUrl,
      pdf: pdfBase64,
      pdfGenerated,
      pptUrl,
      ppt: pptBase64,
      pptGenerated,
      pptFileName,
      pptData,
      creditsRemaining: remainingCredits,
    });
  } catch (error) {
    console.error("AGENTS CONTROLLER ERROR:", error);
    return res.status(500).json({
      response: `Error: ${error.message}`,
      error: error.response?.data?.error || error.message,
    });
  }
};