
import { PDFParse } from "pdf-parse";

export const extractPdfText = async (buffer) => {
  let parser;

  try {
    if (!buffer || !Buffer.isBuffer(buffer)) {
      throw new Error("A valid PDF buffer is required");
    }

    parser = new PDFParse({
      data: new Uint8Array(buffer),
    });

    const result = await parser.getText();

    const text = (result.text || "").trim();

    if (!text) {
      throw new Error(
        "No readable text found in PDF. It may be a scanned PDF."
      );
    }

    const chunkSize = 3000;
    const chunkOverlap = 300;
    const chunks = [];

    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);

      chunks.push(text.slice(start, end));

      if (end === text.length) break;

      start += chunkSize - chunkOverlap;
    }

    console.log(
      `PDF extraction completed. Pages: ${result.total}, Chunks: ${chunks.length}`
    );

    return {
      text,
      chunks,
    };
  } catch (error) {
    console.error("PDF Extraction Error:", error);
    throw error;
  } finally {
    if (parser) {
      await parser.destroy().catch((error) => {
        console.error("PDF Parser Cleanup Error:", error);
      });
    }
  }
};
