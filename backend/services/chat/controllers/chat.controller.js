import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js"

export const CreateConversion=async(req,res)=>{
try {
    const userId=req.headers["x-user-id"]
    console.log("userid",userId)
    const conversation=await Conversation.create({
        userId:userId
    })
    return res.status(200).json(conversation)
} catch (error) {
     return res.status(200).json({
        message:"Conversation Create error"
     })
}
}

export const UpdatedConversions=async(req,res)=>{
try {
    const {id,title}=req.body
    const userId=req.headers["x-user-id"]
    console.log("userid",userId)
    const conversation=await Conversation.findByIdAndUpdate(id,{
        title
    })
    return res.status(200).json(conversation)
} catch (error) {
     return res.status(200).json({
        message:"Conversation update error"
     })
}
}

export const GetConversions=async(req,res)=>{
try {
    const userId=req.headers["x-user-id"]
    console.log("userid",userId)
    const conversation=await Conversation.find({
        userId:userId
    }).sort({updatedAt:-1})
    return res.status(200).json(conversation)
} catch (error) {
     return res.status(200).json({
        message:"Conversation Get error"
     })
}
}


export const SaveMessage=async(req,res)=>{
    try {
        const {conversationId,role,content}=req.body
        const message=await Message.create({
            conversationId,
            role,
            content
        })
        return res.status(200).json(message)
    } catch (error) {
         return res.status(200).json({
            message:"Messages errror"
         })
    }
}

export const GetMessages=async(req,res)=>{
    try {
       
        const messages=await Message.find({
            conversationId:req.params.conversationId
        }).sort({updatedAt:1})
        return res.status(200).json(messages)
    } catch (error) {
         return res.status(200).json({
            message:"Get Messages errror"
         })
    }
}

