import express from "express"
import DbConnect from "./config/db.js"
import dotenv from "dotenv"
import AgentRoutes from "./routes/agent.routes.js"
dotenv.config()


const PORT=process.env.PORT
const app=express()
app.use(express.json())
app.use('/agent',AgentRoutes)

app.listen(PORT,()=>{
    console.log(`agent running on port ${PORT}`)
    DbConnect()
})