import express from "express"
import { CreateConversion, GetConversions, GetMessages, SaveMessage, UpdatedConversions } from "../controllers/chat.controller.js"

const Route=express.Router()

Route.post('/create-conversation',CreateConversion)
Route.get('/get-conversation',GetConversions)
Route.post('/save-messages',SaveMessage)
Route.post('/update-conversation',UpdatedConversions)
Route.get('/get-messages/:conversationId',GetMessages)


export default Route
