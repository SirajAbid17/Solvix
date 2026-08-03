import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import ChatArea from "../components/ChatArea/ChatArea";
import Coding from "../components/coding/Coding";

export default function Home() {
  return (
    <div className="flex w-full h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Chat Area */}
      <div className="flex-1 border-r border-gray-500">
        <ChatArea />
      </div>

      {/* Coding Area */}
      <div className="w-1/5">
        <Coding />
      </div>

    </div>
  );
}