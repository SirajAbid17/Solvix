import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

export const extractTextFromPDF = async (buffer) => {
  const pdf = await getDocument({
    data: new Uint8Array(buffer),
  }).promise;

  let text = "";

  for (let page = 1; page <= pdf.numPages; page++) {
    const currentPage = await pdf.getPage(page);
    const content = await currentPage.getTextContent();

    text +=
      content.items.map((item) => item.str).join(" ") + "\n";
  }

  return text;
};