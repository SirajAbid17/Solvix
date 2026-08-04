// agents/SearchAgent.js
import { tavilySearch } from "../config/websearchTavily.js";

export const SearchAgent = async (state) => {
  try {
   
    const result = await tavilySearch.invoke({
      query: state.prompt,
    });

   
    // Extract images from the result
    const images = result?.images || result?.Images || [];
    const searchResults = result?.results || result || [];

    
    return {
      ...state,
      searchResults: searchResults,
      images: images,
    };
  } catch (error) {
    console.error("❌ SearchAgent error:", error);
    return {
      ...state,
      searchResults: [],
      images: [],
    };
  }
};