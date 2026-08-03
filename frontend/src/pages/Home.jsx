import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import ChatArea from "../components/ChatArea/ChatArea";
import Coding from "../components/coding/Coding";
import { useTheme } from "../BgContext/ThemeContext";

export default function Home() {
  const { dark } = useTheme();

  return (
    <div className="flex w-full h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Chat Area */}
      <div
        className={`
          flex-1
          border-r
          ${dark ? "border-white/5" : "border-gray-200"}
        `}
      >
        <ChatArea />
      </div>

      {/* Coding Area */}
      <div className="w-1/5">
        <Coding />
      </div>

    </div>
  );
}