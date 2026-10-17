import fs from "fs";
import { extractTextFromFile } from "../utlis/fileParser.js";
import {
  storeFileInPinecone,
  deleteFileFromPinecone,
} from "../utlis/ragStore.js";
import { randomUUID } from "crypto";

export const uploadAndProcessFile = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] || req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const { path: filePath, originalname, mimetype, size } = req.file;
    const fileId = randomUUID();

    console.log(`\n Processing file: ${originalname} (${size} bytes)`);
    console.log(`   MIME: ${mimetype}`);

   
    const parsed = await extractTextFromFile(filePath, mimetype, originalname);

    console.log(`Extracted type: ${parsed.type}`);
    console.log(`Extracted text length: ${parsed.text?.length || 0}`);


    if (parsed.type === "image") {
      if (!parsed.text || parsed.text.trim().length < 3) {
        console.log(
          "Image has minimal text — continuing with placeholder"
        );
        parsed.text =
          parsed.text?.trim() ||
          `[Image uploaded: ${originalname}. Visual-only image.]`;
      }
    } else {
      if (!parsed.text || parsed.text.trim().length < 10) {
        try {
          fs.unlinkSync(filePath);
        } catch {}

        return res.status(400).json({
          success: false,
          message:
            "Could not extract text from file. The document appears to be empty or unreadable.",
          fileType: parsed.type,
        });
      }
    }

   
    let imageBase64 = null;
    let imageMimeType = null;

    if (parsed.type === "image") {
      try {
        const imageBuffer = fs.readFileSync(filePath);
        imageBase64 = imageBuffer.toString("base64");
        imageMimeType = mimetype;
        console.log(
          `Image encoded to base64 (${Math.round(
            imageBase64.length / 1024
          )}KB)`
        );
      } catch (err) {
        console.error("Failed to read image as base64:", err.message);
      }
    }

    
    let ragStored = false;
    let chunksStored = 0;

    try {
      const storeResult = await storeFileInPinecone({
        userId,
        fileId,
        fileName: originalname,
        fileType: parsed.type,
        text: parsed.text,
        metadata: {
          mimetype,
          size,
          uploadedAt: new Date().toISOString(),
        },
      });
      ragStored = storeResult.success;
      chunksStored = storeResult.chunksStored || 0;
    } catch (ragErr) {
      console.error("RAG store failed:", ragErr.message);
    }

    
    try {
      fs.unlinkSync(filePath);
    } catch {}

    
    return res.json({
      success: true,
      message: "File processed successfully",
      file: {
        fileId,
        fileName: originalname,
        fileType: parsed.type,
        mimetype,
        size,
        textPreview: (parsed.text || "").slice(0, 500),
        fullText: (parsed.text || "").slice(0, 15000),
       
        imageBase64: imageBase64 || null,
        imageMimeType: imageMimeType || null,
        chunksStored,
        ragStored,
        pages: parsed.pages || 0,
        sheets: parsed.sheets || [],
      },
    });
  } catch (error) {
    console.error(" File upload error:", error);

    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch {}
    }

    return res.status(500).json({
      success: false,
      message: error.message || "File processing failed",
    });
  }
};


export const askAboutFile = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] || req.body.userId;
    const { fileId, question } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User required" });
    }

    if (!fileId || !question) {
      return res.status(400).json({
        success: false,
        message: "fileId and question required",
      });
    }

    const { queryRAG } = await import("../utlis/ragStore.js");
    const { GetModels } = await import("../config/aimodels.js");

    const { matches } = await queryRAG({
      userId,
      query: question,
      fileId,
      topK: 6,
    });

    if (!matches || matches.length === 0) {
      return res.json({
        success: true,
        answer: "No relevant content found in this file.",
        sources: [],
      });
    }

    const context = matches
      .map((m, i) => `[Chunk ${i + 1}]\n${m.text}`)
      .join("\n\n---\n\n");

    const llm = await GetModels("chat");
    const response = await llm.invoke([
      {
        role: "system",
        content: `Answer based ONLY on this file content:\n\n${context}`,
      },
      { role: "user", content: question },
    ]);

    return res.json({
      success: true,
      answer: response.content,
      sources: matches.map((m) => ({
        chunkIndex: m.chunkIndex,
        score: m.score,
      })),
    });
  } catch (error) {
    console.error("askAboutFile error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteFileRAG = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] || req.body.userId;
    const { fileId } = req.params;

    if (!userId || !fileId) {
      return res.status(400).json({ success: false });
    }

    const result = await deleteFileFromPinecone({ userId, fileId });

    return res.json({
      success: result.success,
      message: result.success ? "File removed from RAG" : "Delete failed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};