import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "../../BgContext/ThemeContext";
import toast from "react-hot-toast";
import MessageBubble from "./Message/MessageBubble";
import ThinkingIndicator from "./Message/ThinkingIndicator";

export default function Message() {
  const { dark } = useTheme();

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const [isThinking, setIsThinking] = useState(false);
  const [pdfDownloading, setPdfDownloading] = useState({});

  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );

  const allMessages = useSelector((state) => state.message.messages);

  const messages = allMessages.filter(
    (msg) => msg.conversationId === selectedConversation?._id
  );

  const showWelcome = messages.length === 0 || !selectedConversation;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      setIsThinking(lastMessage?.role === "user");
    } else {
      setIsThinking(false);
    }
  }, [messages]);

  const handlePDFDownload = (pdfBase64, title, messageId) => {
    const downloadKey = `pdf-${messageId}`;
    setPdfDownloading((prev) => ({ ...prev, [downloadKey]: true }));

    try {
      if (!pdfBase64) {
        toast.error("No PDF data available");
        setPdfDownloading((prev) => ({ ...prev, [downloadKey]: false }));
        return;
      }

      const byteCharacters = atob(pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title || "document"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => window.URL.revokeObjectURL(url), 100);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF download failed:", error);
      toast.error("Failed to download PDF");
    } finally {
      setPdfDownloading((prev) => ({ ...prev, [downloadKey]: false }));
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className={`
        flex-1
        w-full
        min-h-0
        overflow-y-auto
        overflow-x-hidden
        overscroll-contain
        px-2
        py-3
        transition-colors
        duration-300
        sm:px-4
        sm:py-4
        md:px-6
        lg:px-8
        ${dark ? "bg-black text-white" : "bg-white text-black"}

        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        ${
          dark
            ? "[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:hover:bg-white/40"
            : "[&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:hover:bg-gray-400"
        }
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:transition-all
        [&::-webkit-scrollbar-thumb]:duration-200
      `}
    >
      {showWelcome ? (
       
        <div className="flex min-h-full items-center justify-center px-2 sm:px-4">
          <div className="w-full max-w-2xl text-center">
            <h1
              className={`
                text-xl
                font-bold
                tracking-tight
                sm:text-2xl
                md:text-3xl
                lg:text-4xl
                ${dark ? "text-white" : "text-gray-900"}
              `}
            >
              Welcome to Solvix
            </h1>

            <p
              className={`
                mx-auto
                mt-3
                max-w-xl
                text-xs
                leading-5
                sm:mt-4
                sm:text-sm
                sm:leading-6
                md:text-[15px]
                md:leading-7
                ${dark ? "text-gray-400" : "text-gray-500"}
              `}
            >
              Your intelligent AI companion for coding, research,
              problem-solving, and everyday questions.
              <span
                className={`
                  mt-1
                  block
                  ${dark ? "text-gray-500" : "text-gray-400"}
                `}
              >
                Ask anything, explore ideas, and find smarter solutions with
                Solvix.
              </span>
            </p>

            <p
              className={`
                mt-5
                text-[10px]
                font-medium
                uppercase
                tracking-[0.2em]
                sm:mt-6
                sm:text-xs
                ${dark ? "text-gray-500" : "text-gray-400"}
              `}
            >
              How can I help you today?
            </p>
          </div>
        </div>
      ) : (
        
        <div
          className="
            mx-auto
            flex
            w-full
            max-w-3xl
            min-w-0
            flex-col
            gap-3
            pb-4
            sm:gap-4
            sm:pb-6
            md:max-w-4xl
            lg:max-w-5xl
            xl:max-w-6xl
          "
        >
          {messages.map((message, index) => {
            const messageId =
              message._id || message.id || `msg-${index}`;

            return (
              <MessageBubble
                key={messageId}
                message={message}
                index={index}
                dark={dark}
                onPDFDownload={handlePDFDownload}
              />
            );
          })}

          {isThinking && <ThinkingIndicator dark={dark} />}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}