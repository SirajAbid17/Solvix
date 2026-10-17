import api from "../utlis/axios";

export default async function GetMessages(id) {
  try {
    const { data } = await api.get(`/chat/get-messages/${id}`);
    console.log("Messages fetched:", data);

    const messagesWithFields = data.map((msg) => ({
      ...msg,
      pdf: msg.pdf || null,
      pdfUrl: msg.pdfUrl || null,
      pdfGenerated: msg.pdfGenerated || false,
      ppt: msg.ppt || null,
      pptUrl: msg.pptUrl || null,
      pptGenerated: msg.pptGenerated || false,
      pptFileName: msg.pptFileName || "solvix-presentation.pptx",
      pptData: msg.pptData || null,
      images: msg.images || [],
    }));

    return messagesWithFields;
  } catch (error) {
    console.log("GetMessages Error:", error);
    return [];
  }
}