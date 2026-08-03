import React from "react";
import { useSelector } from "react-redux";

export default function Navbar() {
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );

  return (
    <div>
      <h1>{selectedConversation?.title || "New Chat"}</h1>
    </div>
  );
}