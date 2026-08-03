import React from 'react'
import api from '../utlis/axios'

export default async function CreateConversation() {
 try {
    const {data}=await api.post('/chat/create-conversation')
    return data
 } catch (error) {
    console.log(error)
 }
}
