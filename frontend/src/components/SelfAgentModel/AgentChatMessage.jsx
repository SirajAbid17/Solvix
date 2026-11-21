import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FiCpu,
  FiCopy,
  FiCheck,
  FiLoader,
  FiDownload,
  FiMaximize2,
  FiZap,
  FiImage,
} from "react-icons/fi";
import { BsFilePdf, BsFilePpt } from "react-icons/bs";

const cleanMessageContent = (text) => {
  if (!text) return "";
  return String(text)
    .replace(/\[NEEDS_SEARCH\][^\n]*\n?/gi, "")
    .replace(/\[CREATE_PDF\][^\n]*\n?/gi, "")
    .replace(/\[CREATE_PPT\][^\n]*\n?/gi, "")
    .replace(/\[CREATE_IMAGE\][^\n]*\n?/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(p|div|span|strong|em|ul|ol|li|h[1-6])[^>]*>/gi, "")
    .replace(/<\/?[a-z][^>]*>/gi, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .trim();
};

export default function AgentChatMessage({
  message,
  idx,
  dark,
  agent,
  copiedIdx,
  onCopy,
  downloading,
  onDownloadPDF,
  onDownloadPPT,
  onDownloadImage,
  onPreviewImage,
}) {
  const m = message;
  const i = idx;
  const hasPdf = m.pdfGenerated === true && (m.pdfUrl || m.pdfBase64 || m.pdf);
  const hasPpt = m.pptGenerated === true && (m.pptUrl || m.pptBase64 || m.ppt);
  const msgImages = Array.isArray(m.images) ? m.images : [];
  const isUser = m.role === "user";

  const markdownComponents = {
    p: ({ children }) => (
      <p className="my-2 break-words leading-relaxed">{children}</p>
    ),
    h1: ({ children }) => (
      <h1 className="mb-3 mt-4 text-lg font-bold tracking-tight">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-2 mt-3 text-base font-bold tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 mt-3 text-sm font-bold tracking-tight">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-1.5 mt-2 text-xs font-bold uppercase tracking-wider opacity-80">
        {children}
      </h4>
    ),
    ul: ({ children }) => (
      <ul className="my-2 list-disc space-y-1 pl-5 marker:text-emerald-500">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="my-2 list-decimal space-y-1 pl-5 marker:font-semibold marker:text-emerald-500">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="break-words leading-relaxed">{children}</li>
    ),
    strong: ({ children }) => (
      <strong className="font-bold text-gray-900 dark:text-white">
        {children}
      </strong>
    ),
    em: ({ children }) => <em className="italic opacity-90">{children}</em>,
    code: ({ inline, className, children }) => {
      const isInline = !className?.includes("language-");
      if (isInline) {
        return (
          <code
            className={`rounded-md px-1.5 py-0.5 font-mono text-[0.85em] font-semibold ${
              dark
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {children}
          </code>
        );
      }
      return (
        <code
          className={`font-mono text-[0.85em] ${
            dark ? "text-gray-200" : "text-gray-800"
          }`}
        >
          {children}
        </code>
      );
    },
    pre: ({ children }) => (
      <pre
        className={`my-3 overflow-x-auto rounded-xl p-4 font-mono text-[0.8em] leading-relaxed shadow-lg ${
          dark
            ? "bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10"
            : "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100"
        }`}
      >
        {children}
      </pre>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className={`my-3 rounded-r-lg border-l-4 pl-4 pr-3 py-2 italic ${
          dark
            ? "border-emerald-500/60 bg-emerald-500/[0.06] text-gray-300"
            : "border-emerald-400 bg-emerald-50 text-gray-700"
        }`}
      >
        {children}
      </blockquote>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`font-medium underline underline-offset-2 transition-colors ${
          dark
            ? "text-emerald-400 hover:text-emerald-300"
            : "text-emerald-600 hover:text-emerald-700"
        }`}
      >
        {children}
      </a>
    ),
    table: ({ children }) => (
      <div className="my-3 overflow-x-auto rounded-xl border border-white/10 shadow-sm">
        <table className="w-full border-collapse text-[0.85em]">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th
        className={`border-b px-3 py-2 text-left font-bold uppercase tracking-wider text-[0.85em] ${
          dark
            ? "border-white/10 bg-white/[0.04] text-gray-300"
            : "border-gray-200 bg-gray-50 text-gray-700"
        }`}
      >
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td
        className={`border-b px-3 py-2 ${
          dark
            ? "border-white/[0.06] text-gray-300"
            : "border-gray-100 text-gray-700"
        }`}
      >
        {children}
      </td>
    ),
    hr: () => (
      <hr
        className={`my-4 border-0 h-px ${
          dark
            ? "bg-gradient-to-r from-transparent via-white/20 to-transparent"
            : "bg-gradient-to-r from-transparent via-gray-300 to-transparent"
        }`}
      />
    ),
  };

  return (
    <div
      className={`relative flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`group/msg max-w-[88%] ${isUser ? "" : "w-full"}`}
      >
        {!isUser && (
          <div className="mb-2 flex items-center gap-2 px-1">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-lg shadow-md ${
                dark
                  ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-300 ring-1 ring-emerald-500/20"
                  : "bg-gradient-to-br from-emerald-100 to-teal-50 text-emerald-600 ring-1 ring-emerald-200"
              }`}
            >
              <FiCpu className="text-[11px]" />
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-[0.1em] ${
                dark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {agent.name}
            </span>
            {m.toolExecuted && (
              <span
                className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow-sm ${
                  dark
                    ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 ring-1 ring-emerald-500/30"
                    : "bg-gradient-to-r from-emerald-100 to-teal-50 text-emerald-700 ring-1 ring-emerald-200"
                }`}
              >
                <FiZap className="text-[8px]" />
                {m.toolExecuted}
              </span>
            )}
            {m.ragUsed && (
              <span
                className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                  dark
                    ? "bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/30"
                    : "bg-purple-100 text-purple-700 ring-1 ring-purple-200"
                }`}
              >
                <FiZap className="text-[8px]" />
                RAG
              </span>
            )}
            <button
              onClick={() => onCopy(cleanMessageContent(m.content), i)}
              className={`ml-auto rounded-lg p-1.5 opacity-0 transition-all group-hover/msg:opacity-100 ${
                dark
                  ? "hover:bg-white/10 text-gray-500 hover:text-gray-300"
                  : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              }`}
              title="Copy"
            >
              {copiedIdx === i ? (
                <FiCheck className="text-xs text-emerald-500" />
              ) : (
                <FiCopy className="text-xs" />
              )}
            </button>
          </div>
        )}

        <div
          className={`relative whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-md transition-shadow ${
            isUser
              ? dark
                ? "bg-gradient-to-br from-white to-gray-100 text-black shadow-lg shadow-white/10"
                : "bg-gradient-to-br from-gray-900 to-black text-white shadow-lg shadow-black/20"
              : dark
                ? "bg-white/[0.04] text-gray-100 border border-white/[0.08] backdrop-blur-sm shadow-black/20"
                : "bg-white text-gray-800 border border-gray-200/80 shadow-gray-200/50"
          }`}
        >
          {!isUser && (
            <div
              className={`pointer-events-none absolute top-0 left-4 right-4 h-px ${
                dark
                  ? "bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  : "bg-gradient-to-r from-transparent via-gray-300 to-transparent"
              }`}
            />
          )}

          {isUser ? (
            <span className="font-medium">
              {cleanMessageContent(m.content)}
            </span>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {cleanMessageContent(m.content)}
              </ReactMarkdown>
            </div>
          )}

         
          {hasPdf && (
            <div
              className={`mt-4 rounded-xl border overflow-hidden ${
                dark
                  ? "border-red-500/30 bg-gradient-to-br from-red-500/10 to-pink-500/5"
                  : "border-red-200 bg-gradient-to-br from-red-50 to-pink-50"
              }`}
            >
              <div className="flex items-center gap-3 p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-pink-600 shadow-lg shadow-red-500/30">
                  <BsFilePdf className="text-lg text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-[11px] font-bold uppercase tracking-wider ${
                      dark ? "text-red-300" : "text-red-700"
                    }`}
                  >
                    PDF Ready
                  </p>
                  <p
                    className={`truncate text-[10px] ${
                      dark ? "text-red-400/70" : "text-red-600/70"
                    }`}
                  >
                    Click to download
                  </p>
                </div>
              </div>
              <button
                onClick={() => onDownloadPDF(m, i)}
                disabled={downloading[`pdf-${i}`]}
                className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 px-4 py-2.5 text-xs font-bold text-white transition-all hover:from-red-600 hover:via-pink-600 hover:to-rose-600 active:scale-[0.98] disabled:opacity-50"
              >
                {downloading[`pdf-${i}`] ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <FiDownload />
                    Download PDF
                  </>
                )}
              </button>
            </div>
          )}

          
          {hasPpt && (
            <div
              className={`mt-4 rounded-xl border overflow-hidden ${
                dark
                  ? "border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-amber-500/5"
                  : "border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50"
              }`}
            >
              <div className="flex items-center gap-3 p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/30">
                  <BsFilePpt className="text-lg text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-[11px] font-bold uppercase tracking-wider ${
                      dark ? "text-orange-300" : "text-orange-700"
                    }`}
                  >
                    PPT Ready
                  </p>
                  <p
                    className={`truncate text-[10px] ${
                      dark ? "text-orange-400/70" : "text-orange-600/70"
                    }`}
                  >
                    {m.pptFileName || "presentation.pptx"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onDownloadPPT(m, i)}
                disabled={downloading[`ppt-${i}`]}
                className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 px-4 py-2.5 text-xs font-bold text-white transition-all hover:from-orange-600 hover:via-red-600 hover:to-pink-600 active:scale-[0.98] disabled:opacity-50"
              >
                {downloading[`ppt-${i}`] ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <FiDownload />
                    Download PPT
                  </>
                )}
              </button>
            </div>
          )}

          
          {msgImages.length > 0 && (
            <div className="mt-4">
              <div
                className={`mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${
                  dark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <FiImage className="text-xs" />
                Generated Images ({msgImages.length})
              </div>
              <div className="grid grid-cols-1 gap-2">
                {msgImages.map((img, imgIdx) => {
                  const url =
                    typeof img === "string"
                      ? img
                      : img?.url || img?.src || "";
                  if (!url) return null;
                  return (
                    <div
                      key={imgIdx}
                      className={`group/img relative overflow-hidden rounded-xl border shadow-md ${
                        dark ? "border-white/10" : "border-gray-200"
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={url}
                          alt={`Generated ${imgIdx + 1}`}
                          className="h-44 w-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                          loading="lazy"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover/img:opacity-100" />
                        <button
                          onClick={() => onPreviewImage(url)}
                          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-sm opacity-0 transition-all group-hover/img:opacity-100 hover:bg-black/80 hover:scale-110 active:scale-95"
                          title="Preview"
                        >
                          <FiMaximize2 size={13} />
                        </button>
                      </div>
                      <button
                        onClick={() => onDownloadImage(url, imgIdx)}
                        disabled={downloading[`img-${imgIdx}`]}
                        className={`flex w-full items-center justify-center gap-1.5 border-t px-3 py-2 text-[11px] font-bold transition-all disabled:opacity-50 ${
                          dark
                            ? "border-white/10 bg-black/40 text-white hover:bg-black/60"
                            : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {downloading[`img-${imgIdx}`] ? (
                          <>
                            <FiLoader className="animate-spin" size={12} />
                            Downloading...
                          </>
                        ) : (
                          <>
                            <FiDownload size={12} />
                            Download
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}