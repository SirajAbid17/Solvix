import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import toast from "react-hot-toast";
import { FiX, FiZap } from "react-icons/fi";
import { AGENT_CATEGORIES, AGENT_MODELS } from "./AgentComponents";
import AgentChatHeader from "./AgentChatHeader";
import AgentChatMessage from "./AgentChatMessage";
import AgentChatInput from "./AgentChatInput";

export default function AgentChatDrawer({
  dark,
  agent,
  messages,
  input,
  setInput,
  onSend,
  loading,
  onClose,
  inputClass,
  onFileUpload,
}) {
  const drawerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [downloading, setDownloading] = useState({});
  const [attachedFile, setAttachedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useGSAP(
    () => {
      if (!agent) return;
      const tl = gsap.timeline();
      tl.from(".cd-backdrop", { opacity: 0, duration: 0.3, ease: "power2.out" })
        .from(
          ".cd-panel",
          { x: 60, opacity: 0, duration: 0.5, ease: "power4.out" },
          "-=0.2"
        )
        .from(
          ".cd-header",
          { y: -20, opacity: 0, duration: 0.4, ease: "power3.out" },
          "-=0.3"
        )
        .from(
          ".cd-input-area",
          { y: 20, opacity: 0, duration: 0.4, ease: "power3.out" },
          "-=0.2"
        );
    },
    { scope: drawerRef, dependencies: [agent] }
  );

  useEffect(() => {
    if (!agent) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, agent]);

  if (!agent) return null;

  const agentTools =
    Array.isArray(agent.tools) && agent.tools.length > 0
      ? agent.tools
      : ["chat"];

  const canUploadFile =
    agentTools.includes("file") || agentTools.includes("rag");

  const handleCopy = (text, idx) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedIdx(idx);
        toast.success("Copied!", {
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
        setTimeout(() => setCopiedIdx(null), 2000);
      })
      .catch(() => toast.error("Failed to copy"));
  };

  const handleSend = () => {
    const toolToSend = attachedFile
      ? agentTools.includes("rag")
        ? "rag"
        : "file"
      : null;

    onSend(toolToSend, attachedFile);
    setAttachedFile(null);
  };

  const downloadPDF = (message, idx) => {
    const key = `pdf-${idx}`;
    setDownloading((p) => ({ ...p, [key]: true }));

    try {
      if (message.pdfUrl) {
        window.open(message.pdfUrl, "_blank");
        toast.success("PDF opened!");
        return;
      }

      const b64 = message.pdfBase64 || message.pdf;
      if (!b64) {
        toast.error("No PDF data");
        return;
      }

      const byteChars = atob(b64);
      const byteNums = new Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++)
        byteNums[i] = byteChars.charCodeAt(i);
      const blob = new Blob([new Uint8Array(byteNums)], {
        type: "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Solvix-Document-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      toast.success("PDF downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download PDF");
    } finally {
      setDownloading((p) => ({ ...p, [key]: false }));
    }
  };

  const downloadPPT = (message, idx) => {
    const key = `ppt-${idx}`;
    setDownloading((p) => ({ ...p, [key]: true }));

    try {
      if (message.pptUrl) {
        window.open(message.pptUrl, "_blank");
        toast.success("PPT opened!");
        return;
      }

      const b64 = message.pptBase64 || message.ppt;
      if (!b64) {
        toast.error("No PPT data");
        return;
      }

      const byteChars = atob(b64);
      const byteNums = new Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++)
        byteNums[i] = byteChars.charCodeAt(i);
      const blob = new Blob([new Uint8Array(byteNums)], {
        type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        message.pptFileName || `Solvix-Presentation-${Date.now()}.pptx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      toast.success("PPT downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download PPT");
    } finally {
      setDownloading((p) => ({ ...p, [key]: false }));
    }
  };

  const downloadImage = async (imageUrl, idx) => {
    const key = `img-${idx}`;
    setDownloading((p) => ({ ...p, [key]: true }));

    try {
      const res = await fetch(imageUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `solvix-image-${idx + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      toast.success("Image downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download image");
    } finally {
      setDownloading((p) => ({ ...p, [key]: false }));
    }
  };

  return (
    <>
      {previewImage && (
        <div
          className="fixed inset-0 z-[400] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-110 active:scale-95"
          >
            <FiX className="text-lg" />
          </button>
          <img
            src={previewImage}
            alt="Preview"
            className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div ref={drawerRef} className="fixed inset-0 z-[200] flex justify-end">
        <div
          className="cd-backdrop absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        <div
          className={`cd-panel relative flex h-full w-full flex-col shadow-2xl sm:max-w-lg ${
            dark
              ? "bg-gradient-to-b from-[#0f0f0f] via-[#0a0a0a] to-[#050505] border-l border-white/10"
              : "bg-gradient-to-b from-white via-white to-gray-50 border-l border-gray-200"
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />

         
          <AgentChatHeader dark={dark} agent={agent} onClose={onClose} />

         
          <div className="relative flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-5">
            {dark && (
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.06),transparent_60%)]" />
            )}

            {messages.map((m, i) => (
              <AgentChatMessage
                key={i}
                message={m}
                idx={i}
                dark={dark}
                agent={agent}
                copiedIdx={copiedIdx}
                onCopy={handleCopy}
                downloading={downloading}
                onDownloadPDF={downloadPDF}
                onDownloadPPT={downloadPPT}
                onDownloadImage={downloadImage}
                onPreviewImage={setPreviewImage}
              />
            ))}

           
            {loading && (
              <div className="flex justify-start">
                <div
                  className={`rounded-2xl px-4 py-3 shadow-md ${
                    dark
                      ? "bg-white/[0.04] border border-white/10"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FiZap
                      className={`text-sm animate-pulse ${
                        dark ? "text-emerald-400" : "text-emerald-500"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        dark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {agent.name} is thinking
                    </span>
                    <span className="inline-flex items-center gap-0.5">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" />
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          
          <AgentChatInput
            dark={dark}
            input={input}
            setInput={setInput}
            onSend={handleSend}
            loading={loading}
            inputClass={inputClass}
            attachedFile={attachedFile}
            setAttachedFile={setAttachedFile}
            uploading={uploading}
            setUploading={setUploading}
            onFileUpload={onFileUpload}
            canUploadFile={canUploadFile}
          />
        </div>
      </div>
    </>
  );
}