export const parseGeminiResponse = (response) => {
  try {
    if (!response) {
      throw new Error("Empty Gemini response");
    }

    let cleaned = response.trim();

    
    cleaned = cleaned.replace(/```json/g, "");
    cleaned = cleaned.replace(/```/g, "");

  
    cleaned = cleaned.replace(/^\uFEFF/, "");

   
    cleaned = cleaned.trim();

    return JSON.parse(cleaned);

  } catch (error) {
    console.error("JSON Parse Error");

    console.error(error);

    throw new Error("Invalid JSON returned from Gemini");
  }
};