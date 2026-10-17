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
        h-full
        min-h-0
        w-full
        flex-col
        overflow-hidden
        transition-colors
        duration-300
        ${dark ? "bg-black text-white" : "bg-white text-black"}
      `}
    >
     
      <div
        className={`
          relative
          flex
          h-14
          w-full
          shrink-0
          items-center
          justify-between
          gap-2
          border-b
          px-3
          sm:h-16
          sm:px-4
          ${
            dark
              ? "border-white/[0.08] bg-black"
              : "border-gray-200 bg-white"
          }
        `}
      >
        <div className="min-w-0 flex-1">
          <p
            className={`
              text-[10px]
              font-light
              uppercase
              leading-tight
              tracking-[0.15em]
              sm:text-[11px]
              sm:tracking-[0.2em]
              ${dark ? "text-gray-400" : "text-gray-600"}
            `}
          >
            Build something{" "}
            <span
              className={`font-semibold ${dark ? "text-white" : "text-black"}`}
            >
              amazing with AI
            </span>
          </p>
        </div>

        <div
          className={`
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
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
      </div>

     
      <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
        <CodePreview />
      </div>

    
      <div className="mt-auto w-full shrink-0">
        <WebsiteInformation />
      </div>
    </div>
  );
}