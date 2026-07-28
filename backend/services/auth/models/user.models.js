import mongoose from "mongoose";

const UserSchema=new mongoose.Schema({
    firebaseId:{
        type:String,
        unique:true
    },
    name:{
        type:String,
    },
    email:{
        type:String,
    },
    avatar:{
        type:String,
    }
},{timestamps:true})

const User =mongoose.model("User",UserSchema)
export default User