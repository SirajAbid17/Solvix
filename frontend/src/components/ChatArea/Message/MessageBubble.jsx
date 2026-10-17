import React, { useState } from "react";
import {
  FiCopy,
  FiCheck,
  FiDownload,
  FiFile,
  FiFileText,
  FiExternalLink,
  FiShare2,
  FiMaximize2,
  FiX,
  FiThumbsUp,
  FiThumbsDown,
  FiChevronDown,
} from "react-icons/fi";
import { BsFilePdf, BsFilePpt } from "react-icons/bs";
import { BiTime } from "react-icons/bi";
import { TbFileDownload } from "react-icons/tb";
import { MdOutlineImage } from "react-icons/md";
import { HiOutlineSparkles } from "react-icons/hi2";
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

  const attachedFile = message?.attachedFile || null;
  const attachedImageBase64 = attachedFile?.imageBase64 || null;
  const attachedImageMimeType = attachedFile?.imageMimeType || "image/jpeg";

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

  const handlePDFDownload = (pdfData, title, id) => {
    const downloadKey = `pdf-${id}`;
    setPdfDownloading((prev) => ({ ...prev, [downloadKey]: true }));

    try {
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

  const markdownComponents = {
    p: ({ children }) => (
      <p className="my-2 break-words [overflow-wrap:anywhere] text-[14px] leading-6 tracking-[0.01em] sm:text-[15px] sm:leading-7">
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
            className={`break-words rounded-md px-1.5 py-0.5 text-[0.85em] font-mono [overflow-wrap:anywhere] border sm:px-2 ${
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
      <ul className="my-2 list-disc space-y-1.5 break-words pl-5 marker:text-base marker:text-purple-500 sm:my-3 sm:space-y-2 sm:pl-6 sm:marker:text-lg">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="my-2 list-decimal space-y-1.5 break-words pl-5 marker:font-bold marker:text-purple-500 sm:my-3 sm:space-y-2 sm:pl-6">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="my-0.5 break-words pl-0.5 text-[14px] leading-6 [overflow-wrap:anywhere] sm:my-1 sm:pl-1 sm:text-[15px] sm:leading-7">
        {children}
      </li>
    ),
    table: ({ children }) => (
      <div
        className={`my-3 w-full overflow-x-auto rounded-xl border sm:my-4 ${
          dark ? "border-white/10" : "border-gray-200"
        }`}
      >
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
      <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider sm:px-4 sm:py-2.5 sm:text-xs">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td
        className={`border-t px-3 py-2 text-xs sm:px-4 sm:py-2.5 sm:text-sm ${
          dark ? "border-white/5" : "border-gray-100"
        }`}
      >
        {children}
      </td>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className={`relative my-3 overflow-hidden rounded-r-lg border-l-4 py-1.5 pl-3 pr-2 break-words sm:my-4 sm:py-2 sm:pl-4 ${
          dark
            ? "border-purple-500 bg-[#1B2536]/60 text-gray-300"
            : "border-purple-400 bg-gradient-to-r from-purple-50 to-transparent text-gray-600"
        }`}
      >
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-purple-500 to-pink-500" />
        {children}
      </blockquote>
    ),
    h1: ({ children }) => (
      <h1 className="mb-2 mt-4 break-words bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-lg font-extrabold text-transparent sm:mb-3 sm:mt-6 sm:text-2xl">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        className={`mb-1.5 mt-3 break-words text-base font-bold sm:mb-2 sm:mt-5 sm:text-xl ${
          dark ? "text-purple-300" : "text-purple-600"
        }`}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-1.5 mt-3 break-words text-sm font-semibold sm:mb-2 sm:mt-4 sm:text-lg">
        {children}
      </h3>
    ),
    hr: () => (
      <hr
        className={`my-4 border-t-2 sm:my-5 ${
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

  return (
    <>
      {previewImage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-3 backdrop-blur-sm sm:p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button
            type="button"
            onClick={() => setPreviewImage(null)}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 sm:right-4 sm:top-4 sm:h-10 sm:w-10"
          >
            <FiX size={18} />
          </button>
          <img
            src={previewImage}
            alt="Preview"
            className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain sm:rounded-2xl"
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
            group
            relative
            min-w-0
            max-w-[95%]
            overflow-hidden
            rounded-2xl
            px-3
            py-2.5
            transition-all
            duration-500
            sm:max-w-[90%]
            sm:rounded-3xl
            sm:px-4
            sm:py-3.5
            md:max-w-[82%]
            lg:max-w-[78%]
            xl:max-w-[75%]
            ${
              isUser
                ? "bg-white text-black rounded-br-lg border border-gray-200"
                : dark
                  ? "bg-[#1B2536] text-gray-100 rounded-bl-lg"
                  : "bg-white text-gray-800 rounded-bl-lg"
            }
          `}
          style={!isUser && dark ? { backgroundColor: "#1B2536" } : undefined}
        >
          {!isUser && (
            <div
              className={`pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full opacity-10 blur-3xl ${
                dark
                  ? "bg-gradient-to-br from-purple-500 to-pink-500"
                  : "bg-gradient-to-br from-purple-400 to-pink-400"
              }`}
            />
          )}

          <div className="relative mb-2 flex min-w-0 items-center justify-between gap-2 sm:mb-2.5 sm:gap-3">
            <div className="flex min-w-0 flex-col">
              <div className="flex items-center gap-1.5">
                {!isUser && (
                  <HiOutlineSparkles
                    size={12}
                    className={`shrink-0 ${
                      dark ? "text-purple-300" : "text-purple-600"
                    }`}
                  />
                )}
                <p
                  className={`
                    truncate
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-widest
                    sm:text-[11px]
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

            <div
              className="
                flex shrink-0 items-center gap-0.5
                opacity-100 transition-opacity duration-300
                sm:gap-1
                sm:opacity-0 sm:group-hover:opacity-100
              "
            >
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
                  rounded-lg
                  p-1.5
                  transition-all
                  duration-300
                  hover:scale-110
                  active:scale-95
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

              <button
                type="button"
                onClick={handleShare}
                title="Share"
                className={`
                  rounded-lg
                  p-1.5
                  transition-all
                  duration-300
                  hover:scale-110
                  active:scale-95
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

              {!isUser && (
                <>
                  <button
                    type="button"
                    onClick={() => handleFeedback("like")}
                    title="Good response"
                    className={`
                      rounded-lg
                      p-1.5
                      transition-all
                      duration-300
                      hover:scale-110
                      active:scale-95
                      ${
                        feedback === "like"
                          ? "text-green-500 bg-green-500/10"
                          : dark
                            ? "text-gray-400 hover:bg-green-500/20 hover:text-green-400"
                            : "text-gray-500 hover:bg-green-100 hover:text-green-600"
                      }
                    `}
                  >
                    <FiThumbsUp size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFeedback("dislike")}
                    title="Bad response"
                    className={`
                      rounded-lg
                      p-1.5
                      transition-all
                      duration-300
                      hover:scale-110
                      active:scale-95
                      ${
                        feedback === "dislike"
                          ? "text-red-500 bg-red-500/10"
                          : dark
                            ? "text-gray-400 hover:bg-red-500/20 hover:text-red-400"
                            : "text-gray-500 hover:bg-red-100 hover:text-red-600"
                      }
                    `}
                  >
                    <FiThumbsDown size={14} />
                  </button>
                </>
              )}
            </div>
          </div>

          {isUser ? (
            <div className="relative min-w-0">
              {attachedImageBase64 && (
                <div className="mb-2 flex items-start sm:mb-3">
                  <div
                    className="group/thumb relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-black/5"
                    onClick={() =>
                      setPreviewImage(
                        `data:${attachedImageMimeType};base64,${attachedImageBase64}`,
                      )
                    }
                  >
                    <img
                      src={`data:${attachedImageMimeType};base64,${attachedImageBase64}`}
                      alt={attachedFile?.fileName || "Attached image"}
                      className="block max-h-40 max-w-[200px] object-cover transition-transform duration-300 group-hover/thumb:scale-105 sm:max-h-48 sm:max-w-[240px]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover/thumb:opacity-100">
                      <FiMaximize2 size={20} className="text-white" />
                    </div>
                    <div className="absolute bottom-1 right-1 max-w-[160px] truncate rounded-md bg-black/70 px-2 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm sm:max-w-[180px]">
                      {attachedFile?.fileName || "image"}
                    </div>
                  </div>
                </div>
              )}

              {attachedFile &&
                !attachedImageBase64 &&
                attachedFile?.fileName && (
                  <div className="mb-2 inline-flex max-w-full items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 sm:gap-2 sm:px-2.5">
                    <FiFile size={12} className="shrink-0 text-gray-500" />
                    <span className="truncate text-[10px] font-medium text-gray-700 sm:max-w-[200px] sm:text-[11px]">
                      {attachedFile.fileName}
                    </span>
                  </div>
                )}

              <p className="relative min-w-0 whitespace-pre-wrap break-words text-[14px] leading-6 text-black [overflow-wrap:anywhere] sm:text-[15px] sm:leading-7">
                {content}
              </p>
            </div>
          ) : (
            <>
              <div
                className={`
                  min-w-0
                  max-w-none
                  overflow-hidden
                  prose
                  prose-sm
                  sm:prose-base
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

              {message?.ragUsed && message?.ragSources?.length > 0 && (
                <div
                  className={`mt-3 rounded-xl border p-2.5 sm:mt-4 sm:p-3 ${
                    dark
                      ? "border-purple-500/20 bg-purple-500/[0.04]"
                      : "border-purple-200 bg-purple-50/50"
                  }`}
                >
                  <div className="mb-1.5 flex items-center gap-1.5 sm:mb-2 sm:gap-2">
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md sm:h-6 sm:w-6 ${
                        dark
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      <FiFileText size={11} className="sm:size-[12px]" />
                    </div>
                    <span
                      className={`truncate text-[9px] font-semibold uppercase tracking-wider sm:text-[10px] ${
                        dark ? "text-purple-300" : "text-purple-700"
                      }`}
                    >
                      Sources from your documents
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 sm:gap-1.5">
                    {message.ragSources.map((src, idx) => (
                      <span
                        key={idx}
                        className={`rounded-md px-1.5 py-0.5 text-[9px] font-medium sm:px-2 sm:py-1 sm:text-[10px] ${
                          dark
                            ? "bg-purple-500/10 text-purple-300"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        📄 {src.fileName}
                        {src.score && (
                          <span className="ml-1 opacity-60">
                            ({(src.score * 100).toFixed(0)}%)
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {hasPptData && (
                <div
                  className={`mt-3 border-t pt-3 sm:mt-4 sm:pt-4 ${
                    dark ? "border-white/10" : "border-black/10"
                  }`}
                >
                  <div
                    className={`mb-2 flex items-center gap-2 text-xs font-semibold sm:mb-3 ${
                      dark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600 sm:h-9 sm:w-9 sm:rounded-xl">
                      <BsFilePpt
                        size={15}
                        className="text-white sm:size-[17px]"
                      />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-[9px] uppercase tracking-wider sm:text-[10px]">
                        Presentation
                      </span>
                      <span className="truncate text-[9px] font-normal opacity-70 sm:text-[10px]">
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
                      group/btn
                      relative
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      overflow-hidden
                      rounded-xl
                      bg-gradient-to-r
                      from-orange-500
                      via-red-500
                      to-pink-500
                      px-4
                      py-2.5
                      text-xs
                      font-semibold
                      text-white
                      transition-all
                      duration-300
                      hover:scale-[1.03]
                      hover:from-orange-600
                      hover:via-red-600
                      hover:to-pink-600
                      active:scale-95
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                      sm:w-auto
                      sm:gap-2.5
                      sm:px-5
                      sm:py-3
                      sm:text-sm
                    "
                  >
                    {isPptDownloading ? (
                      <>
                        <svg
                          className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4"
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
                          size={16}
                          className="relative z-10 shrink-0 group-hover/btn:animate-bounce sm:size-[18px]"
                        />
                        <span className="relative z-10 truncate">
                          Download PowerPoint
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {hasPdfData && (
                <div
                  className={`mt-3 border-t pt-3 sm:mt-4 sm:pt-4 ${
                    dark ? "border-white/10" : "border-black/10"
                  }`}
                >
                  <div
                    className={`mb-2 flex items-center gap-2 text-xs font-semibold sm:mb-3 ${
                      dark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-pink-600 sm:h-9 sm:w-9 sm:rounded-xl">
                      <BsFilePdf
                        size={15}
                        className="text-white sm:size-[17px]"
                      />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-[9px] uppercase tracking-wider sm:text-[10px]">
                        Document
                      </span>
                      <span className="truncate text-[9px] font-normal opacity-70 sm:text-[10px]">
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
                      group/btn
                      relative
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      overflow-hidden
                      rounded-xl
                      bg-gradient-to-r
                      from-red-500
                      via-pink-500
                      to-rose-500
                      px-4
                      py-2.5
                      text-xs
                      font-semibold
                      text-white
                      transition-all
                      duration-300
                      hover:scale-[1.03]
                      hover:from-red-600
                      hover:via-pink-600
                      hover:to-rose-600
                      active:scale-95
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                      sm:w-auto
                      sm:gap-2.5
                      sm:px-5
                      sm:py-3
                      sm:text-sm
                    "
                  >
                    {isPdfDownloading ? (
                      <>
                        <svg
                          className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4"
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
                          size={16}
                          className="relative z-10 shrink-0 group-hover/btn:animate-bounce sm:size-[18px]"
                        />
                        <span className="relative z-10 truncate">
                          Download PDF
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {images.length > 0 && (
                <div className="mt-3 min-w-0 sm:mt-4">
                  <div
                    className={`mb-2 flex items-center gap-2 text-xs font-semibold sm:mb-3 ${
                      dark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 sm:h-9 sm:w-9 sm:rounded-xl">
                      <MdOutlineImage
                        size={15}
                        className="text-white sm:size-[17px]"
                      />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-[9px] uppercase tracking-wider sm:text-[10px]">
                        Generated Images
                      </span>
                      <span className="truncate text-[9px] font-normal opacity-70 sm:text-[10px]">
                        {images.length} image{images.length > 1 ? "s" : ""}{" "}
                        ready
                      </span>
                    </div>
                  </div>

                  <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3">
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
                            group/image
                            relative
                            flex
                            min-w-0
                            flex-col
                            overflow-hidden
                            rounded-xl
                            border
                            border-white/10
                            bg-black/20
                            transition-all
                            duration-500
                            hover:-translate-y-1
                            sm:rounded-2xl
                            sm:hover:-translate-y-2
                          "
                        >
                          <div className="relative overflow-hidden">
                            <img
                              src={finalUrl}
                              alt={`Generated image ${imgIndex + 1}`}
                              className="block h-36 w-full object-cover transition-transform duration-700 group-hover/image:scale-125 sm:h-44"
                              loading="lazy"
                              onError={() => handleImageError(imageKey)}
                            />

                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover/image:opacity-100" />

                            <button
                              type="button"
                              onClick={() => setPreviewImage(finalUrl)}
                              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-black/80 group-hover/image:opacity-100 sm:h-8 sm:w-8"
                              title="Preview"
                            >
                              <FiMaximize2
                                size={13}
                                className="sm:size-[14px]"
                              />
                            </button>

                            <div className="absolute left-2 top-2 flex h-5 min-w-5 items-center justify-center rounded-lg bg-black/60 px-1.5 text-[9px] font-bold text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover/image:opacity-100 sm:h-6 sm:min-w-6 sm:px-2 sm:text-[10px]">
                              #{imgIndex + 1}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDownload(finalUrl, imgIndex)}
                            disabled={isDownloading}
                            className="
                              group/dl
                              relative
                              flex
                              items-center
                              justify-center
                              gap-1.5
                              overflow-hidden
                              border-t
                              border-white/10
                              bg-gradient-to-r
                              from-gray-900
                              via-black
                              to-gray-900
                              px-3
                              py-2.5
                              text-xs
                              font-semibold
                              text-white
                              transition-all
                              duration-300
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                              sm:gap-2
                              sm:px-4
                              sm:py-3
                              sm:text-sm
                            "
                          >
                            {isDownloading ? (
                              <>
                                <svg
                                  className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4"
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
                                  size={14}
                                  className="shrink-0 group-hover/dl:animate-bounce sm:size-[16px]"
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

function sanitizeFileName(name) {
  return (
    String(name)
      .replace(/[<>:"/\\|?*]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 100)
      .trim() || "Solvix-File"
  );
}
