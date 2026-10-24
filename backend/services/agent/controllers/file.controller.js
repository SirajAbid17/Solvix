import fs from "fs";
import { extractTextFromFile } from "../utlis/fileParser.js";
import {
  storeFileInPinecone,
  deleteFileFromPinecone,
} from "../utlis/ragStore.js";
import { randomUUID } from "crypto";
import cloudinary from "../config/cloudinary.js";
import redis from "../../../shared/redis/redis.js";

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
    console.log(`   Extracted type: ${parsed.type}`);
    console.log(`   Extracted text length: ${parsed.text?.length || 0}`);

    if (parsed.type === "image") {
      if (!parsed.text || parsed.text.trim().length < 3) {
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
          `   Image base64: ${Math.round(imageBase64.length / 1024)}KB`
        );
      } catch (err) {
        console.error("   Failed to read image:", err.message);
      }
    }

   
    let cloudinaryUrl = null;
    let cloudinaryPublicId = null;

    try {
      const buffer = fs.readFileSync(filePath);
      const safeName = `${fileId}_${originalname.replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      )}`;
      const isPdf = parsed.type === "pdf" || mimetype === "application/pdf";
      const isImage = parsed.type === "image";

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "solvix/files",
            resource_type: isPdf ? "raw" : isImage ? "image" : "raw",
            public_id: safeName.replace(/\.(pdf|docx?|txt)$/i, ""),
            format: isPdf ? "pdf" : isImage ? "png" : undefined,
            type: "upload",
            access_mode: "public",
          },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(buffer);
      });

      if (uploadResult?.secure_url) {
        cloudinaryUrl = uploadResult.secure_url;
        cloudinaryPublicId = uploadResult.public_id;
        console.log(`   Cloudinary upload: ${cloudinaryUrl}`);
      }
    } catch (cloudErr) {
      console.error(`    Cloudinary failed: ${cloudErr.message}`);
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
          cloudinaryUrl,
          cloudinaryPublicId,
          uploadedAt: new Date().toISOString(),
        },
      });
      ragStored = storeResult.success;
      chunksStored = storeResult.chunksStored || 0;
      console.log(`    RAG stored: ${chunksStored} chunks`);
    } catch (ragErr) {
      console.warn(`     RAG store failed (non-critical): ${ragErr.message}`);
    }

   
    if (cloudinaryUrl) {
      try {
        await redis.set(
          `cv:${userId}:${fileId}`,
          JSON.stringify({
            url: cloudinaryUrl,
            publicId: cloudinaryPublicId,
            fileName: originalname,
            fileType: parsed.type,
            mimetype,
            uploadedAt: new Date().toISOString(),
          }),
          "EX",
          60 * 60 * 24 * 30 
        );
        console.log(` CV URL cached in Redis`);
      } catch (redisErr) {
        console.warn(`  Redis cache failed: ${redisErr.message}`);
      }
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
        cloudinaryUrl,
        cloudinaryPublicId,
        chunksStored,
        ragStored,
        pages: parsed.pages || 0,
        sheets: parsed.sheets || [],
      },
    });
  } catch (error) {
    console.error("File upload error:", error);

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

   
    try {
      await deleteFileFromPinecone({ userId, fileId });
    } catch (err) {
      console.warn("Pinecone delete failed:", err.message);
    }

  
    try {
      await redis.del(`cv:${userId}:${fileId}`);
    } catch (err) {
      console.warn("Redis delete failed:", err.message);
    }

    return res.json({
      success: true,
      message: "File removed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};