import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const extractPdfText = async (buffer) => {
  try {
    const data = new Uint8Array(buffer);

    const pdf = await pdfjsLib.getDocument({
      data,
    }).promise;

    let text = "";

    for (let page = 1; page <= pdf.numPages; page++) {
      const currentPage = await pdf.getPage(page);

      const content = await currentPage.getTextContent();

      const pageText = content.items.map((item) => item.str).join(" ");

      text += pageText + "\n\n";
    }

    text = text.trim();

    const chunkSize = 3000;
    const chunkOverlap = 300;

    const chunks = [];

    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);

      chunks.push(text.slice(start, end));

      start += chunkSize - chunkOverlap;
    }

    console.log("PDF Extraction Completed");

    chunks.forEach((chunk, index) => {
      console.log(chunk);
    });

    return {
      text,
      chunks,
    };
  } catch (error) {
    console.error("PDF Extraction Error:", error);
    throw error;
  }
};
