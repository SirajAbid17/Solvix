import express from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy"
import cors from "cors"
import cookieParser from "cookie-parser"
import protect from "./middleware/auth.middleware.js"
import { CurrentUser } from "./controllers/user.controller.js"
import { ProxyWithHeader } from "./utlis/proxyWithHeader.js"
dotenv.config()

const PORT=process.env.PORT
const app=express()
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(cookieParser())


app.use('/auth',proxy(process.env.Auth_Services))
app.use('/chat',protect,ProxyWithHeader(process.env.Chat_Services))
app.get('/me',protect,CurrentUser)
app.get('/agent',protect,proxy(process.env.Agent_Services))

app.listen(PORT,()=>{
    console.log(`gateway running on port ${PORT}`)
})