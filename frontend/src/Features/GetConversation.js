import React from 'react'
import api from '../utlis/axios'

export default async function GetConversation() {
 try {
    const {data}=await api.get('/chat/get-conversation')
    return data
 } catch (error) {
    console.log(error)
 }
}
