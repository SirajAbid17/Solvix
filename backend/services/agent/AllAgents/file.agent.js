import { GetModels } from "../config/aimodels.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const FileAgent = async (state) => {
  try {
    const fileContext = state.fileContext || "";
    const fileMetadata = state.fileMetadata || {};
    const userQuery = state.prompt || "Explain this file in detail.";
    const hasImage = !!state.imageBase64;

    console.log("FileAgent:", {
      hasImage,
      fileType: fileMetadata.fileType,
      contentLength: fileContext.length,
      query: userQuery.slice(0, 80),
    });

   
    if (hasImage && state.imageBase64) {
      return await analyzeImageWithVision(state);
    }

    
    return await analyzeDocumentWithLLM(state);
  } catch (error) {
    console.error("FileAgent error:", error);
    return {
      ...state,
      aiResponse: "Sorry, I couldn't analyze the file. Please try again.",
    };
  }
};


async function analyzeImageWithVision(state) {
  try {
    console.log("Using Gemini Vision for image analysis...");

    const imageBase64 = state.imageBase64;
    const imageMimeType = state.imageMimeType || "image/jpeg";
    const fileName = state.imageFileName || state.fileMetadata?.fileName || "image";
    const userQuery = state.prompt || "Describe this image in detail.";

    if (!process.env.GOOGLE_API_KEY) {
      return {
        ...state,
        aiResponse: "Image analysis not configured (missing Google API key).",
      };
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const visionPrompt = `You are Solvix AI, an expert image analyst.

## Context
- **File name:** ${fileName}
- **User's question:** ${userQuery}

## Your Task
Analyze the image and provide a **detailed, well-formatted description** based on the user's question.

## Response Format (ALWAYS use this)
Use rich markdown formatting:

###  Overview
Brief 2-3 sentence summary of what the image shows.

###  Key Elements
- Bullet points of main objects, people, or components
- Use **bold** for important items

###  Visual Details
- Colors, layout, style, background
- Text visible in the image (extract exactly)

###  What It Represents
- Purpose, context, or meaning of the image

## Rules
1. **Use markdown formatting** — headings, bullets, bold text
2. If user asked in Roman English/Urdu, respond in same language
3. Extract ALL visible text from the image
4. Be specific and detailed — describe colors, positions, sizes
5. If it's a photo, describe the scene
6. If it's a screenshot, describe UI elements
7. If it's a design, describe style and purpose
8. If you can't see clearly, say so honestly
9. Never invent details you can't see
10. Keep it well-organized and easy to read

Now analyze the image and respond.`;

    const result = await model.generateContent([
      visionPrompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: imageMimeType,
        },
      },
    ]);

    const aiResponse = result.response.text();

    console.log(" Image analysis complete:", {
      length: aiResponse?.length || 0,
    });

    return {
      ...state,
      aiResponse:
        aiResponse || "I couldn't analyze the image. Please try again.",
    };
  } catch (error) {
    console.error(" Gemini Vision error:", error.message);

   
    return {
      ...state,
      aiResponse: `##  Image Analysis Failed

Mujhe image analyze karne mein issue aaya: **${error.message}**

**Possible reasons:**
- Google API key invalid hai
- Image format support nahi karta
- API rate limit reach ho gaya

**Please try:**
- Re-upload karo
- Ya text-based file use karo (PDF/DOCX/TXT)`,
    };
  }
}


async function analyzeDocumentWithLLM(state) {
  try {
    console.log(" Using LLM for document analysis...");

    const llm = await GetModels("chat");
    const fileContext = state.fileContext || "";
    const fileMetadata = state.fileMetadata || {};
    const userQuery = state.prompt || "Explain this file in detail.";

    if (!fileContext || fileContext.trim().length === 0) {
      return {
        ...state,
        aiResponse: "No text content found in the file. Please try another file.",
      };
    }

   
    const maxContextLength = 25000;
    const truncatedContext =
      fileContext.length > maxContextLength
        ? fileContext.slice(0, maxContextLength) +
          `\n\n[...content truncated, ${fileContext.length - maxContextLength} more characters available]`
        : fileContext;

    const systemPrompt = `You are Solvix AI, an expert document analyst.

The user has uploaded a file and asked a question about it.

## File Information
- **Name:** ${fileMetadata.fileName || "unknown"}
- **Type:** ${fileMetadata.fileType || "document"}
- **Content length:** ${fileContext.length} characters

## User's Question
${userQuery}

## File Content
${truncatedContext}

## Your Task
Provide a **detailed, well-formatted analysis** of the file based on the user's question.

## Response Format (ALWAYS use this structure)
Use rich markdown formatting with:

###  Overview
Brief 2-3 sentence summary of what this file contains.

###  Main Content
Break down the content into logical sections with **bold headings** and bullet points.

###  Key Insights
- Most important points from the file
- Notable facts, figures, or achievements
- Any actionable information

###  Summary
- Overall assessment
- What the reader should know

## Rules
1. **Use markdown formatting** — headings, bullets, bold text
2. Base your answer ONLY on the file content provided
3. If user asked in Roman English/Urdu, respond in same language
4. Be specific — mention names, dates, numbers from the file
5. If the file doesn't contain the answer, say so
6. Never invent information not present in the file
7. Keep response well-organized and easy to read
8. Use emojis in headings for visual clarity (📋 🎯 💡 📊)
9. If content is truncated, mention it to the user

Now analyze the file and respond.`;

    const response = await llm.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: userQuery },
    ]);

    let aiResponse = response?.content;

    if (Array.isArray(aiResponse)) {
      aiResponse = aiResponse
        .map((i) => (typeof i === "string" ? i : i?.text || ""))
        .join("");
    }

    aiResponse = String(aiResponse || "").trim();

    if (!aiResponse) {
      aiResponse = "Sorry, I couldn't analyze the file. Please try again.";
    }

    console.log("Document analysis complete:", {
      length: aiResponse.length,
    });

    return {
      ...state,
      aiResponse,
    };
  } catch (error) {
    console.error("Document analysis error:", error.message);
    return {
      ...state,
      aiResponse: `##  File Analysis Failed

Mujhe file analyze karne mein issue aaya: **${error.message}**

Please try again.`,
    };
  }
}