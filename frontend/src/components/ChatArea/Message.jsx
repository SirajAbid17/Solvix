import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "../../BgContext/ThemeContext";
import { FiCopy, FiCheck, FiImage } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Message() {
  const { dark } = useTheme();
  const messagesEndRef = useRef(null);
  const [copiedId, setCopiedId] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation,
  );

  const allMessages = useSelector((state) => state.message.messages);

  // Filter messages for the selected conversation
  const messages = allMessages.filter(
    (msg) => msg.conversationId === selectedConversation?._id
  );

  const showWelcome = messages.length === 0 || !selectedConversation;

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Copy message
  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  // Handle image error
  const handleImageError = (key) => {
    setImageErrors(prev => ({ ...prev, [key]: true }));
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
        ${dark ? "bg-black text-white" : "bg-white text-black"}

        /* Scrollbar */
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        ${
          dark
            ? "[&::-webkit-scrollbar-thumb]:bg-white/20"
            : "[&::-webkit-scrollbar-thumb]:bg-gray-300"
        }
        [&::-webkit-scrollbar-thumb]:rounded-full
      `}
    >
      {showWelcome ? (
        /* =====================
           WELCOME
        ====================== */
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="w-full max-w-2xl px-4 text-center">
            <h1
              className={`
                text-2xl
                sm:text-3xl
                md:text-4xl
                font-bold
                tracking-tight
                ${dark ? "text-white" : "text-gray-900"}
              `}
            >
              Welcome to Solvix
            </h1>

            <p
              className={`
                mx-auto
                mt-4
                max-w-xl
                text-sm
                sm:text-[15px]
                leading-6
                sm:leading-7
                ${dark ? "text-gray-400" : "text-gray-500"}
              `}
            >
              Your intelligent AI companion for coding, research,
              problem-solving, and everyday questions.
              <span
                className={`
                  block
                  mt-1
                  ${dark ? "text-gray-500" : "text-gray-400"}
                `}
              >
                Ask anything, explore ideas, and find smarter solutions with
                Solvix.
              </span>
            </p>

            <p
              className={`
                mt-6
                text-xs
                font-medium
                uppercase
                tracking-[0.2em]
                ${dark ? "text-gray-500" : "text-gray-400"}
              `}
            >
              How can I help you today?
            </p>
          </div>
        </div>
      ) : (
        /* =====================
           MESSAGES
        ====================== */
        <div
          className="
            mx-auto
            flex
            w-full
            max-w-4xl
            flex-col
            gap-4
            pb-6
          "
        >
          {messages.map((message, index) => {
            const isUser = message.role === "user";

            const content =
              message.content || message.message || message.text || "";

            const messageId = message._id || message.id || `msg-${index}`;
            
            // 👇 YAHAN SE - Images nikaalein
            const images = message.images || [];

            return (
              <div
                key={messageId}
                className={`
                  flex
                  w-full
                  ${isUser ? "justify-end" : "justify-start"}
                `}
              >
                <div
                  className={`
                    group
                    relative
                    max-w-[90%]
                    sm:max-w-[80%]
                    md:max-w-[75%]
                    lg:max-w-[70%]

                    rounded-2xl
                    px-3
                    py-2

                    sm:px-4
                    sm:py-2.5

                    shadow-sm

                    ${
                      isUser
                        ? dark
                          ? "bg-white text-black rounded-br-md"
                          : "bg-black text-white rounded-br-md"
                        : dark
                          ? "bg-white/10 text-gray-200 rounded-bl-md"
                          : "bg-gray-100 text-gray-800 rounded-bl-md"
                    }
                  `}
                >
                  {/* =================
                      HEADER
                  ================== */}
                  <div
                    className="
                      mb-1
                      flex
                      items-center
                      justify-between
                      gap-4
                    "
                  >
                    <p
                      className={`
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-wider
                        ${
                          isUser
                            ? dark
                              ? "text-gray-500"
                              : "text-gray-400"
                            : dark
                              ? "text-gray-400"
                              : "text-gray-500"
                        }
                      `}
                    >
                      {isUser ? "You" : "Solvix AI"}
                    </p>

                    {/* Copy AI */}
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(content, messageId)}
                        title="Copy message"
                        className={`
                          rounded-md
                          p-1
                          opacity-0
                          transition-all
                          duration-200
                          group-hover:opacity-100
                          ${
                            dark
                              ? "text-gray-400 hover:bg-white/10 hover:text-white"
                              : "text-gray-500 hover:bg-black/10 hover:text-black"
                          }
                        `}
                      >
                        {copiedId === messageId ? (
                          <FiCheck size={14} className="text-green-500" />
                        ) : (
                          <FiCopy size={14} />
                        )}
                      </button>
                    )}
                  </div>

                  {/* =================
                      MESSAGE CONTENT
                  ================== */}

                  {isUser ? (
                    <p className="whitespace-pre-wrap break-words text-sm leading-5">
                      {content}
                    </p>
                  ) : (
                    <>
                      {/* AI Markdown */}
                      <div
                        className={`
                          prose
                          prose-sm
                          max-w-none
                          break-words

                          ${dark ? "prose-invert" : ""}

                          prose-headings:font-bold
                          prose-headings:tracking-tight

                          prose-h2:mt-4
                          prose-h2:mb-2
                          prose-h2:text-lg

                          prose-h3:mt-3
                          prose-h3:mb-1
                          prose-h3:text-base

                          prose-p:my-1.5
                          prose-p:leading-6

                          prose-ul:my-2
                          prose-ol:my-2

                          prose-li:my-0.5

                          prose-strong:font-bold

                          prose-code:rounded
                          prose-code:px-1
                          prose-code:py-0.5
                        `}
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {content}
                        </ReactMarkdown>
                      </div>

                      {/* 👇 YAHAN SE - Images display karein */}
                      {images && images.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-gray-400 mb-2">
                            📸 Related Images ({images.length})
                          </p>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {images.map((img, imgIndex) => {
                              const imageUrl = typeof img === 'string' ? img : img.url || img.src || img;
                              const imageKey = `${messageId}-${imgIndex}`;
                              
                              if (imageErrors[imageKey] || !imageUrl) {
                                return null;
                              }

                              return (
                                <div
                                  key={imageKey}
                                  className="relative overflow-hidden rounded-lg border border-white/10 bg-black/20 group/image"
                                >
                                  <img
                                    src={imageUrl}
                                    alt={`Search result ${imgIndex + 1}`}
                                    className="h-32 w-full object-cover transition-transform duration-300 group-hover/image:scale-105"
                                    loading="lazy"
                                    onError={() => handleImageError(imageKey)}
                                  />
                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover/image:opacity-100 transition-opacity duration-200">
                                    <a
                                      href={imageUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-white/90 hover:text-white flex items-center gap-1 justify-center"
                                    >
                                      <FiImage size={12} />
                                      View Full
                                    </a>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}