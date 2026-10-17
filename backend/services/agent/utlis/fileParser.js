import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import Tesseract from "tesseract.js";
import { createRequire } from "module";


const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");


export const extractTextFromFile = async (filePath, mimetype, originalName) => {
  try {
    const ext = path.extname(originalName || filePath).toLowerCase();

  
    if (ext === ".pdf" || mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      return {
        type: "pdf",
        text: data.text || "",
        pages: data.numpages || 0,
        info: data.info || {},
      };
    }

   
    if (
      ext === ".docx" ||
      mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      return {
        type: "docx",
        text: result.value || "",
        messages: result.messages || [],
      };
    }

    
    if (ext === ".doc" || mimetype === "application/msword") {
      return {
        type: "doc",
        text: " Old .doc format detected. Please convert to .docx for better parsing.",
      };
    }

   
    if (
      [".xlsx", ".xls", ".csv"].includes(ext) ||
      mimetype.includes("spreadsheet") ||
      mimetype === "text/csv"
    ) {
      const workbook = XLSX.readFile(filePath);
      let text = "";
      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const csv = XLSX.utils.sheet_to_csv(sheet);
        text += `\n=== Sheet: ${sheetName} ===\n${csv}\n`;
      });
      return {
        type: "excel",
        text,
        sheets: workbook.SheetNames,
      };
    }

    
    if (
      [".txt", ".md", ".log", ".json", ".xml", ".html", ".js", ".py"].includes(ext) ||
      mimetype.startsWith("text/")
    ) {
      const text = fs.readFileSync(filePath, "utf-8");
      return { type: "text", text };
    }

    if (mimetype.startsWith("image/")) {
      try {
        const { data } = await Tesseract.recognize(filePath, "eng", {
          logger: () => {},
        });
        return {
          type: "image",
          text: data.text || "",
          confidence: data.confidence || 0,
        };
      } catch (ocrErr) {
        console.error("OCR failed:", ocrErr.message);
        return {
          type: "image",
          text: "[Image uploaded — OCR unavailable]",
        };
      }
    }

    
    try {
      const text = fs.readFileSync(filePath, "utf-8");
      return { type: "unknown", text };
    } catch {
      return { type: "unknown", text: "" };
    }
  } catch (error) {
    console.error("File parse error:", error);
    throw new Error(`Failed to parse file: ${error.message}`);
  }
};


export const chunkText = (text, chunkSize = 800, overlap = 100) => {
  const cleanText = String(text).replace(/\s+/g, " ").trim();
  if (!cleanText) return [];

  const chunks = [];
  let start = 0;

  while (start < cleanText.length) {
    const end = Math.min(start + chunkSize, cleanText.length);
    const chunk = cleanText.slice(start, end).trim();

    if (chunk.length > 30) {
      chunks.push(chunk);
    }

    if (end >= cleanText.length) break;
    start = end - overlap;
  }

  return chunks;
};