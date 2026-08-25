import axios from "axios";

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

    // Check if Pollinations generated the image successfully
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 120000,
    });

    if (!response.data) {
      throw new Error("Image generation failed.");
    }

    return {
      ...state,

      aiResponse: "Your image has been generated successfully.",

      images: [
        {
          url: imageUrl,
          src: imageUrl,
          prompt: prompt,
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