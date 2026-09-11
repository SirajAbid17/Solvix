import React, { useState } from "react";
import {
  FiCopy,
  FiCheck,
  FiDownload,
  FiImage,
  FiFile,
  FiFileText,
  FiExternalLink,
  FiShare2,
  FiThumbsUp,
  FiThumbsDown,
  FiMoreHorizontal,
  FiMaximize2,
} from "react-icons/fi";
import {
  HiSparkles,
  HiOutlineLightningBolt,
  HiOutlinePresentationChartBar,
} from "react-icons/hi";
import { BsStars, BsShieldCheck, BsFilePdf, BsFilePpt } from "react-icons/bs";
import { BiBot, BiTime } from "react-icons/bi";
import { TbSparkles, TbFileDownload } from "react-icons/tb";
import { MdOutlineAutoAwesome, MdOutlineImage } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import toast from "react-hot-toast";
import CodeBlock from "./CodeBlock";

export default function MessageBubble({ message, index, dark, onPDFDownload }) {
  const [copiedId, setCopiedId] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [downloading, setDownloading] = useState({});
  const [pdfDownloading, setPdfDownloading] = useState({});
  const [pptDownloading, setPptDownloading] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const isUser = message?.role === "user";
  const content = message?.content || message?.message || message?.text || "";
  const messageId = message?._id || message?.id || `msg-${index}`;

  const images = Array.isArray(message?.images) ? message.images : [];
  const pdf = message?.pdf || null;
  const pdfUrl = message?.pdfUrl || null;
  const pdfBase64 = message?.pdfBase64 || null;
  const pdfGenerated = message?.pdfGenerated === true;
  const ppt = message?.ppt || null;
  const pptUrl = message?.pptUrl || null;
  const pptGenerated = message?.pptGenerated === true;
  const pptData = message?.pptData || null;
  const pptFileName = message?.pptFileName || "solvix-presentation.pptx";

  const hasPptData = pptGenerated === true && (pptUrl || ppt);
  const hasPdfData = pdfGenerated === true && (pdfUrl || pdf || pdfBase64);

  const pdfDownloadKey = `pdf-${messageId}`;
  const pptDownloadKey = `ppt-${messageId}`;
  const isPdfDownloading = pdfDownloading[pdfDownloadKey] || false;
  const isPptDownloading = pptDownloading[pptDownloadKey] || false;

  const messageTime = message?.createdAt
    ? new Date(message.createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

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
          setTimeout(() => setCopiedId(null), 2000);
        })
        .catch((error) => {
          console.error("Copy failed:", error);
          fallbackCopy(text);
        });
    } else {
      fallbackCopy(text);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Solvix AI Response",
          text: content,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        if (error.name !== "AbortError") {
          handleCopy(content, messageId);
        }
      }
    } else {
      handleCopy(content, messageId);
    }
  };

  const handleFeedback = (type) => {
    setFeedback(type);
    toast.success(
      type === "like" ? "Thanks for the feedback!" : "We'll improve!",
    );
  };

  // ============================================================
  // PDF DOWNLOAD
  // ============================================================

  const handlePDFDownload = (pdfData, title, id) => {
    const downloadKey = `pdf-${id}`;
    setPdfDownloading((prev) => ({ ...prev, [downloadKey]: true }));

    try {
      // URL case — open in new tab
      if (
        pdfData &&
        typeof pdfData === "string" &&
        pdfData.startsWith("http")
      ) {
        window.open(pdfData, "_blank");
        toast.success("PDF opened successfully!");
        setPdfDownloading((prev) => ({ ...prev, [downloadKey]: false }));
        return;
      }

      const pdfBase64 =
        typeof pdfData === "string" ? pdfData : pdfData?.pdf || pdfData;
      if (!pdfBase64) {
        toast.error("No PDF data available");
        setPdfDownloading((prev) => ({ ...prev, [downloadKey]: false }));
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
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF download failed:", error);
      toast.error("Failed to download PDF");
    } finally {
      setPdfDownloading((prev) => ({ ...prev, [downloadKey]: false }));
    }
  };

  // ============================================================
  // PPT DOWNLOAD
  // ============================================================

  const handlePPTDownload = (pptData, title, id) => {
    const downloadKey = `ppt-${id}`;
    setPptDownloading((prev) => ({ ...prev, [downloadKey]: true }));

    try {
      if (
        pptData &&
        typeof pptData === "string" &&
        pptData.startsWith("http")
      ) {
        window.open(pptData, "_blank");
        toast.success("PowerPoint downloaded successfully!");
        setPptDownloading((prev) => ({ ...prev, [downloadKey]: false }));
        return;
      }

      const pptBase64 =
        typeof pptData === "string" ? pptData : pptData?.ppt || pptData;
      if (!pptBase64) {
        toast.error("No PowerPoint data available");
        setPptDownloading((prev) => ({ ...prev, [downloadKey]: false }));
        return;
      }

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
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      toast.success("PowerPoint downloaded successfully!");
    } catch (error) {
      console.error("PPT download failed:", error);
      toast.error("Failed to download PowerPoint");
    } finally {
      setPptDownloading((prev) => ({ ...prev, [downloadKey]: false }));
    }
  };

  // ============================================================
  // IMAGE HANDLING
  // ============================================================

  const handleImageError = (key) => {
    setImageErrors((prev) => ({ ...prev, [key]: true }));
  };

  const handleDownload = async (imageUrl, imageIndex) => {
    const downloadKey = `${imageUrl}-${imageIndex}`;
    setDownloading((prev) => ({ ...prev, [downloadKey]: true }));

    try {
      if (!imageUrl) {
        toast.error("Invalid image URL");
        return;
      }
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `solvix-image-${imageIndex + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      toast.success("Image downloaded!");
    } catch (error) {
      console.error("Image download failed:", error);
      toast.error("Failed to download image");
    } finally {
      setDownloading((prev) => ({ ...prev, [downloadKey]: false }));
    }
  };

  // ============================================================
  // MARKDOWN COMPONENTS
  // ============================================================

  const markdownComponents = {
    p: ({ children }) => (
      <p className="my-2 break-words [overflow-wrap:anywhere] leading-7 text-[15px] tracking-[0.01em]">
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`group/link inline-flex items-center gap-1 break-all underline transition-all duration-200 ${
          dark
            ? "text-cyan-400 decoration-cyan-400/30 hover:decoration-cyan-400 hover:text-cyan-300"
            : "text-blue-600 decoration-blue-600/30 hover:decoration-blue-600 hover:text-blue-700"
        }`}
      >
        <span>{children}</span>
        <FiExternalLink
          size={12}
          className="shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity"
        />
      </a>
    ),
    code: ({ inline, className, children, ...props }) => {
      if (inline) {
        return (
          <code
            className={`break-words rounded-md px-2 py-0.5 text-[0.85em] font-mono [overflow-wrap:anywhere] border ${
              dark
                ? "bg-[#1B2536]/60 text-purple-300 border-purple-500/20"
                : "bg-purple-50 text-purple-700 border-purple-200"
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
          if (match) language = match[1];
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
      return (
        <CodeBlock language={language} code={codeContent} darkMode={dark} />
      );
    },
    ul: ({ children }) => (
      <ul className="my-3 pl-6 break-words space-y-2 list-disc marker:text-purple-500 marker:text-lg">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="my-3 pl-6 break-words space-y-2 list-decimal marker:text-purple-500 marker:font-bold">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="my-1 break-words [overflow-wrap:anywhere] leading-6 pl-1">
        {children}
      </li>
    ),
    table: ({ children }) => (
      <div className="my-4 w-full overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-max border-collapse">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead
        className={`${
          dark
            ? "bg-[#1B2536]/80"
            : "bg-gradient-to-r from-purple-100 to-pink-100"
        }`}
      >
        {children}
      </thead>
    ),
    th: ({ children }) => (
      <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td
        className={`px-4 py-2.5 text-sm border-t ${
          dark ? "border-white/5" : "border-gray-100"
        }`}
      >
        {children}
      </td>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className={`my-4 border-l-4 pl-4 py-2 break-words rounded-r-lg relative overflow-hidden ${
          dark
            ? "border-purple-500 bg-[#1B2536]/60 text-gray-300"
            : "border-purple-400 bg-gradient-to-r from-purple-50 to-transparent text-gray-600"
        }`}
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500" />
        {children}
      </blockquote>
    ),
    h1: ({ children }) => (
      <h1 className="mt-6 mb-3 text-2xl font-extrabold break-words bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        className={`mt-5 mb-2 text-xl font-bold break-words ${
          dark ? "text-purple-300" : "text-purple-600"
        }`}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-4 mb-2 text-lg font-semibold break-words">
        {children}
      </h3>
    ),
    hr: () => (
      <hr
        className={`my-5 border-t-2 ${
          dark ? "border-white/10" : "border-gray-200"
        }`}
      />
    ),
    strong: ({ children }) => (
      <strong
        className={`font-bold ${dark ? "text-purple-300" : "text-purple-700"}`}
      >
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className={`italic ${dark ? "text-pink-300" : "text-pink-600"}`}>
        {children}
      </em>
    ),
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fadeIn p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button
            type="button"
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            ✕
          </button>
          <img
            src={previewImage}
            alt="Preview"
            className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div
        className={`flex w-full min-w-0 ${
          isUser ? "justify-end" : "justify-start"
        } animate-fadeInUp`}
      >
        <div
          className={`
            group relative min-w-0 max-w-[95%] sm:max-w-[90%] md:max-w-[82%] lg:max-w-[78%]
            overflow-hidden rounded-3xl px-4 py-3.5 transition-all duration-500
            ${
              isUser
                ? "bg-white text-black rounded-br-lg border border-gray-200"
                : dark
                  ? "bg-[#1B2536] text-gray-100 rounded-bl-lg"
                  : "bg-white text-gray-800 rounded-bl-lg"
            }
          `}
          style={
            !isUser && dark
              ? { backgroundColor: "#1B2536" }
              : undefined
          }
        >
          {/* Ambient glow for AI messages only */}
          {!isUser && (
            <div
              className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-10 pointer-events-none ${
                dark
                  ? "bg-gradient-to-br from-purple-500 to-pink-500"
                  : "bg-gradient-to-br from-purple-400 to-pink-400"
              }`}
            />
          )}

          {/* ================================================== */}
          {/* MESSAGE HEADER */}
          {/* ================================================== */}
          <div className="mb-2.5 flex min-w-0 items-center justify-between gap-3 relative">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <p
                  className={`
                    text-[11px] font-bold uppercase tracking-widest
                    ${
                      isUser
                        ? "text-gray-800"
                        : dark
                          ? "text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text"
                          : "text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text"
                    }
                  `}
                >
                  {isUser ? "You" : "Solvix AI"}
                </p>
              </div>
              {messageTime && (
                <div
                  className={`flex items-center gap-1 text-[9px] ${
                    isUser
                      ? "text-gray-500"
                      : dark
                        ? "text-gray-500"
                        : "text-gray-400"
                  }`}
                >
                  <BiTime size={9} />
                  <span>{messageTime}</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              {/* Copy button */}
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
                  rounded-lg p-1.5 opacity-0 transition-all duration-300
                  group-hover:opacity-100 hover:scale-110 active:scale-95
                  ${
                    isUser
                      ? "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                      : dark
                        ? "text-gray-400 hover:bg-purple-500/20 hover:text-purple-300"
                        : "text-gray-500 hover:bg-purple-100 hover:text-purple-600"
                  }
                `}
              >
                {copiedId === messageId ? (
                  <FiCheck size={14} className="text-green-500" />
                ) : (
                  <FiCopy size={14} />
                )}
              </button>

              {/* Share button */}
              <button
                type="button"
                onClick={handleShare}
                title="Share"
                className={`
                  rounded-lg p-1.5 opacity-0 transition-all duration-300
                  group-hover:opacity-100 hover:scale-110 active:scale-95
                  ${
                    isUser
                      ? "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                      : dark
                        ? "text-gray-400 hover:bg-purple-500/20 hover:text-purple-300"
                        : "text-gray-500 hover:bg-purple-100 hover:text-purple-600"
                  }
                `}
              >
                <FiShare2 size={14} />
              </button>
            </div>
          </div>

          {/* ================================================== */}
          {/* USER MESSAGE */}
          {/* ================================================== */}
          {isUser ? (
            <p className="min-w-0 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-[15px] leading-7 relative text-black">
              {content}
            </p>
          ) : (
            <>
              {/* AI MESSAGE */}
              <div
                className={`
                  min-w-0 max-w-none overflow-hidden prose prose-sm
                  ${dark ? "prose-invert" : ""}
                  prose-headings:font-bold prose-headings:tracking-tight prose-headings:break-words
                  prose-p:my-2 prose-p:leading-7 prose-p:break-words
                  prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-li:break-words
                  prose-a:break-all prose-code:break-words
                  prose-pre:my-3 prose-pre:max-w-full prose-pre:overflow-x-auto prose-pre:p-0
                  prose-table:block prose-table:max-w-full prose-table:overflow-x-auto
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
              {/* PPT DOWNLOAD */}
              {/* ================================================== */}
              {hasPptData && (
                <div
                  className={`mt-4 pt-4 border-t ${
                    dark ? "border-white/10" : "border-black/10"
                  }`}
                >
                  <div
                    className={`mb-3 flex items-center gap-2 text-xs font-semibold ${
                      dark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                      <BsFilePpt size={17} className="text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="uppercase tracking-wider text-[10px]">
                        Presentation
                      </span>
                      <span className="text-[10px] font-normal opacity-70">
                        PowerPoint file ready
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const pptToDownload = pptUrl || ppt;
                      handlePPTDownload(
                        pptToDownload,
                        pptData?.title ||
                          pptFileName.replace(".pptx", "") ||
                          "Solvix-Presentation",
                        messageId,
                      );
                    }}
                    disabled={isPptDownloading}
                    className="
                      group/btn relative flex items-center justify-center gap-2.5 rounded-xl overflow-hidden
                      bg-gradient-to-r from-orange-500 via-red-500 to-pink-500
                      hover:from-orange-600 hover:via-red-600 hover:to-pink-600
                      px-5 py-3 text-sm font-semibold text-white
                      transition-all duration-300 hover:scale-[1.03] active:scale-95
                      disabled:cursor-not-allowed disabled:opacity-50
                      w-full sm:w-auto
                    "
                  >
                    {isPptDownloading ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin"
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
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <TbFileDownload
                          size={18}
                          className="group-hover/btn:animate-bounce relative z-10"
                        />
                        <span className="relative z-10">
                          Download PowerPoint
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* ================================================== */}
              {/* PDF DOWNLOAD */}
              {/* ================================================== */}
              {hasPdfData && (
                <div
                  className={`mt-4 pt-4 border-t ${
                    dark ? "border-white/10" : "border-black/10"
                  }`}
                >
                  <div
                    className={`mb-3 flex items-center gap-2 text-xs font-semibold ${
                      dark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-pink-600">
                      <BsFilePdf size={17} className="text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="uppercase tracking-wider text-[10px]">
                        Document
                      </span>
                      <span className="text-[10px] font-normal opacity-70">
                        PDF file ready
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const pdfToDownload = pdfUrl || pdfBase64 || pdf;
                      handlePDFDownload(
                        pdfToDownload,
                        content?.slice(0, 40) || "Solvix-Document",
                        messageId,
                      );
                    }}
                    disabled={isPdfDownloading}
                    className="
                      group/btn relative flex items-center justify-center gap-2.5 rounded-xl overflow-hidden
                      bg-gradient-to-r from-red-500 via-pink-500 to-rose-500
                      hover:from-red-600 hover:via-pink-600 hover:to-rose-600
                      px-5 py-3 text-sm font-semibold text-white
                      transition-all duration-300 hover:scale-[1.03] active:scale-95
                      disabled:cursor-not-allowed disabled:opacity-50
                      w-full sm:w-auto
                    "
                  >
                    {isPdfDownloading ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin"
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
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <TbFileDownload
                          size={18}
                          className="group-hover/btn:animate-bounce relative z-10"
                        />
                        <span className="relative z-10">Download PDF</span>
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
                    className={`mb-3 flex items-center gap-2 text-xs font-semibold ${
                      dark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                      <MdOutlineImage size={17} className="text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="uppercase tracking-wider text-[10px]">
                        Generated Images
                      </span>
                      <span className="text-[10px] font-normal opacity-70">
                        {images.length} image{images.length > 1 ? "s" : ""}{" "}
                        ready
                      </span>
                    </div>
                  </p>

                  <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
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

                      if (imageErrors[imageKey] || !finalUrl) return null;

                      return (
                        <div
                          key={imageKey}
                          className="
                            group/image relative min-w-0 overflow-hidden rounded-2xl
                            border border-white/10 bg-black/20 flex flex-col
                            transition-all duration-500
                            hover:-translate-y-2
                          "
                        >
                          <div className="relative overflow-hidden">
                            <img
                              src={finalUrl}
                              alt={`Generated image ${imgIndex + 1}`}
                              className="block h-44 w-full object-cover transition-transform duration-700 group-hover/image:scale-125"
                              loading="lazy"
                              onError={() => handleImageError(imageKey)}
                            />

                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 pointer-events-none" />

                            {/* Preview button */}
                            <button
                              type="button"
                              onClick={() => setPreviewImage(finalUrl)}
                              className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm text-white opacity-0 group-hover/image:opacity-100 transition-all duration-300 hover:bg-black/80 hover:scale-110"
                              title="Preview"
                            >
                              <FiMaximize2 size={14} />
                            </button>

                            {/* Image number badge */}
                            <div className="absolute top-2 left-2 flex h-6 min-w-6 items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm px-2 text-[10px] font-bold text-white opacity-0 group-hover/image:opacity-100 transition-all duration-300">
                              #{imgIndex + 1}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDownload(finalUrl, imgIndex)}
                            disabled={isDownloading}
                            className="
                              group/dl relative flex items-center justify-center gap-2 overflow-hidden
                              bg-gradient-to-r from-gray-900 via-black to-gray-900
                              text-white text-sm font-semibold py-3 px-4
                              transition-all duration-300
                              border-t border-white/10 disabled:opacity-50 disabled:cursor-not-allowed
                            "
                          >
                            {isDownloading ? (
                              <>
                                <svg
                                  className="h-4 w-4 animate-spin"
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
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                  />
                                </svg>
                                <span>Downloading...</span>
                              </>
                            ) : (
                              <>
                                <FiDownload
                                  size={16}
                                  className="group-hover/dl:animate-bounce"
                                />
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
    </>
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