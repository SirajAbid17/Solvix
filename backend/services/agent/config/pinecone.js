import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

let pineconeClient = null;
let pineconeIndex = null;

export const initPinecone = async () => {
  try {
    if (pineconeClient && pineconeIndex) {
      return { client: pineconeClient, index: pineconeIndex };
    }

    if (!process.env.PINECONE_API_KEY) {
      console.warn("PINECONE_API_KEY not set - RAG disabled");
      return { client: null, index: null };
    }

    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    const indexName = process.env.PINECONE_INDEX || "solvix-rag";

    
    const existingIndexes = await pineconeClient.listIndexes();
    const indexExists = existingIndexes.indexes?.some(
      (idx) => idx.name === indexName
    );

    if (!indexExists) {
      console.log(`Creating Pinecone index: ${indexName}`);
      await pineconeClient.createIndex({
        name: indexName,
        dimension: 768, 
        metric: "cosine",
        spec: {
          serverless: {
            cloud: "aws",
            region: "us-east-1",
          },
        },
      });

  
      console.log("Waiting for index to be ready...");
      await new Promise((r) => setTimeout(r, 15000));
    }

    pineconeIndex = pineconeClient.index(indexName);
    console.log(`Pinecone connected: ${indexName}`);

    return { client: pineconeClient, index: pineconeIndex };
  } catch (error) {
    console.error(" Pinecone init error:", error.message);
    return { client: null, index: null };
  }
};

export const getPineconeIndex = async () => {
  if (!pineconeIndex) {
    await initPinecone();
  }
  return pineconeIndex;
};