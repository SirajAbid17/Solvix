import React from 'react'
import api from '../utlis/axios'

export default async function GetMessages(id) {
 try {
    const {data}=await api.get(`/chat/get-messages/${id}`)
    console.log(data)
    return data
 } catch (error) {
    console.log(error)
 }
}
