import React, {
  useRef,
  useEffect,
  useState,
} from "react";

import { useSelector } from "react-redux";

import { useTheme } from "../../BgContext/ThemeContext";

import toast from "react-hot-toast";
import MessageBubble from "./Message/MessageBubble";
import ThinkingIndicator from "./Message/ThinkingIndicator";

export default function Message() {
  const { dark } = useTheme();

  const messagesEndRef = useRef(null);

  const [
    isThinking,
    setIsThinking,
  ] = useState(false);

  const [
    pdfDownloading,
    setPdfDownloading,
  ] = useState({});

  
  
  

  const selectedConversation =
    useSelector(
      (state) =>
        state.conversation
          .selectedConversation
    );

  
  
  

  const allMessages =
    useSelector(
      (state) =>
        state.message.messages
    );

  
  
  

  const messages =
    allMessages.filter(
      (msg) =>
        msg.conversationId ===
        selectedConversation?._id
    );

  
  
  

  const showWelcome =
    messages.length === 0 ||
    !selectedConversation;

  
  
  

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );
  }, [messages]);

  
  
  

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage =
        messages[
          messages.length - 1
        ];

      setIsThinking(
        lastMessage?.role === "user"
      );
    } else {
      setIsThinking(false);
    }
  }, [messages]);

  
  
  

  const handlePDFDownload = (
    pdfBase64,
    title,
    messageId
  ) => {
    const downloadKey =
      `pdf-${messageId}`;

    setPdfDownloading(
      (prev) => ({
        ...prev,
        [downloadKey]: true,
      })
    );

    try {
      console.log(
        "📄 Downloading PDF from message, length:",
        pdfBase64?.length
      );

      if (!pdfBase64) {
        toast.error(
          "No PDF data available"
        );

        setPdfDownloading(
          (prev) => ({
            ...prev,
            [downloadKey]: false,
          })
        );

        return;
      }

      
      
      

      const byteCharacters =
        atob(pdfBase64);

      const byteNumbers =
        new Array(
          byteCharacters.length
        );

      for (
        let i = 0;
        i < byteCharacters.length;
        i++
      ) {
        byteNumbers[i] =
          byteCharacters.charCodeAt(
            i
          );
      }

      const byteArray =
        new Uint8Array(
          byteNumbers
        );

      const blob = new Blob(
        [byteArray],
        {
          type: "application/pdf",
        }
      );

      
      
      

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `${title || "document"}.pdf`;

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );

      
      
      

      setTimeout(() => {
        window.URL.revokeObjectURL(
          url
        );
      }, 100);

      toast.success(
        "📄 PDF downloaded successfully!"
      );
    } catch (error) {
      console.error(
        "PDF download failed:",
        error
      );

      toast.error(
        "Failed to download PDF"
      );
    } finally {
      setPdfDownloading(
        (prev) => ({
          ...prev,
          [downloadKey]: false,
        })
      );
    }
  };

  
  
  

  return (
    <div
      className={`
        flex-1
        w-full
        overflow-y-auto

        px-3
        sm:px-4

        py-3

        transition-colors
        duration-300

        ${
          dark
            ? "bg-black text-white"
            : "bg-white text-black"
        }

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
        
        
        

        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="w-full max-w-2xl px-4 text-center">

            {}
            {}
            {}

            <h1
              className={`
                text-2xl
                sm:text-3xl
                md:text-4xl

                font-bold

                tracking-tight

                ${
                  dark
                    ? "text-white"
                    : "text-gray-900"
                }
              `}
            >
              Welcome to Solvix
            </h1>

            {}
            {}
            {}

            <p
              className={`
                mx-auto
                mt-4

                max-w-xl

                text-sm
                sm:text-[15px]

                leading-6
                sm:leading-7

                ${
                  dark
                    ? "text-gray-400"
                    : "text-gray-500"
                }
              `}
            >
              Your intelligent AI companion
              for coding, research,
              problem-solving, and everyday
              questions.

              <span
                className={`
                  block
                  mt-1

                  ${
                    dark
                      ? "text-gray-500"
                      : "text-gray-400"
                  }
                `}
              >
                Ask anything, explore ideas,
                and find smarter solutions
                with Solvix.
              </span>
            </p>

            
            <p
              className={`
                mt-6

                text-xs

                font-medium

                uppercase

                tracking-[0.2em]

                ${
                  dark
                    ? "text-gray-500"
                    : "text-gray-400"
                }
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
            max-w-4xl
            min-w-0
            flex-col
            gap-4

            px-2
            pb-6

            sm:px-4
          "
        >
         
          {messages.map(
            (
              message,
              index
            ) => {
              const messageId =
                message._id ||
                message.id ||
                `msg-${index}`;

              return (
                <MessageBubble
                  key={messageId}
                  message={message}
                  index={index}
                  dark={dark}
                  onPDFDownload={
                    handlePDFDownload
                  }
                />
              );
            }
          )}

          
          {isThinking && (
            <ThinkingIndicator
              dark={dark}
            />
          )}

         
          <div
            ref={messagesEndRef}
          />
        </div>
      )}
    </div>
  );
}

