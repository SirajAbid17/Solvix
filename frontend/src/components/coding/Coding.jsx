import React from "react";
import BgContextBtn from "../BgContextBtn";
import { useTheme } from "../../BgContext/ThemeContext";

export default function Coding() {
  const { dark } = useTheme();

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        dark ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Theme Button */}
      <div
        className={`
          fixed right-3 top-3
          rounded-full
          p-1
          transition-all duration-300
          hover:scale-110
          ${
            dark
              ? "bg-black  "
              : "bg-white"
          }
        `}
      >
        <BgContextBtn />
      </div>

      {/* Heading */}
      <div className="p-2.5 w-56">
        <div className="relative">
          {/* Left Line */}
         

          <p
            className={`
              pl-3
              text-sm
              font-light
              tracking-[0.2em]
              uppercase
              leading-relaxed
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

      {/* Bottom Border - Same as Sidebar */}
      <div
        className={`
          w-full
          border-b
          ${
            dark
              ? "border-white/10"
              : "border-gray-200"
          }
        `}
      ></div>
    </div>
  );
}