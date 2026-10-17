import React, { useEffect } from "react";
import Navbar from "./Navbar";
import ChatInput from "./ChatInput";
import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import GetMessages from "../../Features/GetMessages";
import { setMessages } from "../../redux/messageslice";

export default function ChatArea() {
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const getMessage = async () => {
     
      if (!selectedConversation?._id) {
        dispatch(setMessages([]));
        return;
      }

      try {
        const data = await GetMessages(selectedConversation._id);

        const list = Array.isArray(data)
          ? data
          : data?.messages || data?.data || [];


        const messagesWithImages = list.map((msg) => ({
          ...msg,
          conversationId:
            msg.conversationId ||
            msg.conversation ||
            msg.chatId ||
            selectedConversation._id,
          images: msg.images || [],
        }));

        console.log("Mapped messages:", messagesWithImages);

        dispatch(setMessages(messagesWithImages));
      } catch (error) {
        console.error("GetMessages failed:", error);
        dispatch(setMessages([]));
      }
    };

    getMessage();
  }, [selectedConversation, dispatch]);

  return (
    <div
      className="
        flex
        h-screen
        w-full
        min-w-0
        flex-col
        overflow-hidden
      "
    >
      <Navbar />
      <Message />
      <ChatInput />
    </div>
  );
}