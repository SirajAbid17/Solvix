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
    const result = await graph.invoke({
      prompt,
      messages: previousMessages,
      conversationId,
      agent: agent || "Auto",
    });

    const aiResponse = result.aiResponse;
    const images = result.images || [];

    // 5. Save AI response in MongoDB
    if (aiResponse) {
      try {
        await axios.post(
          `${process.env.CHAT_SERVICES_URL}/chat/save-messages`,
          {
            conversationId,
            role: "assistant",
            content: aiResponse,
            images: images, // Send images properly
          }
        );
      } catch (error) {
        console.error("Error saving AI response to MongoDB:", error.message);
      }

      // 6. Save AI response in Redis
      await saveConversationMessage(conversationId, {
        role: "assistant",
        content: aiResponse,
        images: images,
      });
    }

    return res.status(200).json({
      response: aiResponse || "No response generated",
      images: images,
    });
  } catch (error) {
    console.error("Agent error:", error.response?.data || error.message);

    return res.status(500).json({
      error: error.response?.data?.error || error.message,
    });
  }
};