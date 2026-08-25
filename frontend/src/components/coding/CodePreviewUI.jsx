import React from "react";

import {
  FiCode,
  FiCopy,
  FiCheck,
  FiRefreshCw,
  FiMaximize2,
  FiMinimize2,
  FiAlertCircle,
  FiTool,
  FiCheckCircle,
} from "react-icons/fi";

export default function CodePreviewUI({
  dark,
  latestCode,
  isFullscreen,
  isLoading,
  error,
  copied,
  iframeRef,
  handleCopy,
  executeCode,
  setIsFullscreen,
}) {
  // =========================================================
  // NO CODE UI
  // =========================================================

  if (!latestCode) {
    return (
      <div
        className={`
          flex
          h-full
          min-h-[400px]
          w-full
          items-center
          justify-center
          px-6
          ${dark ? "bg-[#080808]" : "bg-gray-50"}
        `}
      >
        <div className="flex max-w-sm flex-col items-center text-center">
          <div
            className={`
              mb-4
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              border
              ${
                dark
                  ? "border-white/[0.08] bg-white/[0.04]"
                  : "border-gray-200 bg-white"
              }
            `}
          >
            <FiCode
              size={20}
              className={
                dark
                  ? "text-gray-500"
                  : "text-gray-400"
              }
            />
          </div>

          <h3
            className={`
              text-sm
              font-semibold
              tracking-tight
              ${dark ? "text-gray-200" : "text-gray-800"}
            `}
          >
            No preview available
          </h3>

          <p
            className={`
              mt-1.5
              max-w-xs
              text-xs
              leading-5
              ${dark ? "text-gray-500" : "text-gray-400"}
            `}
          >
            Generate HTML, CSS, or JavaScript code
            with Solvix to see the live preview here.
          </p>

          <div
            className={`
              mt-4
              flex
              items-center
              gap-2
              rounded-lg
              border
              px-3
              py-2
              ${
                dark
                  ? "border-white/[0.06] bg-white/[0.02] text-gray-600"
                  : "border-gray-200 bg-white text-gray-400"
              }
            `}
          >
            <span
              className={`
                h-1.5
                w-1.5
                rounded-full
                ${dark ? "bg-gray-600" : "bg-gray-300"}
              `}
            />

            <span className="text-[10px]">
              Your preview will appear here
            </span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN PREVIEW
  // =========================================================

  return (
    <div
      className={`
        flex
        w-full
        flex-col
        overflow-hidden
        ${
          isFullscreen
            ? "fixed inset-0 z-[9999] h-screen w-screen"
            : "h-[420px]"
        }
        ${dark ? "bg-[#080808]" : "bg-gray-50"}
      `}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className={`
          flex
          h-12
          shrink-0
          items-center
          justify-between
          border-b
          px-3
          ${
            dark
              ? "border-white/[0.08] bg-[#0d0d0d]"
              : "border-gray-200 bg-white"
          }
        `}
      >
        <div className="flex items-center gap-2">
          <div
            className={`
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-lg
              ${
                dark
                  ? "bg-white/[0.06] text-gray-300"
                  : "bg-gray-100 text-gray-600"
              }
            `}
          >
            <FiCode size={14} />
          </div>

          <div className="flex flex-col">
            <span
              className={`
                text-xs
                font-semibold
                ${dark ? "text-gray-200" : "text-gray-800"}
              `}
            >
              Code Preview
            </span>

            <span
              className={`
                text-[9px]
                ${dark ? "text-gray-600" : "text-gray-400"}
              `}
            >
              {latestCode.isComingSoon
                ? "Coming Soon"
                : latestCode.language?.toUpperCase() || "HTML"}
            </span>
          </div>
        </div>

        {/* =================================================
            ACTIONS
        ================================================== */}

        <div className="flex items-center gap-1">
          {/* COPY */}

          <button
            type="button"
            onClick={handleCopy}
            title="Copy preview code"
            className={`
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-md
              transition
              ${
                dark
                  ? "text-gray-500 hover:bg-white/[0.06] hover:text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              }
            `}
          >
            {copied ? (
              <FiCheck
                size={13}
                className="text-green-500"
              />
            ) : (
              <FiCopy size={13} />
            )}
          </button>

          {/* REFRESH */}

          <button
            type="button"
            onClick={executeCode}
            disabled={isLoading}
            title="Refresh preview"
            className={`
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-md
              transition
              disabled:opacity-50
              ${
                dark
                  ? "text-gray-500 hover:bg-white/[0.06] hover:text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              }
            `}
          >
            <FiRefreshCw
              size={13}
              className={
                isLoading
                  ? "animate-spin"
                  : ""
              }
            />
          </button>

          {/* FULLSCREEN */}

          <button
            type="button"
            onClick={() =>
              setIsFullscreen(
                (previous) => !previous,
              )
            }
            title={
              isFullscreen
                ? "Exit fullscreen"
                : "Fullscreen"
            }
            className={`
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-md
              transition
              ${
                dark
                  ? "text-gray-500 hover:bg-white/[0.06] hover:text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              }
            `}
          >
            {isFullscreen ? (
              <FiMinimize2 size={13} />
            ) : (
              <FiMaximize2 size={13} />
            )}
          </button>
        </div>
      </div>

      {/* =====================================================
          PREVIEW AREA
      ====================================================== */}

      <div
        className={`
          min-h-0
          flex-1
          overflow-hidden
          ${isFullscreen ? "p-0" : "p-1.5"}
        `}
      >
        <div
          className={`
            relative
            h-full
            overflow-hidden
            border
            ${isFullscreen ? "rounded-none border-0" : "rounded-lg"}
            ${
              dark
                ? "border-white/[0.08] bg-black"
                : "border-gray-200 bg-white"
            }
          `}
        >
          {/* =================================================
              ERROR
          ================================================== */}

          {error ? (
            <div
              className={`
                flex
                h-full
                items-center
                justify-center
                p-4
                ${dark ? "text-red-400" : "text-red-600"}
              `}
            >
              <div className="w-full max-w-xl">
                <div className="flex items-center gap-2">
                  <FiAlertCircle size={16} />

                  <span className="text-xs font-semibold">
                    Preview Error
                  </span>
                </div>

                <pre
                  className={`
                    mt-2
                    max-w-full
                    overflow-auto
                    whitespace-pre-wrap
                    break-words
                    rounded-lg
                    p-3
                    text-[11px]
                    ${
                      dark
                        ? "bg-red-950/20 text-red-300"
                        : "bg-red-50 text-red-700"
                    }
                  `}
                >
                  {error}
                </pre>

                <button
                  type="button"
                  onClick={executeCode}
                  className={`
                    mt-3
                    rounded-md
                    px-3
                    py-1.5
                    text-xs
                    font-medium
                    ${
                      dark
                        ? "bg-white text-black"
                        : "bg-black text-white"
                    }
                  `}
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              title="Solvix Code Preview"
              className="block h-full w-full border-0"
              sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
              style={{
                overflow: "auto",
                display: "block",
              }}
            />
          )}

          {/* =================================================
              LOADING
          ================================================== */}

          {isLoading && !error && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20">
              <div
                className={`
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  border
                  px-3
                  py-2
                  text-xs
                  shadow-lg
                  ${
                    dark
                      ? "border-white/[0.08] bg-[#111]/95 text-gray-300"
                      : "border-gray-200 bg-white/95 text-gray-700"
                  }
                `}
              >
                <FiRefreshCw
                  size={13}
                  className="animate-spin"
                />

                <span>
                  Loading preview...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {!isFullscreen && (
        <div
          className={`
            flex
            h-6
            shrink-0
            items-center
            justify-between
            border-t
            px-3
            text-[9px]
            ${
              dark
                ? "border-white/[0.08] text-gray-600"
                : "border-gray-200 text-gray-400"
            }
          `}
        >
          <div className="flex items-center gap-1.5">
            {latestCode.isComingSoon ? (
              <>
                <FiTool size={10} />

                <span>
                  Coming Soon
                </span>
              </>
            ) : (
              <>
                <FiCheckCircle
                  size={10}
                  className="text-green-500"
                />

                <span>
                  Ready
                </span>
              </>
            )}
          </div>

          <span>
            {latestCode.code
              ? latestCode.code.split("\n").length
              : 0}{" "}
            lines
          </span>
        </div>
      )}
    </div>
  );
}