import React from 'react'
import Navbar from './Navbar'
import ChatInput from './ChatInput'
import Message from './Message'

export default function ChatArea() {
  return (
    <div>
      <Navbar/>
      <Message/>
      <ChatInput/>
     
    </div>
  )
}
