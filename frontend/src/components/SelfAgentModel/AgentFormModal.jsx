import React, { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FiX, FiCheck, FiMinus, FiLoader, FiCpu } from "react-icons/fi";

import {
  AGENT_CATEGORIES,
  AGENT_MODELS,
  AGENT_TOOLS,
  PROMPT_TEMPLATES,
} from "./AgentConstants";

import { CustomDropdown } from "./AgentComponents";

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
      gsap.from(".fm-box", {
        opacity: 0,
        y: 30,
        scale: 0.96,
        duration: 0.5,
        ease: "power3.out",
      });
      gsap.from(".fm-row", {
        opacity: 0,
        y: 10,
        duration: 0.4,
        stagger: 0.04,
        ease: "power2.out",
        delay: 0.15,
      });
    },
    { scope: modalRef }
  );

  useEffect(() => {
    const isValid = AGENT_MODELS.some((m) => m.id === form?.model);
    if (!isValid) {
      console.warn(" Invalid model, resetting:", form?.model);
      setForm((f) => ({ ...f, model: AGENT_MODELS[0].id }));
    }
  }, [form?.model, setForm]);

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
    icon: FiCpu,
  }));

  const selectedModel = AGENT_MODELS.find(
    (m) => String(m.id) === String(form?.model)
  );

 
  

  const toggleTool = (toolId) => {
    setForm((f) => {
      const current = Array.isArray(f.tools) ? f.tools : ["chat"];
      const exists = current.includes(toolId);
      if (toolId === "chat" && exists) return f;
      const next = exists
        ? current.filter((t) => t !== toolId)
        : [...current, toolId];
      if (!next.includes("chat")) next.unshift("chat");
      return { ...f, tools: next };
    });
  };

  const activeTools = Array.isArray(form?.tools) ? form.tools : ["chat"];

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div
        className={`fm-box relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-visible rounded-t-2xl border p-4 shadow-2xl sm:max-h-[90vh] sm:rounded-2xl sm:p-6 ${
          dark
            ? "bg-[#0a0a0a] border-white/10 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-current opacity-20 sm:hidden" />

        <div className="flex shrink-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-bold sm:text-xl">
              {editingAgent ? "Edit Agent" : "Create Agent"}
            </h2>
            <p
              className={`mt-1 text-[11px] sm:text-xs ${
                dark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Give your agent a name, a system prompt, a model, and pick its
              tools.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm transition ${
              dark
                ? "bg-white/[0.05] hover:bg-white/15 text-gray-300"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            } disabled:opacity-50`}
          >
            <FiX />
          </button>
        </div>

        <div className="mt-4 flex-1 space-y-4 overflow-y-auto pr-1 sm:mt-5">
          <div className="fm-row">
            <label className={labelClass}>Agent name *</label>
            <input
              value={form?.name || ""}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Resume Roaster"
              className={inputClass}
              disabled={saving}
            />
            {errors?.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="fm-row">
            <label className={labelClass}>Description *</label>
            <textarea
              rows={2}
              value={form?.description || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="What does this agent do?"
              className={`${inputClass} resize-none`}
              disabled={saving}
            />
            {errors?.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="fm-row grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Category</label>
              <CustomDropdown
                value={form?.category}
                onChange={(val) => {
                 
                  setForm((f) => {
                    const next = { ...f, category: val };
                    
                    return next;
                  });
                }}
                options={categoryOptions}
                dark={dark}
                placeholder="Select category"
                icon={AGENT_CATEGORIES.find((c) => c.id === form?.category)?.Icon}
              />
            </div>

            <div>
              <label className={labelClass}>Model</label>
              <CustomDropdown
                value={form?.model}
                onChange={(val) => {
                 
                  setForm((f) => {
                    const next = { ...f, model: val };
                   
                    return next;
                  });
                }}
                options={modelOptions}
                dark={dark}
                placeholder="Select model"
                icon={FiCpu}
              />
            </div>

            {selectedModel && (
              <div className="sm:col-span-2">
                <div
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[11px] ${
                    dark
                      ? "border-white/20 bg-white/[0.04] text-gray-300"
                      : "border-gray-300 bg-gray-50 text-gray-700"
                  }`}
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-black dark:bg-white" />
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
                Temperature:{" "}
                <span className={dark ? "text-white" : "text-black"}>
                  {form?.temperature}
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={form?.temperature ?? 0.7}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    temperature: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-black dark:accent-white"
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
            <div className="mb-1.5 flex items-center justify-between">
              <label className={labelClass}>Tools &amp; Capabilities</label>
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                  dark ? "bg-white/10 text-white" : "bg-black text-white"
                }`}
              >
                {activeTools.length} selected
              </span>
            </div>
            <p
              className={`mb-2 text-[11px] ${
                dark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Pick what this agent can do. Chat is always enabled.
            </p>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {AGENT_TOOLS.map((tool) => {
                const ToolIcon = tool.Icon;
                const isActive = activeTools.includes(tool.id);
                const isChat = tool.id === "chat";

                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => toggleTool(tool.id)}
                    disabled={saving || isChat}
                    className={`group relative flex items-start gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${
                      isActive
                        ? dark
                          ? "border-white/30 bg-white/[0.06]"
                          : "border-black/20 bg-gray-50"
                        : dark
                          ? "border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20"
                          : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300"
                    } ${
                      isChat
                        ? "cursor-default opacity-90"
                        : "active:scale-[0.98]"
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200 ${
                        isActive
                          ? dark
                            ? "bg-white border-white text-black"
                            : "bg-black border-black text-white"
                          : dark
                            ? "border-white/25 bg-transparent"
                            : "border-gray-300 bg-transparent group-hover:border-gray-400"
                      }`}
                    >
                      {isActive ? (
                        <FiCheck className="text-[12px]" strokeWidth={3} />
                      ) : (
                        <FiMinus
                          className={`text-[10px] opacity-30 ${
                            dark ? "text-gray-500" : "text-gray-400"
                          }`}
                          strokeWidth={3}
                        />
                      )}
                    </div>

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black text-white border border-black shadow-sm">
                      <ToolIcon className="text-sm" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p
                          className={`truncate text-[12px] font-semibold ${
                            dark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {tool.label}
                        </p>
                        {isChat && (
                          <span
                            className={`rounded px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                              dark
                                ? "bg-white/15 text-white"
                                : "bg-black text-white"
                            }`}
                          >
                            Always
                          </span>
                        )}
                      </div>
                      <p
                        className={`truncate text-[10px] ${
                          dark ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        {tool.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="fm-row">
            <div className="flex items-center justify-between">
              <label className={labelClass}>System prompt *</label>
              <span
                className={`text-[10px] ${
                  dark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {form?.systemPrompt?.length || 0} chars
              </span>
            </div>
            <textarea
              rows={5}
              value={form?.systemPrompt || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, systemPrompt: e.target.value }))
              }
              placeholder="You are a... Your job is to..."
              className={`${inputClass} resize-none font-mono text-xs leading-5`}
              disabled={saving}
            />
            {errors?.systemPrompt && (
              <p className="mt-1 text-xs text-red-500">{errors.systemPrompt}</p>
            )}

            <div className="mt-3">
              <p
                className={`text-[10px] uppercase tracking-wider ${
                  dark ? "text-gray-500" : "text-gray-400"
                }`}
              >
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
          style={{
            borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
          }}
        >
          <button
            onClick={onClose}
            disabled={saving}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition active:scale-95 disabled:opacity-50 ${
              dark
                ? "bg-white/[0.05] hover:bg-white/15 text-gray-200"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-95 disabled:opacity-50 ${
              dark
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-black text-white hover:bg-white/[0.05]"
            }`}
          >
            {saving && <FiLoader className="animate-spin" />}
            {saving
              ? "Saving..."
              : editingAgent
                ? "Save Changes"
                : "Create Agent"}
          </button>
        </div>
      </div>
    </div>
  );
}