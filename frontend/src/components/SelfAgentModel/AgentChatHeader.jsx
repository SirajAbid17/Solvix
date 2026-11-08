import React from "react";
import { FiX, FiCheckCircle, FiCpu } from "react-icons/fi";
import { AGENT_CATEGORIES, AGENT_MODELS } from "./AgentComponents";

export default function AgentChatHeader({ dark, agent, onClose }) {
  const CatIcon =
    AGENT_CATEGORIES.find((c) => c.id === agent.category)?.Icon || FiCpu;
  const model = AGENT_MODELS.find((m) => m.id === agent.model);

  return (
    <div
      className={`cd-header relative flex shrink-0 items-center justify-between border-b px-5 py-4 ${
        dark
          ? "border-white/[0.06] bg-white/[0.02]"
          : "border-gray-200/80 bg-gray-50/60"
      } backdrop-blur-xl`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 opacity-20 blur-md" />
          <div
            className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-lg ${
              dark
                ? "border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] text-emerald-400"
                : "border-gray-200 bg-gradient-to-br from-white to-gray-50 text-emerald-600"
            }`}
          >
            <CatIcon className="text-lg" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0a0a0a]" />
          </span>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p
              className={`truncate text-sm font-bold tracking-tight ${
                dark ? "text-white" : "text-gray-900"
              }`}
            >
              {agent.name}
            </p>
            <FiCheckCircle
              className={`shrink-0 text-xs ${
                dark ? "text-emerald-400" : "text-emerald-500"
              }`}
            />
          </div>
          <p
            className={`truncate text-[10px] font-medium tracking-wide ${
              dark ? "text-gray-500" : "text-gray-500"
            }`}
          >
            {model?.label || agent.model} · T {agent.temperature}
          </p>
        </div>
      </div>

      <button
        onClick={onClose}
        className={`group flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 active:scale-90 ${
          dark
            ? "bg-white/[0.04] text-gray-400 hover:bg-white/10 hover:text-white"
            : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900"
        }`}
        title="Close"
      >
        <FiX className="text-base transition-transform group-hover:rotate-90" />
      </button>
    </div>
  );
}