import React from "react";
import {
  FiBriefcase,
  FiFileText,
  FiUpload,
  FiSend,
  FiEdit3,
  FiMail,
  FiCheckCircle,
  FiX,
  FiPaperclip,
  FiMapPin,
  FiClock,
  FiEye,
  FiSearch,
  FiLoader,
  FiAlertCircle,
  FiExternalLink,
  FiZap,
  FiRefreshCw,
  FiHome,
  FiArrowUpRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function JobWorkspace({
  user,
  jobs,
  selectedJob,
  currentQuery,
  onSelectJob,
  cvName,
  cvUploading,
  cvFileId,
  fileInputRef,
  onCvChange,
  subject,
  setSubject,
  body,
  setBody,
  activeTab,
  setActiveTab,
  generatingEmail,
  onRegenerateEmail,
  applying,
  appliedJobs,
  onOpenConfirm,
  onNewSearch,
  notice,
  setNotice,
  onOpenJobLink,
}) {
  const navigate = useNavigate();
  const sentCount = Object.keys(appliedJobs).length;

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-black px-4 py-7 text-slate-100 sm:px-6 sm:py-10 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-emerald-400/[0.05] blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/3 h-[32rem] w-[32rem] rounded-full bg-cyan-400/[0.04] blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-teal-400/[0.03] blur-[120px]"
      />

      <div className="relative z-10 mx-auto max-w-[1480px]">
        <header className="mb-8 flex flex-col justify-between gap-5 border-b border-white/[0.07] pb-7 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/20 bg-gradient-to-br from-emerald-300/15 to-cyan-300/5 text-emerald-200 shadow-[0_0_35px_rgba(52,211,153,0.08)]">
              <FiZap size={24} />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
                AI Auto Job Apply
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                {currentQuery || "Live jobs from the web"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-semibold text-slate-300 backdrop-blur-xl transition hover:border-emerald-300/40 hover:bg-emerald-300/[0.08] hover:text-emerald-200"
            >
              <FiHome size={15} /> Back to Home
            </button>
            <button
              onClick={onNewSearch}
              className="flex items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.08] px-4 py-2.5 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300/50 hover:bg-emerald-300/[0.13]"
            >
              <FiSearch size={15} /> New Search <FiArrowUpRight size={14} />
            </button>
          </div>
        </header>

        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Total jobs", value: jobs.length, icon: FiBriefcase },
            { label: "Applications sent", value: sentCount, icon: FiCheckCircle },
            { label: "CV ready", value: cvFileId ? "Yes" : "No", icon: FiFileText },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-3xl border border-white/[0.08] bg-[#0a0a0a]/90 p-5 shadow-[0_18px_65px_rgba(0,0,0,0.35)] backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">{s.label}</span>
                <s.icon className="text-emerald-400" size={19} />
              </div>
              <p className="mt-3 text-3xl font-semibold">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-white/[0.08] bg-[#0a0a0a]/90 p-5 shadow-[0_18px_65px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
                  <FiFileText size={19} />
                </div>
                <div>
                  <h2 className="font-semibold">Your CV</h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Uploaded & attached to every email
                  </p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={onCvChange}
                className="hidden"
              />

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-400/10 text-red-300">
                  <FiFileText size={21} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {cvName || "No CV selected"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {cvUploading
                      ? "Uploading & parsing..."
                      : cvFileId
                        ? "Ready to attach ✓"
                        : "Select a PDF (max 10MB)"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={cvUploading}
                  className="flex shrink-0 items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-emerald-400/40 hover:text-emerald-300 disabled:opacity-50"
                >
                  {cvUploading ? (
                    <FiLoader className="animate-spin" size={15} />
                  ) : (
                    <FiUpload size={15} />
                  )}
                  {cvFileId ? "Replace" : "Choose"}
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-[#0a0a0a]/90 p-5 shadow-[0_18px_65px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold">Job opportunities</h2>
                  <p className="mt-1 text-xs text-slate-400">
                    {jobs.length} fresh listings
                  </p>
                </div>
              </div>
              <div className="max-h-[600px] space-y-3 overflow-y-auto pr-1">
                {jobs.map((job) => {
                  const applied = appliedJobs[job.id];
                  return (
                    <button
                      key={job.id}
                      onClick={() => onSelectJob(job)}
                      className={`w-full rounded-xl border p-4 text-left transition ${
                        selectedJob?.id === job.id
                          ? "border-emerald-400/40 bg-emerald-400/[0.06]"
                          : "border-white/[0.07] bg-black hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 font-medium text-slate-100">
                            {job.title}
                          </p>
                          <p className="mt-1 truncate text-sm text-slate-400">
                            {job.company || "Company"}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2 py-1 text-[10px] ${
                            applied
                              ? "border border-emerald-400/30 bg-emerald-400/20 text-emerald-200"
                              : "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                          }`}
                        >
                          {applied ? "Applied ✓" : job.status || "Ready"}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                        {job.location && (
                          <span className="flex items-center gap-1.5">
                            <FiMapPin size={13} />
                            {job.location}
                          </span>
                        )}
                        {job.postedAt && (
                          <span className="flex items-center gap-1.5">
                            <FiClock size={13} />
                            {job.postedAt}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/[0.08] bg-[#0a0a0a]/90 p-5 shadow-[0_18px_65px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-6">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                  <FiMail size={19} />
                </div>
                <div>
                  <h2 className="font-semibold">Application email</h2>
                  <p className="mt-1 text-xs text-slate-400">
                    AI-generated · editable
                  </p>
                </div>
              </div>
              <div className="flex gap-1 rounded-lg bg-black p-1">
                <button
                  onClick={() => setActiveTab("edit")}
                  className={`rounded-md px-3 py-2 text-xs transition ${
                    activeTab === "edit"
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FiEdit3 className="mr-1 inline" size={13} />Edit
                </button>
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`rounded-md px-3 py-2 text-xs transition ${
                    activeTab === "preview"
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FiEye className="mr-1 inline" size={13} />Preview
                </button>
              </div>
            </div>

            {!selectedJob ? (
              <p className="text-sm text-slate-400">
                Select a job to draft an application.
              </p>
            ) : activeTab === "edit" ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 flex items-center justify-between text-xs font-medium text-slate-400">
                    <span>To</span>
                    {selectedJob.url && (
                      <button
                        type="button"
                        onClick={() => onOpenJobLink(selectedJob.url)}
                        className="flex items-center gap-1 text-emerald-400 hover:underline"
                      >
                        View job <FiExternalLink size={11} />
                      </button>
                    )}
                  </label>
                  <input
                    value={selectedJob.email || ""}
                    onChange={(e) =>
                      onSelectJob({ ...selectedJob, email: e.target.value }, true)
                    }
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-300/60 focus:ring-4 focus:ring-emerald-300/[0.07]"
                    placeholder="recruiter@company.com (leave blank to apply on job site)"
                    type="email"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-400">
                    Subject
                  </label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-300/60 focus:ring-4 focus:ring-emerald-300/[0.07]"
                  />
                </div>
                <div>
                  <label className="mb-2 flex items-center justify-between text-xs font-medium text-slate-400">
                    <span>Email body</span>
                    <button
                      type="button"
                      onClick={onRegenerateEmail}
                      disabled={generatingEmail}
                      className="flex items-center gap-1 text-emerald-400 hover:underline disabled:opacity-50"
                    >
                      {generatingEmail ? (
                        <FiLoader className="animate-spin" size={11} />
                      ) : (
                        <FiRefreshCw size={11} />
                      )}
                      Regenerate
                    </button>
                  </label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={14}
                    placeholder={
                      generatingEmail
                        ? "AI is drafting your email..."
                        : "Write your application..."
                    }
                    className="w-full resize-y rounded-2xl border border-white/10 bg-black px-4 py-4 text-sm leading-7 text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-emerald-300/60 focus:ring-4 focus:ring-emerald-300/[0.07]"
                  />
                  <p className="mt-2 text-right text-xs text-slate-500">
                    {body.length} characters
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
                <div className="border-b border-white/[0.07] px-4 py-4">
                  <p className="text-xs text-slate-500">To</p>
                  <p className="mt-1 break-all text-sm text-slate-200">
                    {selectedJob.email || "No recipient"}
                  </p>
                  <p className="mt-4 text-xs text-slate-500">Subject</p>
                  <p className="mt-1 text-sm font-medium text-slate-200">
                    {subject || "No subject"}
                  </p>
                </div>
                <div className="max-h-[400px] overflow-y-auto whitespace-pre-wrap px-4 py-5 text-sm leading-7 text-slate-300">
                  {body || "Your email body will appear here."}
                </div>
                <div className="border-t border-white/[0.07] px-4 py-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <FiPaperclip size={14} />
                    {cvFileId ? cvName : "No CV attached"}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={onOpenConfirm}
              disabled={!selectedJob || !cvFileId || !body.trim() || applying}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 px-4 py-4 font-bold text-slate-950 shadow-[0_10px_35px_rgba(45,212,191,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_15px_45px_rgba(45,212,191,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {applying ? (
                <>
                  <FiLoader className="animate-spin" size={17} />
                  Sending application...
                </>
              ) : (
                <>
                  <FiSend size={17} />
                  Send Application
                </>
              )}
            </button>

            {!cvFileId && (
              <p className="mt-3 flex items-center justify-center gap-2 text-xs text-amber-300">
                <FiAlertCircle size={12} /> Upload CV to enable sending
              </p>
            )}
          </section>
        </div>

        {notice.text && (
          <div
            className={`mt-6 flex items-start gap-3 rounded-xl border p-4 text-sm leading-6 ${
              notice.type === "error"
                ? "border-red-400/20 bg-red-400/[0.06] text-red-200"
                : notice.type === "warning"
                  ? "border-amber-400/20 bg-amber-400/[0.06] text-amber-200"
                  : "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-200"
            }`}
          >
            <FiCheckCircle className="mt-1 shrink-0" size={17} />
            <span>{notice.text}</span>
            <button
              onClick={() => setNotice({ type: "", text: "" })}
              className="ml-auto shrink-0 opacity-70 hover:opacity-100"
            >
              <FiX size={17} />
            </button>
          </div>
        )}

        <footer className="mt-8 border-t border-white/[0.07] pt-5 text-center text-xs leading-6 text-slate-500">
          SOLVIX · Real auto-apply · Powered by Tavily + Gemini + Gmail API
        </footer>
      </div>
    </main>
  );
}