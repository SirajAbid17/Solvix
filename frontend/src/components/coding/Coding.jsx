
import React from "react";
import BgContextBtn from "../BgContextBtn";
import { useTheme } from "../../BgContext/ThemeContext";
import CodePreview from "./CodePreview";
import WebsiteInformation from "./WebsiteInformation";

export default function Coding() {
  const { dark } = useTheme();

  return (
    <div
      className={`
        flex
        h-screen
        min-h-0
        w-full
        flex-col
        overflow-hidden
        transition-colors
        duration-300
        ${dark ? "bg-black text-white" : "bg-white text-black"}
      `}
    >
      {/* Theme Button */}
      <div
        className={`
          fixed
          right-3
          top-3
          z-50
          rounded-full
          p-1
          transition-all
          duration-300
          hover:scale-110
          ${dark ? "bg-black" : "bg-white"}
        `}
      >
        <BgContextBtn />
      </div>

      {/* Heading */}
      <div className="w-56 shrink-0 p-2.5">
        <div className="relative">
          <p
            className={`
              pl-3
              text-sm
              font-light
              uppercase
              leading-relaxed
              tracking-[0.2em]
              ${dark ? "text-gray-400" : "text-gray-600"}
            `}
          >
            Build something
            <br />

            <span
              className={`
                font-semibold
                ${dark ? "text-white" : "text-black"}
              `}
            >
              amazing with AI
            </span>
          </p>
        </div>
      </div>

      {/* Heading Border */}
      <div
        className={`
          w-full
          shrink-0
          border-b
          ${dark ? "border-white/10" : "border-gray-200"}
        `}
      />

      {/* Code Preview Area */}
      <div
        className="
          min-h-0
          flex-1
          overflow-hidden
        "
      >
        <CodePreview />
      </div>

      {/* Bottom Website Information */}
      <div className="mt-auto w-full shrink-0">
        <WebsiteInformation />
      </div>
    </div>
  );
}

