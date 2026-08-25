import React from 'react'
import api from '../utlis/axios'

export default async function ChatAgent(payload) {
  try {
    const { data } = await api.post("/agent/chat", payload)
    return data
  } catch (error) {
    console.log("ChatAgent Error:", error)
    throw error
  }
}