import mongoose from "mongoose";

const ConversationSchmea=new mongoose.Schema({
    title:{
        type:String,
        title:"New Chat"
    },
    userId:{
        type:String
    }
})

const Conversation=mongoose.model("Conversation",ConversationSchmea)
export default Conversation