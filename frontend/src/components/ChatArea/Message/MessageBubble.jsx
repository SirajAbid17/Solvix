import React, { useState } from "react";

import {
  FiCopy,
  FiCheck,
  FiDownload,
} from "react-icons/fi";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import toast from "react-hot-toast";

import CodeBlock from "./CodeBlock";

export default function MessageBubble({
  message,
  index,
  dark,
  onPDFDownload,
}) {
  // ============================================================
  // STATES
  // ============================================================

  const [copiedId, setCopiedId] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [downloading, setDownloading] = useState({});
  const [pdfDownloading, setPdfDownloading] = useState({});
  const [pptDownloading, setPptDownloading] = useState({});

  // ============================================================
  // BASIC MESSAGE DATA
  // ============================================================

  const isUser = message?.role === "user";
  const content = message?.content || message?.message || message?.text || "";
  const messageId = message?._id || message?.id || `msg-${index}`;

  // ============================================================
  // FILE / MEDIA DATA
  // ============================================================

  const images = Array.isArray(message?.images) ? message.images : [];

  // PDF
  const pdf = message?.pdf || null;
  const pdfUrl = message?.pdfUrl || null;
  const pdfGenerated = message?.pdfGenerated === true;

  // PPT
  const ppt = message?.ppt || null;
  const pptUrl = message?.pptUrl || null; // ✅ Cloudinary URL
  const pptGenerated = message?.pptGenerated === true;
  const pptData = message?.pptData || null;
  const pptFileName = message?.pptFileName || "solvix-presentation.pptx";

  // ✅ Check if PPT data exists (URL or base64)
  const hasPptData = pptGenerated === true && (pptUrl || ppt);
  const hasPdfData = pdfGenerated === true && (pdfUrl || pdf);

  // ============================================================
  // DOWNLOAD KEYS
  // ============================================================

  const pdfDownloadKey = `pdf-${messageId}`;
  const pptDownloadKey = `ppt-${messageId}`;

  const isPdfDownloading = pdfDownloading[pdfDownloadKey] || false;
  const isPptDownloading = pptDownloading[pptDownloadKey] || false;

  // ============================================================
  // COPY FALLBACK
  // ============================================================

  const fallbackCopy = (text) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      document.execCommand("copy");
      document.body.removeChild(textArea);

      toast.success("Message copied!");
    } catch (error) {
      console.error("Fallback copy failed:", error);
      toast.error("Failed to copy message");
    }
  };

  // ============================================================
  // COPY MESSAGE
  // ============================================================

  const handleCopy = (text, id) => {
    if (!text) {
      toast.error("Nothing to copy");
      return;
    }

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
  // PDF DOWNLOAD
  // ============================================================

  const handlePDFDownload = (pdfData, title, id) => {
    const downloadKey = `pdf-${id}`;

    setPdfDownloading((prev) => ({
      ...prev,
      [downloadKey]: true,
    }));

    try {
      // ✅ If we have a URL, use it directly
      if (pdfData && typeof pdfData === "string" && pdfData.startsWith("http")) {
        window.open(pdfData, "_blank");
        toast.success("PDF downloaded successfully!");
        setPdfDownloading((prev) => ({
          ...prev,
          [downloadKey]: false,
        }));
        return;
      }

      // ✅ Fallback: base64
      const pdfBase64 = typeof pdfData === "string" ? pdfData : pdfData?.pdf || pdfData;

      if (!pdfBase64) {
        toast.error("No PDF data available");
        setPdfDownloading((prev) => ({
          ...prev,
          [downloadKey]: false,
        }));
        return;
      }

      const byteCharacters = atob(pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${sanitizeFileName(title || "Solvix-Document")}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);

      toast.success("PDF downloaded successfully!");
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
  // PPT DOWNLOAD - Supports Cloudinary URL
  // ============================================================

  const handlePPTDownload = (pptData, title, id) => {
    const downloadKey = `ppt-${id}`;

    setPptDownloading((prev) => ({
      ...prev,
      [downloadKey]: true,
    }));

    try {
      console.log("================================");
      console.log("PPT DOWNLOAD STARTED");
      console.log("pptData type:", typeof pptData);
      console.log("pptData:", pptData);

      // ✅ If we have a URL (Cloudinary), open it directly
      if (pptData && typeof pptData === "string" && pptData.startsWith("http")) {
        console.log("✅ Opening Cloudinary URL:", pptData);
        // Open in new tab to download
        window.open(pptData, "_blank");
        toast.success("PowerPoint downloaded successfully!");
        setPptDownloading((prev) => ({
          ...prev,
          [downloadKey]: false,
        }));
        return;
      }

      // ✅ Fallback: base64
      const pptBase64 = typeof pptData === "string" ? pptData : pptData?.ppt || pptData;

      if (!pptBase64) {
        toast.error("No PowerPoint data available");
        console.log("❌ No PPT data found");
        setPptDownloading((prev) => ({
          ...prev,
          [downloadKey]: false,
        }));
        return;
      }

      console.log("✅ Using base64 download");
      console.log("PPT base64 length:", pptBase64.length);

      const byteCharacters = atob(pptBase64);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${sanitizeFileName(title || "Solvix-Presentation")}.pptx`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);

      toast.success("PowerPoint downloaded successfully!");
    } catch (error) {
      console.error("PPT download failed:", error);
      toast.error("Failed to download PowerPoint");
    } finally {
      setPptDownloading((prev) => ({
        ...prev,
        [downloadKey]: false,
      }));
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
  // IMAGE DOWNLOAD
  // ============================================================

  const handleDownload = async (imageUrl, imageIndex) => {
    const downloadKey = `${imageUrl}-${imageIndex}`;

    setDownloading((prev) => ({
      ...prev,
      [downloadKey]: true,
    }));

    try {
      if (!imageUrl) {
        toast.error("Invalid image URL");
        return;
      }

      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

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
      }, 1000);

      toast.success("Image downloaded!");
    } catch (error) {
      console.error("Image download failed:", error);
      toast.error("Failed to download image");
    } finally {
      setDownloading((prev) => ({
        ...prev,
        [downloadKey]: false,
      }));
    }
  };

  // ============================================================
  // MARKDOWN COMPONENTS
  // ============================================================

  const markdownComponents = {
    p: ({ children }) => (
      <p className="my-1.5 break-words [overflow-wrap:anywhere] leading-6">
        {children}
      </p>
    ),

    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all text-blue-500 underline hover:text-blue-600 transition-colors duration-200"
      >
        {children}
      </a>
    ),

    code: ({ inline, className, children, ...props }) => {
      if (inline) {
        return (
          <code
            className={`break-words rounded px-1.5 py-0.5 text-[0.85em] [overflow-wrap:anywhere] ${
              dark ? "bg-white/10" : "bg-gray-200"
            }`}
            {...props}
          >
            {children}
          </code>
        );
      }
      return null;
    },

    pre: ({ children }) => {
      let codeContent = "";
      let language = "text";

      if (children && children.props) {
        const childProps = children.props;

        if (childProps.className) {
          const match = childProps.className.match(/language-([\w-]+)/);
          if (match) {
            language = match[1];
          }
        }

        if (childProps.children !== undefined) {
          if (Array.isArray(childProps.children)) {
            codeContent = childProps.children.join("");
          } else {
            codeContent = String(childProps.children);
          }
        }
      }

      codeContent = codeContent.trim();

      return <CodeBlock language={language} code={codeContent} darkMode={dark} />;
    },

    ul: ({ children }) => (
      <ul className="my-2 pl-5 break-words space-y-0.5">{children}</ul>
    ),

    ol: ({ children }) => (
      <ol className="my-2 pl-5 break-words space-y-0.5">{children}</ol>
    ),

    li: ({ children }) => (
      <li className="my-0.5 break-words [overflow-wrap:anywhere]">{children}</li>
    ),

    table: ({ children }) => (
      <div className="my-3 w-full overflow-x-auto">
        <table className="min-w-max border-collapse">{children}</table>
      </div>
    ),

    blockquote: ({ children }) => (
      <blockquote
        className={`my-3 border-l-4 pl-3 break-words ${
          dark ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-600"
        }`}
      >
        {children}
      </blockquote>
    ),

    h1: ({ children }) => (
      <h1 className="mt-4 mb-3 text-xl font-bold break-words">{children}</h1>
    ),

    h2: ({ children }) => (
      <h2 className="mt-4 mb-2 text-lg font-bold break-words">{children}</h2>
    ),

    h3: ({ children }) => (
      <h3 className="mt-3 mb-1.5 text-base font-bold break-words">{children}</h3>
    ),
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className={`flex w-full min-w-0 ${
        isUser ? "justify-end" : "justify-start"
      }`}
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

        <div className="mb-1.5 flex min-w-0 items-center justify-between gap-3">
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
          <p className="min-w-0 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm leading-6">
            {content}
          </p>
        ) : (
          <>
            {/* ================================================== */}
            {/* AI MESSAGE */}
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
                prose-p:my-1.5
                prose-p:leading-6
                prose-p:break-words
                prose-ul:my-2
                prose-ol:my-2
                prose-li:my-0.5
                prose-li:break-words
                prose-strong:font-bold
                prose-a:break-all
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
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {content}
              </ReactMarkdown>
            </div>

            {/* ================================================== */}
            {/* PPT DOWNLOAD - Uses pptUrl from Cloudinary */}
            {/* ================================================== */}

            {hasPptData && (
              <div
                className={`
                  mt-4
                  pt-3
                  border-t
                  ${dark ? "border-white/10" : "border-black/10"}
                `}
              >
                <div
                  className={`
                    mb-2
                    text-xs
                    font-medium
                    ${dark ? "text-gray-400" : "text-gray-500"}
                  `}
                >
                   PowerPoint Presentation
                </div>

                <button
                  type="button"
                  onClick={() => {
                    // ✅ Use pptUrl (Cloudinary URL) if available, otherwise fallback to base64
                    const pptToDownload = pptUrl || ppt;

                    console.log("🟦 PPT DOWNLOAD CLICKED");
                    console.log("🟦 pptUrl (Cloudinary):", pptUrl);
                    console.log("🟦 ppt exists:", !!ppt);
                    console.log("🟦 Using:", pptUrl ? "Cloudinary URL" : ppt ? "base64" : "none");

                    handlePPTDownload(
                      pptToDownload,
                      pptData?.title || pptFileName.replace(".pptx", "") || "Solvix-Presentation",
                      messageId
                    );
                  }}
                  disabled={isPptDownloading}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-blue-600
                    hover:bg-blue-700
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition-all
                    duration-200
                    hover:scale-[1.02]
                    active:scale-95
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    shadow-lg
                    shadow-blue-500/20
                    w-full
                    sm:w-auto
                  "
                >
                  {isPptDownloading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
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
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <FiDownload size={18} />
                      <span>Download PowerPoint</span>
                    </>
                  )}
                </button>

             

              
              </div>
            )}

           
            {hasPdfData && (
              <div
                className={`
                  mt-4
                  pt-3
                  border-t
                  ${dark ? "border-white/10" : "border-black/10"}
                `}
              >
                <div
                  className={`
                    mb-2
                    text-xs
                    font-medium
                    ${dark ? "text-gray-400" : "text-gray-500"}
                  `}
                >
                  📄 PDF Document
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const pdfToDownload = pdfUrl || pdf;
                    handlePDFDownload(
                      pdfToDownload,
                      content?.slice(0, 40) || "Solvix-Document",
                      messageId
                    );
                  }}
                  disabled={isPdfDownloading}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-red-500
                    hover:bg-red-600
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition-all
                    duration-200
                    hover:scale-[1.02]
                    active:scale-95
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    shadow-lg
                    shadow-red-500/20
                    w-full
                    sm:w-auto
                  "
                >
                  {isPdfDownloading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
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
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
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
                  🖼️ Generated Images ({images.length})
                </p>

                <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {images.map((img, imgIndex) => {
                    let finalUrl = "";

                    if (typeof img === "string") {
                      finalUrl = img;
                    } else if (img && typeof img === "object") {
                      finalUrl = img.url || img.src || "";
                    }

                    if (finalUrl && !finalUrl.startsWith("http")) {
                      const baseUrl =
                        import.meta.env.VITE_SERVER_URL ||
                        import.meta.env.REACT_APP_API_URL ||
                        "http://localhost:5000";

                      finalUrl = finalUrl.startsWith("/")
                        ? `${baseUrl}${finalUrl}`
                        : `${baseUrl}/${finalUrl}`;
                    }

                    const imageKey = `${messageId}-${imgIndex}`;
                    const downloadKey = `${finalUrl}-${imgIndex}`;
                    const isDownloading = downloading[downloadKey];

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

                        <button
                          type="button"
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
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                          "
                        >
                          {isDownloading ? (
                            <>
                              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
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
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
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

// ============================================================
// FILE NAME SANITIZER
// ============================================================

function sanitizeFileName(name) {
  return (
    String(name)
      .replace(/[<>:"/\\|?*]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 100)
      .trim() || "Solvix-File"
  );
}