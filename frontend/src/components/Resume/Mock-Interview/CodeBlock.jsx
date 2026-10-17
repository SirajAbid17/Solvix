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

  const normalizeCode = (code) => {
    if (!code) return "";

    
    let normalized = code.replace(/\\n/g, "\n");
    normalized = normalized.replace(/\\"/g, '"');
    normalized = normalized.replace(/\\'/g, "'");

    
    normalized = normalized.trim();

    return normalized;
  };

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
    if (!code) {
      toast.error("No code to copy");
      return;
    }

    const normalizedCode = normalizeCode(code);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(normalizedCode)
        .then(() => {
          setCopied(true);
          toast.success("Code copied!");
          setTimeout(() => {
            setCopied(false);
          }, 2000);
        })
        .catch((error) => {
          console.error("Copy failed:", error);
          fallbackCopyCode(normalizedCode);
        });
    } else {
      fallbackCopyCode(normalizedCode);
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

    return languageMap[lang?.toLowerCase()] || lang || "Code";
  };

  const getSyntaxLanguage = (lang) => {
    const langMap = {
      js: "javascript",
      ts: "typescript",
      py: "python",
      jsx: "jsx",
      tsx: "tsx",
      cpp: "cpp",
      cs: "csharp",
      md: "markdown",
      yml: "yaml",
    };
    return langMap[lang?.toLowerCase()] || lang || "text";
  };

  const displayLanguage = getLanguageDisplay(language);
  const syntaxLanguage = getSyntaxLanguage(language);
  const isDark = darkMode !== undefined ? darkMode : true;

  
  const displayCode = normalizeCode(code);

  
  if (!displayCode) {
    return (
      <div
        className={`relative my-3 rounded-xl border border-dashed p-8 text-center ${
          isDark ? "border-white/10" : "border-gray-300"
        }`}
      >
        <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          No code available
        </p>
      </div>
    );
  }

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
          background: isDark
            ? "rgba(13, 17, 23, 0.9)"
            : "rgba(246, 248, 250, 0.9)",
          color: isDark ? "#8b949e" : "#6e7681",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          backdropFilter: "blur(4px)",
          borderBottom: isDark
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid rgba(0,0,0,0.06)",
        }}
      >
        {displayLanguage}
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
            isDark
              ? "bg-black/60 text-white hover:bg-black/80 border border-white/10"
              : "bg-white/90 text-gray-700 hover:bg-white border border-gray-200"
          }
        `}
        title="Copy code"
      >
        {copied ? (
          <>
            <FiCheck size={14} className="text-green-500" />
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
              background: isDark ? "#0d1117" : "#f6f8fa",
              zIndex: 10,
              borderRight: isDark
                ? "1px solid rgba(255,255,255,0.06)"
                : "1px solid rgba(0,0,0,0.06)",
              padding: "48px 16px 20px 12px",
              minWidth: "2.5em",
              textAlign: "right",
              fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
              fontSize: "13px",
              lineHeight: "1.7",
              color: isDark ? "#4b5563" : "#8b949e",
              userSelect: "none",
              flexShrink: 0,
            }}
          >
            {displayCode.split("\n").map((_, index) => (
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
              language={syntaxLanguage || "text"}
              style={isDark ? oneDark : oneLight}
              showLineNumbers={false}
              wrapLines={true}
              wrapLongLines={false}
              PreTag="div"
              customStyle={{
                margin: 0,
                padding: "48px 20px 20px 20px",
                fontSize: "13px",
                lineHeight: "1.7",
                fontFamily:
                  '"JetBrains Mono", "Fira Code", Consolas, monospace',
                background: isDark ? "#0d1117" : "#f6f8fa",
                minHeight: "100%",
                minWidth: "100%",
                whiteSpace: "pre",
                wordBreak: "normal",
                wordWrap: "normal",
              }}
              codeTagProps={{
                style: {
                  fontFamily:
                    '"JetBrains Mono", "Fira Code", Consolas, monospace',
                  whiteSpace: "pre",
                  wordBreak: "normal",
                  wordWrap: "normal",
                },
              }}
            >
              {displayCode}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>

      {}
      <style>
        {`
          .code-scroll-area {
            scrollbar-width: thin;
            scrollbar-color: ${isDark ? "#374151" : "#d1d5db"} ${
          isDark ? "#0d1117" : "#f6f8fa"
        };
            overflow: auto !important;
          }

          .code-scroll-area::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }

          .code-scroll-area::-webkit-scrollbar-track {
            background: ${isDark ? "#0d1117" : "#f6f8fa"};
          }

          .code-scroll-area::-webkit-scrollbar-thumb {
            background: ${isDark ? "#374151" : "#d1d5db"};
            border-radius: 999px;
            border: 2px solid ${isDark ? "#0d1117" : "#f6f8fa"};
          }

          .code-scroll-area::-webkit-scrollbar-thumb:hover {
            background: ${isDark ? "#6b7280" : "#9ca3af"};
          }

          .code-scroll-area::-webkit-scrollbar-corner {
            background: ${isDark ? "#0d1117" : "#f6f8fa"};
          }

          .code-wrapper {
            min-width: fit-content;
            position: relative;
          }

          .line-numbers div {
            white-space: nowrap;
          }

          /*  SyntaxHighlighter - Preserve line breaks */
          .code-wrapper pre {
            margin: 0 !important;
            padding: 48px 20px 20px 20px !important;
            background: ${isDark ? "#0d1117" : "#f6f8fa"} !important;
            white-space: pre !important;
            word-break: normal !important;
            word-wrap: normal !important;
          }

          .code-wrapper code {
            white-space: pre !important;
            word-break: normal !important;
            word-wrap: normal !important;
            display: block !important;
          }

          /* Copy button - ensure it's always clickable */
          .group-hover\\/code\\:opacity-100 {
            opacity: 0;
          }
          .group:hover .group-hover\\/code\\:opacity-100 {
            opacity: 1;
          }

          /*  Fix line height for code */
          .code-wrapper pre .token-line {
            line-height: 1.7 !important;
          }
        `}
      </style>
    </div>
  );
}