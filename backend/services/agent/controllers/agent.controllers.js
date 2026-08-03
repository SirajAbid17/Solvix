import axios from "axios";
import dotenv from "dotenv";
import { graph } from "../graph/AgentNodeGraph.js";

dotenv.config();

export const agent = async (req, res) => {
  try {
    console.log("========== AGENT CONTROLLER ==========");

    const { prompt, conversationId } = req.body;

    console.log("Prompt:", prompt);
    console.log("Conversation ID:", conversationId);

    // ==========================================
    // 1. Save User Message
    // ==========================================

    await axios.post(
      `${process.env.CHAT_SERVICES_URL}/chat/save-messages`,
      {
        conversationId,
        role: "user",
        content: prompt,
      }
    );

    console.log("User message saved successfully");

    // ==========================================
    // 2. Run AI Graph
    // ==========================================

    const result = await graph.invoke({
      prompt,
      conversationId,
    });

    console.log("Graph Result:", result);

    const aiResponse = result.aiResponse;

    // ==========================================
    // 3. Save AI Message
    // ==========================================

    if (aiResponse) {
      await axios.post(
        `${process.env.CHAT_SERVICES_URL}/chat/save-messages`,
        {
          conversationId,
          role: "assistant",
          content: aiResponse,
        }
      );

      console.log("AI message saved successfully");
    }

    // ==========================================
    // 4. Send AI Response to Frontend
    // ==========================================

    return res.status(200).json({
      response: aiResponse,
    });

  } catch (error) {
    console.error("========== AGENT ERROR ==========");

    console.error("Message:", error.message);
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);

    return res.status(500).json({
      error: error.message,
    });
  }
};