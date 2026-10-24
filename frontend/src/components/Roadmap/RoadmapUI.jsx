import React from "react";
import {
  FiArrowLeft,
  FiZap,
  FiLoader,
  FiCheck,
  FiChevronDown,
  FiChevronRight,
  FiExternalLink,
  FiYoutube,
  FiGithub,
  FiBookOpen,
  FiRotateCcw,
  FiCheckCircle,
  FiTrendingUp,
  FiLayers,
  FiX,
  FiAlertCircle,
  FiSearch,
  FiClock,
  FiTarget,
  FiEye,
  FiActivity,
  FiGrid,
  FiList,
  FiCommand,
} from "react-icons/fi";

import {
  SUGGESTIONS,
  LEVELS,
  RESOURCE_TYPES,
  RESOURCE_COLORS,
  getPhaseProgress,
} from "./roadmapHelpers";

// ==================== ICON HELPER ====================
export const ResourceIcon = ({ type, size = 16 }) => {
  const cls = `shrink-0 ${RESOURCE_COLORS[type]?.text || "text-slate-400"}`;
  if (type === "YouTube") return <FiYoutube size={size} className={cls} />;
  if (type === "GitHub") return <FiGithub size={size} className={cls} />;
  return <FiBookOpen size={size} className={cls} />;
};


export function LoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#060912]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20" />
          <FiLoader className="relative animate-spin text-emerald-400" size={32} />
        </div>
        <p className="text-sm text-slate-400">Loading your roadmap...</p>
      </div>
    </main>
  );
}


export function TopBar({ onHome, onOpenPalette }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
      <button
        onClick={onHome}
        className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-emerald-400/40 hover:bg-white/5 hover:text-white"
      >
        <FiArrowLeft size={15} className="transition group-hover:-translate-x-0.5" />
        Home
      </button>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onOpenPalette}
          className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-slate-400 transition hover:border-white/20 hover:text-white sm:flex"
        >
          <FiCommand size={13} />
          <span>Press</span>
          <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white">
            ⌘K
          </kbd>
        </button>

        <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold tracking-wide text-emerald-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          AI ONLINE
        </span>
      </div>
    </div>
  );
}


export function Hero() {
  return (
    <div className="mb-10 text-center">
      <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-400/30 bg-gradient-to-br from-emerald-400/20 to-cyan-400/5 text-emerald-300 shadow-[0_0_80px_rgba(52,211,153,0.25)]">
        <FiZap size={38} />
      </div>
      <h1 className="bg-gradient-to-r from-white via-emerald-100 to-cyan-100 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-6xl">
        AI Roadmap
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
        AI-powered personalized roadmap with{" "}
        <span className="text-emerald-300">real resources</span> fetched from the web
      </p>
    </div>
  );
}


export function GeneratorForm({
  topic,
  setTopic,
  level,
  setLevel,
  loading,
  error,
  onSubmit,
}) {
  const levelStyles = {
    emerald: {
      active: "bg-emerald-400/15 text-emerald-300 border-emerald-400/40",
      dot: "bg-emerald-400",
    },
    amber: {
      active: "bg-amber-400/15 text-amber-300 border-amber-400/40",
      dot: "bg-amber-400",
    },
    rose: {
      active: "bg-rose-400/15 text-rose-300 border-rose-400/40",
      dot: "bg-rose-400",
    },
  };

  return (
    <form
      onSubmit={onSubmit}
      className="group/form relative mb-8 overflow-hidden rounded-3xl border border-white/[0.09] bg-[#0d111a]/80 shadow-[0_20px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
      <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-emerald-400/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-cyan-400/[0.04] blur-3xl" />

      <div className="relative p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
              <FiTarget size={13} />
            </span>
            What do you want to master?
          </label>
          <span className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-500 sm:flex">
            <FiZap size={9} className="text-emerald-400" />
            AI-powered
          </span>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 transition focus-within:border-emerald-400/60 focus-within:ring-4 focus-within:ring-emerald-400/[0.08]">
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="e.g. Advanced Multi-Agent AI Systems with LangGraph"
            className="w-full resize-none bg-transparent px-4 pt-3.5 pb-1 text-sm leading-6 text-white outline-none placeholder:text-slate-600"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] bg-white/[0.02] px-3 py-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-slate-500">
                Level
              </span>
              <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-black/60 p-0.5">
                {LEVELS.map((l) => {
                  const active = level === l.id;
                  const styles = levelStyles[l.color];
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setLevel(l.id)}
                      className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold transition border ${
                        active
                          ? styles.active
                          : "border-transparent text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          active ? styles.dot : "bg-slate-600"
                        }`}
                      />
                      {l.id}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] tabular-nums transition ${
                  topic.length >= 500
                    ? "text-rose-400"
                    : topic.length > 450
                      ? "text-amber-400"
                      : "text-slate-500"
                }`}
              >
                {topic.length}/500
              </span>

              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="group/btn relative flex items-center gap-1.5 overflow-hidden rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 transition-all duration-300 group-hover/btn:from-emerald-300 group-hover/btn:via-teal-300 group-hover/btn:to-cyan-300" />
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                <span className="relative flex items-center gap-1.5 text-slate-950">
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin" size={12} />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <FiZap size={12} strokeWidth={2.5} />
                      <span>Generate</span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setTopic(s)}
              className="group/chip inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-[11px] text-slate-400 transition hover:border-emerald-400/40 hover:bg-emerald-400/[0.08] hover:text-emerald-300"
            >
              <span className="h-1 w-1 rounded-full bg-slate-600 transition group-hover/chip:bg-emerald-400" />
              {s}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-center gap-3 text-[10px] text-slate-600">
          <span className="flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-emerald-400" /> AI generated
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-cyan-400" /> Web resources
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-violet-400" /> Saved to cloud
          </span>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-3 text-xs text-red-200">
            <FiAlertCircle className="mt-0.5 shrink-0" size={14} />
            <span>{error}</span>
          </div>
        )}
      </div>
    </form>
  );
}


export function StatsRow({ stats }) {
  const items = [
    { label: "Phases", value: stats.phaseCount, icon: FiLayers, color: "text-emerald-300", sub: "total" },
    { label: "Resources", value: stats.resourceCount, icon: FiBookOpen, color: "text-sky-300", sub: "curated" },
    { label: "Tasks", value: `${stats.completedCount}/${stats.allTasks}`, icon: FiCheckCircle, color: "text-violet-300", sub: "done" },
    { label: "Progress", value: `${stats.progress}%`, icon: FiTrendingUp, color: "text-amber-300", sub: `~${stats.estimatedHours}h` },
  ];

  return (
    <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0d111a] p-4 transition hover:border-emerald-400/20"
          >
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-400/[0.04] transition group-hover:bg-emerald-400/[0.08]" />
            <div className="relative flex items-center justify-between">
              <span className="text-xs text-slate-400">{s.label}</span>
              <Icon className={s.color} size={16} />
            </div>
            <p className="relative mt-3 text-2xl font-black">{s.value}</p>
            <p className="relative mt-1 text-[10px] uppercase tracking-wider text-slate-500">
              {s.sub}
            </p>
          </div>
        );
      })}
    </div>
  );
}


export function ProgressCard({ title, stats, onReset }) {
  return (
    <div className="mb-5 overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-br from-[#0d111a] to-[#0a0e16] p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <FiActivity className="text-emerald-400" size={14} />
            <p className="truncate text-sm font-bold">{title}</p>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {stats.completedCount} of {stats.allTasks} tasks ·{" "}
            {stats.resourceCount} resources · ~{stats.estimatedHours}h to finish
          </p>
        </div>
        <button
          onClick={onReset}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-400 transition hover:border-rose-400/40 hover:text-rose-300"
        >
          <FiRotateCcw size={12} /> Reset
        </button>
      </div>
      <div className="relative h-3 overflow-hidden rounded-full bg-black/60">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_20px_rgba(52,211,153,0.6)] transition-all duration-700"
          style={{ width: `${stats.progress}%` }}
        />
      </div>
    </div>
  );
}


export function Controls({
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
  viewMode,
  setViewMode,
  onToggleExpandAll,
  allExpanded,
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-white/[0.09] bg-[#0d111a] p-2">
      <div className="relative min-w-0 flex-1">
        <FiSearch
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          size={14}
        />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks or resources..."
          className="w-full rounded-xl border border-white/5 bg-black/40 py-2.5 pl-9 pr-3 text-xs text-white outline-none focus:border-emerald-400/40"
        />
      </div>

      <select
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
        className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-xs text-slate-300 outline-none"
      >
        {RESOURCE_TYPES.map((t) => (
          <option key={t} value={t} className="bg-[#0d111a]">
            {t}
          </option>
        ))}
      </select>

      <button
        onClick={onToggleExpandAll}
        className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-xs font-medium text-slate-300 transition hover:border-emerald-400/30 hover:text-emerald-300"
      >
        {allExpanded ? "Collapse" : "Expand"} All
      </button>

      <div className="flex rounded-xl border border-white/10 bg-black/40 p-0.5">
        <button
          onClick={() => setViewMode("timeline")}
          className={`rounded-lg p-2 transition ${
            viewMode === "timeline"
              ? "bg-emerald-400/10 text-emerald-300"
              : "text-slate-500 hover:text-white"
          }`}
          aria-label="Timeline view"
        >
          <FiList size={14} />
        </button>
        <button
          onClick={() => setViewMode("compact")}
          className={`rounded-lg p-2 transition ${
            viewMode === "compact"
              ? "bg-emerald-400/10 text-emerald-300"
              : "text-slate-500 hover:text-white"
          }`}
          aria-label="Compact view"
        >
          <FiGrid size={14} />
        </button>
      </div>
    </div>
  );
}


export function PhaseCard({
  phase,
  originalIndex,
  isOpen,
  viewMode,
  completedTasks,
  onToggle,
  onToggleTask,
  onSelectResource,
}) {
  const tasks = phase.tasks || [];
  const resources = phase.resources || [];
  const { percent, isDone } = getPhaseProgress(phase, completedTasks);

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-[#0d111a] transition-all ${
        isOpen
          ? "border-emerald-400/25 shadow-[0_10px_40px_rgba(52,211,153,0.08)]"
          : "border-white/[0.09] hover:border-white/20"
      }`}
    >
      <div
        className={`absolute inset-y-0 left-0 w-1 transition-all ${
          isDone
            ? "bg-gradient-to-b from-emerald-400 to-cyan-400"
            : percent > 0
              ? "bg-emerald-400/50"
              : "bg-white/5"
        }`}
      />

      <button
        type="button"
        onClick={() => viewMode !== "compact" && onToggle()}
        className="flex w-full items-start gap-4 p-5 text-left sm:items-center"
      >
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition ${
            isDone
              ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-300"
              : "border-white/10 bg-white/[0.03] text-emerald-300/70"
          }`}
        >
          {isDone ? <FiCheck size={22} /> : <FiTrendingUp size={22} />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
              PHASE {String(originalIndex + 1).padStart(2, "0")}
            </span>
            {phase.duration && (
              <span className="flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-[10px] text-slate-400">
                <FiClock size={9} /> {phase.duration}
              </span>
            )}
            {isDone && (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-400/20 px-2 py-1 text-[10px] font-bold text-emerald-300">
                <FiCheck size={9} /> DONE
              </span>
            )}
            {percent > 0 && !isDone && (
              <span className="text-[10px] font-bold text-emerald-400/70">
                {percent}%
              </span>
            )}
          </div>
          <h3 className="font-bold leading-tight sm:text-lg">{phase.title}</h3>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400 sm:text-sm">
            {phase.description}
          </p>

          {percent > 0 && (
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-black/40">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          )}
        </div>

        {viewMode === "timeline" && (
          <span className="pt-1 text-slate-500 transition group-hover:text-emerald-300">
            {isOpen ? <FiChevronDown size={20} /> : <FiChevronRight size={20} />}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="border-t border-white/[0.07] px-5 py-5">
          {tasks.length > 0 && (
            <>
              <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <FiCheckCircle size={12} /> Tasks · {tasks.length}
              </h4>
              <div className="space-y-2">
                {tasks.map((task, ti) => {
                  const key = `${phase.id}-${ti}`;
                  const taskDone = Boolean(completedTasks[key]);
                  return (
                    <label
                      key={key}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-2.5 transition ${
                        taskDone
                          ? "border-emerald-400/20 bg-emerald-400/[0.04]"
                          : "border-white/[0.06] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={taskDone}
                        onChange={() => onToggleTask(phase.id, ti, taskDone)}
                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-emerald-400"
                      />
                      <span
                        className={`text-sm leading-5 ${
                          taskDone
                            ? "text-slate-500 line-through"
                            : "text-slate-200"
                        }`}
                      >
                        {task}
                      </span>
                    </label>
                  );
                })}
              </div>
            </>
          )}

          {resources.length > 0 && (
            <>
              <h4 className="mb-3 mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <FiBookOpen size={12} /> Resources · {resources.length}
              </h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {resources.map((r) => {
                  const colors =
                    RESOURCE_COLORS[r.type] || RESOURCE_COLORS.Documentation;
                  return (
                    <button
                      key={r.id || r.url}
                      onClick={() => onSelectResource(r)}
                      className={`group/res flex items-start gap-2.5 rounded-lg border ${colors.border} ${colors.bg} p-2.5 text-left transition hover:-translate-y-0.5 hover:shadow-lg`}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/40">
                        <ResourceIcon type={r.type} size={14} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-2 text-xs font-semibold text-slate-100">
                          {r.title}
                        </span>
                        <span
                          className={`mt-1 block text-[10px] ${colors.text}`}
                        >
                          {r.type} · {r.domain || "web"}
                        </span>
                      </span>
                      <FiExternalLink
                        size={12}
                        className="shrink-0 text-slate-500 transition group-hover/res:text-white"
                      />
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {tasks.length === 0 && resources.length === 0 && (
            <p className="text-xs text-slate-500">
              Nothing matches your filters in this phase.
            </p>
          )}
        </div>
      )}
    </article>
  );
}


export function EmptyState() {
  return (
    <div className="rounded-2xl border border-white/[0.09] bg-[#0d111a] p-14 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02] text-slate-700">
        <FiZap size={36} />
      </div>
      <p className="mt-5 text-xl font-bold">No roadmap yet</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
        Enter a topic above and click "Generate Roadmap" — AI will build a
        personalized plan with real resources.
      </p>
    </div>
  );
}


export function NoResults() {
  return (
    <div className="rounded-2xl border border-white/[0.09] bg-[#0d111a] p-10 text-center">
      <FiSearch className="mx-auto text-slate-600" size={28} />
      <p className="mt-3 text-sm font-bold">No results</p>
      <p className="mt-1 text-xs text-slate-400">
        Try different keywords or filters.
      </p>
    </div>
  );
}


export function CommandPalette({ commands, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/80 p-4 pt-24 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0d111a] shadow-[0_30px_100px_rgba(0,0,0,0.9)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-white/[0.07] p-3">
          <div className="flex items-center gap-2">
            <FiCommand className="text-emerald-400" size={16} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Commands
            </span>
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {commands.map((cmd, i) => {
            const Icon = cmd.icon;
            return (
              <button
                key={i}
                onClick={cmd.action}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-emerald-400/10 hover:text-emerald-300"
              >
                <Icon size={14} />
                {cmd.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}


export function ResourceModal({ resource, onClose }) {
  const colors =
    RESOURCE_COLORS[resource.type] || RESOURCE_COLORS.Documentation;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-lg"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#0d111a] shadow-[0_30px_100px_rgba(0,0,0,0.9)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`flex items-center justify-between border-b border-white/[0.07] p-4 ${colors.bg}`}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/40">
              <ResourceIcon type={resource.type} size={16} />
            </span>
            <span
              className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}
            >
              {resource.type}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <FiX size={18} />
          </button>
        </div>
        <div className="p-5 sm:p-6">
          <h3 className="text-lg font-bold leading-7 text-white">
            {resource.title}
          </h3>
          {resource.description && (
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {resource.description}
            </p>
          )}
          {resource.domain && (
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <FiEye size={12} /> Source:{" "}
              <span className="text-emerald-300">{resource.domain}</span>
            </div>
          )}
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 px-4 py-2.5 text-sm font-bold text-black transition hover:from-emerald-300 hover:to-teal-300"
          >
            Open Resource <FiExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}


export function SuccessModal({ isOpen, onClose, roadmap, autoCloseMs = 4000 }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setVisible(false);
      return;
    }

    const enterTimer = setTimeout(() => setVisible(true), 20);

    let closeTimer;
    if (autoCloseMs > 0) {
      closeTimer = setTimeout(() => {
        onClose?.();
      }, autoCloseMs);
    }

    return () => {
      clearTimeout(enterTimer);
      if (closeTimer) clearTimeout(closeTimer);
    };
  }, [isOpen, autoCloseMs, onClose]);

  if (!isOpen) return null;

  const phaseCount = roadmap?.phases?.length || 0;
  const taskCount = (roadmap?.phases || []).reduce(
    (sum, p) => sum + (p.tasks?.length || 0),
    0
  );
  const resourceCount = (roadmap?.phases || []).reduce(
    (sum, p) => sum + (p.resources?.length || 0),
    0
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-lg"
      onClick={onClose}
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease-out",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-[#0d111a] via-[#0a1420] to-[#0d111a] p-6 shadow-[0_30px_120px_rgba(52,211,153,0.2)] sm:p-8"
        style={{
          transform: visible
            ? "scale(1) translateY(0)"
            : "scale(0.85) translateY(30px)",
          opacity: visible ? 1 : 0,
          transition:
            "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease-out",
        }}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />
        <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

        <button
          onClick={onClose}
          className="absolute right-3 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:border-rose-400/40 hover:bg-rose-400/10 hover:text-rose-300"
          aria-label="Close"
        >
          <FiX size={15} />
        </button>

        <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20" />
          <span className="absolute inset-2 animate-pulse rounded-full bg-emerald-400/30" />
          <span
            className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-[0_0_40px_rgba(52,211,153,0.5)]"
            style={{
              animation: visible
                ? "scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both"
                : "none",
            }}
          >
            <FiCheck size={32} strokeWidth={3} />
          </span>
        </div>

        <h3 className="text-center text-xl font-black tracking-tight sm:text-2xl">
          <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
            Successfully Generated!
          </span>
        </h3>

        <p className="mt-2 text-center text-sm leading-6 text-slate-400">
          Your AI-powered roadmap is ready
        </p>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.04] p-3 text-center">
            <p className="text-lg font-black text-emerald-300">{phaseCount}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">
              Phases
            </p>
          </div>
          <div className="rounded-xl border border-violet-400/15 bg-violet-400/[0.04] p-3 text-center">
            <p className="text-lg font-black text-violet-300">{taskCount}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">
              Tasks
            </p>
          </div>
          <div className="rounded-xl border border-sky-400/15 bg-sky-400/[0.04] p-3 text-center">
            <p className="text-lg font-black text-sky-300">{resourceCount}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">
              Resources
            </p>
          </div>
        </div>

        {roadmap?.title && (
          <div className="mt-4 rounded-xl border border-white/[0.06] bg-black/40 p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Topic
            </p>
            <p className="mt-1 truncate text-xs font-semibold text-slate-200">
              {roadmap.title}
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="group relative mt-5 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <FiZap size={15} />
          <span>View Roadmap</span>
        </button>

        <p className="mt-3 text-center text-[10px] text-slate-600">
          Auto-closing in a moment · Click anywhere to dismiss
        </p>
      </div>

      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.3) rotate(-180deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0);
          }
        }
      `}</style>
    </div>
  );
}


export function Footer() {
  return (
    <footer className="mt-12 border-t border-white/[0.07] pt-6 text-center">
      <p className="text-xs text-slate-500">
        SOLVIX · AI Roadmap Generator ·{" "}
        <span className="text-emerald-400">Real resources · Real progress</span>
      </p>
      <p className="mt-2 text-[10px] text-slate-600">
        Press{" "}
        <kbd className="rounded bg-white/5 px-1 py-0.5 text-slate-400">⌘K</kbd>{" "}
        for commands ·{" "}
        <kbd className="rounded bg-white/5 px-1 py-0.5 text-slate-400">⌘E</kbd>{" "}
        expand all ·{" "}
        <kbd className="rounded bg-white/5 px-1 py-0.5 text-slate-400">Esc</kbd>{" "}
        close
      </p>
    </footer>
  );
}