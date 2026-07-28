import express from "express"
import { Login, Logout } from "../controllers/auth.controller.js"

const Router=express.Router()

Router.post('/login',Login)
Router.post('/logout',Logout)

export default Router

