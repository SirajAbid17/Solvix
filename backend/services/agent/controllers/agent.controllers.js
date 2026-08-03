import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
export const agent=async (req, res)=>{
try {
    const {prompt,conversationId}=req.body
    await axios.post(process.env.CHAT_SERVICES_URL+"/save-messages",{
        conversationId, role: "user", content: prompt
    })
    const result=await graph.invoke({
        prompt,
        conversationId    })

    const response=result.aiResponse 
    return res.status(200).json(response)

} catch (error) {
    res.status(500).json({ error: error.message });
}
}