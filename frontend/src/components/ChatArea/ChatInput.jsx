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
import { removeUploadedFile } from "../../redux/fileSlice";

import ChatAgent from "../../Features/ChatAgent";
import UpdateConversation from "../../Features/UpdateConversation";
import Document from "./Document";
import VoiceText from "./VoiceText";
import toast from "react-hot-toast";

import Fileloaded from "../FileUpload/Fileloaded";
import FileCard from "../FileUpload/FileCard";
import ImagePromptModal from "./ImagePromptModal";

export default function ChatInput() {
  const { dark } = useTheme();
  const dispatch = useDispatch();

  const [showFileLoaded, setShowFileLoaded] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("Auto");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [showImagePrompts, setShowImagePrompts] = useState(false);
  const [imagePromptFile, setImagePromptFile] = useState(null);

  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );

  const activeFileId = useSelector((state) => state.file.activeFileId);
  const activeFileContext = useSelector(
    (state) => state.file.activeFileContext
  );
  const activeImageBase64 = useSelector(
    (state) => state.file.activeImageBase64
  );
  const activeImageMimeType = useSelector(
    (state) => state.file.activeImageMimeType
  );
  const uploadedFiles = useSelector((state) => state.file.uploadedFiles);

  const tools = [
    { id: "auto", icon: FiZap, label: "Auto" },
    { id: "chat", icon: FiMessageSquare, label: "Chat" },
    { id: "search", icon: FiSearch, label: "Search" },
    { id: "image", icon: FiImage, label: "Image" },
    { id: "coding", icon: FiCode, label: "Coding" },
    { id: "ppt", icon: FiFileText, label: "PPT" },
    { id: "pdf", icon: FiFile, label: "PDF" },
  ];

  const parseError = (error) => {
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Something went wrong. Please try again.";

    const lowerMsg = String(errorMessage).toLowerCase();

    const isRateLimit =
      lowerMsg.includes("too many") ||
      lowerMsg.includes("rate limit") ||
      lowerMsg.includes("429");

    if (isRateLimit) {
      return {
        friendlyMessage: `##  Rate Limit Reached\n\nPlease wait a moment.`,
        toastMessage: "Too many requests. Wait a moment.",
      };
    }

    return {
      friendlyMessage: `##  Error\n\n${errorMessage}`,
      toastMessage: "Failed to get response",
    };
  };

  const processResponse = (data) => {
    if (!data) throw new Error("Empty response from backend");

    let responseText = data.response || data.message || data.aiResponse || "";

    if (Array.isArray(responseText)) {
      responseText = responseText
        .map((i) => (typeof i === "string" ? i : i?.text || ""))
        .join("");
    }

    responseText = String(responseText).trim();

    if (!responseText) {
      responseText = "No response received. Please try again.";
    }

    let imageUrls = [];
    if (Array.isArray(data?.images)) {
      imageUrls = data.images
        .map((img) => {
          if (typeof img === "string") return img;
          if (img && typeof img === "object") return img.url || img.src || "";
          return "";
        })
        .filter(Boolean);
    }

    let pptUrl = null;
    let pptGenerated = false;
    let pptFileName = null;
    let pptData = null;

    if (data?.pptGenerated === true) {
      pptGenerated = true;
      pptUrl = data.pptUrl || null;
      pptFileName = data.pptFileName || "solvix-presentation.pptx";
      pptData = data.pptData || null;
    }

    let pdfUrl = null;
    let pdfBase64 = null;
    let pdfGenerated = false;

    if (data?.pdfGenerated === true) {
      pdfGenerated = true;
      pdfBase64 = data.pdfBase64 || data.pdf || null;
      pdfUrl = data.pdfUrl || null;
    }

    dispatch(
      addMessage({
        role: "assistant",
        content: responseText,
        conversationId: selectedConversation._id,
        images: imageUrls,
        pdf: data?.pdf || null,
        pdfUrl,
        pdfBase64,
        pdfGenerated,
        ppt: data?.ppt || null,
        pptUrl,
        pptGenerated,
        pptFileName,
        pptData,
        ragUsed: data?.ragUsed || false,
        ragSources: data?.ragSources || [],
      })
    );
  };

  const buildAttachedFile = () => {
    if (!activeFileId) return null;

    const activeFile = uploadedFiles.find((f) => f.fileId === activeFileId);
    if (!activeFile) return null;

    return {
      fileId: activeFile.fileId,
      fileName: activeFile.fileName,
      fileType: activeFile.fileType,
      imageBase64: activeImageBase64 || null,
      imageMimeType: activeImageMimeType || null,
    };
  };

  const handleSendWithPrompt = async (promptText) => {
    if (loading) return;

    if (!selectedConversation?._id) {
      setShowErrorModal(true);
      return;
    }

    const attachedFileData = buildAttachedFile();

    const agentToSend = activeImageBase64
      ? "Auto"
      : selectedAgent === "auto"
      ? "Auto"
      : selectedAgent;

    const payload = {
      prompt: promptText,
      conversationId: selectedConversation._id,
      agent: agentToSend,
      fileId: activeFileId || null,
      fileContext: activeFileContext || null,
      fileName: attachedFileData?.fileName || null,
      fileType: attachedFileData?.fileType || null,
      imageBase64: activeImageBase64 || null,
      imageMimeType: activeImageMimeType || null,
    };

    dispatch(
      addMessage({
        role: "user",
        content: promptText,
        conversationId: selectedConversation._id,
        attachedFile: attachedFileData,
      })
    );

    setMessage("");

    if (activeFileId) {
      setTimeout(() => {
        dispatch(removeUploadedFile(activeFileId));
      }, 300);
    }

    try {
      setLoading(true);
      const data = await ChatAgent(payload);
      processResponse(data);
      toast.success("Response received");
    } catch (error) {
      console.error(" Chat Error:", error?.response?.data || error?.message);
      const { friendlyMessage, toastMessage } = parseError(error);

      dispatch(
        addMessage({
          role: "assistant",
          content: friendlyMessage,
          conversationId: selectedConversation._id,
          images: [],
          pdf: null,
          pdfUrl: null,
          pdfGenerated: false,
          ppt: null,
          pptGenerated: false,
        })
      );

      toast.error(toastMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const text = message.trim();
    if ((!text && !activeFileId) || loading) return;

    if (!selectedConversation?._id) {
      setShowErrorModal(true);
      return;
    }

    const isNewConversation =
      !selectedConversation.title ||
      selectedConversation.title === "New Conversation" ||
      selectedConversation.title === "New Chat";

    if (isNewConversation && text) {
      let newTitle = text.length > 30 ? `${text.substring(0, 30)}...` : text;

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

    const finalPrompt =
      text ||
      (activeFileId ? "What is this file about? Give me a summary." : "");

    const attachedFileData = buildAttachedFile();

    const hasAnyFile = activeFileId || activeImageBase64;
    const agentToSend = hasAnyFile
      ? "Auto"
      : selectedAgent === "auto"
      ? "Auto"
      : selectedAgent;

    const payload = {
      prompt: finalPrompt,
      conversationId: selectedConversation._id,
      agent: agentToSend,
      fileId: activeFileId || null,
      fileContext: activeFileContext || null,
      fileName: attachedFileData?.fileName || null,
      fileType: attachedFileData?.fileType || null,
      imageBase64: activeImageBase64 || null,
      imageMimeType: activeImageMimeType || null,
    };

    dispatch(
      addMessage({
        role: "user",
        content: finalPrompt,
        conversationId: selectedConversation._id,
        attachedFile: attachedFileData,
      })
    );

    setMessage("");

    if (activeFileId) {
      setTimeout(() => {
        dispatch(removeUploadedFile(activeFileId));
      }, 300);
    }

    try {
      setLoading(true);
      const data = await ChatAgent(payload);
      processResponse(data);
      toast.success("Response received");
    } catch (error) {
      console.error("Chat Error:", error?.response?.data || error?.message);
      const { friendlyMessage, toastMessage } = parseError(error);

      dispatch(
        addMessage({
          role: "assistant",
          content: friendlyMessage,
          conversationId: selectedConversation._id,
          images: [],
          pdf: null,
          pdfUrl: null,
          pdfGenerated: false,
          ppt: null,
          pptGenerated: false,
        })
      );

      toast.error(toastMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showFileLoaded && (
        <Fileloaded
          dark={dark}
          onClose={() => setShowFileLoaded(false)}
          onUploadSuccess={(fileData) => {
            setShowFileLoaded(false);

            if (fileData?.fileType === "image") {
              setImagePromptFile(fileData);
              setShowImagePrompts(true);
            }
          }}
        />
      )}

      {showImagePrompts && (
        <ImagePromptModal
          dark={dark}
          fileName={imagePromptFile?.fileName || "image"}
          onClose={() => {
            setShowImagePrompts(false);
            setImagePromptFile(null);
          }}
          onSelectPrompt={(prompt) => {
            setShowImagePrompts(false);

            setTimeout(() => {
              handleSendWithPrompt(prompt);
              setImagePromptFile(null);
            }, 150);
          }}
        />
      )}

      {showErrorModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm ${
            dark ? "bg-black/50" : "bg-white/50"
          }`}
          onClick={() => setShowErrorModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md rounded-2xl border p-6 text-center shadow-xl sm:p-8 ${
              dark
                ? "border-white/10 bg-[#111111] text-white"
                : "border-gray-200 bg-white text-gray-900"
            }`}
          >
            <div
              className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-xl sm:h-14 sm:w-14 sm:text-2xl ${
                dark ? "bg-white/10 text-white" : "bg-gray-100 text-gray-900"
              }`}
            >
              <RiMessageAi3Fill />
            </div>

            <h2 className="mb-2 text-lg font-semibold sm:text-xl">
              No Conversation Selected
            </h2>

            <p
              className={`text-xs leading-5 sm:text-sm sm:leading-6 ${
                dark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Please select a conversation from the sidebar before sending a
              message.
            </p>

            <button
              type="button"
              onClick={() => setShowErrorModal(false)}
              className={`mt-5 rounded-xl px-5 py-2 text-xs font-medium transition hover:scale-105 active:scale-95 sm:mt-6 sm:px-6 sm:py-2.5 sm:text-sm ${
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

     
      <div
        className={`
          w-full
          shrink-0
          border-t
          px-2
          py-2
          transition-colors
          duration-300
          sm:px-4
          sm:py-3
          md:px-6
          ${dark ? "border-white/10 bg-black" : "border-gray-200 bg-white"}
        `}
      >
      
        <div className="w-full pb-2">
          <div
            className="
              flex
              items-center
              gap-1.5
              overflow-x-auto
              pb-1
              sm:flex-wrap
              sm:justify-center
              sm:gap-2
              sm:overflow-visible
              sm:pb-0
              [&::-webkit-scrollbar]:h-0
            "
          >
            {tools.map((item) => {
              const Icon = item.icon;
              const isActive =
                selectedAgent === item.id ||
                (selectedAgent === "Auto" && item.id === "auto");

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedAgent(item.id)}
                  className={`
                    group
                    inline-flex
                    shrink-0
                    items-center
                    justify-center
                    gap-1
                    whitespace-nowrap
                    rounded-lg
                    border
                    px-2
                    py-1.5
                    text-[11px]
                    font-medium
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    active:scale-95
                    sm:gap-1.5
                    sm:px-2.5
                    sm:py-1.5
                    sm:text-xs
                    md:px-3
                    md:py-2
                    md:text-sm
                    ${
                      isActive
                        ? dark
                          ? "border-white/30 bg-white/10 text-white"
                          : "border-gray-400 bg-gray-100 text-black"
                        : dark
                        ? "border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-black"
                    }
                  `}
                >
                  <Icon
                    size={13}
                    className="shrink-0 transition-transform duration-200 group-hover:scale-110 sm:size-[15px]"
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <FileCard />

       
        <div className="mx-auto max-w-4xl">
          <div
            className={`
              flex
              items-end
              gap-1
              rounded-md
              border
              p-1.5
              shadow-sm
              sm:gap-2
              sm:p-2
              ${dark ? "border-white/10 bg-[#111111]" : "border-gray-200 bg-gray-50"}
            `}
          >
            <Document
              onFileSelect={() => {}}
              onFileRemove={() => {}}
              selectedFiles={[]}
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
                loading
                  ? "Solvix is thinking..."
                  : activeFileId
                  ? "Ask about the file..."
                  : "Ask anything..."
              }
              rows={1}
              className={`
                max-h-32
                min-h-[36px]
                flex-1
                resize-none
                overflow-y-auto
                bg-transparent
                px-1.5
                py-2
                text-[13px]
                leading-5
                outline-none
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
                sm:min-h-[40px]
                sm:px-2
                sm:py-2.5
                sm:text-sm
                ${
                  dark
                    ? "text-white placeholder:text-gray-500"
                    : "text-gray-900 placeholder:text-gray-400"
                }
              `}
            />

            <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
              <button
                type="button"
                title="Attach file"
                onClick={() => setShowFileLoaded(true)}
                className={`
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  transition-all
                  hover:scale-105
                  active:scale-95
                  sm:h-10
                  sm:w-10
                  sm:rounded-xl
                  ${
                    dark
                      ? "text-gray-400 hover:bg-white/10 hover:text-white"
                      : "text-gray-500 hover:bg-gray-100 hover:text-black"
                  }
                `}
              >
                <FiPaperclip size={17} strokeWidth={1.8} className="sm:size-[19px]" />
              </button>

              <div className="-ms-1 sm:-ms-2.5">
                <VoiceText
                  onTranscript={(text) => console.log("Final:", text)}
                  setMessage={setMessage}
                  dark={dark}
                  loading={loading}
                />
              </div>

              <button
                type="button"
                onClick={handleSend}
                disabled={(!message.trim() && !activeFileId) || loading}
                title="Send message"
                className={`
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  transition-all
                  hover:scale-105
                  active:scale-95
                  sm:h-10
                  sm:w-10
                  ${
                    (message.trim() || activeFileId) && !loading
                      ? dark
                        ? "bg-white text-black hover:bg-gray-200"
                        : "bg-black text-white hover:bg-gray-800"
                      : dark
                      ? "cursor-not-allowed bg-white/10 text-gray-600"
                      : "cursor-not-allowed bg-gray-200 text-gray-400"
                  }
                `}
              >
                <FiSend size={16} className="sm:size-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}