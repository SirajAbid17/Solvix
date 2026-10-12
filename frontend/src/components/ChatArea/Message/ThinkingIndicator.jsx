import React from "react";

export default function ThinkingIndicator({ dark }) {
  return (
    <>
      <div className="flex w-full min-w-0 justify-start">
        <div
          className={`
            relative
            min-w-0
            max-w-[95%]
            sm:max-w-[90%]
            md:max-w-[82%]
            lg:max-w-[78%]

            overflow-hidden
            rounded-2xl
            rounded-bl-md

            px-3
            py-2

            sm:px-4
            sm:py-3

            ${
              dark
                ? "bg-white/10 text-gray-200"
                : "bg-gray-100 text-gray-800"
            }
          `}
        >
          <div className="flex items-center gap-2 ">
            <span
              className={`
                text-sm
                font-medium
                ${
                  dark
                    ? "text-gray-300"
                    : "text-gray-600"
                }
                inline-flex
                items-center
                gap-1
              `}
            >
              Thinking
              {}
              <span className="inline-flex items-center  gap-0.5 ml-0.5">
                <span
                  className={`
                    w-1 h-1 rounded-full 
                    ${dark ? "bg-gray-300" : "bg-gray-600"}
                    animate-dot
                  `}
                  style={{ animationDelay: "0s" }}
                />
                <span
                  className={`
                    w-1 h-1 rounded-full
                    ${dark ? "bg-gray-300" : "bg-gray-600"}
                    animate-dot
                  `}
                  style={{ animationDelay: "0.2s" }}
                />
                <span
                  className={`
                    w-1 h-1 rounded-full
                    ${dark ? "bg-gray-300" : "bg-gray-600"}
                    animate-dot
                  `}
                  style={{ animationDelay: "0.4s" }}
                />
              </span>
            </span>
          </div>
        </div>
      </div>

      {}
      <style>{`
        @keyframes dotBounce {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }
        .animate-dot {
          animation: dotBounce 1.2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}