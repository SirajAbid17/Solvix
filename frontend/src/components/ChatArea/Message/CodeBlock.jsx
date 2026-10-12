import React, { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import toast from "react-hot-toast";

export default function CodeBlock({ language, code, darkMode }) {
  const [copied, setCopied] = useState(false);

  const fallbackCopyCode = (text) => {
    const textArea = document.createElement("textarea");

    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";

    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
      toast.success("Code copied!");
    } catch (err) {
      console.error("Fallback copy failed:", err);
      toast.error("Failed to copy code");
    }

    document.body.removeChild(textArea);
  };

  const handleCopy = () => {
    if (
      navigator.clipboard &&
      navigator.clipboard.writeText
    ) {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          setCopied(true);

          toast.success("Code copied!");

          setTimeout(() => {
            setCopied(false);
          }, 2000);
        })
        .catch((error) => {
          console.error("Copy failed:", error);
          fallbackCopyCode(code);
        });
    } else {
      fallbackCopyCode(code);
    }
  };

  const getLanguageDisplay = (lang) => {
    const languageMap = {
      html: "HTML",
      htm: "HTML",

      css: "CSS",

      javascript: "JavaScript",
      js: "JavaScript",

      react: "React",
      jsx: "React JSX",

      tsx: "React TSX",
      typescript: "TypeScript",
      ts: "TypeScript",

      json: "JSON",

      python: "Python",
      py: "Python",

      java: "Java",

      cpp: "C++",
      c: "C",

      csharp: "C#",
      cs: "C#",

      php: "PHP",

      ruby: "Ruby",

      go: "Go",

      rust: "Rust",

      swift: "Swift",

      kotlin: "Kotlin",

      sql: "SQL",

      xml: "XML",

      yaml: "YAML",
      yml: "YAML",

      markdown: "Markdown",
      md: "Markdown",

      text: "Text",
    };

    return (
      languageMap[lang?.toLowerCase()] ||
      lang ||
      "Code"
    );
  };

  return (
    <div className="relative my-3 group/code rounded-xl overflow-hidden border border-white/10">

      {}
      <div
        className="
          absolute
          top-0
          left-0
          right-0
          z-10
          w-full
          text-center
          py-1.5
          px-4
          text-[10px]
          font-mono
          font-black
          uppercase
          tracking-wider
        "
        style={{
          background: darkMode
            ? "rgba(13, 17, 23, 0.9)"
            : "rgba(246, 248, 250, 0.9)",

          color: darkMode
            ? "#8b949e"
            : "#6e7681",

          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",

          backdropFilter: "blur(4px)",

          borderBottom: darkMode
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid rgba(0,0,0,0.06)",
        }}
      >
        {getLanguageDisplay(language)}
      </div>

      {}
      <button
        type="button"
        onClick={handleCopy}
        className={`
          absolute
          top-2
          right-2
          z-10
          flex
          items-center
          gap-1.5
          rounded-lg
          px-2.5
          py-1.5
          text-xs
          font-medium
          transition-all
          duration-200
          opacity-0
          group-hover/code:opacity-100
          hover:scale-105

          ${
            darkMode
              ? "bg-black/60 text-white hover:bg-black/80 border border-white/10"
              : "bg-white/90 text-gray-700 hover:bg-white border border-gray-200"
          }
        `}
        title="Copy code"
      >
        {copied ? (
          <>
            <FiCheck
              size={14}
              className="text-green-500"
            />

            <span>Copied!</span>
          </>
        ) : (
          <>
            <FiCopy size={14} />

            <span>Copy</span>
          </>
        )}
      </button>

      {}
      <div className="code-scroll-area max-h-[600px] overflow-auto">

        <div
          className="code-wrapper"
          style={{
            display: "flex",
            minWidth: "100%",
          }}
        >

          {}
          <div
            className="line-numbers"
            style={{
              position: "sticky",
              left: 0,

              background: darkMode
                ? "#0d1117"
                : "#f6f8fa",

              zIndex: 10,

              borderRight: darkMode
                ? "1px solid rgba(255,255,255,0.06)"
                : "1px solid rgba(0,0,0,0.06)",

              padding: "48px 16px 20px 12px",

              minWidth: "2.5em",

              textAlign: "right",

              fontFamily:
                '"JetBrains Mono", "Fira Code", Consolas, monospace',

              fontSize: "13px",

              lineHeight: "1.7",

              color: darkMode
                ? "#4b5563"
                : "#8b949e",

              userSelect: "none",

              flexShrink: 0,
            }}
          >
            {code.split("\n").map((_, index) => (
              <div
                key={index}
                style={{
                  height: "1.7em",
                }}
              >
                {index + 1}
              </div>
            ))}
          </div>

          {}
          <div
            style={{
              flex: 1,
              overflow: "auto",
            }}
          >
            <SyntaxHighlighter
              language={language || "text"}
              style={
                darkMode
                  ? oneDark
                  : oneLight
              }
              showLineNumbers={false}
              wrapLines={true}
              wrapLongLines={false}
              PreTag="div"
              customStyle={{
                margin: 0,

                padding:
                  "48px 20px 20px 20px",

                fontSize: "13px",

                lineHeight: "1.7",

                fontFamily:
                  '"JetBrains Mono", "Fira Code", Consolas, monospace',

                background: darkMode
                  ? "#0d1117"
                  : "#f6f8fa",

                minHeight: "100%",

                minWidth: "100%",
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>

      {}
      <style>
        {`
          .code-scroll-area {
            scrollbar-width: thin;
            scrollbar-color: ${
              darkMode
                ? "#374151"
                : "#d1d5db"
            } ${
              darkMode
                ? "#0d1117"
                : "#f6f8fa"
            };

            overflow: auto !important;
          }

          .code-scroll-area::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }

          .code-scroll-area::-webkit-scrollbar-track {
            background: ${
              darkMode
                ? "#0d1117"
                : "#f6f8fa"
            };
          }

          .code-scroll-area::-webkit-scrollbar-thumb {
            background: ${
              darkMode
                ? "#374151"
                : "#d1d5db"
            };

            border-radius: 999px;

            border: 2px solid ${
              darkMode
                ? "#0d1117"
                : "#f6f8fa"
            };
          }

          .code-scroll-area::-webkit-scrollbar-thumb:hover {
            background: ${
              darkMode
                ? "#6b7280"
                : "#9ca3af"
            };
          }

          .code-scroll-area::-webkit-scrollbar-corner {
            background: ${
              darkMode
                ? "#0d1117"
                : "#f6f8fa"
            };
          }

          .code-wrapper {
            min-width: fit-content;
            position: relative;
          }

          .line-numbers div {
            white-space: nowrap;
          }
        `}
      </style>
    </div>
  );
}

