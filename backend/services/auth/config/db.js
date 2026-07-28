import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const DbConnect=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("dbconnected successfully!!!")
    } catch (error) {
        console.log(error)
    }
}

export default DbConnect