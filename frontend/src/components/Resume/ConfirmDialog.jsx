import React, { useEffect } from "react";
import { FiAlertTriangle, FiLoader } from "react-icons/fi";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
  dark = false,
  variant = "danger", 
}) {
  
  useEffect(() => {
    if (!open || loading) return;

    const handleKey = (e) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };

    document.addEventListener("keydown", handleKey);

   
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, loading, onCancel, onConfirm]);

  if (!open) return null;

  const variants = {
    danger: {
      iconBg: dark
        ? "bg-red-500/15 text-red-400 border border-red-500/20"
        : "bg-red-50 text-red-600 border border-red-200",
      buttonBg: "bg-red-600 hover:bg-red-700 text-white",
    },
    warning: {
      iconBg: dark
        ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
        : "bg-amber-50 text-amber-600 border border-amber-200",
      buttonBg: "bg-amber-600 hover:bg-amber-700 text-white",
    },
    info: {
      iconBg: dark
        ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
        : "bg-blue-50 text-blue-600 border border-blue-200",
      buttonBg: "bg-blue-600 hover:bg-blue-700 text-white",
    },
  };

  const style = variants[variant] || variants.danger;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => !loading && onCancel()}
      />

      
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-2xl border p-6 shadow-2xl ${
          dark
            ? "border-white/10 bg-[#0a0a0a] text-white"
            : "border-gray-200 bg-white text-gray-900"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="flex items-start gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${style.iconBg}`}
          >
            <FiAlertTriangle className="text-xl" />
          </div>

          <div className="min-w-0 flex-1 pt-1">
            <h3
              id="confirm-title"
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
            type="button"
            onClick={onCancel}
            disabled={loading}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition active:scale-95 disabled:opacity-50 ${
              dark
                ? "bg-white/[0.06] text-gray-200 hover:bg-white/15"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-95 disabled:opacity-60 ${style.buttonBg}`}
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" />
                Please wait...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}