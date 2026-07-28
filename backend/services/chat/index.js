import express from "express"
import dotenv from "dotenv"
import DbConnect from "./config/db.js"
import ChatRoute from "./routes/chat.route.js"
dotenv.config()


const PORT=process.env.PORT
const app=express()
app.use(express.json())
app.use('/chat',ChatRoute)


app.listen(PORT,()=>{
    console.log(`chat running on port ${PORT}`)
    DbConnect()
})