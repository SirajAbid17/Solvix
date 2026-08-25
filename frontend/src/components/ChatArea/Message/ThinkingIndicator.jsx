import React from "react";

export default function ThinkingIndicator({ dark }) {
  return (
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

          shadow-sm

          ${
            dark
              ? "bg-white/10 text-gray-200"
              : "bg-gray-100 text-gray-800"
          }
        `}
      >
        <div className="flex items-center gap-2">
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
              gap-2
            `}
          >
            Thinking...
          </span>
        </div>
      </div>
    </div>
  );
}

