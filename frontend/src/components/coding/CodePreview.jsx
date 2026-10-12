import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useTheme } from "../../BgContext/ThemeContext";

import { useSelector } from "react-redux";

import CodePreviewLogic from "./CodePreviewLogic";
import CodePreviewUI from "./CodePreviewUI";

export default function CodePreview() {
  const { dark } = useTheme();

  const iframeRef = useRef(null);
  const executionTimerRef = useRef(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const messages = useSelector(
    (state) => state.message.messages || [],
  );

  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation,
  );



  const conversationMessages = useMemo(() => {
    if (!selectedConversation?._id) {
      return [];
    }

    return messages.filter(
      (message) =>
        message.conversationId === selectedConversation._id,
    );
  }, [messages, selectedConversation]);

  
  const getMessageContent = useCallback((message) => {
    if (!message) {
      return "";
    }

    return (
      message.content ||
      message.message ||
      message.text ||
      ""
    );
  }, []);

  
  const codeBlocks = useMemo(() => {
    const blocks = [];

    conversationMessages.forEach((message) => {
      const content = getMessageContent(message);

      if (!content || typeof content !== "string") {
        return;
      }

      const regex =
        /```([a-zA-Z0-9_+#.-]+)?[ \t]*\n?([\s\S]*?)```/g;

      let match;

      while ((match = regex.exec(content)) !== null) {
        const language = (
          match[1] || "text"
        )
          .trim()
          .toLowerCase();

        const code = (
          match[2] || ""
        ).trim();

        if (!code) {
          continue;
        }

        blocks.push({
          language,
          code,
        });
      }
    });

    return blocks;
  }, [
    conversationMessages,
    getMessageContent,
  ]);

  
  const normalizeLanguage = useCallback(
    (language) => {
      const lang = (
        language || ""
      )
        .toLowerCase()
        .trim();

      if (
        lang === "html" ||
        lang === "htm" ||
        lang === "html5"
      ) {
        return "html";
      }

      if (
        lang === "css" ||
        lang === "scss" ||
        lang === "sass"
      ) {
        return "css";
      }

      if (
        lang === "javascript" ||
        lang === "js" ||
        lang === "javascriptreact"
      ) {
        return "javascript";
      }

      if (
        lang === "react" ||
        lang === "jsx" ||
        lang === "tsx"
      ) {
        return "react";
      }

      if (
        lang === "typescript" ||
        lang === "ts"
      ) {
        return "typescript";
      }

      if (
        lang === "vue" ||
        lang === "vuejs"
      ) {
        return "vue";
      }

      if (lang === "angular") {
        return "angular";
      }

      if (
        lang === "python" ||
        lang === "py"
      ) {
        return "python";
      }

      if (lang === "json") {
        return "json";
      }

      return lang || "text";
    },
    [],
  );

  
  
  

  const latestCode = useMemo(() => {
    if (!codeBlocks.length) {
      return null;
    }

    let htmlCode = "";
    let cssCode = "";
    let jsCode = "";

    let unsupportedLanguage = "";

    codeBlocks.forEach((block) => {
      const language = normalizeLanguage(
        block.language,
      );

      if (language === "html") {
        htmlCode = block.code;
        return;
      }

      if (language === "css") {
        cssCode = block.code;
        return;
      }

      if (language === "javascript") {
        jsCode = block.code;
        return;
      }

      if (
        language === "react" ||
        language === "typescript" ||
        language === "vue" ||
        language === "angular" ||
        language === "python"
      ) {
        unsupportedLanguage = language;
      }
    });

    
    
    

    const scrollbarStyles = `
      <style>
        ::-webkit-scrollbar {
          width: 0px !important;
          height: 0px !important;
          background: transparent !important;
        }

        ::-webkit-scrollbar-track {
          background: transparent !important;
        }

        ::-webkit-scrollbar-thumb {
          background: transparent !important;
        }

        * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
      </style>
    `;

    
    
    

    if (htmlCode) {
      let finalHtml = htmlCode;

      if (finalHtml.includes("</head>")) {
        finalHtml = finalHtml.replace(
          "</head>",
          scrollbarStyles + "</head>",
        );
      } else {
        finalHtml =
          scrollbarStyles + finalHtml;
      }

      if (cssCode) {
        const cssTag =
          "<style>\n" +
          cssCode +
          "\n</style>";

        if (finalHtml.includes("</head>")) {
          finalHtml = finalHtml.replace(
            "</head>",
            cssTag + "\n</head>",
          );
        } else {
          finalHtml =
            cssTag + "\n" + finalHtml;
        }
      }

      if (jsCode) {
        const jsTag =
          "<script>\n" +
          jsCode +
          "\n</script>";

        if (finalHtml.includes("</body>")) {
          finalHtml = finalHtml.replace(
            "</body>",
            jsTag + "\n</body>",
          );
        } else {
          finalHtml =
            finalHtml + "\n" + jsTag;
        }
      }

      return {
        code: finalHtml,
        isComingSoon: false,
        language: "html",
      };
    }

    
    
    

    if (cssCode) {
      const cssOnlyHtml =
        "<!DOCTYPE html>\n" +
        "<html>\n" +
        "<head>\n" +
        '<meta charset="UTF-8">\n' +
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
        "<style>\n" +
        "* {\n" +
        "  box-sizing: border-box;\n" +
        "}\n" +
        "html, body {\n" +
        "  margin: 0;\n" +
        "  padding: 0;\n" +
        "  min-height: 100%;\n" +
        "  overflow: auto;\n" +
        "}\n" +
        "body {\n" +
        "  min-height: 100vh;\n" +
        "  font-family: Arial, sans-serif;\n" +
        "}\n" +
        scrollbarStyles
          .replace("<style>", "")
          .replace("</style>", "") +
        cssCode +
        "\n</style>\n" +
        "</head>\n" +
        "<body>\n" +
        '<div class="preview-content">\n' +
        "<h2>CSS Preview</h2>\n" +
        "<p>Your CSS code is loaded successfully.</p>\n" +
        "</div>\n" +
        "</body>\n" +
        "</html>";

      return {
        code: cssOnlyHtml,
        isComingSoon: false,
        language: "css",
      };
    }

    
    
    

    if (jsCode) {
      const escapedJsCode =
        jsCode.replace(
          /<\/script>/gi,
          "<\\/script>",
        );

      const jsOnlyHtml =
        "<!DOCTYPE html>\n" +
        "<html>\n" +
        "<head>\n" +
        '<meta charset="UTF-8">\n' +
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
        "<style>\n" +
        "* {\n" +
        "  box-sizing: border-box;\n" +
        "}\n" +
        "html, body {\n" +
        "  margin: 0;\n" +
        "  padding: 0;\n" +
        "  min-height: 100%;\n" +
        "  overflow: auto;\n" +
        "}\n" +
        "body {\n" +
        "  padding: 24px;\n" +
        "  min-height: 100vh;\n" +
        "  background: " +
        (dark
          ? "#080808"
          : "#ffffff") +
        ";\n" +
        "  color: " +
        (dark
          ? "#ffffff"
          : "#111111") +
        ";\n" +
        "  font-family: Arial, sans-serif;\n" +
        "}\n" +
        "#output {\n" +
        "  margin-top: 20px;\n" +
        "  padding: 16px;\n" +
        "  min-height: 100px;\n" +
        "  border-radius: 10px;\n" +
        "  background: " +
        (dark
          ? "#151515"
          : "#f3f4f6") +
        ";\n" +
        "  white-space: pre-wrap;\n" +
        "  word-break: break-word;\n" +
        "  font-family: monospace;\n" +
        "}\n" +
        ".error {\n" +
        "  color: #ef4444;\n" +
        "}\n" +
        "::-webkit-scrollbar {\n" +
        "  width: 0px !important;\n" +
        "  height: 0px !important;\n" +
        "  background: transparent !important;\n" +
        "}\n" +
        "::-webkit-scrollbar-track {\n" +
        "  background: transparent !important;\n" +
        "}\n" +
        "::-webkit-scrollbar-thumb {\n" +
        "  background: transparent !important;\n" +
        "}\n" +
        "* {\n" +
        "  scrollbar-width: none !important;\n" +
        "  -ms-overflow-style: none !important;\n" +
        "}\n" +
        "</style>\n" +
        "</head>\n" +
        "<body>\n" +
        "<h2>JavaScript Preview</h2>\n" +
        '<div id="output"></div>\n' +
        "<script>\n" +
        "(function() {\n" +
        "  var output = document.getElementById('output');\n" +
        "  var oldLog = console.log;\n" +
        "  var logMessages = [];\n" +
        "\n" +
        "  function formatValue(value) {\n" +
        "    if (value === undefined) return 'undefined';\n" +
        "    if (value === null) return 'null';\n" +
        "    if (typeof value === 'object') {\n" +
        "      try {\n" +
        "        return JSON.stringify(value, null, 2);\n" +
        "      } catch (e) {\n" +
        "        return String(value);\n" +
        "      }\n" +
        "    }\n" +
        "    return String(value);\n" +
        "  }\n" +
        "\n" +
        "  console.log = function() {\n" +
        "    var args = Array.prototype.slice.call(arguments);\n" +
        "    oldLog.apply(console, args);\n" +
        "    var text = args.map(formatValue).join(' ');\n" +
        "    logMessages.push(text);\n" +
        "    if (output) {\n" +
        "      output.textContent += text + '\\n';\n" +
        "    }\n" +
        "  };\n" +
        "\n" +
        "  console.error = function() {\n" +
        "    var args = Array.prototype.slice.call(arguments);\n" +
        "    oldLog.apply(console, args);\n" +
        "    var text = args.map(formatValue).join(' ');\n" +
        "    logMessages.push('ERROR: ' + text);\n" +
        "    if (output) {\n" +
        "      output.innerHTML += '<div class=\"error\">Error: ' + text + '</div>';\n" +
        "    }\n" +
        "  };\n" +
        "\n" +
        "  try {\n" +
        "    " +
        escapedJsCode +
        "\n" +
        "    if (logMessages.length === 0 && output) {\n" +
        "      output.textContent = '✓ Code executed successfully (no console output)';\n" +
        "    }\n" +
        "  } catch (error) {\n" +
        "    if (output) {\n" +
        "      output.innerHTML += '<div class=\"error\">Error: ' + String(error.message) + '</div>';\n" +
        "    }\n" +
        "  }\n" +
        "})();\n" +
        "</script>\n" +
        "</body>\n" +
        "</html>";

      return {
        code: jsOnlyHtml,
        isComingSoon: false,
        language: "javascript",
      };
    }

    
    
    

    if (unsupportedLanguage) {
      const readableLanguage =
        unsupportedLanguage
          .charAt(0)
          .toUpperCase() +
        unsupportedLanguage.slice(1);

      const comingSoonHtml =
        "<!DOCTYPE html>\n" +
        "<html>\n" +
        "<head>\n" +
        '<meta charset="UTF-8">\n' +
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
        "<style>\n" +
        "* { box-sizing: border-box; }\n" +
        "html, body {\n" +
        "  width: 100%;\n" +
        "  height: 100%;\n" +
        "  margin: 0;\n" +
        "  overflow: auto;\n" +
        "}\n" +
        "body {\n" +
        "  display: flex;\n" +
        "  align-items: center;\n" +
        "  justify-content: center;\n" +
        "  padding: 24px;\n" +
        "  background: " +
        (dark
          ? "#000000"
          : "#ffffff") +
        ";\n" +
        "  color: " +
        (dark
          ? "#ffffff"
          : "#111111") +
        ";\n" +
        "  font-family: Arial, sans-serif;\n" +
        "}\n" +
        ".container {\n" +
        "  width: 100%;\n" +
        "  max-width: 420px;\n" +
        "  text-align: center;\n" +
        "}\n" +
        ".icon {\n" +
        "  width: 52px;\n" +
        "  height: 52px;\n" +
        "  margin: 0 auto 16px;\n" +
        "  display: flex;\n" +
        "  align-items: center;\n" +
        "  justify-content: center;\n" +
        "  border-radius: 14px;\n" +
        "  background: " +
        (dark
          ? "#111111"
          : "#f3f4f6") +
        ";\n" +
        "  border: 1px solid " +
        (dark
          ? "#222222"
          : "#e5e7eb") +
        ";\n" +
        "  font-size: 22px;\n" +
        "}\n" +
        ".title {\n" +
        "  font-size: 17px;\n" +
        "  font-weight: 700;\n" +
        "}\n" +
        ".subtitle {\n" +
        "  margin-top: 8px;\n" +
        "  color: " +
        (dark
          ? "#888888"
          : "#6b7280") +
        ";\n" +
        "  font-size: 12px;\n" +
        "  line-height: 1.6;\n" +
        "}\n" +
        ".technology {\n" +
        "  display: inline-block;\n" +
        "  margin-top: 18px;\n" +
        "  padding: 7px 11px;\n" +
        "  border-radius: 8px;\n" +
        "  background: " +
        (dark
          ? "#151515"
          : "#f9fafb") +
        ";\n" +
        "  border: 1px solid " +
        (dark
          ? "#252525"
          : "#e5e7eb") +
        ";\n" +
        "  font-size: 11px;\n" +
        "}\n" +
        "</style>\n" +
        "</head>\n" +
        "<body>\n" +
        '<div class="container">\n' +
        '<div class="icon">✦</div>\n' +
        '<div class="title">Preview Coming Soon</div>\n' +
        '<div class="subtitle">\n' +
        "Live preview for " +
        readableLanguage +
        " is coming soon.\n" +
        "</div>\n" +
        '<div class="technology">' +
        readableLanguage +
        "</div>\n" +
        "</div>\n" +
        "</body>\n" +
        "</html>";

      return {
        code: comingSoonHtml,
        isComingSoon: true,
        language: unsupportedLanguage,
      };
    }

    
    
    

    if (codeBlocks.length === 1) {
      const block = codeBlocks[0];

      if (
        block.code.includes("<!DOCTYPE") ||
        block.code.includes("<html") ||
        block.code.includes("<body") ||
        block.code.includes("<div")
      ) {
        let finalHtml = block.code;

        if (finalHtml.includes("</head>")) {
          finalHtml = finalHtml.replace(
            "</head>",
            scrollbarStyles + "</head>",
          );
        } else {
          finalHtml =
            scrollbarStyles + finalHtml;
        }

        return {
          code: finalHtml,
          isComingSoon: false,
          language: "html",
        };
      }
    }

    return null;
  }, [
    codeBlocks,
    dark,
    normalizeLanguage,
  ]);

  
  
  

  const {
    executeCode,
    handleCopy,
  } = CodePreviewLogic({
    iframeRef,
    executionTimerRef,
    latestCode,
    setIsLoading,
    setError,
    isFullscreen,
    setIsFullscreen,
    setCopied,
  });

  
  
  

  return (
    <CodePreviewUI
      dark={dark}
      latestCode={latestCode}
      isFullscreen={isFullscreen}
      isLoading={isLoading}
      error={error}
      copied={copied}
      iframeRef={iframeRef}
      handleCopy={handleCopy}
      executeCode={executeCode}
      setIsFullscreen={setIsFullscreen}
    />
  );
}