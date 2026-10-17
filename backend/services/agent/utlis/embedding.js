import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

let embeddingsClient = null;

export const getEmbeddings = () => {
  if (!embeddingsClient) {
    if (!process.env.GOOGLE_API_KEY) {
      console.warn(" GOOGLE_API_KEY not set - embeddings disabled");
      return null;
    }

    embeddingsClient = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-embedding-001",
      dimensions: 768,
    });
  }
  return embeddingsClient;
};


const normalizeEmbedding = (value) => {
  if (!value) return null;

  
  if (
    Array.isArray(value) &&
    value.length > 0 &&
    typeof value[0] === "number"
  ) {
    return value;
  }

 
  if (
    Array.isArray(value) &&
    value.length > 0 &&
    Array.isArray(value[0])
  ) {
    if (value[0].length > 0 && typeof value[0][0] === "number") {
      return value[0];
    }
  }


  if (value.values && Array.isArray(value.values)) {
    return value.values;
  }

 
  if (value.embedding && Array.isArray(value.embedding)) {
    return value.embedding;
  }


  if (value.data && Array.isArray(value.data)) {
    return value.data;
  }

  return null;
};


export const embedText = async (text) => {
  const embeddings = getEmbeddings();
  if (!embeddings) throw new Error("Embeddings not configured");

  const cleanText = String(text).replace(/\s+/g, " ").trim().slice(0, 8000);
  if (!cleanText) throw new Error("Empty text to embed");

  const result = await embeddings.embedQuery(cleanText);

  const normalized = normalizeEmbedding(result);

  if (!normalized) {
    console.error(" embedText: Failed to normalize embedding");
    console.error("   Raw result:", JSON.stringify(result).slice(0, 300));
    throw new Error("Invalid embedding format from Gemini");
  }

  return normalized;
};


export const embedBatch = async (texts) => {
  const embeddings = getEmbeddings();
  if (!embeddings) throw new Error("Embeddings not configured");

  if (!Array.isArray(texts) || texts.length === 0) {
    console.warn("embedBatch: empty texts array");
    return [];
  }

  
  const cleanTexts = texts
    .map((t) => String(t).replace(/\s+/g, " ").trim().slice(0, 8000))
    .filter((t) => t.length > 0);

  if (cleanTexts.length === 0) {
    console.warn("embedBatch: all texts empty after cleaning");
    return [];
  }

  try {
    const result = await embeddings.embedDocuments(cleanTexts);

    if (result && result.length > 0) {
      const first = result[0];
      console.log(
        "    First embedding type:",
        typeof first,
        Array.isArray(first) ? `(Array, length ${first.length})` : "(Object)"
      );
    }

    if (!Array.isArray(result)) {
      console.error(" embedDocuments returned non-array");
      return [];
    }

    const normalized = result
      .map((item, idx) => {
        const norm = normalizeEmbedding(item);
        if (!norm) {
          console.error(`    Could not normalize embedding at index ${idx}`);
          console.error(
            `      Item preview:`,
            JSON.stringify(item).slice(0, 200)
          );
        }
        return norm;
      })
      .filter(Boolean);

    console.log(
      `    Normalized ${normalized.length}/${result.length} embeddings`
    );

    return normalized;
  } catch (error) {
    console.error(" embedBatch failed:", error.message);
    throw error;
  }
};