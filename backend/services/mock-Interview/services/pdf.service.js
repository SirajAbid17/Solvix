import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const extractTextFromPDF = async (buffer) => {
  try {
    const uint8Array = new Uint8Array(buffer);

    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
    });

    const pdfDocument = await loadingTask.promise;

    console.log(`PDF Pages: ${pdfDocument.numPages}`);

    let extractedText = "";

    for (
      let pageNumber = 1;
      pageNumber <= pdfDocument.numPages;
      pageNumber++
    ) {
      const page = await pdfDocument.getPage(pageNumber);

      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map((item) => item.str || "")
        .join(" ");

      extractedText += `\n\n--- PAGE ${pageNumber} ---\n\n`;
      extractedText += pageText;

      console.log(`Page ${pageNumber} extracted`);
    }

    const cleanedText = extractedText
      .replace(/\s+/g, " ")
      .trim();

    console.log(
      `PDF extraction completed. Characters: ${cleanedText.length}`
    );

    return cleanedText;
  } catch (error) {
    console.error("PDF Extraction Error:", error);
    throw new Error(
      `Failed to extract text from PDF: ${error.message}`
    );
  }
};