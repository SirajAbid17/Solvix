import React, { useState } from "react";
import { useTheme } from "../../BgContext/ThemeContext";
import {
  FiPaperclip,
  FiSend,
  FiZap,
  FiMessageSquare,
  FiSearch,
  FiImage,
  FiCode,
  FiFileText,
  FiFile,
} from "react-icons/fi";
import { RiMessageAi3Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../../redux/messageslice";
import {
  updateConversationTitle,
  setSelectedConversation,
} from "../../redux/conversationSlice";

import ChatAgent from "../../Features/ChatAgent";
import UpdateConversation from "../../Features/UpdateConversation";
import Document from "./Document";
import VoiceText from "./VoiceText";
import toast from "react-hot-toast";

import Fileloaded from "../FileUpload/Fileloaded";

export default function ChatInput() {
  const { dark } = useTheme();
  const dispatch = useDispatch();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showFileLoaded, setShowFileLoaded] = useState(false);

  const [selectedAgent, setSelectedAgent] = useState("Auto");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );

  // --------------------------------------------------
  // FILE HANDLING
  // --------------------------------------------------

  const handleFileSelect = (files) => {
    if (!files) return;

    const fileArray = Array.from(files);

    setSelectedFiles(fileArray);
  };

  const handleFileRemove = (index) => {
    if (index === "all") {
      setSelectedFiles([]);
      return;
    }

    setSelectedFiles((prev) =>
      prev.filter((_, fileIndex) => fileIndex !== index)
    );
  };

  const handleFileLoaded = (file) => {
    if (!file) return;

    setSelectedFiles((prev) => {
      const exists = prev.some(
        (existingFile) =>
          existingFile.name === file.name &&
          existingFile.size === file.size
      );

      if (exists) return prev;

      return [...prev, file];
    });

    setShowFileLoaded(false);

    toast.success("File added successfully");
  };

  // --------------------------------------------------
  // TOOLS
  // --------------------------------------------------

  const tools = [
    {
      id: "auto",
      icon: FiZap,
      label: "Auto",
    },
    {
      id: "chat",
      icon: FiMessageSquare,
      label: "Chat",
    },
    {
      id: "search",
      icon: FiSearch,
      label: "Search",
    },
    {
      id: "image",
      icon: FiImage,
      label: "Image",
    },
    {
      id: "coding",
      icon: FiCode,
      label: "Coding",
    },
    {
      id: "ppt",
      icon: FiFileText,
      label: "PPT",
    },
    {
      id: "pdf",
      icon: FiFile,
      label: "PDF",
    },
  ];

  // --------------------------------------------------
  // PDF DOWNLOAD
  // --------------------------------------------------

  const downloadPDF = (pdfBase64, title) => {
    try {
      if (!pdfBase64) {
        toast.error("No PDF data available");
        return false;
      }

      const byteCharacters = atob(pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `${title || "document"}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);

      toast.success("PDF downloaded successfully");

      return true;
    } catch (error) {
      console.error("PDF download failed:", error);

      toast.error("Failed to download PDF");

      return false;
    }
  };

  // --------------------------------------------------
  // SEND MESSAGE
  // --------------------------------------------------

  const handleSend = async () => {
    const text = message.trim();

    if (!text || loading) return;

    if (!selectedConversation?._id) {
      setShowErrorModal(true);
      return;
    }

    const isNewConversation =
      !selectedConversation.title ||
      selectedConversation.title === "New Conversation" ||
      selectedConversation.title === "New Chat";

    // --------------------------------------------------
    // UPDATE CONVERSATION TITLE
    // --------------------------------------------------

    if (isNewConversation) {
      let newTitle = text;

      if (newTitle.length > 30) {
        newTitle = `${newTitle.substring(0, 30)}...`;
      }

      dispatch(
        updateConversationTitle({
          id: selectedConversation._id,
          title: newTitle,
        })
      );

      dispatch(
        setSelectedConversation({
          ...selectedConversation,
          title: newTitle,
        })
      );

      try {
        await UpdateConversation({
          id: selectedConversation._id,
          title: newTitle,
        });
      } catch (error) {
        console.error("Failed to update title:", error);
      }
    }

    const payload = {
      prompt: text,
      conversationId: selectedConversation._id,
      agent: selectedAgent,
    };

    // --------------------------------------------------
    // USER MESSAGE
    // --------------------------------------------------

    dispatch(
      addMessage({
        role: "user",
        content: text,
        conversationId: selectedConversation._id,
      })
    );

    setMessage("");

    // --------------------------------------------------
    // AI REQUEST
    // --------------------------------------------------

    try {
      setLoading(true);

      const data = await ChatAgent(payload);

      console.log("Full Response:", data);

      // --------------------------------------------------
      // IMAGES
      // --------------------------------------------------

      let imageUrls = [];

      if (Array.isArray(data?.images)) {
        imageUrls = data.images
          .map((img) => {
            if (typeof img === "string") {
              return img;
            }

            if (img && typeof img === "object") {
              return img.url || img.src || "";
            }

            return "";
          })
          .filter(Boolean);
      }

      // --------------------------------------------------
      // PPT
      // --------------------------------------------------

      let pptData = null;
      let pptUrl = null;
      let pptGenerated = false;
      let pptFileName = null;

      if (data?.pptGenerated === true) {
        pptGenerated = true;
        pptUrl = data.pptUrl || null;
        pptFileName =
          data.pptFileName || "solvix-presentation.pptx";
        pptData = data.pptData || null;

        if (pptUrl) {
          toast.success("PowerPoint generated successfully");
        }
      }

      // --------------------------------------------------
      // PDF
      // --------------------------------------------------

      let pdfData = null;

      if (data?.pdf && data?.pdfGenerated === true) {
        pdfData = data.pdf;

        setTimeout(() => {
          downloadPDF(
            pdfData,
            data.response?.slice(0, 30) || "document"
          );
        }, 500);
      }

      // --------------------------------------------------
      // ASSISTANT MESSAGE
      // --------------------------------------------------

      dispatch(
        addMessage({
          role: "assistant",
          content: data?.response || "No response",

          conversationId: selectedConversation._id,

          images: imageUrls,

          pdf: pdfData || data?.pdf || null,
          pdfUrl: data?.pdfUrl || null,
          pdfGenerated: data?.pdfGenerated === true,

          ppt: data?.ppt || null,
          pptUrl: pptUrl || data?.pptUrl || null,
          pptGenerated:
            pptGenerated || data?.pptGenerated === true,
          pptFileName:
            pptFileName ||
            data?.pptFileName ||
            "solvix-presentation.pptx",
          pptData: pptData || data?.pptData || null,
        })
      );

      toast.success("Response received");
    } catch (error) {
      console.error(
        "Chat Error:",
        error?.response?.data || error?.message
      );

      dispatch(
        addMessage({
          role: "assistant",
          content:
            "Sorry, something went wrong. Please try again.",

          conversationId: selectedConversation._id,

          images: [],

          pdf: null,
          pdfGenerated: false,

          ppt: null,
          pptGenerated: false,
          pptUrl: null,
          pptFileName: null,
          pptData: null,
        })
      );

      toast.error("Failed to get response");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <>
      {/* ==========================================
          FILE UPLOAD MODAL
      ========================================== */}

      {showFileLoaded && (
        <Fileloaded
          dark={dark}
          onClose={() => setShowFileLoaded(false)}
          onFileSelect={handleFileLoaded}
        />
      )}

      {/* ==========================================
          ERROR MODAL
      ========================================== */}

      {showErrorModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm ${
            dark ? "bg-black/50" : "bg-white/50"
          }`}
          onClick={() => setShowErrorModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md rounded-2xl border p-8 text-center shadow-xl ${
              dark
                ? "border-white/10 bg-[#111111] text-white"
                : "border-gray-200 bg-white text-gray-900"
            }`}
          >
            <div
              className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl ${
                dark
                  ? "bg-white/10 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <RiMessageAi3Fill />
            </div>

            <h2 className="mb-2 text-xl font-semibold">
              No Conversation Selected
            </h2>

            <p
              className={`text-sm leading-6 ${
                dark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Please select a conversation from the sidebar
              before sending a message.
            </p>

            <button
              type="button"
              onClick={() => setShowErrorModal(false)}
              className={`mt-6 rounded-xl px-6 py-2.5 text-sm font-medium transition hover:scale-105 active:scale-95 ${
                dark
                  ? "bg-white text-black hover:bg-gray-200"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* ==========================================
          CHAT INPUT
      ========================================== */}

      <div
        className={`w-full border-t px-4 py-2 ${
          dark
            ? "border-white/10 bg-black"
            : "border-gray-200 bg-white"
        }`}
      >
        {/* Tools */}

        <div className="w-full py-2">
          <div className="flex flex-wrap items-center justify-around gap-2">
            {tools.map((item) => {
              const Icon = item.icon;

              const isActive =
                selectedAgent === item.id ||
                (selectedAgent === "Auto" &&
                  item.id === "auto");

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedAgent(item.id)}
                  className={`group inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 active:scale-95 sm:px-3 sm:py-2 sm:text-sm ${
                    isActive
                      ? dark
                        ? "border-white/30 bg-white/10 text-white"
                        : "border-gray-400 bg-gray-100 text-black"
                      : dark
                        ? "border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-black"
                  }`}
                >
                  <Icon
                    size={15}
                    className="shrink-0 transition-transform duration-200 group-hover:scale-110"
                  />

                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Files */}

        {selectedFiles.length > 0 && (
          <div className="mx-auto mb-2 flex max-w-4xl flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className={`flex max-w-[220px] items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
                  dark
                    ? "border-white/10 bg-white/5 text-gray-300"
                    : "border-gray-200 bg-gray-50 text-gray-700"
                }`}
              >
                <FiFile className="shrink-0" />

                <span className="truncate">
                  {file.name}
                </span>

                <button
                  type="button"
                  onClick={() => handleFileRemove(index)}
                  className="shrink-0 opacity-60 hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input */}

        <div className="mx-auto max-w-4xl">
          <div
            className={`flex items-end gap-2 rounded-md border p-2 shadow-sm ${
              dark
                ? "border-white/10 bg-[#111111]"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <Document
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              selectedFiles={selectedFiles}
            />

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={
                loading
                  ? "Solvix is thinking..."
                  : "Ask anything..."
              }
              rows={1}
              className={`max-h-32 min-h-[40px] flex-1 resize-none overflow-y-auto bg-transparent px-2 py-2.5 text-sm leading-5 outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                dark
                  ? "text-white placeholder:text-gray-500"
                  : "text-gray-900 placeholder:text-gray-400"
              }`}
            />

            <div className="flex shrink-0 items-center gap-1">
              {/* ATTACH */}

              <button
                type="button"
                title="Attach file"
                onClick={() =>
                  setShowFileLoaded(true)
                }
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95 ${
                  dark
                    ? "text-gray-400 hover:bg-white/10 hover:text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-black"
                }`}
              >
                <FiPaperclip
                  size={19}
                  strokeWidth={1.8}
                />
              </button>

              {/* VOICE */}

              <div className="-ms-2.5">
                <VoiceText
                  onTranscript={(text) => {
                    console.log(
                      "Final transcript:",
                      text
                    );
                  }}
                  setMessage={setMessage}
                  dark={dark}
                  loading={loading}
                />
              </div>

              {/* SEND */}

              <button
                type="button"
                onClick={handleSend}
                disabled={!message.trim() || loading}
                title="Send message"
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:scale-105 active:scale-95 ${
                  message.trim() && !loading
                    ? dark
                      ? "bg-white text-black hover:bg-gray-200"
                      : "bg-black text-white hover:bg-gray-800"
                    : dark
                      ? "cursor-not-allowed bg-white/10 text-gray-600"
                      : "cursor-not-allowed bg-gray-200 text-gray-400"
                }`}
              >
                <FiSend size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}