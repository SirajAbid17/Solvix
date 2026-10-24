import React from "react";
import {
  FiZap,
  FiHome,
  FiSearch,
  FiLoader,
  FiAlertCircle,
  FiArrowLeft,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function JobSearchScreen({
  searchPrompt,
  setSearchPrompt,
  jobLimit,
  setJobLimit,
  searching,
  onSearch,
  cooldownInfo,
  notice,
  hasCachedJobs,
  onBackToResults,
}) {
  const navigate = useNavigate();

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-8 text-slate-100 sm:py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-emerald-400/[0.06] blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-cyan-400/[0.05] blur-[120px]"
      />

      <div className="relative z-10 w-full max-w-2xl">
        {hasCachedJobs && (
          <button
            onClick={onBackToResults}
            className="mb-5 flex items-center gap-2 rounded-xl border border-white/10 bg-[#0a0a0a] px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:border-emerald-400/40 hover:text-emerald-300"
          >
            <FiArrowLeft size={14} />
            Back to results
          </button>
        )}

        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-300">
              <FiZap size={15} />
            </span>
            SOLVIX <span className="text-slate-600">/</span> Career AI
          </div>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3.5 py-2.5 text-xs font-semibold text-slate-300 backdrop-blur-xl transition hover:border-emerald-300/40 hover:bg-emerald-300/[0.08] hover:text-emerald-200 sm:px-4 sm:text-sm"
          >
            <FiHome size={15} /> Back to Home
          </button>
        </div>

        <div className="mb-7 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[1.35rem] border border-emerald-300/25 bg-gradient-to-br from-emerald-300/20 to-cyan-300/5 text-emerald-200 shadow-[0_0_55px_rgba(52,211,153,0.12)]">
            <FiZap size={27} />
          </div>
          <h1 className="bg-gradient-to-r from-white via-slate-100 to-emerald-100 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
            AI Auto Job Apply
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400 sm:text-base">
            Real jobs · AI emails · CV auto-attached · Sent via Gmail
          </p>
        </div>

        {cooldownInfo && (
          <div className="mb-3 flex items-start gap-2.5 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-3 text-xs text-amber-200">
            <FiAlertCircle className="mt-0.5 shrink-0" size={15} />
            <div>
              <p className="font-medium">Daily search limit reached</p>
              <p className="mt-0.5 text-[11px] text-amber-200/80">
                Next search in {cooldownInfo.timeRemaining}. Showing cached
                results.
              </p>
            </div>
          </div>
        )}

        <form
          onSubmit={onSearch}
          className="rounded-3xl border border-white/[0.09] bg-[#0a0a0a]/90 p-5 shadow-[0_25px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-7"
        >
          <label className="mb-1.5 block text-xs font-medium text-slate-300">
            Job role & location
          </label>
          <textarea
            value={searchPrompt}
            onChange={(e) => setSearchPrompt(e.target.value)}
            rows={2}
            placeholder="e.g. MERN Stack Developer in Lahore, Pakistan"
            className="w-full resize-none rounded-2xl border border-white/10 bg-black p-4 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-300/60 focus:ring-4 focus:ring-emerald-300/[0.08]"
          />

          <div className="mt-3">
            <p className="mb-2 text-xs font-medium text-slate-300">
              How many jobs?
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {[5, 10].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setJobLimit(n)}
                  className={`rounded-lg border py-2 text-xs font-semibold transition ${
                    jobLimit === n
                      ? "border-emerald-400 bg-emerald-400/10 text-emerald-300"
                      : "border-white/10 bg-black text-slate-400 hover:border-white/20"
                  }`}
                >
                  {n} Jobs
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={searching || !searchPrompt.trim()}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 px-4 py-4 text-sm font-bold text-slate-950 shadow-[0_10px_35px_rgba(45,212,191,0.15)] transition hover:-translate-y-0.5 hover:shadow-[0_15px_45px_rgba(45,212,191,0.22)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {searching ? (
              <>
                <FiLoader className="animate-spin" size={16} />
                Searching real jobs...
              </>
            ) : (
              <>
                <FiSearch size={16} />
                Find {jobLimit} Fresh Jobs
              </>
            )}
          </button>
          <p className="mt-3 text-center text-[10px] leading-4 text-slate-500">
            Uses Tavily · Only last 3 days · 1 search per 24h
          </p>
        </form>

        {notice.text && (
          <div
            className={`mt-3 rounded-xl border p-3 text-xs ${
              notice.type === "error"
                ? "border-red-400/20 bg-red-400/[0.06] text-red-200"
                : notice.type === "warning"
                  ? "border-amber-400/20 bg-amber-400/[0.06] text-amber-200"
                  : "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-200"
            }`}
          >
            {notice.text}
          </div>
        )}
      </div>
    </main>
  );
}