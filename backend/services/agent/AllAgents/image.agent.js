import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const ImageAgent = async (state) => {
  try {
    const prompt = state.prompt?.trim();

    if (!prompt) {
      return {
        ...state,
        aiResponse: "Please provide an image prompt.",
        images: [],
      };
    }

    
    if (state.imageBase64 || state.imageContext) {
      return await analyzeUploadedImage(state);
    }

    console.log("ImageAgent: generating image for:", prompt);

    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;

    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 120000,
    });

    if (!response.data) {
      throw new Error("Image generation failed.");
    }

    const imageBuffer = Buffer.from(response.data);

    let cloudinaryUrl = null;
    let cloudinaryPublicId = null;

    try {
      const cloudinary = (await import("../config/cloudinary.js")).default;

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: `solvix/images`,
              resource_type: "image",
              public_id: `image_${Date.now()}`,
              format: "png",
              transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(imageBuffer);
      });

      if (uploadResult && uploadResult.secure_url) {
        cloudinaryUrl = uploadResult.secure_url;
        cloudinaryPublicId = uploadResult.public_id;
        console.log("Image uploaded to Cloudinary:", cloudinaryUrl);
      }
    } catch (cloudinaryError) {
      console.error("Cloudinary upload failed:", cloudinaryError);
      cloudinaryUrl = imageUrl;
    }

    return {
      ...state,
      aiResponse: `Your image has been generated successfully.`,
      images: [
        {
          url: cloudinaryUrl || imageUrl,
          src: cloudinaryUrl || imageUrl,
          prompt: prompt,
          cloudinaryId: cloudinaryPublicId || null,
          source: cloudinaryUrl ? "cloudinary" : "pollinations",
        },
      ],
    };
  } catch (error) {
    console.error("ImageAgent error:", error.message);
    return {
      ...state,
      aiResponse: "Sorry, I couldn't generate the image. Please try again.",
      images: [],
    };
  }
};


async function analyzeUploadedImage(state) {
  try {
    console.log("Analyzing uploaded image with Gemini Vision...");

    const imageBase64 = state.imageBase64 || state.imageContext?.imageBase64;
    const imageMimeType =
      state.imageMimeType ||
      state.imageContext?.imageMimeType ||
      "image/jpeg";
    const imageFileName =
      state.imageFileName || state.imageContext?.imageFileName || "image";

    if (!imageBase64) {
      return {
        ...state,
        aiResponse: "Image data not available. Please re-upload the image.",
      };
    }

    if (!process.env.GOOGLE_API_KEY) {
      return {
        ...state,
        aiResponse:
          "Image analysis is not configured. Please contact support.",
      };
    }

 
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const visionPrompt = `You are Solvix AI, an expert image analyst. The user has uploaded an image and asked a question.

**File name:** ${imageFileName}
**User's question:** ${state.prompt}

## Your Task:
Analyze the image and answer the user's question in detail.

## Rules:
1. Describe the image thoroughly — objects, people, colors, layout, style, background.
2. If user asks in Roman English/Urdu, respond in Roman English.
3. If there's text in the image, extract and mention it.
4. If the image is a photo, describe what you see.
5. If the image is a design/screenshot, describe its purpose and elements.
6. If it's an electronics/device image, identify components.
7. Be specific and detailed — don't be generic.
8. Use markdown formatting for readability.
9. If you cannot see the image clearly, say so honestly.

Now analyze the image and answer the user's question.`;

    const result = await model.generateContent([
      visionPrompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: imageMimeType,
        },
      },
    ]);

    const response = result.response;
    const aiResponse = response.text();

    console.log("Gemini Vision response received:", {
      length: aiResponse?.length || 0,
      preview: aiResponse?.slice(0, 100),
    });

    return {
      ...state,
      aiResponse:
        aiResponse || "I couldn't analyze the image. Please try again.",
    };
  } catch (error) {
    console.error("Image analysis error:", error.message);
    console.error("   Full error:", error);

    return {
      ...state,
      aiResponse: `Sorry, I couldn't analyze the image. ${
        error.message?.includes("API key")
          ? "Please check your Google API key."
          : "Please try again."
      }`,
    };
  }
}