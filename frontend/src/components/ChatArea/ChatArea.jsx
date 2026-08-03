import React, { useEffect } from 'react'
import Navbar from './Navbar'
import ChatInput from './ChatInput'
import Message from './Message'
import { useDispatch, useSelector } from 'react-redux';
import GetMessages from '../../Features/GetMessages';
import { setMessages } from '../../redux/messageslice';

export default function ChatArea() {
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );
  const dispatch = useDispatch();
  
  useEffect(() => {
    const getMessage = async () => {
      if (selectedConversation) {
        const data = await GetMessages(selectedConversation?._id);
        dispatch(setMessages(data));
      }
    };
    getMessage();
  }, [selectedConversation, dispatch]);

  return (
    <div className="flex flex-col h-screen w-full">
      <Navbar />
      <Message />
      <ChatInput />
    </div>
  );
}