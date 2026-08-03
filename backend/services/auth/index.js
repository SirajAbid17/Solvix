import express from "express"
import dotenv from "dotenv"
import DbConnect from "./config/db.js"
import AuthRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
dotenv.config()


const PORT=process.env.PORT
const app=express()
app.use(express.json())
app.use(cookieParser());
app.use('/',AuthRouter)


app.listen(PORT,()=>{
    console.log(`auth running on port ${PORT}`)
    DbConnect()
})