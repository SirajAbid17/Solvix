import api from '../utlis/axios'

export default async function GetMessages(id) {
  try {
    const { data } = await api.get(`/chat/get-messages/${id}`)
    console.log("📥 Messages fetched:", data)
    
    // ✅ Ensure all messages have PDF fields
    const messagesWithPDF = data.map(msg => ({
      ...msg,
      pdf: msg.pdf || null,
      pdfGenerated: msg.pdfGenerated || false,
      images: msg.images || []
    }))
    
    return messagesWithPDF
  } catch (error) {
    console.log("❌ GetMessages Error:", error)
    return []
  }
}