import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaCheck,
  FaCode,
  FaCopy,
  FaTimes,
} from "react-icons/fa";

import toast from "react-hot-toast";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import {
  html as beautifyHtml,
  css as beautifyCss,
  js as beautifyJs,
} from "js-beautify";

export default function WebsiteCodeModal({
  portfolio,
  isOpen,
  onClose,
}) {
  const [activeCodeTab, setActiveCodeTab] =
    useState("html");

  const [copied, setCopied] =
    useState(false);

  
  
  

  const generatedCode =
    portfolio?.generatedCode || {};

  const rawHtml =
    generatedCode?.html || "";

  const rawCss =
    generatedCode?.css || "";

  const rawJs =
    generatedCode?.js || "";

  // ============================================================
  // BEAUTIFY OPTIONS
  // ============================================================

  const beautifyOptions = {
    indent_size: 2,
    indent_char: " ",
    max_preserve_newlines: 2,
    preserve_newlines: true,
    wrap_line_length: 120,
    end_with_newline: true,
    space_in_empty_paren: false,
    jslint_happy: false,
  };

  // ============================================================
  // FORMAT HTML
  // ============================================================

  const html = useMemo(() => {
    if (!rawHtml) return "";

    try {
      return beautifyHtml(
        rawHtml,
        {
          ...beautifyOptions,
          indent_inner_html: true,
          wrap_attributes: "auto",
          wrap_attributes_min_attrs: 2,
        }
      );
    } catch (error) {
      console.error(
        "HTML formatting error:",
        error
      );

      return rawHtml;
    }
  }, [rawHtml]);

  
  
  

  const css = useMemo(() => {
    if (!rawCss) return "";

    try {
      return beautifyCss(
        rawCss,
        {
          ...beautifyOptions,
          selector_separator_newline: true,
        }
      );
    } catch (error) {
      console.error(
        "CSS formatting error:",
        error
      );

      return rawCss;
    }
  }, [rawCss]);

  // ============================================================
  // FORMAT JAVASCRIPT
  // ============================================================

  const js = useMemo(() => {
    if (!rawJs) return "";

    try {
      return beautifyJs(
        rawJs,
        {
          ...beautifyOptions,

          // JavaScript specific
          brace_style: "collapse",
          break_chained_methods: true,
          comma_first: false,
          e4x: false,
          keep_array_indentation: false,
          keep_function_indentation: false,
          space_after_anon_function: true,
          space_after_named_function: true,
          space_before_conditional: true,
          space_in_paren: false,
          unescape_strings: false,
        }
      );
    } catch (error) {
      console.error(
        "JavaScript formatting error:",
        error
      );

      return rawJs;
    }
  }, [rawJs]);

  
  
  

  const codeTabs = useMemo(
    () => [
      {
        id: "html",
        label: "HTML",
        language: "html",
        code: html,
      },

      {
        id: "css",
        label: "CSS",
        language: "css",
        code: css,
      },

      {
        id: "js",
        label: "JavaScript",
        language: "javascript",
        code: js,
      },
    ],
    [html, css, js]
  );

  
  
  

  const activeTab = useMemo(() => {
    return (
      codeTabs.find(
        (tab) =>
          tab.id === activeCodeTab
      ) || codeTabs[0]
    );
  }, [
    codeTabs,
    activeCodeTab,
  ]);

  const currentCode =
    activeTab?.code || "";

  // ============================================================
  // ESCAPE KEY
  // ============================================================

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [isOpen, onClose]);

  
  
  

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, [isOpen]);

  
  
  

  useEffect(() => {
    setActiveCodeTab("html");
    setCopied(false);
  }, [portfolio]);

  
  
  

  const copyCode = async () => {
    if (!currentCode) {
      toast.error(
        "No code available"
      );

      return;
    }

    try {
      await navigator.clipboard.writeText(
        currentCode
      );

      setCopied(true);

      toast.success(
        `${activeTab.label} copied`
      );

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Clipboard error:",
        error
      );

      copyUsingFallback();
    }
  };

  
  
  

  const copyUsingFallback = () => {
    try {
      const textarea =
        document.createElement(
          "textarea"
        );

      textarea.value =
        currentCode;

      textarea.style.position =
        "fixed";

      textarea.style.left =
        "-9999px";

      textarea.style.top =
        "0";

      textarea.style.opacity =
        "0";

      document.body.appendChild(
        textarea
      );

      textarea.focus();

      textarea.select();

      const successful =
        document.execCommand(
          "copy"
        );

      document.body.removeChild(
        textarea
      );

      if (!successful) {
        throw new Error(
          "Copy command failed"
        );
      }

      setCopied(true);

      toast.success(
        `${activeTab.label} copied`
      );

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Fallback copy error:",
        error
      );

      toast.error(
        "Unable to copy code"
      );
    }
  };

  
  
  

  const handleTabChange = (
    tabId
  ) => {
    setActiveCodeTab(tabId);

    setCopied(false);
  };

  
  
  

  if (!isOpen) {
    return null;
  }

  
  
  

  return (
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-black/80
        p-3
        backdrop-blur-sm
        sm:p-6
      "
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      {}

      <div
        className="
          flex
          h-[92vh]
          w-full
          max-w-7xl
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-white/10
          bg-[#0d1117]
          shadow-2xl
        "
      >
        {}

        <header
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-white/10
            bg-[#0d1117]
            px-4
            py-3
            sm:px-5
          "
        >
          {}

          <div
            className="
              flex
              min-w-0
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-white
                text-black
              "
            >
              <FaCode />
            </div>

            <div className="min-w-0">
              <h2
                className="
                  truncate
                  text-sm
                  font-semibold
                  text-white
                  sm:text-base
                "
              >
                Generated Website Code
              </h2>

              <p
                className="
                  truncate
                  text-xs
                  text-gray-500
                "
              >
                {portfolio?.title ||
                  "My Portfolio"}
              </p>
            </div>
          </div>

          {}

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-gray-400
              transition
              hover:bg-white/10
              hover:text-white
            "
            title="Close"
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </header>

        {}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            gap-3
            overflow-x-auto
            border-b
            border-white/10
            bg-[#161b22]
            px-3
          "
        >
          {}

          <div
            className="
              flex
              shrink-0
              items-center
            "
          >
            {codeTabs.map(
              (tab) => {
                const isActive =
                  activeCodeTab ===
                  tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() =>
                      handleTabChange(
                        tab.id
                      )
                    }
                    className={`
                      border-b-2
                      px-4
                      py-3
                      text-sm
                      font-medium
                      transition
                      ${
                        isActive
                          ? "border-white text-white"
                          : "border-transparent text-gray-500 hover:text-gray-300"
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                );
              }
            )}
          </div>

          {}

          <button
            type="button"
            onClick={copyCode}
            disabled={!currentCode}
            className="
              flex
              shrink-0
              items-center
              gap-2
              rounded-lg
              bg-white
              px-3
              py-2
              text-xs
              font-semibold
              text-black
              transition
              hover:bg-gray-200
              disabled:cursor-not-allowed
              disabled:opacity-40
              sm:px-4
              sm:text-sm
            "
          >
            {copied ? (
              <>
                <FaCheck />

                <span>
                  Copied
                </span>
              </>
            ) : (
              <>
                <FaCopy />

                <span className="hidden sm:inline">
                  Copy Code
                </span>

                <span className="sm:hidden">
                  Copy
                </span>
              </>
            )}
          </button>
        </div>

        {}

        <main
          className="
            relative
            min-h-0
            flex-1
            overflow-hidden
            bg-[#0d1117]
          "
        >
          {currentCode ? (
            <div
              className="
                code-scroll-area
                h-full
                w-full
                overflow-auto
              "
            >
              <SyntaxHighlighter
                language={
                  activeTab.language
                }
                style={oneDark}
                showLineNumbers={true}
                wrapLongLines={false}
                PreTag="div"
                CodeTag="code"
                customStyle={{
                  margin: 0,
                  minHeight:
                    "100%",
                  width:
                    "max-content",
                  minWidth:
                    "100%",
                  background:
                    "#0d1117",
                  padding:
                    "24px 24px 60px 24px",
                  fontSize:
                    "14px",
                  lineHeight:
                    "1.7",
                  fontFamily:
                    '"JetBrains Mono", "Fira Code", Consolas, monospace',
                  whiteSpace:
                    "pre",
                  overflow:
                    "visible",
                }}
                codeTagProps={{
                  style: {
                    fontFamily:
                      '"JetBrains Mono", "Fira Code", Consolas, monospace',
                  },
                }}
                lineNumberStyle={{
                  minWidth:
                    "3.5em",
                  paddingRight:
                    "20px",
                  marginRight:
                    "20px",
                  color:
                    "#4b5563",
                  userSelect:
                    "none",
                  textAlign:
                    "right",
                  borderRight:
                    "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {currentCode}
              </SyntaxHighlighter>
            </div>
          ) : (
            <div
              className="
                flex
                h-full
                items-center
                justify-center
                text-sm
                text-gray-500
              "
            >
              No code available.
            </div>
          )}
        </main>

        {}

        <footer
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-t
            border-white/10
            bg-[#161b22]
            px-4
            py-3
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
              text-xs
              text-gray-500
            "
          >
            <span>
              {currentCode
                ? `${currentCode.length.toLocaleString()} characters`
                : "No code"}
            </span>

            <span
              className="
                hidden
                h-1
                w-1
                rounded-full
                bg-gray-600
                sm:block
              "
            />

            <span className="hidden sm:block">
              {activeTab?.label}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              border
              border-white/10
              px-4
              py-2
              text-sm
              font-medium
              text-gray-300
              transition
              hover:bg-white/10
              hover:text-white
            "
          >
            Close
          </button>
        </footer>
      </div>

      {}

      <style>
        {`
          .code-scroll-area {
            scrollbar-width: thin;
            scrollbar-color: #4b5563 #0d1117;
          }

          .code-scroll-area::-webkit-scrollbar {
            width: 10px;
            height: 10px;
          }

          .code-scroll-area::-webkit-scrollbar-track {
            background: #0d1117;
          }

          .code-scroll-area::-webkit-scrollbar-thumb {
            background: #374151;
            border-radius: 999px;
            border: 2px solid #0d1117;
          }

          .code-scroll-area::-webkit-scrollbar-thumb:hover {
            background: #6b7280;
          }

          .code-scroll-area::-webkit-scrollbar-corner {
            background: #0d1117;
          }
        `}
      </style>
    </div>
  );
}