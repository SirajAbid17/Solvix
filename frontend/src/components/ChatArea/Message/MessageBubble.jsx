import React, { useState } from "react";
import { FiCopy, FiCheck, FiDownload } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import toast from "react-hot-toast";

import CodeBlock from "./CodeBlock";

export default function MessageBubble({ message, index, dark, onPDFDownload }) {
  const [copiedId, setCopiedId] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [downloading, setDownloading] = useState({});
  const [pdfDownloading, setPdfDownloading] = useState({});

  const isUser = message.role === "user";

  const content = message.content || message.message || message.text || "";

  const messageId = message._id || message.id || `msg-${index}`;

  const images = message.images || [];

  const pdf = message.pdf;

  const pdfGenerated = message.pdfGenerated || false;

  const pdfDownloadKey = `pdf-${messageId}`;

  const isPdfDownloading = pdfDownloading[pdfDownloadKey];

  // ============================================================
  // PDF DOWNLOAD
  // ============================================================

  const handlePDFDownload = (pdfBase64, title, id) => {
    const downloadKey = `pdf-${id}`;

    setPdfDownloading((prev) => ({
      ...prev,
      [downloadKey]: true,
    }));

    try {
      console.log(
        "📄 Downloading PDF from message, length:",
        pdfBase64?.length,
      );

      if (!pdfBase64) {
        toast.error("No PDF data available");

        setPdfDownloading((prev) => ({
          ...prev,
          [downloadKey]: false,
        }));

        return;
      }

      // Convert Base64 to Blob
      const byteCharacters = atob(pdfBase64);

      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], {
        type: "application/pdf",
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `${title || "document"}.pdf`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);

      toast.success("📄 PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF download failed:", error);

      toast.error("Failed to download PDF");
    } finally {
      setPdfDownloading((prev) => ({
        ...prev,
        [downloadKey]: false,
      }));
    }
  };

  // ============================================================
  // IMAGE DOWNLOAD
  // ============================================================

  const handleDownload = async (imageUrl, imageIndex) => {
    const downloadKey = `${imageUrl}-${imageIndex}`;

    setDownloading((prev) => ({
      ...prev,
      [downloadKey]: true,
    }));

    try {
      const response = await fetch(imageUrl);

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `solvix-image-${imageIndex + 1}.png`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);

      toast.success("Image downloaded!");
    } catch (error) {
      console.error("Download failed:", error);

      toast.error("Failed to download image");
    } finally {
      setDownloading((prev) => ({
        ...prev,
        [downloadKey]: false,
      }));
    }
  };

  // ============================================================
  // COPY MESSAGE
  // ============================================================

  const fallbackCopy = (text) => {
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

      toast.success("Message copied!");
    } catch (err) {
      console.error("Fallback copy failed:", err);

      toast.error("Failed to copy");
    }

    document.body.removeChild(textArea);
  };

  const handleCopy = (text, id) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopiedId(id);

          toast.success("Message copied!");

          setTimeout(() => {
            setCopiedId(null);
          }, 2000);
        })
        .catch((error) => {
          console.error("Copy failed:", error);

          fallbackCopy(text);
        });
    } else {
      fallbackCopy(text);
    }
  };

  // ============================================================
  // IMAGE ERROR
  // ============================================================

  const handleImageError = (key) => {
    setImageErrors((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  // ============================================================
  // MARKDOWN COMPONENTS
  // ============================================================

  const markdownComponents = {
    // ----------------------------------------------------------
    // PARAGRAPH
    // ----------------------------------------------------------

    p: ({ children }) => (
      <p
        className="
          my-1.5
          break-words
          [overflow-wrap:anywhere]
          leading-6
        "
      >
        {children}
      </p>
    ),

    // ----------------------------------------------------------
    // LINKS
    // ----------------------------------------------------------

    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="
          break-all
          text-blue-500
          underline
          hover:text-blue-600
          transition-colors
          duration-200
        "
      >
        {children}
      </a>
    ),

    // ----------------------------------------------------------
    // CODE
    // ----------------------------------------------------------

    code: ({ inline, className, children, ...props }) => {
      if (inline) {
        return (
          <code
            className={`
              break-words
              rounded
              px-1.5
              py-0.5
              text-[0.85em]
              [overflow-wrap:anywhere]
              ${dark ? "bg-white/10" : "bg-gray-200"}
            `}
            {...props}
          >
            {children}
          </code>
        );
      }

      return null;
    },

    // ----------------------------------------------------------
    // PRE / CODE BLOCK
    // ----------------------------------------------------------

    pre: ({ children }) => {
      let codeContent = "";

      let language = "text";

      if (children && children.props) {
        const childProps = children.props;

        if (childProps.className) {
          const match = childProps.className.match(/language-(\w+)/);

          if (match) {
            language = match[1];
          }
        }

        if (childProps.children) {
          codeContent = Array.isArray(childProps.children)
            ? childProps.children.join("")
            : childProps.children;
        }
      }

      codeContent = codeContent.trim();

      return (
        <CodeBlock language={language} code={codeContent} darkMode={dark} />
      );
    },

    // ----------------------------------------------------------
    // UNORDERED LIST
    // ----------------------------------------------------------

    ul: ({ children }) => (
      <ul
        className="
          my-2
          pl-5
          break-words
          space-y-0.5
        "
      >
        {children}
      </ul>
    ),

    // ----------------------------------------------------------
    // ORDERED LIST
    // ----------------------------------------------------------

    ol: ({ children }) => (
      <ol
        className="
          my-2
          pl-5
          break-words
          space-y-0.5
        "
      >
        {children}
      </ol>
    ),

    // ----------------------------------------------------------
    // LIST ITEM
    // ----------------------------------------------------------

    li: ({ children }) => (
      <li
        className="
          my-0.5
          break-words
          [overflow-wrap:anywhere]
        "
      >
        {children}
      </li>
    ),

    // ----------------------------------------------------------
    // TABLE
    // ----------------------------------------------------------

    table: ({ children }) => (
      <div className="my-3 w-full overflow-x-auto">
        <table className="min-w-max border-collapse">{children}</table>
      </div>
    ),

    // ----------------------------------------------------------
    // BLOCKQUOTE
    // ----------------------------------------------------------

    blockquote: ({ children }) => (
      <blockquote
        className={`
          my-3
          border-l-4
          pl-3
          break-words

          ${
            dark
              ? "border-gray-600 text-gray-300"
              : "border-gray-300 text-gray-600"
          }
        `}
      >
        {children}
      </blockquote>
    ),
  };

  return (
    <div
      className={`
        flex
        w-full
        min-w-0
        ${isUser ? "justify-end" : "justify-start"}
      `}
    >
      <div
        className={`
          group
          relative
          min-w-0

          max-w-[95%]
          sm:max-w-[90%]
          md:max-w-[82%]
          lg:max-w-[78%]

          overflow-hidden
          rounded-2xl
          px-3
          py-2

          sm:px-4
          sm:py-3

          shadow-sm

          ${
            isUser
              ? dark
                ? "bg-white text-black rounded-br-md"
                : "bg-black text-white rounded-br-md"
              : dark
                ? "bg-white/10 text-gray-200 rounded-bl-md"
                : "bg-gray-100 text-gray-800 rounded-bl-md"
          }
        `}
      >
        {/* ================================================== */}
        {/* MESSAGE HEADER */}
        {/* ================================================== */}

        <div
          className="
            mb-1.5
            flex
            min-w-0
            items-center
            justify-between
            gap-3
          "
        >
          <p
            className={`
              min-w-0
              truncate
              text-[10px]
              font-semibold
              uppercase
              tracking-wider

              ${
                isUser
                  ? dark
                    ? "text-gray-500"
                    : "text-gray-400"
                  : dark
                    ? "text-gray-400"
                    : "text-gray-500"
              }
            `}
          >
            {isUser ? "You" : "Solvix AI"}
          </p>

          {/* COPY MESSAGE BUTTON */}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();

              e.stopPropagation();

              handleCopy(content, messageId);
            }}
            onMouseDown={(e) => e.preventDefault()}
            title="Copy message"
            className={`
              shrink-0
              rounded-md
              p-1
              opacity-0
              transition-all
              duration-200
              group-hover:opacity-100

              ${
                dark
                  ? "text-gray-400 hover:bg-white/10 hover:text-white"
                  : "text-gray-500 hover:bg-black/10 hover:text-black"
              }
            `}
          >
            {copiedId === messageId ? (
              <FiCheck size={14} className="text-green-500" />
            ) : (
              <FiCopy size={14} />
            )}
          </button>
        </div>

        {/* ================================================== */}
        {/* USER MESSAGE */}
        {/* ================================================== */}

        {isUser ? (
          <p
            className="
              min-w-0
              whitespace-pre-wrap
              break-words
              [overflow-wrap:anywhere]
              text-sm
              leading-6
            "
          >
            {content}
          </p>
        ) : (
          <>
            {/* ================================================== */}
            {/* AI MARKDOWN MESSAGE */}
            {/* ================================================== */}

            <div
              className={`
                min-w-0
                max-w-none
                overflow-hidden
                prose
                prose-sm

                ${dark ? "prose-invert" : ""}

                prose-headings:font-bold
                prose-headings:tracking-tight
                prose-headings:break-words

                prose-h1:mb-3
                prose-h1:mt-4
                prose-h1:text-xl

                prose-h2:mb-2
                prose-h2:mt-4
                prose-h2:text-lg

                prose-h3:mb-1.5
                prose-h3:mt-3
                prose-h3:text-base

                prose-p:my-1.5
                prose-p:leading-6
                prose-p:break-words

                prose-ul:my-2
                prose-ol:my-2

                prose-li:my-0.5
                prose-li:break-words

                prose-strong:font-bold

                prose-a:break-all
                prose-a:[overflow-wrap:anywhere]

                prose-code:break-words

                prose-pre:my-3
                prose-pre:max-w-full
                prose-pre:overflow-x-auto
                prose-pre:p-0

                prose-table:block
                prose-table:max-w-full
                prose-table:overflow-x-auto

                [&_*]:max-w-full
              `}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {content}
              </ReactMarkdown>
            </div>

            {/* ================================================== */}
            {/* PDF DOWNLOAD BUTTON */}
            {/* ================================================== */}

            {pdf && pdfGenerated === true && (
              <div className="mt-4 pt-3 border-t border-white/10">
                <button
                  onClick={() => {
                    console.log("🔵 PDF Download clicked");

                    console.log("📄 PDF data exists:", !!pdf);

                    console.log("📄 PDF length:", pdf?.length);

                    const title = content?.slice(0, 30) || "document";

                    onPDFDownload(pdf, title, messageId);
                  }}
                  disabled={isPdfDownloading}
                  className="
                      flex
                      items-center
                      gap-2

                      px-4
                      py-2.5

                      rounded-lg

                      bg-blue-500
                      hover:bg-blue-600

                      text-white
                      text-sm
                      font-medium

                      transition-all
                      duration-200

                      hover:scale-[1.02]
                      active:scale-95

                      disabled:opacity-50
                      disabled:cursor-not-allowed

                      shadow-lg
                      shadow-blue-500/25
                    "
                >
                  {isPdfDownloading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />

                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>

                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <FiDownload size={18} />

                      <span>Download PDF</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* ================================================== */}
            {/* GENERATED IMAGES */}
            {/* ================================================== */}

            {images.length > 0 && (
              <div className="mt-4 min-w-0">
                <p
                  className={`
                    mb-2
                    text-xs
                    font-medium

                    ${dark ? "text-gray-400" : "text-gray-500"}
                  `}
                >
                  Generated Images ({images.length})
                </p>

                <div
                  className="
                    grid
                    min-w-0
                    grid-cols-1
                    gap-3

                    sm:grid-cols-2
                    md:grid-cols-3
                  "
                >
                  {images.map((img, imgIndex) => {
                    let finalUrl = "";

                    // ------------------------------------------------
                    // IMAGE URL
                    // ------------------------------------------------

                    if (typeof img === "string") {
                      finalUrl = img;
                    } else if (img && typeof img === "object") {
                      finalUrl = img.url || img.src || "";
                    }

                    // ------------------------------------------------
                    // LOCAL IMAGE URL
                    // ------------------------------------------------

                    if (finalUrl && !finalUrl.startsWith("http")) {
                      const baseUrl =
                        import.meta.env.REACT_APP_API_URL ||
                        "http://localhost:5000";

                      finalUrl = finalUrl.startsWith("/")
                        ? `${baseUrl}${finalUrl}`
                        : `${baseUrl}/${finalUrl}`;
                    }

                    const imageKey = `${messageId}-${imgIndex}`;

                    const downloadKey = `${finalUrl}-${imgIndex}`;

                    const isDownloading = downloading[downloadKey];

                    // ------------------------------------------------
                    // INVALID IMAGE
                    // ------------------------------------------------

                    if (imageErrors[imageKey] || !finalUrl) {
                      return null;
                    }

                    return (
                      <div
                        key={imageKey}
                        className="
                            group/image
                            relative
                            min-w-0
                            overflow-hidden
                            rounded-lg
                            border
                            border-white/10
                            bg-black/20
                            flex
                            flex-col
                          "
                      >
                        {/* IMAGE */}

                        <img
                          src={finalUrl}
                          alt={`Generated image ${imgIndex + 1}`}
                          className="
                              block
                              h-40
                              w-full
                              object-cover
                              transition-transform
                              duration-300
                              group-hover/image:scale-105
                            "
                          loading="lazy"
                          onError={() => handleImageError(imageKey)}
                        />

                        {/* IMAGE DOWNLOAD */}

                        <button
                          onClick={() => handleDownload(finalUrl, imgIndex)}
                          disabled={isDownloading}
                          className="
                              flex
                              items-center
                              justify-center
                              gap-2

                              bg-black/80
                              hover:bg-black

                              text-white
                              text-sm
                              font-medium

                              py-2.5
                              px-4

                              transition-all
                              duration-200

                              hover:scale-[1.02]

                              border-t
                              border-white/10

                              hover:border-white/20

                              cursor-pointer

                              disabled:opacity-50
                              disabled:cursor-not-allowed
                            "
                        >
                          {isDownloading ? (
                            <>
                              <svg
                                className="animate-spin h-4 w-4"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="none"
                                />

                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>

                              <span>Downloading...</span>
                            </>
                          ) : (
                            <>
                              <FiDownload size={16} />

                              <span>Download</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
