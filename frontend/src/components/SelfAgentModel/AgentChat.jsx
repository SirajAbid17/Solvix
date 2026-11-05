import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FiCpu,
  FiX,
  FiSend,
  FiCopy,
  FiCheck,
  FiLoader,
} from "react-icons/fi";
import { AGENT_CATEGORIES, AGENT_MODELS } from "./AgentComponents";

export default function AgentChatDrawer({
  dark,
  agent,
  messages,
  input,
  setInput,
  onSend,
  loading,
  onClose,
  inputClass,
}) {
  const drawerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [copiedIdx, setCopiedIdx] = useState(null);

  useGSAP(
    () => {
      gsap.from(".cd-panel", { x: 40, opacity: 0, duration: 0.45, ease: "power3.out" });
    },
    { scope: drawerRef }
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const CatIcon = AGENT_CATEGORIES.find((c) => c.id === agent.category)?.Icon || FiCpu;
  const model = AGENT_MODELS.find((m) => m.id === agent.model);

  const handleCopy = (text, idx) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedIdx(idx);
        toast.success("Copied to clipboard!", {
          style: {
            background: dark ? "#1a1a1a" : "#fff",
            color: dark ? "#fff" : "#000",
          },
        });
        setTimeout(() => setCopiedIdx(null), 2000);
      })
      .catch(() => toast.error("Failed to copy"));
  };

  const markdownComponents = {
    p: ({ children }) => <p className="my-1.5 break-words">{children}</p>,
    h1: ({ children }) => <h1 className="mb-2 mt-3 text-base font-bold">{children}</h1>,
    h2: ({ children }) => <h2 className="mb-2 mt-3 text-sm font-bold">{children}</h2>,
    h3: ({ children }) => <h3 className="mb-1.5 mt-2.5 text-sm font-semibold">{children}</h3>,
    h4: ({ children }) => <h4 className="mb-1 mt-2 text-xs font-semibold">{children}</h4>,
    ul: ({ children }) => <ul className="my-1.5 list-disc space-y-0.5 pl-5">{children}</ul>,
    ol: ({ children }) => <ol className="my-1.5 list-decimal space-y-0.5 pl-5">{children}</ol>,
    li: ({ children }) => <li className="break-words leading-relaxed">{children}</li>,
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ inline, className, children }) => {
      const isInline = !className?.includes("language-");
      if (isInline) {
        return (
          <code
            className={`rounded px-1.5 py-0.5 font-mono text-[0.85em] ${
              dark ? "bg-purple-500/15 text-purple-300" : "bg-purple-100 text-purple-700"
            }`}
          >
            {children}
          </code>
        );
      }
      return (
        <code className={`font-mono text-[0.85em] ${dark ? "text-gray-200" : "text-gray-800"}`}>
          {children}
        </code>
      );
    },
    pre: ({ children }) => (
      <pre
        className={`my-2 overflow-x-auto rounded-lg p-3 font-mono text-[0.8em] leading-relaxed ${
          dark ? "bg-black/60 border border-white/10" : "bg-gray-900/95 text-gray-100"
        }`}
      >
        {children}
      </pre>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className={`my-2 border-l-3 pl-3 italic ${
          dark ? "border-purple-500/50 text-gray-300" : "border-purple-400 text-gray-600"
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
        className={`underline underline-offset-2 ${dark ? "text-cyan-400" : "text-blue-600"}`}
      >
        {children}
      </a>
    ),
    table: ({ children }) => (
      <div className="my-2 overflow-x-auto">
        <table className={`w-full border-collapse text-[0.85em] ${dark ? "border-white/10" : "border-gray-200"}`}>
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th
        className={`border px-2 py-1 text-left font-semibold ${
          dark ? "border-white/10 bg-white/[0.04]" : "border-gray-200 bg-gray-50"
        }`}
      >
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className={`border px-2 py-1 ${dark ? "border-white/10" : "border-gray-200"}`}>{children}</td>
    ),
    hr: () => <hr className={`my-3 ${dark ? "border-white/10" : "border-gray-200"}`} />,
  };

  return (
    <div ref={drawerRef} className="fixed inset-0 z-[200] flex justify-end bg-black/70 backdrop-blur-sm">
      <div
        className={`cd-panel flex h-full w-full flex-col border-l shadow-2xl sm:max-w-md ${
          dark ? "bg-[#0a0a0a] border-white/10 text-white" : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        <div className={`flex shrink-0 items-center justify-between border-b px-4 py-3 ${dark ? "border-white/10" : "border-gray-200"}`}>
          <div className="flex min-w-0 items-center gap-2.5">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                dark
                  ? "border-white/10 bg-white/[0.05] text-gray-200"
                  : "border-gray-200 bg-gray-50 text-gray-700"
              }`}
            >
              <CatIcon className="text-base" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{agent.name}</p>
              <p className={`truncate text-[10px] ${dark ? "text-gray-400" : "text-gray-500"}`}>
                {model?.label || agent.model} · T {agent.temperature}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm transition ${
              dark ? "bg-white/[0.05] hover:bg-white/15 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            <FiX />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-3 py-4 sm:px-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`group/msg max-w-[88%] ${m.role === "user" ? "" : "w-full"}`}>
                {m.role === "assistant" && (
                  <div className="mb-1 flex items-center gap-1.5 px-1">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-md ${
                        dark ? "bg-purple-500/20 text-purple-300" : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      <FiCpu className="text-[10px]" />
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        dark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {agent.name}
                    </span>
                    <button
                      onClick={() => handleCopy(m.content, i)}
                      className={`ml-auto rounded p-1 opacity-0 transition group-hover/msg:opacity-100 ${
                        dark ? "hover:bg-white/10 text-gray-500" : "hover:bg-gray-100 text-gray-400"
                      }`}
                      title="Copy"
                    >
                      {copiedIdx === i ? (
                        <FiCheck className="text-[11px] text-emerald-500" />
                      ) : (
                        <FiCopy className="text-[11px]" />
                      )}
                    </button>
                  </div>
                )}
                <div
                  className={`whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${
                    m.role === "user"
                      ? dark
                        ? "bg-white text-black"
                        : "bg-black text-white"
                      : dark
                      ? "bg-white/[0.04] text-gray-100 border border-white/[0.08]"
                      : "bg-gray-50 text-gray-800 border border-gray-200"
                  }`}
                >
                  {m.role === "user" ? (
                    <span>{m.content}</span>
                  ) : (
                    <div className="markdown-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div
                className={`rounded-2xl px-3.5 py-2.5 text-sm ${
                  dark ? "bg-white/[0.05] border border-white/10" : "bg-gray-50 border border-gray-200"
                }`}
              >
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current opacity-50" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current opacity-50 [animation-delay:0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current opacity-50 [animation-delay:0.3s]" />
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={`shrink-0 border-t p-3 ${dark ? "border-white/10" : "border-gray-200"}`}>
          <div className="flex items-end gap-2">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
              placeholder="Type a message..."
              className={`${inputClass} resize-none`}
              disabled={loading}
            />
            <button
              onClick={onSend}
              disabled={loading || !input.trim()}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold transition active:scale-95 disabled:opacity-50 ${
                dark ? "bg-white text-black" : "bg-black text-white"
              }`}
            >
              {loading ? <FiLoader className="animate-spin" /> : <FiSend />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}