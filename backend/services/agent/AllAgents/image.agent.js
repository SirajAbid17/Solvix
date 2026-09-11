import axios from "axios";
import { uploadToCloudinary } from "../utlis/UploadFile.js";

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

    console.log("ImageAgent prompt:", prompt);

    const encodedPrompt = encodeURIComponent(prompt);

    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;

    // ✅ Download image from Pollinations
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 120000,
    });

    if (!response.data) {
      throw new Error("Image generation failed.");
    }

    // ✅ Convert to buffer
    const imageBuffer = Buffer.from(response.data);

    // ✅ Upload to Cloudinary
    let cloudinaryUrl = null;
    let cloudinaryPublicId = null;

    try {
      // Upload image to Cloudinary as image type
      const cloudinary = (await import("../config/cloudinary.js")).default;

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: `solvix/images`,
            resource_type: "image",
            public_id: `image_${Date.now()}`,
            format: "png",
            transformation: [
              { quality: "auto" },
              { fetch_format: "auto" }
            ]
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(imageBuffer);
      });

      if (uploadResult && uploadResult.secure_url) {
        cloudinaryUrl = uploadResult.secure_url;
        cloudinaryPublicId = uploadResult.public_id;
        console.log("✅ Image uploaded to Cloudinary:", cloudinaryUrl);
      }
    } catch (cloudinaryError) {
      console.error("❌ Cloudinary upload failed:", cloudinaryError);
      // Fallback: use Pollinations URL
      cloudinaryUrl = imageUrl;
    }

    return {
      ...state,

      aiResponse: `Your image has been generated successfully.${cloudinaryUrl ? ' ' : ''}`,

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
      aiResponse:
        "Sorry, I couldn't generate the image. Please try again.",
      images: [],
    };
  }
};