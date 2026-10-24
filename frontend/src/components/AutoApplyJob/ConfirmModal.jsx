import React from "react";
import {
  FiSend,
  FiX,
  FiAlertCircle,
  FiArrowLeft,
  FiLoader,
} from "react-icons/fi";

export default function ConfirmModal({
  show,
  applying,
  selectedJob,
  cvName,
  user,
  onClose,
  onConfirm,
}) {
  if (!show || !selectedJob) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-lg"
      onClick={() => !applying && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-modalIn relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-[0_20px_80px_-10px_rgba(0,0,0,0.9)]"
      >
        <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />

        <button
          onClick={() => !applying && onClose()}
          disabled={applying}
          aria-label="Close"
          className="absolute right-3 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-red-400/40 hover:bg-red-400/10 hover:text-red-300 disabled:opacity-40"
        >
          <FiX size={17} />
        </button>

        <div className="p-6">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/20">
            <FiSend size={22} />
          </div>
          <h3 className="pr-10 text-lg font-semibold text-white">
            Ready to send?
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            You're about to send your application to{" "}
            <span className="font-medium text-emerald-300">
              {selectedJob.company || "the employer"}
            </span>{" "}
            for the <span className="text-white">{selectedJob.title}</span>{" "}
            position.
          </p>
          <div className="mt-5 space-y-2.5 rounded-xl border border-white/[0.06] bg-black/60 p-3 text-xs">
            <div className="flex justify-between gap-2">
              <span className="text-slate-500">To</span>
              <span className="ml-2 truncate text-slate-300">
                {selectedJob.email || "—"}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-500">CV</span>
              <span className="ml-2 truncate text-slate-300">{cvName}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-500">From</span>
              <span className="ml-2 truncate text-slate-300">{user?.email}</span>
            </div>
          </div>

          {!selectedJob.email && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-400/20 bg-amber-400/[0.06] p-3 text-xs text-amber-200">
              <FiAlertCircle className="mt-0.5 shrink-0" size={14} />
              No email found. Backend will attempt to find contact or you must
              apply on the job site.
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
            <button
              onClick={onClose}
              disabled={applying}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5 disabled:opacity-50"
            >
              <FiArrowLeft size={15} />
              Back
            </button>
            <button
              onClick={onConfirm}
              disabled={applying}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 px-4 py-3 text-sm font-semibold text-black shadow-[0_4px_20px_rgba(52,211,153,0.35)] transition hover:from-emerald-300 hover:to-teal-300 disabled:opacity-50"
            >
              {applying ? (
                <>
                  <FiLoader className="animate-spin" size={15} />
                  Sending...
                </>
              ) : (
                <>
                  <FiSend size={15} />
                  Confirm & Send
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modalIn {
          animation: modalIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}