import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  FiCpu,
  FiChevronRight,
  FiChevronDown,
  FiCheck,
  FiAlertTriangle,
  FiLoader,
  FiTrash2,
  FiEdit2,
  FiMessageSquare,
  FiPlus,
  FiX,
} from "react-icons/fi";

import {
  AGENT_CATEGORIES,
  AGENT_MODELS,
  AGENT_TOOLS,
  PROMPT_TEMPLATES,
  FREE_MODELS,
  PAID_MODELS,
  defaultForm,
} from "./AgentConstants";

import { AgentFormModal } from "./AgentFormModal";

export {
  AGENT_CATEGORIES,
  AGENT_MODELS,
  AGENT_TOOLS,
  PROMPT_TEMPLATES,
  FREE_MODELS,
  PAID_MODELS,
  defaultForm,
  AgentFormModal,
};


export function CustomDropdown({
  value,
  onChange,
  options,
  dark,
  placeholder,
  icon: Icon,
}) {
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);
  const btnRef = useRef(null);
  const dropdownRef = useRef(null);

  const selected = options.find((o) => String(o.value) === String(value));

 
  useEffect(() => {
    if (!open) return;

    const handleClick = (e) => {
      const isInsideButton = ref.current?.contains(e.target);
      const isInsideDropdown = dropdownRef.current?.contains(e.target);

      if (!isInsideButton && !isInsideDropdown) {
        setOpen(false);
      }
    };

    
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClick);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [open]);

  
  useEffect(() => {
    if (!open) return;
    const updatePosition = () => {
      if (btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const dropdownHeight = 300;
        const placement = spaceBelow < dropdownHeight ? "top" : "bottom";
        setDropdownPos({
          top:
            placement === "bottom"
              ? rect.bottom + 8
              : Math.max(8, rect.top - dropdownHeight - 8),
          left: rect.left,
          width: rect.width,
        });
      }
    };
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  const handleSelect = (val) => {
    
    onChange(val);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className={`group w-full flex items-center justify-between gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm text-left transition-all duration-200 ${
          dark
            ? "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.06] hover:border-white/20"
            : "border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:shadow-sm"
        } ${
          open
            ? dark
              ? "border-white/30 bg-white/[0.06] ring-2 ring-white/10"
              : "border-black/30 bg-white ring-2 ring-black/5"
            : ""
        }`}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black text-white">
            {Icon ? (
              <Icon className="text-[12px]" />
            ) : (
              <FiCpu className="text-[12px]" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            {selected ? (
              <>
                <p
                  className={`truncate text-[13px] font-semibold ${
                    dark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {selected.label}
                </p>
                {selected.subLabel && (
                  <p
                    className={`truncate text-[10px] ${
                      dark ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    {selected.subLabel}
                  </p>
                )}
              </>
            ) : (
              <p
                className={`text-[13px] ${
                  dark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {placeholder}
              </p>
            )}
          </div>
        </div>
        <FiChevronDown
          className={`shrink-0 text-sm transition-transform duration-200 ${
            open ? "rotate-180" : ""
          } ${dark ? "text-gray-400" : "text-gray-500"}`}
        />
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            
            <div
              className="fixed inset-0 z-[99998]"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(false);
              }}
            />

          
            <div
              ref={dropdownRef}
              className={`fixed z-[99999] max-h-72 overflow-y-auto rounded-xl border shadow-2xl ${
                dark
                  ? "border-white/10 bg-[#0f0f0f]"
                  : "border-gray-200 bg-white"
              }`}
              style={{
                top: `${dropdownPos.top}px`,
                left: `${dropdownPos.left}px`,
                width: `${dropdownPos.width}px`,
                animation: "dropdownIn 0.15s ease-out",
                boxShadow: dark
                  ? "0 25px 50px -12px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.08)"
                  : "0 25px 50px -12px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.05)",
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="p-1.5">
                {options.map((opt) => {
                  const OptIcon = opt.icon;
                  const isActive = String(opt.value) === String(value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSelect(opt.value);
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
                              ? "bg-black text-white"
                              : "bg-black/80 text-white"
                          }`}
                        >
                          <OptIcon className="text-xs" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p
                            className={`truncate text-[12px] font-semibold ${
                              isActive
                                ? dark
                                  ? "text-white"
                                  : "text-gray-900"
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
                                dark
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : "bg-emerald-100 text-emerald-700"
                              }`}
                            >
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        {opt.subLabel && (
                          <p
                            className={`truncate text-[10px] ${
                              dark ? "text-gray-500" : "text-gray-500"
                            }`}
                          >
                            {opt.subLabel}
                          </p>
                        )}
                      </div>
                      {isActive && (
                        <FiCheck
                          className={`shrink-0 text-sm ${
                            dark ? "text-white" : "text-black"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>,
          document.body
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
      gsap.from(".cm-box", {
        opacity: 0,
        y: 30,
        scale: 0.95,
        duration: 0.3,
        ease: "power3.out",
      });
      gsap.from(".cm-backdrop", { opacity: 0, duration: 0.2 });
    },
    { scope: modalRef, dependencies: [open] }
  );

  if (!open) return null;

  const isDanger = variant === "danger";

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    >
      <div
        className="cm-backdrop absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={() => !loading && onCancel()}
      />
      <div
        className={`cm-box relative w-full max-w-md overflow-hidden rounded-2xl border p-6 shadow-2xl ${
          dark
            ? "bg-[#0a0a0a] border-white/10 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }`}
      >
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
            <h3
              className={`text-base font-bold sm:text-lg ${
                dark ? "text-white" : "text-gray-900"
              }`}
            >
              {title}
            </h3>
            <p
              className={`mt-1.5 text-sm leading-6 ${
                dark ? "text-gray-400" : "text-gray-600"
              }`}
            >
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
            dark
              ? "border-white/10 bg-white/[0.02]"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex items-start justify-between">
            <div
              className={`h-11 w-11 rounded-xl ${
                dark ? "bg-white/10" : "bg-gray-200"
              }`}
            />
            <div className="flex gap-1">
              <div
                className={`h-7 w-7 rounded-lg ${
                  dark ? "bg-white/10" : "bg-gray-200"
                }`}
              />
              <div
                className={`h-7 w-7 rounded-lg ${
                  dark ? "bg-white/10" : "bg-gray-200"
                }`}
              />
            </div>
          </div>
          <div
            className={`mt-3 h-4 w-2/3 rounded ${
              dark ? "bg-white/10" : "bg-gray-200"
            }`}
          />
          <div
            className={`mt-2 h-3 w-full rounded ${
              dark ? "bg-white/10" : "bg-gray-200"
            }`}
          />
          <div className="mt-3 flex gap-1.5">
            <div
              className={`h-5 w-16 rounded ${
                dark ? "bg-white/10" : "bg-gray-200"
              }`}
            />
            <div
              className={`h-5 w-20 rounded ${
                dark ? "bg-white/10" : "bg-gray-200"
              }`}
            />
          </div>
          <div
            className={`mt-4 h-9 w-full rounded-xl ${
              dark ? "bg-white/10" : "bg-gray-200"
            }`}
          />
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
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black text-white transition-transform duration-300 group-hover:scale-110">
        <Icon className="text-sm" />
      </div>
      <div className="min-w-0">
        <p
          className={`text-xs font-semibold ${
            dark ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </p>
        <p
          className={`mt-0.5 text-[11px] leading-5 ${
            dark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {text}
        </p>
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
  const agentTools = Array.isArray(agent.tools) ? agent.tools : ["chat"];

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
            dark
              ? "bg-black border-white/10 text-white"
              : "bg-black border-gray-900 text-white"
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

      <h3
        className={`mt-3 truncate text-[15px] font-semibold sm:text-base ${
          dark ? "text-white" : "text-gray-900"
        }`}
      >
        {agent.name}
      </h3>
      <p
        className={`mt-1 line-clamp-2 text-xs leading-5 ${
          dark ? "text-gray-400" : "text-gray-500"
        }`}
      >
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

      {agentTools.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {agentTools.slice(0, 4).map((toolId) => {
            const tool = AGENT_TOOLS.find((t) => t.id === toolId);
            if (!tool) return null;
            const ToolIcon = tool.Icon;
            return (
              <span
                key={toolId}
                title={tool.label}
                className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[9px] font-medium ${
                  dark
                    ? "border-white/10 bg-white/[0.04] text-gray-300"
                    : "border-gray-200 bg-gray-50 text-gray-600"
                }`}
              >
                <span className="flex h-4 w-4 items-center justify-center rounded bg-black text-white">
                  <ToolIcon className="text-[8px]" />
                </span>
                {tool.label}
              </span>
            );
          })}
          {agentTools.length > 4 && (
            <span
              className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[9px] font-medium ${
                dark
                  ? "border-white/10 bg-white/[0.04] text-gray-400"
                  : "border-gray-200 bg-gray-50 text-gray-500"
              }`}
            >
              +{agentTools.length - 4}
            </span>
          )}
        </div>
      )}

      <button
        onClick={onChat}
        className={`group/btn mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-300 active:scale-95 ${
          dark
            ? "bg-white text-black hover:bg-gray-200"
            : "bg-black text-white hover:bg-gray-800"
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
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white sm:h-14 sm:w-14">
        <FiCpu className="text-xl sm:text-2xl" />
      </div>
      <h3
        className={`mt-4 text-base font-semibold sm:text-lg ${
          dark ? "text-white" : "text-gray-900"
        }`}
      >
        No agents yet
      </h3>
      <p
        className={`mt-1 text-xs sm:text-sm ${
          dark ? "text-gray-400" : "text-gray-500"
        }`}
      >
        Create your first custom AI agent to get started.
      </p>
      <button
        onClick={onCreate}
        className={`mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-95 ${
          dark
            ? "bg-white text-black hover:bg-gray-200"
            : "bg-black text-white hover:bg-gray-800"
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
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black text-white transition-transform duration-300 group-hover:scale-110">
        <Icon className="text-sm" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p
            className={`truncate text-xs font-semibold ${
              dark ? "text-white" : "text-gray-900"
            }`}
          >
            {label}
          </p>
          {badge && (
            <span
              className={`rounded px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                dark
                  ? "bg-amber-500/15 text-amber-300"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {badge}
            </span>
          )}
        </div>
        <p
          className={`truncate text-[10px] ${
            dark ? "text-gray-500" : "text-gray-500"
          }`}
        >
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