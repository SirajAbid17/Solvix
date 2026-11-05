import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FiCpu,
  FiCode,
  FiEdit3,
  FiFileText,
  FiMic,
  FiSearch,
  FiZap,
  FiStar,
  FiImage,
  FiMessageSquare,
  FiLayers,
  FiBriefcase,
  FiMap,
  FiClock,
  FiChevronRight,
  FiChevronDown,
  FiChevronUp,
  FiExternalLink,
  FiCheckCircle,
  FiTrendingUp,
  FiAward,
  FiPlus,
  FiX,
  FiSend,
  FiTrash2,
  FiEdit2,
  FiCopy,
  FiCheck,
  FiAlertTriangle,
  FiLoader,
} from "react-icons/fi";


export const AGENT_CATEGORIES = [
  { id: "general", label: "General", Icon: FiCpu },
  { id: "coding", label: "Coding", Icon: FiCode },
  { id: "writing", label: "Writing", Icon: FiEdit3 },
  { id: "resume", label: "Resume / CV", Icon: FiFileText },
  { id: "interview", label: "Interview Prep", Icon: FiMic },
  { id: "research", label: "Research", Icon: FiSearch },
  { id: "productivity", label: "Productivity", Icon: FiZap },
  { id: "custom", label: "Custom", Icon: FiStar },
];


export const AGENT_MODELS = [
  { id: "openai/gpt-oss-20b", label: "GPT-OSS 20B", provider: "Groq", badge: "Default", desc: "Fastest · 1000 t/s" },
  { id: "openai/gpt-oss-120b", label: "GPT-OSS 120B", provider: "Groq", desc: "Deep reasoning · 500 t/s" },
  { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B", provider: "Groq", desc: "Balanced · 280 t/s" },
  { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B", provider: "Groq", desc: "Instant · 560 t/s" },
  { id: "gemini-1.5-flash", label: "Gemini 1.5 Flash", provider: "Google", desc: "Light coding" },
  { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro", provider: "Google", desc: "Advanced reasoning" },
];


export const PROMPT_TEMPLATES = [
  {
    id: "resume-reviewer",
    label: "Resume Reviewer",
    description: "Reviews resumes like a senior recruiter.",
    systemPrompt:
      "You are a senior technical recruiter with 15 years of experience. Review resumes critically, highlight strengths, weaknesses, ATS issues, and give concrete rewrite suggestions.",
  },
  {
    id: "code-reviewer",
    label: "Code Reviewer",
    description: "Reviews code for bugs, style, and performance.",
    systemPrompt:
      "You are a strict but fair senior software engineer. Review code for bugs, edge cases, readability, and performance. Suggest concrete improvements with examples.",
  },
  {
    id: "interview-coach",
    label: "Interview Coach",
    description: "Conducts mock interviews and gives feedback.",
    systemPrompt:
      "You are an interview coach. Ask one behavioural or technical question at a time, wait for the answer, then give honest, actionable feedback and a score out of 10.",
  },
  {
    id: "portfolio-writer",
    label: "Portfolio Writer",
    description: "Writes portfolio copy for developers.",
    systemPrompt:
      "You are a senior copywriter specialising in developer portfolios. Write concise, modern, benefit-driven portfolio copy with strong verbs and no fluff.",
  },
];

export const FREE_MODELS = [
  { id: "free-chat", label: "Free Chat", description: "Unlimited chat with our base AI", Icon: FiMessageSquare, path: "/" },
  { id: "search", label: "Web Search", description: "Real-time web search agent", Icon: FiSearch, path: "/" },
  { id: "image", label: "Image Generation", description: "Generate images from text", Icon: FiImage, path: "/" },
  { id: "coding", label: "Coding", description: "Debug, build & explain code", Icon: FiCode, path: "/" },
  { id: "pdf", label: "PDF Chat", description: "Chat with your PDFs", Icon: FiFileText, path: "/" },
  { id: "ppt", label: "PPT Generator", description: "Auto-generate slide decks", Icon: FiLayers, path: "/" },
  { id: "pdf-analysis", label: "PDF Analysis", description: "Summarise & analyse documents", Icon: FiTrendingUp, path: "/" },
];

export const PAID_MODELS = [
  { id: "resume", label: "Resume Builder", description: "AI-crafted ATS resumes", Icon: FiFileText, path: "/resume", badge: "Pro" },
  { id: "resume-analysis", label: "Resume Analysis", description: "Get a full ATS report", Icon: FiAward, path: "/resume-analysis", badge: "Pro" },
  { id: "cv-generator", label: "CV Generator", description: "Long-form CV in one click", Icon: FiEdit3, path: "/cv-generator", badge: "Pro" },
  { id: "portfolio", label: "CV → Portfolio", description: "Turn your CV into a website", Icon: FiBriefcase, path: "/portfolio", badge: "Pro" },
  { id: "mock-interview-paid", label: "CV → Mock Interview", description: "Interview based on your CV", Icon: FiMic, path: "/mock-interview", badge: "Pro" },
];

export const defaultForm = {
  name: "",
  description: "",
  systemPrompt: "",
  category: "general",
  model: "openai/gpt-oss-20b",
  temperature: 0.7,
};


export function CustomDropdown({ value, onChange, options, dark, placeholder, icon: Icon }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-sm text-left transition-all duration-200 ${
          dark
            ? "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.06] hover:border-white/20"
            : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 hover:shadow-sm"
        } ${open ? (dark ? "border-white/30 bg-white/[0.08]" : "border-black ring-2 ring-black/5") : ""}`}
      >
        <div className="flex min-w-0 items-center gap-2">
          {Icon && (
            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                dark ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-600"
              }`}
            >
              <Icon className="text-[11px]" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            {selected ? (
              <>
                <p className={`truncate text-xs font-semibold ${dark ? "text-white" : "text-gray-900"}`}>
                  {selected.label}
                </p>
                {selected.subLabel && (
                  <p className={`truncate text-[10px] ${dark ? "text-gray-500" : "text-gray-500"}`}>
                    {selected.subLabel}
                  </p>
                )}
              </>
            ) : (
              <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>{placeholder}</p>
            )}
          </div>
        </div>
        <FiChevronDown
          className={`shrink-0 text-sm transition-transform duration-200 ${open ? "rotate-180" : ""} ${
            dark ? "text-gray-400" : "text-gray-500"
          }`}
        />
      </button>

      {open && (
        <div
          className={`absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-xl border shadow-2xl ${
            dark ? "border-white/10 bg-[#0a0a0a] backdrop-blur-xl" : "border-gray-200 bg-white"
          }`}
          style={{ animation: "dropdownIn 0.15s ease-out" }}
        >
          <div className="p-1.5">
            {options.map((opt) => {
              const OptIcon = opt.icon;
              const isActive = opt.value === value;

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all duration-150 ${
                    isActive
                      ? dark
                        ? "bg-white/10"
                        : "bg-gray-100"
                      : dark
                      ? "hover:bg-white/[0.06]"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {OptIcon && (
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                        isActive
                          ? dark
                            ? "bg-white text-black"
                            : "bg-black text-white"
                          : dark
                          ? "bg-white/[0.06] text-gray-400"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <OptIcon className="text-xs" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p
                        className={`truncate text-xs font-semibold ${
                          isActive
                            ? dark
                              ? "text-white"
                              : "text-black"
                            : dark
                            ? "text-gray-200"
                            : "text-gray-900"
                        }`}
                      >
                        {opt.label}
                      </p>
                      {opt.badge && (
                        <span
                          className={`rounded px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                            dark ? "bg-emerald-500/20 text-emerald-300" : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    {opt.subLabel && (
                      <p className={`truncate text-[10px] ${dark ? "text-gray-500" : "text-gray-500"}`}>
                        {opt.subLabel}
                      </p>
                    )}
                  </div>
                  {isActive && (
                    <FiCheck className={`shrink-0 text-sm ${dark ? "text-emerald-400" : "text-emerald-600"}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


export function ConfirmModal({
  dark,
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
  variant = "danger",
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, loading, onCancel]);

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  useGSAP(
    () => {
      if (!open) return;
      gsap.from(".cm-box", { opacity: 0, y: 30, scale: 0.95, duration: 0.3, ease: "power3.out" });
      gsap.from(".cm-backdrop", { opacity: 0, duration: 0.2 });
    },
    { scope: modalRef, dependencies: [open] }
  );

  if (!open) return null;

  const isDanger = variant === "danger";

  return (
    <div ref={modalRef} className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div
        className="cm-backdrop absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => !loading && onCancel()}
      />

      <div
        className={`cm-box relative w-full max-w-md overflow-hidden rounded-2xl border p-6 shadow-2xl ${
          dark ? "bg-[#0a0a0a] border-white/10 text-white" : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        <div
          className={`pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 ${
            dark
              ? "bg-gradient-to-r from-transparent via-white/30 to-transparent"
              : "bg-gradient-to-r from-transparent via-black/20 to-transparent"
          }`}
        />

        <div className="flex items-start gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
              isDanger
                ? dark
                  ? "bg-red-500/15 text-red-400"
                  : "bg-red-50 text-red-600 border border-red-200"
                : dark
                ? "bg-amber-500/15 text-amber-400"
                : "bg-amber-50 text-amber-600 border border-amber-200"
            }`}
          >
            <FiAlertTriangle className="text-xl" />
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <h3 className={`text-base font-bold sm:text-lg ${dark ? "text-white" : "text-gray-900"}`}>
              {title}
            </h3>
            <p className={`mt-1.5 text-sm leading-6 ${dark ? "text-gray-400" : "text-gray-600"}`}>
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition active:scale-95 disabled:opacity-50 ${
              dark
                ? "bg-white/[0.05] hover:bg-white/15 text-gray-200"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-95 disabled:opacity-60 ${
              isDanger
                ? "bg-red-500 text-white hover:bg-red-600"
                : dark
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <FiTrash2 className="text-sm" />
                {confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


export function LoadingState({ dark }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
      {[1, 2].map((i) => (
        <div
          key={i}
          className={`animate-pulse rounded-2xl border p-5 ${
            dark ? "border-white/10 bg-white/[0.02]" : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className={`h-11 w-11 rounded-xl ${dark ? "bg-white/10" : "bg-gray-200"}`} />
            <div className="flex gap-1">
              <div className={`h-7 w-7 rounded-lg ${dark ? "bg-white/10" : "bg-gray-200"}`} />
              <div className={`h-7 w-7 rounded-lg ${dark ? "bg-white/10" : "bg-gray-200"}`} />
            </div>
          </div>
          <div className={`mt-3 h-4 w-2/3 rounded ${dark ? "bg-white/10" : "bg-gray-200"}`} />
          <div className={`mt-2 h-3 w-full rounded ${dark ? "bg-white/10" : "bg-gray-200"}`} />
          <div className="mt-3 flex gap-1.5">
            <div className={`h-5 w-16 rounded ${dark ? "bg-white/10" : "bg-gray-200"}`} />
            <div className={`h-5 w-20 rounded ${dark ? "bg-white/10" : "bg-gray-200"}`} />
          </div>
          <div className={`mt-4 h-9 w-full rounded-xl ${dark ? "bg-white/10" : "bg-gray-200"}`} />
        </div>
      ))}
    </div>
  );
}


export function Benefit({ dark, Icon, title, text }) {
  return (
    <div
      className={`sa-benefit group flex items-start gap-3 rounded-xl border p-3 transition-all duration-300 ${
        dark
          ? "border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 ${
          dark ? "bg-white/[0.06] text-gray-200" : "bg-gray-100 text-gray-700"
        }`}
      >
        <Icon className="text-sm" />
      </div>
      <div className="min-w-0">
        <p className={`text-xs font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{title}</p>
        <p className={`mt-0.5 text-[11px] leading-5 ${dark ? "text-gray-400" : "text-gray-500"}`}>{text}</p>
      </div>
    </div>
  );
}

export function CategoryChip({ active, onClick, dark, Icon, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`group inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
        active
          ? dark
            ? "bg-white text-black border-white shadow-[0_5px_20px_rgba(255,255,255,0.15)]"
            : "bg-black text-white border-black shadow-[0_5px_20px_rgba(0,0,0,0.15)]"
          : dark
          ? "bg-white/[0.03] text-gray-300 border-white/10 hover:bg-white/[0.08] hover:border-white/20"
          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
      }`}
    >
      {Icon && <Icon className="text-sm" />}
      {label}
      {typeof count === "number" && (
        <span
          className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
            active
              ? dark
                ? "bg-black/10 text-black"
                : "bg-white/20 text-white"
              : dark
              ? "bg-white/10 text-gray-400"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export function Badge({ children, dark }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium ${
        dark
          ? "bg-white/[0.05] text-gray-400 border border-white/[0.06]"
          : "bg-gray-50 text-gray-600 border border-gray-200"
      }`}
    >
      {children}
    </span>
  );
}


export function IconBtn({ children, onClick, dark, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200 sm:h-7 sm:w-7 ${
        dark
          ? "bg-white/[0.05] hover:bg-white/15 text-gray-300 hover:text-white"
          : "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );
}

export function AgentCard({ agent, dark, onChat, onEdit, onDelete }) {
  const cat = AGENT_CATEGORIES.find((c) => c.id === agent.category);
  const model = AGENT_MODELS.find((m) => m.id === agent.model);
  const CatIcon = cat?.Icon || FiCpu;

  return (
    <div
      className={`sa-card group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 sm:p-5 ${
        dark
          ? "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-white/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
          : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
      }`}
    >
      <div
        className={`pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 ${
          dark
            ? "bg-gradient-to-r from-transparent via-white/30 to-transparent"
            : "bg-gradient-to-r from-transparent via-black/20 to-transparent"
        }`}
      />

      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110 sm:h-11 sm:w-11 ${
            dark ? "bg-white/[0.06] border-white/10 text-gray-200" : "bg-gray-50 border-gray-200 text-gray-700"
          }`}
        >
          <CatIcon className="text-base sm:text-lg" />
        </div>

        <div className="flex gap-1 opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
          <IconBtn dark={dark} onClick={onEdit} title="Edit">
            <FiEdit2 className="text-xs" />
          </IconBtn>
          <IconBtn dark={dark} onClick={onDelete} title="Delete">
            <FiTrash2 className="text-xs" />
          </IconBtn>
        </div>
      </div>

      <h3 className={`mt-3 truncate text-[15px] font-semibold sm:text-base ${dark ? "text-white" : "text-gray-900"}`}>
        {agent.name}
      </h3>
      <p className={`mt-1 line-clamp-2 text-xs leading-5 ${dark ? "text-gray-400" : "text-gray-500"}`}>
        {agent.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge dark={dark}>
          <CatIcon className="text-[10px]" />
          {cat?.label}
        </Badge>
        <Badge dark={dark}>{model?.label || agent.model}</Badge>
        <Badge dark={dark}>T {agent.temperature}</Badge>
      </div>

      <button
        onClick={onChat}
        className={`group/btn mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-300 active:scale-95 ${
          dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        <FiMessageSquare className="text-sm" />
        <span className="truncate">Chat with {agent.name}</span>
        <FiChevronRight className="shrink-0 text-sm transition-transform duration-300 group-hover/btn:translate-x-0.5" />
      </button>
    </div>
  );
}


export function EmptyState({ dark, onCreate }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-12 text-center sm:px-6 sm:py-16 ${
        dark ? "border-white/10 bg-white/[0.01]" : "border-gray-300 bg-white"
      }`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl sm:h-14 sm:w-14 ${
          dark ? "bg-white/[0.05] text-gray-400" : "bg-gray-100 text-gray-600"
        }`}
      >
        <FiCpu className="text-xl sm:text-2xl" />
      </div>
      <h3 className={`mt-4 text-base font-semibold sm:text-lg ${dark ? "text-white" : "text-gray-900"}`}>
        No agents yet
      </h3>
      <p className={`mt-1 text-xs sm:text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
        Create your first custom AI agent to get started.
      </p>
      <button
        onClick={onCreate}
        className={`mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-95 ${
          dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        <FiPlus /> Create Agent
      </button>
    </div>
  );
}


export function Tab({ active, onClick, dark, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-lg px-3 py-2 text-[11px] font-semibold transition-all duration-300 sm:text-xs ${
        active
          ? dark
            ? "bg-white text-black shadow-sm"
            : "bg-black text-white shadow-sm"
          : dark
          ? "text-gray-400 hover:text-white"
          : "text-gray-500 hover:text-gray-900"
      }`}
    >
      {label}
    </button>
  );
}


export function ModelRow({ model, dark }) {
  const { label, description, Icon, path, badge } = model;

  return (
    <a
      href={path}
      className={`sa-model-row group flex items-center gap-3 rounded-xl border p-2.5 transition-all duration-300 active:scale-[0.98] sm:p-3 ${
        dark
          ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 ${
          dark ? "bg-white/[0.06] text-gray-200" : "bg-gray-100 text-gray-700"
        }`}
      >
        <Icon className="text-sm" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className={`truncate text-xs font-semibold ${dark ? "text-white" : "text-gray-900"}`}>
            {label}
          </p>
          {badge && (
            <span
              className={`rounded px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                dark ? "bg-amber-500/15 text-amber-300" : "bg-amber-100 text-amber-700"
              }`}
            >
              {badge}
            </span>
          )}
        </div>
        <p className={`truncate text-[10px] ${dark ? "text-gray-500" : "text-gray-500"}`}>
          {description}
        </p>
      </div>

      <FiChevronRight
        className={`shrink-0 text-sm transition-transform duration-300 group-hover:translate-x-0.5 ${
          dark ? "text-gray-500" : "text-gray-400"
        }`}
      />
    </a>
  );
}


export function AgentFormModal({
  dark,
  form,
  setForm,
  errors,
  editingAgent,
  onSave,
  onClose,
  inputClass,
  labelClass,
  saving,
}) {
  const modalRef = useRef(null);

  useGSAP(
    () => {
      gsap.from(".fm-box", { opacity: 0, y: 30, scale: 0.96, duration: 0.5, ease: "power3.out" });
      gsap.from(".fm-row", { opacity: 0, y: 10, duration: 0.4, stagger: 0.04, ease: "power2.out", delay: 0.15 });
    },
    { scope: modalRef }
  );

  const applyTemplate = (tpl) => {
    setForm((f) => ({
      ...f,
      systemPrompt: tpl.systemPrompt,
      name: f.name || tpl.label,
      description: f.description || tpl.description,
    }));
  };

  const categoryOptions = AGENT_CATEGORIES.map((c) => ({
    value: c.id,
    label: c.label,
    icon: c.Icon,
  }));

  const modelOptions = AGENT_MODELS.map((m) => ({
    value: m.id,
    label: m.label,
    subLabel: `${m.provider}${m.desc ? " · " + m.desc : ""}`,
    badge: m.badge,
  }));

  const selectedModel = AGENT_MODELS.find((m) => m.id === form.model);

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div
        className={`fm-box relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border p-4 shadow-2xl sm:max-h-[90vh] sm:rounded-2xl sm:p-6 ${
          dark ? "bg-[#0a0a0a] border-white/10 text-white" : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        <div
          className={`pointer-events-none absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 ${
            dark
              ? "bg-gradient-to-r from-transparent via-white/30 to-transparent"
              : "bg-gradient-to-r from-transparent via-black/20 to-transparent"
          }`}
        />

        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-current opacity-20 sm:hidden" />

        <div className="flex shrink-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-bold sm:text-xl">{editingAgent ? "Edit Agent" : "Create Agent"}</h2>
            <p className={`mt-1 text-[11px] sm:text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>
              Give your agent a name, a system prompt, and a model.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm transition ${
              dark ? "bg-white/[0.05] hover:bg-white/15 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            } disabled:opacity-50`}
          >
            <FiX />
          </button>
        </div>

        <div className="mt-4 flex-1 space-y-4 overflow-y-auto pr-1 sm:mt-5">
          <div className="fm-row">
            <label className={labelClass}>Agent name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Resume Roaster"
              className={inputClass}
              disabled={saving}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="fm-row">
            <label className={labelClass}>Description *</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What does this agent do?"
              className={`${inputClass} resize-none`}
              disabled={saving}
            />
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
          </div>

          <div className="fm-row grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Category</label>
              <CustomDropdown
                value={form.category}
                onChange={(val) => setForm({ ...form, category: val })}
                options={categoryOptions}
                dark={dark}
                placeholder="Select category"
                icon={AGENT_CATEGORIES.find((c) => c.id === form.category)?.Icon}
              />
            </div>

            <div>
              <label className={labelClass}>Model</label>
              <CustomDropdown
                value={form.model}
                onChange={(val) => setForm({ ...form, model: val })}
                options={modelOptions}
                dark={dark}
                placeholder="Select model"
              />
            </div>

            {selectedModel && (
              <div className="sm:col-span-2">
                <div
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[11px] ${
                    dark
                      ? "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-300"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <span className="font-medium">Selected:</span>
                  <span className="font-semibold">{selectedModel.label}</span>
                  <span className="opacity-60">·</span>
                  <span className="opacity-80">{selectedModel.provider}</span>
                  {selectedModel.desc && (
                    <>
                      <span className="opacity-60">·</span>
                      <span className="opacity-80">{selectedModel.desc}</span>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="sm:col-span-2">
              <label className={labelClass}>
                Temperature: <span className={dark ? "text-white" : "text-black"}>{form.temperature}</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={form.temperature}
                onChange={(e) => setForm({ ...form, temperature: parseFloat(e.target.value) })}
                className="w-full accent-black"
                disabled={saving}
              />
              <div className="mt-1 flex justify-between text-[10px] text-gray-500">
                <span>Precise</span>
                <span>Balanced</span>
                <span>Creative</span>
              </div>
            </div>
          </div>

          <div className="fm-row">
            <div className="flex items-center justify-between">
              <label className={labelClass}>System prompt *</label>
              <span className={`text-[10px] ${dark ? "text-gray-500" : "text-gray-400"}`}>
                {form.systemPrompt.length} chars
              </span>
            </div>
            <textarea
              rows={5}
              value={form.systemPrompt}
              onChange={(e) => setForm({ ...form, systemPrompt: e.target.value })}
              placeholder="You are a... Your job is to..."
              className={`${inputClass} resize-none font-mono text-xs leading-5`}
              disabled={saving}
            />
            {errors.systemPrompt && <p className="mt-1 text-xs text-red-500">{errors.systemPrompt}</p>}

            <div className="mt-3">
              <p className={`text-[10px] uppercase tracking-wider ${dark ? "text-gray-500" : "text-gray-400"}`}>
                Templates
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {PROMPT_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => applyTemplate(t)}
                    disabled={saving}
                    className={`rounded-md border px-2 py-1 text-[10px] font-medium transition ${
                      dark
                        ? "border-white/10 bg-white/[0.04] hover:bg-white/10 text-gray-300"
                        : "border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700"
                    } disabled:opacity-50`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-4 flex shrink-0 flex-col-reverse gap-2 border-t pt-4 sm:mt-6 sm:flex-row sm:justify-end sm:border-0 sm:pt-0"
          style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}
        >
          <button
            onClick={onClose}
            disabled={saving}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition active:scale-95 disabled:opacity-50 ${
              dark ? "bg-white/[0.05] hover:bg-white/15 text-gray-200" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-95 disabled:opacity-50 ${
              dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {saving && <FiLoader className="animate-spin" />}
            {saving ? "Saving..." : editingAgent ? "Save Changes" : "Create Agent"}
          </button>
        </div>
      </div>
    </div>
  );
}