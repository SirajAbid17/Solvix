import mongoose from "mongoose";

const messageSchmea=new mongoose.Schema({
      conversationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Conversation'
      },
      role:{
        type:String,
        enum:["user","assistant"]
      },
      content:{
        type:String
      },
      images: {
    type: [String],  // 👈 YAHAN CHANGE - Images array
    default: []
  }
},{timestamps:true})

const Message=mongoose.model("Message",messageSchmea)
export default Message
