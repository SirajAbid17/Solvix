import { getPineconeIndex } from "../config/pinecone.js";
import { embedText, embedBatch } from "./embedding.js";
import { chunkText } from "./fileParser.js";
import { randomUUID } from "crypto";


export const storeFileInPinecone = async ({
  userId,
  fileId,
  fileName,
  fileType,
  text,
  metadata = {},
}) => {
  try {
    const index = await getPineconeIndex();
    if (!index) {
      throw new Error("Pinecone not initialized");
    }

    
    let processedText = text;

    if (!processedText || processedText.trim().length < 10) {
      processedText = `File uploaded: ${fileName}. Type: ${fileType}. This file contains minimal extractable text. File size: ${metadata.size || "unknown"} bytes. Uploaded at: ${metadata.uploadedAt || new Date().toISOString()}.`;
      console.log("Using placeholder text for embedding");
    }

    const chunks = chunkText(processedText, 800, 100);
    if (chunks.length === 0) {
      throw new Error("No text content to embed");
    }

    console.log(` Embedding ${chunks.length} chunks for ${fileName}`);

    const BATCH_SIZE = 20;
    const vectors = [];

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);

      console.log(
        `   → Embedding batch ${Math.floor(i / BATCH_SIZE) + 1}: ${
          batch.length
        } chunks`
      );

      const embeddings = await embedBatch(batch);

      console.log(`    Got ${embeddings?.length || 0} embeddings back`);

      if (!embeddings || embeddings.length === 0) {
        console.error(" embedBatch returned no embeddings");
        continue;
      }

      embeddings.forEach((embedding, idx) => {
        if (!Array.isArray(embedding) || embedding.length === 0) {
          console.error(`    Invalid embedding at index ${idx}`);
          return;
        }

        vectors.push({
          id: `${fileId}-${i + idx}-${randomUUID().slice(0, 8)}`,
          values: embedding,
          metadata: {
            userId: String(userId),
            fileId: String(fileId),
            fileName: String(fileName),
            fileType: String(fileType),
            chunkIndex: i + idx,
            text: String(batch[idx]).slice(0, 1000),
            ...metadata,
          },
        });
      });
    }

    if (vectors.length === 0) {
      throw new Error("No valid vectors generated");
    }

   
    const records = vectors.map((v) => ({
      id: v.id,
      values: v.values,
      metadata: v.metadata,
    }));

    console.log(` Upserting ${records.length} vectors to Pinecone...`);
    console.log(`   First record sample:`, {
      id: records[0]?.id,
      valuesLength: records[0]?.values?.length,
      metadataKeys: Object.keys(records[0]?.metadata || {}),
    });

    if (records.length === 0) {
      throw new Error("No records to upsert");
    }

  
    const namespace = index.namespace(`user-${userId}`);

    await namespace.upsert({ records });

    console.log(` Stored ${records.length} vectors in Pinecone`);

    return {
      success: true,
      chunksStored: records.length,
    };
  } catch (error) {
    console.error(" storeFileInPinecone error:", error.message);
    throw error;
  }
};


export const queryRAG = async ({
  userId,
  query,
  fileId = null,
  topK = 5,
}) => {
  try {
    const index = await getPineconeIndex();
    if (!index) return { matches: [] };

    const queryEmbedding = await embedText(query);

    const filter = fileId ? { fileId: String(fileId) } : undefined;

    const results = await index.namespace(`user-${userId}`).query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
      filter,
    });

    const matches = (results.matches || []).map((m) => ({
      score: m.score,
      text: m.metadata?.text || "",
      fileName: m.metadata?.fileName || "",
      fileId: m.metadata?.fileId || "",
      fileType: m.metadata?.fileType || "",
      chunkIndex: m.metadata?.chunkIndex ?? 0,
    }));

    return { matches };
  } catch (error) {
    console.error(" queryRAG error:", error.message);
    return { matches: [] };
  }
};


export const deleteFileFromPinecone = async ({ userId, fileId }) => {
  try {
    const index = await getPineconeIndex();
    if (!index) return { success: false };

    const namespace = index.namespace(`user-${userId}`);

    await namespace.deleteMany({
      filter: {
        fileId: { $eq: String(fileId) },
      },
    });

    console.log(` Deleted file ${fileId} from Pinecone`);
    return { success: true };
  } catch (error) {
    console.error(" deleteFileFromPinecone error:", error.message);
    return { success: false, error: error.message };
  }
};