export const parseGeminiResponse = (response) => {
  try {
    if (!response) {
      throw new Error("Empty Gemini response");
    }

    let cleaned = response.trim();

    // Remove markdown code fences
    cleaned = cleaned.replace(/```json/g, "");
    cleaned = cleaned.replace(/```/g, "");

    // Remove BOM
    cleaned = cleaned.replace(/^\uFEFF/, "");

    // Remove leading/trailing whitespace
    cleaned = cleaned.trim();

    return JSON.parse(cleaned);

  } catch (error) {
    console.error("JSON Parse Error");

    console.error(error);

    throw new Error("Invalid JSON returned from Gemini");
  }
};