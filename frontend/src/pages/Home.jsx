
// Home.jsx
import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import ChatArea from "../components/ChatArea/ChatArea";
import Coding from "../components/coding/Coding";
import { useTheme } from "../BgContext/ThemeContext";

export default function Home() {
  const { dark } = useTheme();

  return (
    <div
      className={`
        flex
        h-screen
        w-full
        min-w-0
        overflow-hidden
        ${dark ? "bg-black text-white" : "bg-white text-black"}
      `}
    >
      {/* ============================================
          SIDEBAR
      ============================================ */}

      <div className="h-screen shrink-0">
        <Sidebar />
      </div>

      {/* ============================================
          CHAT AREA
      ============================================ */}

      <div
        className={`
          flex
          h-screen
          min-w-0
          flex-1
          flex-col
          overflow-hidden
          border-r

          ${
            dark
              ? "border-white/[0.08]"
              : "border-gray-200"
          }
        `}
      >
        <ChatArea />
      </div>

      {/* ============================================
          CODING / PREVIEW AREA
      ============================================ */}

      <div
        className={`
          h-screen
          w-[360px]
          min-w-[120px]
          max-w-[260px]
          shrink-0
          overflow-hidden

          ${
            dark
              ? "bg-[#080808]"
              : "bg-gray-50"
          }
        `}
      >
        <Coding />
      </div>
    </div>
  );
}

