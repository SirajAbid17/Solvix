import React, { useState } from "react";
import { useTheme } from "../../BgContext/ThemeContext";
import { FiPaperclip, FiMic, FiSend } from "react-icons/fi";
import ChatAgent from "../../Features/ChatAgent";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../../redux/messageslice";
import { RiMessageAi3Fill } from "react-icons/ri";
import {
  FiZap,
  FiMessageSquare,
  FiSearch,
  FiImage,
  FiCode,
  FiFileText,
  FiFile,
  FiUser,
} from "react-icons/fi";
import Document from "./Document";
import UpdateConversation from "../../Features/UpdateConversation";
import { updateConversationTitle, setSelectedConversation } from "../../redux/conversationSlice";
import VoiceText from "./VoiceText";
import toast from "react-hot-toast";

export default function ChatInput() {
  const { dark } = useTheme();
  const dispatch = useDispatch();
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  const handleFileSelect = (files) => {
    setSelectedFiles(files);
  };
  
  const handleFileRemove = (index) => {
    if (index === 'all') {
      setSelectedFiles([]);
    } else {
      const newFiles = [...selectedFiles];
      newFiles.splice(index, 1);
      setSelectedFiles(newFiles);
    }
  };

  const tools = [
    { id: "auto", icon: FiZap, label: "Auto" },
    { id: "chat", icon: FiMessageSquare, label: "Chat" },
    { id: "search", icon: FiSearch, label: "Search" },
    { id: "image", icon: FiImage, label: "Image" },
    { id: "coding", icon: FiCode, label: "Coding" },
    { id: "ppt", icon: FiFileText, label: "PPT" },
    { id: "pdf", icon: FiFile, label: "PDF" },
  ];
  
  const [selectedAgent, setSelectedAgent] = useState("Auto");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation,
  );

  // ✅ PDF Download Function
  const downloadPDF = (pdfBase64, title) => {
    try {
      console.log("📄 Downloading PDF, Base64 length:", pdfBase64?.length);
      
      if (!pdfBase64) {
        toast.error('No PDF data available');
        return false;
      }

      // Convert Base64 to Blob
      const byteCharacters = atob(pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title || 'document'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);

      toast.success('📄 PDF downloaded successfully!');
      return true;
    } catch (error) {
      console.error('PDF download failed:', error);
      toast.error('Failed to download PDF');
      return false;
    }
  };

  const handleSend = async () => {
    const text = message.trim();

    if (!text || loading) return;

    if (!selectedConversation?._id) {
      setShowErrorModal(true);
      return;
    }

    const isNewConversation = !selectedConversation.title || 
                              selectedConversation.title === "New Conversation" ||
                              selectedConversation.title === "New Chat";
    
    if (isNewConversation) {
      let newTitle = text;
      if (newTitle.length > 30) {
        newTitle = newTitle.substring(0, 30) + '...';
      }
      
      dispatch(updateConversationTitle({
        id: selectedConversation._id,
        title: newTitle
      }));
      
      dispatch(setSelectedConversation({
        ...selectedConversation,
        title: newTitle
      }));
      
      try {
        await UpdateConversation({
          id: selectedConversation._id,
          title: newTitle,
        });
        console.log("✅ Title updated in database to:", newTitle);
      } catch (error) {
        console.error("❌ Failed to update title:", error);
      }
    }

    const payload = {
      prompt: text,
      conversationId: selectedConversation._id,
      agent: selectedAgent,
    };

    dispatch(
      addMessage({
        role: "user",
        content: text,
        conversationId: selectedConversation._id,
      })
    );

    setMessage("");

    try {
      setLoading(true);
      const data = await ChatAgent(payload);
      
      console.log("🔍 Full Response:", data);
      console.log("🔍 PDF Generated:", data.pdfGenerated);
      console.log("🔍 PDF Length:", data.pdf?.length);

      let pdfData = null;
      if (data.pdf && data.pdfGenerated === true) {
        pdfData = data.pdf;
        console.log("📄 PDF received! Length:", pdfData.length);
        
        // ✅ Auto download
        setTimeout(() => {
          downloadPDF(pdfData, data.response?.slice(0, 30) || "document");
        }, 500);
      } else {
        console.warn("⚠️ No PDF in response!");
      }

      dispatch(
        addMessage({
          role: "assistant",
          content: data.response || "No response",
          conversationId: selectedConversation._id,
          images: data.images || [],
          pdf: pdfData,
          pdfGenerated: data.pdfGenerated === true,
        })
      );

    } catch (error) {
      console.error("Chat Error:", error.response?.data || error.message);
      dispatch(
        addMessage({
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
          conversationId: selectedConversation._id,
          images: [],
          pdf: null,
          pdfGenerated: false,
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Error Modal */}
      {showErrorModal && (
        <div
          className={`
            fixed inset-0
            flex items-center justify-center
            px-4
            z-50
            ${dark ? "bg-black/50" : "bg-white/50"}
            backdrop-blur-sm
            transition-all
            duration-200
          `}
          onClick={() => setShowErrorModal(false)}
        >
          <div
            className={`
              pointer-events-auto
              w-full max-w-md
              rounded-2xl
              border
              p-8
              text-center
              shadow-xl
              transform
              transition-all
              duration-200
              scale-100
              ${
                dark
                  ? "border-white/10 bg-[#111111] text-white shadow-black/40"
                  : "border-gray-200 bg-white text-gray-900 shadow-gray-200"
              }
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`
                mx-auto mb-4
                flex h-14 w-14
                items-center justify-center
                rounded-full
                text-2xl
                ${dark ? "bg-white/10 text-white" : "bg-gray-100 text-gray-900"}
              `}
            >
              <RiMessageAi3Fill />
            </div>

            <h2 className="mb-2 text-xl font-semibold">
              No Conversation Selected
            </h2>

            <p
              className={`
                text-sm leading-6
                ${dark ? "text-gray-400" : "text-gray-500"}
              `}
            >
              Please select a conversation from the sidebar before sending a
              message.
            </p>

            <button
              onClick={() => setShowErrorModal(false)}
              className={`
                mt-6
                px-6 py-2.5
                rounded-xl
                text-sm
                font-medium
                transition-all
                hover:scale-105
                active:scale-95
                ${
                  dark
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-black text-white hover:bg-gray-800"
                }
              `}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Chat Input */}
      <div
        className={`
          w-full
          border-t
          px-4
          py-2
          transition-all
          duration-300
          ${dark ? "bg-black border-white/10" : "bg-white border-gray-200"}
        `}
      >
        <div className="w-full py-2">
          <div className="flex justify-around flex-wrap items-center gap-2">
            {tools.map((item) => {
              const Icon = item.icon;
              const isActive = selectedAgent === item.id || 
                (selectedAgent === "Auto" && item.id === "auto");

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedAgent(item.id)}
                  className={`
                    group
                    inline-flex
                    items-center
                    justify-center
                    gap-1.5
                    rounded-lg
                    border
                    px-2.5
                    py-1.5
                    sm:px-3
                    sm:py-2
                    text-xs
                    sm:text-sm
                    font-medium
                    whitespace-nowrap
                    transition-all
                    duration-200
                    active:scale-95
                    hover:-translate-y-0.5
                    ${
                      isActive
                        ? dark
                          ? "border-white/30 bg-white/10 text-white"
                          : "border-gray-400 bg-gray-100 text-black"
                        : dark
                          ? "border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20 hover:bg-white/[0.08] hover:text-white hover:shadow-lg hover:shadow-white/5"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-black hover:shadow-md hover:shadow-gray-200/60"
                    }
                  `}
                >
                  <Icon
                    size={15}
                    className={`
                      shrink-0
                      transition-transform
                      duration-200
                      group-hover:scale-110
                      sm:w-4
                      sm:h-4
                    `}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="mx-auto max-w-4xl">
          <div
            className={`
              group
              flex
              items-end
              gap-2
              rounded-md
              border
              p-2
              shadow-sm
              transition-all
              duration-300
              focus-within:ring-2
              ${
                dark
                  ? `
                    bg-[#111111]
                    border-white/10
                    focus-within:border-white/20
                    focus-within:ring-white/5
                    shadow-black/30
                  `
                  : `
                    bg-gray-50
                    border-gray-200
                    focus-within:border-gray-300
                    focus-within:ring-gray-100
                    shadow-gray-200/50
                  `
              }
            `}
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
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={
                loading ? "Solvix is thinking..." : "Ask anything..."
              }
              rows={1}
              className={`
                max-h-32
                min-h-[40px]
                flex-1
                resize-none
                overflow-y-auto
                [scrollbar-width:none]
                [-ms-overflow-style:none]
                [&::-webkit-scrollbar]:hidden
                bg-transparent
                px-2
                py-2.5
                text-sm
                leading-5
                outline-none
                ${
                  dark
                    ? "text-white placeholder:text-gray-500"
                    : "text-gray-900 placeholder:text-gray-400"
                }
              `}
            />

            <div className="flex shrink-0 items-center gap-1">
              <VoiceText
                onTranscript={(text) => {
                  console.log('Final transcript:', text);
                }}
                setMessage={setMessage}
                dark={dark}
                loading={loading}
              />

              <button
                type="button"
                onClick={handleSend}
                disabled={!message.trim() || loading}
                title="Send message"
                className={`
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-md
                  transition-all
                  hover:scale-105
                  active:scale-95
                  ${
                    message.trim() && !loading
                      ? dark
                        ? "bg-white text-black hover:bg-gray-200"
                        : "bg-black text-white hover:bg-gray-800"
                      : dark
                        ? "cursor-not-allowed bg-white/10 text-gray-600"
                        : "cursor-not-allowed bg-gray-200 text-gray-400"
                  }
                `}
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