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
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const [isThinking, setIsThinking] = useState(false);

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

  // Check if last message is from user (AI is thinking)
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      setIsThinking(lastMessage?.role === "user");
    } else {
      setIsThinking(false);
    }
  }, [messages]);

  // Copy message - FIXED
  const handleCopy = (text, id) => {
    // Use clipboard API directly
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopiedId(id);
          setTimeout(() => {
            setCopiedId(null);
          }, 2000);
        })
        .catch((error) => {
          console.error("Copy failed:", error);
          // Fallback method
          fallbackCopy(text);
        });
    } else {
      // Fallback for older browsers
      fallbackCopy(text);
    }
  };

  // Fallback copy method
  const fallbackCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      // You might want to set copied state here too
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
    document.body.removeChild(textArea);
  };

  // Copy code block - FIXED
  const handleCopyCode = (code, id) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code)
        .then(() => {
          setCopiedCodeId(id);
          setTimeout(() => {
            setCopiedCodeId(null);
          }, 2000);
        })
        .catch((error) => {
          console.error("Copy failed:", error);
          fallbackCopy(code);
        });
    } else {
      fallbackCopy(code);
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
          min-w-0
          flex-col
          gap-4
          px-2
          pb-6
          sm:px-4
        "
      >
        {messages.map((message, index) => {
          const isUser = message.role === "user";

          const content =
            message.content || message.message || message.text || "";

          const messageId =
            message._id || message.id || `msg-${index}`;

          const images = message.images || [];

          return (
            <div
              key={messageId}
              className={`
                flex
                w-full
                min-w-0
                ${isUser ? "justify-end" : "justify-start"}
              `}
            >
              <div
                className={`
                  group
                  relative
                  min-w-0
                  max-w-[95%]
                  sm:max-w-[90%]
                  md:max-w-[82%]
                  lg:max-w-[78%]

                  overflow-hidden
                  rounded-2xl
                  px-3
                  py-2

                  sm:px-4
                  sm:py-3

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
                {/* =========================
                    HEADER
                ========================== */}
                <div
                  className="
                    mb-1.5
                    flex
                    min-w-0
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <p
                    className={`
                      min-w-0
                      truncate
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

                  {/* Copy button for BOTH user and AI messages - FIXED */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCopy(content, messageId);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    title="Copy message"
                    className={`
                      shrink-0
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
                      <FiCheck
                        size={14}
                        className="text-green-500"
                      />
                    ) : (
                      <FiCopy size={14} />
                    )}
                  </button>
                </div>

                {/* =========================
                    MESSAGE CONTENT
                ========================== */}

                {isUser ? (
                  <p
                    className="
                      min-w-0
                      whitespace-pre-wrap
                      break-words
                      [overflow-wrap:anywhere]
                      text-sm
                      leading-6
                    "
                  >
                    {content}
                  </p>
                ) : (
                  <>
                    {/* =========================
                        AI MARKDOWN
                    ========================== */}
                    <div
                      className={`
                        min-w-0
                        max-w-none
                        overflow-hidden

                        prose
                        prose-sm

                        ${dark ? "prose-invert" : ""}

                        prose-headings:font-bold
                        prose-headings:tracking-tight
                        prose-headings:break-words

                        prose-h1:mb-3
                        prose-h1:mt-4
                        prose-h1:text-xl

                        prose-h2:mb-2
                        prose-h2:mt-4
                        prose-h2:text-lg

                        prose-h3:mb-1.5
                        prose-h3:mt-3
                        prose-h3:text-base

                        prose-p:my-1.5
                        prose-p:leading-6
                        prose-p:break-words

                        prose-ul:my-2
                        prose-ol:my-2

                        prose-li:my-0.5
                        prose-li:break-words

                        prose-strong:font-bold

                        prose-a:break-all
                        prose-a:[overflow-wrap:anywhere]

                        prose-code:break-words
                        prose-code:rounded
                        prose-code:px-1
                        prose-code:py-0.5

                        prose-pre:my-3
                        prose-pre:max-w-full
                        prose-pre:overflow-x-auto
                        prose-pre:rounded-lg
                        prose-pre:p-3

                        prose-table:block
                        prose-table:max-w-full
                        prose-table:overflow-x-auto

                        [&_*]:max-w-full

                        /* Code block container styles */
                        .code-block-wrapper {
                          position: relative;
                        }
                        .code-block-wrapper:hover .copy-code-btn {
                          opacity: 1;
                        }
                        .copy-code-btn {
                          position: absolute;
                          top: 8px;
                          right: 8px;
                          opacity: 0;
                          transition: opacity 0.2s;
                          z-index: 10;
                        }
                      `}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          /* =========================
                             PARAGRAPH
                          ========================== */
                          p: ({ children }) => (
                            <p
                              className="
                                my-1.5
                                break-words
                                [overflow-wrap:anywhere]
                                leading-6
                              "
                            >
                              {children}
                            </p>
                          ),

                          /* =========================
                             LINKS
                          ========================== */
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="
                                break-all
                                text-blue-500
                                underline
                                hover:text-blue-600
                              "
                            >
                              {children}
                            </a>
                          ),

                          /* =========================
                             INLINE CODE
                          ========================== */
                          code: ({
                            inline,
                            className,
                            children,
                            ...props
                          }) => {
                            if (inline) {
                              return (
                                <code
                                  className="
                                    break-words
                                    rounded
                                    bg-black/10
                                    px-1.5
                                    py-0.5
                                    text-[0.85em]
                                    [overflow-wrap:anywhere]
                                  "
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            }

                            return (
                              <code
                                className={`
                                  block
                                  min-w-0
                                  whitespace-pre
                                  text-xs
                                  leading-5
                                  ${className || ""}
                                `}
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          },

                          /* =========================
                             CODE BLOCK WITH COPY BUTTON - FIXED
                          ========================== */
                          pre: ({ children }) => {
                            // Extract code from children
                            let codeContent = "";
                            if (children && children.props) {
                              const childProps = children.props;
                              if (childProps.children) {
                                codeContent = Array.isArray(childProps.children) 
                                  ? childProps.children.join('') 
                                  : childProps.children;
                              }
                            }

                            // Generate unique ID for this code block
                            const codeId = `code-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

                            return (
                              <div className="code-block-wrapper relative">
                                <pre
                                  className={`
                                    my-3
                                    max-w-full
                                    overflow-x-auto
                                    rounded-xl
                                    border
                                    p-3
                                    text-xs
                                    leading-5
                                    ${
                                      dark
                                        ? "border-white/10 bg-black/40"
                                        : "border-gray-200 bg-gray-900 text-gray-100"
                                    }
                                  `}
                                >
                                  {children}
                                </pre>
                                
                                {/* Copy button for code block - FIXED */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleCopyCode(codeContent, codeId);
                                  }}
                                  onMouseDown={(e) => e.preventDefault()}
                                  className="
                                    copy-code-btn
                                    absolute
                                    top-2
                                    right-2
                                    rounded-md
                                    bg-black/50
                                    p-1.5
                                    text-white
                                    transition-all
                                    hover:bg-black/70
                                    hover:scale-110
                                  "
                                  title="Copy code"
                                >
                                  {copiedCodeId === codeId ? (
                                    <FiCheck size={14} className="text-green-400" />
                                  ) : (
                                    <FiCopy size={14} />
                                  )}
                                </button>
                              </div>
                            );
                          },

                          /* =========================
                             LIST
                          ========================== */
                          ul: ({ children }) => (
                            <ul
                              className="
                                my-2
                                pl-5
                                break-words
                              "
                            >
                              {children}
                            </ul>
                          ),

                          ol: ({ children }) => (
                            <ol
                              className="
                                my-2
                                pl-5
                                break-words
                              "
                            >
                              {children}
                            </ol>
                          ),

                          li: ({ children }) => (
                            <li
                              className="
                                my-1
                                break-words
                                [overflow-wrap:anywhere]
                              "
                            >
                              {children}
                            </li>
                          ),

                          /* =========================
                             TABLE
                          ========================== */
                          table: ({ children }) => (
                            <div className="my-3 w-full overflow-x-auto">
                              <table className="min-w-max">
                                {children}
                              </table>
                            </div>
                          ),

                          /* =========================
                             BLOCKQUOTE
                          ========================== */
                          blockquote: ({ children }) => (
                            <blockquote
                              className={`
                                my-3
                                border-l-4
                                pl-3
                                break-words
                                ${
                                  dark
                                    ? "border-gray-600 text-gray-300"
                                    : "border-gray-300 text-gray-600"
                                }
                              `}
                            >
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {content}
                      </ReactMarkdown>
                    </div>

                    {/* =========================
                        IMAGES
                    ========================== */}
                    {images.length > 0 && (
                      <div className="mt-4 min-w-0">
                        <p
                          className={`
                            mb-2
                            text-xs
                            font-medium
                            ${
                              dark
                                ? "text-gray-400"
                                : "text-gray-500"
                            }
                          `}
                        >
                          📸 Related Images ({images.length})
                        </p>

                        <div
                          className="
                            grid
                            min-w-0
                            grid-cols-1
                            gap-2
                            sm:grid-cols-2
                            md:grid-cols-3
                          "
                        >
                          {images.map((img, imgIndex) => {
                            const imageUrl =
                              typeof img === "string"
                                ? img
                                : img?.url ||
                                  img?.src ||
                                  "";

                            const imageKey =
                              `${messageId}-${imgIndex}`;

                            if (
                              imageErrors[imageKey] ||
                              !imageUrl
                            ) {
                              return null;
                            }

                            return (
                              <div
                                key={imageKey}
                                className="
                                  group/image
                                  relative
                                  min-w-0
                                  overflow-hidden
                                  rounded-lg
                                  border
                                  border-white/10
                                  bg-black/20
                                "
                              >
                                <img
                                  src={imageUrl}
                                  alt={`Search result ${imgIndex + 1}`}
                                  className="
                                    block
                                    h-40
                                    w-full
                                    object-cover
                                    transition-transform
                                    duration-300
                                    group-hover/image:scale-105
                                  "
                                  loading="lazy"
                                  onError={() =>
                                    handleImageError(imageKey)
                                  }
                                />

                                <div
                                  className="
                                    absolute
                                    bottom-0
                                    left-0
                                    right-0
                                    flex
                                    items-center
                                    justify-center
                                    bg-gradient-to-t
                                    from-black/80
                                    to-transparent
                                    p-2
                                    opacity-0
                                    transition-opacity
                                    duration-200
                                    group-hover/image:opacity-100
                                  "
                                >
                                  <a
                                    href={imageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                      flex
                                      items-center
                                      justify-center
                                      gap-1
                                      text-xs
                                      text-white/90
                                      hover:text-white
                                    "
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

        
        {isThinking && (
          <div className="flex w-full min-w-0 justify-start">
            <div
              className={`
                relative
                min-w-0
                max-w-[95%]
                sm:max-w-[90%]
                md:max-w-[82%]
                lg:max-w-[78%]
                overflow-hidden
                rounded-2xl
                rounded-bl-md
                px-3
                py-2
                sm:px-4
                sm:py-3
                shadow-sm
                ${
                  dark
                    ? "bg-white/10 text-gray-200"
                    : "bg-gray-100 text-gray-800"
                }
              `}
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                {/* Animated dots */}
                <div className="flex">
                  <span />
                  <span/>
                  <span/>
                </div>
               <span
  className={`
    text-sm
    font-medium
    ${dark ? "text-gray-300" : "text-gray-600"}
    inline-flex
    items-center
    gap-2
  `}
>
  <h1>Thinking...</h1>
 
  
</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>


      )}
    </div>
  );
}