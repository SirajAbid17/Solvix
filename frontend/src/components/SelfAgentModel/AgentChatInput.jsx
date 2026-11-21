import React, { useRef } from "react";
import toast from "react-hot-toast";
import {
  FiSend,
  FiLoader,
  FiFile,
  FiUpload,
  FiTrash2,
} from "react-icons/fi";

export default function AgentChatInput({
  dark,
  input,
  setInput,
  onSend,
  loading,
  inputClass,
  attachedFile,
  setAttachedFile,
  uploading,
  setUploading,
  onFileUpload,
  canUploadFile,
}) {
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      toast.error("File too large (max 25MB)");
      return;
    }

    setUploading(true);
    const toastId = toast.loading(`Uploading ${file.name}...`, {
      style: {
        background: dark ? "#1a1a1a" : "#fff",
        color: dark ? "#fff" : "#000",
        borderRadius: "12px",
        fontSize: "13px",
        fontWeight: "600",
        padding: "10px 16px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
      },
    });

    try {
      const result = await onFileUpload(file);
      if (result?.success && result?.file) {
        setAttachedFile(result.file);
        toast.success(`Attached: ${file.name}`, { id: toastId });
      } else {
        toast.error("Upload failed", { id: toastId });
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.message || "Upload failed", { id: toastId });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeAttachment = () => {
    setAttachedFile(null);
  };

  return (
    <div
      className={`cd-input-area relative shrink-0 border-t p-3 ${
        dark
          ? "border-white/[0.06] bg-white/[0.02] backdrop-blur-xl"
          : "border-gray-200 bg-gray-50/60 backdrop-blur-xl"
      }`}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept=".pdf,.docx,.doc,.txt,.md,.csv,.xlsx,.xls,.png,.jpg,.jpeg,.webp,.json"
      />

   
      {attachedFile && (
        <div
          className={`mb-2 flex items-center gap-2.5 rounded-xl border p-2.5 shadow-sm ${
            dark
              ? "border-emerald-500/30 bg-gradient-to-r from-emerald-500/[0.12] to-teal-500/[0.06]"
              : "border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50"
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30">
            <FiFile className="text-sm" />
          </div>
          <div className="min-w-0 flex-1">
            <p
              className={`truncate text-xs font-bold ${
                dark ? "text-emerald-200" : "text-emerald-800"
              }`}
            >
              {attachedFile.fileName}
            </p>
            <p
              className={`truncate text-[10px] font-medium ${
                dark ? "text-emerald-300/70" : "text-emerald-600/70"
              }`}
            >
              {attachedFile.fileType} · ready to analyze
            </p>
          </div>
          <button
            onClick={removeAttachment}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all hover:scale-110 active:scale-95 ${
              dark
                ? "text-emerald-300 hover:bg-white/10"
                : "text-emerald-700 hover:bg-emerald-100"
            }`}
            title="Remove file"
          >
            <FiTrash2 size={13} />
          </button>
        </div>
      )}

      
      <div className="flex items-center gap-2">
       
        {canUploadFile && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading || uploading}
            className={`group flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 active:scale-95 disabled:opacity-50 ${
              dark
                ? "border-white/10 bg-white/[0.04] text-gray-400 hover:bg-white/[0.08] hover:text-emerald-400 hover:border-emerald-500/30"
                : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-emerald-600 hover:border-emerald-300"
            }`}
            title="Attach file"
          >
            {uploading ? (
              <FiLoader className="animate-spin text-base" />
            ) : (
              <FiUpload className="text-base transition-transform group-hover:scale-110" />
            )}
          </button>
        )}

       
        <div className="flex flex-1 items-center">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder={
              attachedFile
                ? "Ask about the file..."
                : "Type your message..."
            }
            className={`${inputClass} resize-none !py-3 !pr-4 !pl-4 !rounded-xl !text-[13px] !font-medium shadow-sm transition-all ${
              dark
                ? "!bg-white/[0.04] !border-white/10 focus:!border-emerald-500/40 focus:!bg-white/[0.06] !text-white placeholder:!text-gray-500"
                : "!bg-white !border-gray-200 focus:!border-emerald-400 focus:!bg-white !text-gray-900 placeholder:!text-gray-400"
            }`}
            disabled={loading}
            style={{ minHeight: "44px", maxHeight: "44px" }}
          />
        </div>

      
        <button
          onClick={onSend}
          disabled={loading || (!input.trim() && !attachedFile)}
          className={`group relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl text-sm font-bold shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:shadow-none ${
            attachedFile
              ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-emerald-500/40 hover:shadow-emerald-500/60"
              : dark
                ? "bg-gradient-to-br from-white to-gray-100 text-black shadow-white/20 hover:shadow-white/30"
                : "bg-gradient-to-br from-gray-900 to-black text-white shadow-black/30 hover:shadow-black/40"
          }`}
          title="Send"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity group-hover:opacity-100" />
          {loading ? (
            <FiLoader className="relative animate-spin" />
          ) : (
            <FiSend className="relative text-base transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          )}
        </button>
      </div>
    </div>
  );
}