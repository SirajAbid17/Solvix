import React, { useState } from "react";
import {
  FiCpu,
  FiCode,
  FiEdit3,
  FiFileText,
  FiMic,
  FiSearch,
  FiImage,
  FiMessageSquare,
  FiLayers,
  FiBriefcase,
  FiMap,
  FiClock,
  FiChevronRight,
  FiExternalLink,
  FiCheckCircle,
  FiTrendingUp,
  FiAward,
  FiStar,
} from "react-icons/fi";
import { FREE_MODELS, PAID_MODELS, Tab, ModelRow } from "./AgentComponents";

export default function AgentSidebar({ dark }) {
  const [activeTab, setActiveTab] = useState("free");
  const textPrimary = dark ? "text-white" : "text-gray-900";
  const textSecondary = dark ? "text-gray-400" : "text-gray-500";

  return (
    <section className="sa-sidebar w-full shrink-0 space-y-4 lg:sticky lg:top-24 lg:w-[340px] lg:self-start xl:w-[360px]">
      <div className="lg:hidden">
        <h1
          className={`text-xl font-bold tracking-tight sm:text-2xl ${textPrimary}`}
        >
          Explore AI Agents
        </h1>
        <p className={`mt-1 text-xs sm:text-sm ${textSecondary}`}>
          Free and premium tools in one place.
        </p>
      </div>

      <div
        className={`flex gap-1 rounded-xl border p-1 ${
          dark ? "border-white/10 bg-white/[0.03]" : "border-gray-200 bg-white"
        }`}
      >
        <Tab
          active={activeTab === "free"}
          onClick={() => setActiveTab("free")}
          dark={dark}
          label="Free Models"
        />
        <Tab
          active={activeTab === "paid"}
          onClick={() => setActiveTab("paid")}
          dark={dark}
          label="Career Tools"
        />
      </div>

      <div className="space-y-2">
        {activeTab === "free"
          ? FREE_MODELS.map((m) => <ModelRow key={m.id} model={m} dark={dark} />)
          : PAID_MODELS.map((m) => <ModelRow key={m.id} model={m} dark={dark} />)}
      </div>

     
      <div
        className={`sa-model-row relative overflow-hidden rounded-2xl border p-4 ${
          dark
            ? "border-white/10 bg-white/[0.03]"
            : "border-gray-200 bg-white"
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              dark ? "bg-black text-white" : "bg-black text-white"
            }`}
          >
            <FiClock />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className={`text-sm font-semibold ${textPrimary}`}>
                Auto-Job Apply
              </h3>
              <span
                className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                  dark
                    ? "bg-white/10 text-white"
                    : "bg-black text-white"
                }`}
              >
                24h
              </span>
            </div>
            <p className={`mt-1 text-[11px] leading-5 ${textSecondary}`}>
              Find & auto-apply to jobs. Available once every 24 hours.
            </p>
          </div>
        </div>
        <a
          href="/autoapply"
          className={`mt-3 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition active:scale-95 ${
            dark
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          Open Auto-Apply <FiExternalLink className="text-[10px]" />
        </a>
      </div>

     
      <div
        className={`sa-model-row relative overflow-hidden rounded-2xl border p-4 ${
          dark ? "border-white/10 bg-white/[0.03]" : "border-gray-200 bg-white"
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              dark ? "bg-black text-white" : "bg-black text-white"
            }`}
          >
            <FiMap />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className={`text-sm font-semibold ${textPrimary}`}>
              Career Roadmap
            </h3>
            <p className={`mt-1 text-[11px] leading-5 ${textSecondary}`}>
              Ask any skill roadmap — get YouTube videos, notes & steps.
            </p>
          </div>
        </div>
        <a
          href="/roadmap"
          className={`mt-3 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition active:scale-95 ${
            dark
              ? "bg-white/[0.06] text-white hover:bg-white/15"
              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
          }`}
        >
          Open Roadmap <FiExternalLink className="text-[10px]" />
        </a>
      </div>

      
      <div
        className={`sa-model-row relative overflow-hidden rounded-2xl border p-4 ${
          dark
            ? "border-white/10 bg-white/[0.03]"
            : "border-gray-200 bg-white"
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              dark ? "bg-black text-white" : "bg-black text-white"
            }`}
          >
            <FiStar />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className={`text-sm font-semibold ${textPrimary}`}>
                Why Solvix AI?
              </h3>
              <span
                className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                  dark ? "bg-white/10 text-white" : "bg-black text-white"
                }`}
              >
                Free
              </span>
            </div>
            <ul
              className={`mt-2 space-y-1.5 text-[11px] leading-5 ${textSecondary}`}
            >
              <li className="flex items-start gap-1.5">
                <FiCheckCircle className="mt-0.5 shrink-0 text-[10px] text-black dark:text-white" />
                <span>Unlimited custom AI agents with no hidden paywall</span>
              </li>
              <li className="flex items-start gap-1.5">
                <FiCheckCircle className="mt-0.5 shrink-0 text-[10px] text-black dark:text-white" />
                <span>Groq + Gemini models in one place</span>
              </li>
              <li className="flex items-start gap-1.5">
                <FiCheckCircle className="mt-0.5 shrink-0 text-[10px] text-black dark:text-white" />
                <span>No credit card required to get started</span>
              </li>
              <li className="flex items-start gap-1.5">
                <FiCheckCircle className="mt-0.5 shrink-0 text-[10px] text-black dark:text-white" />
                <span>Create, edit, delete agents anytime</span>
              </li>
              <li className="flex items-start gap-1.5">
                <FiCheckCircle className="mt-0.5 shrink-0 text-[10px] text-black dark:text-white" />
                <span>Prompt templates — start in seconds</span>
              </li>
              <li className="flex items-start gap-1.5">
                <FiCheckCircle className="mt-0.5 shrink-0 text-[10px] text-black dark:text-white" />
                <span>Fully responsive — works on all devices</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}