import React, { useState } from "react";
import { useTheme } from "../../BgContext/ThemeContext";
import { FiPaperclip, FiMic, FiSend } from "react-icons/fi";
import ChatAgent from "../../Features/ChatAgent";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../../redux/messageslice";

export default function ChatInput() {
  const { dark } = useTheme();
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );

  const handleSend = async () => {
    const text = message.trim();

    // Empty message prevent
    if (!text || loading) return;

    // Conversation select nahi hai
    if (!selectedConversation?._id) {
      console.log("Please select a conversation");
      return;
    }

    const payload = {
      prompt: text,
      conversationId: selectedConversation._id,
    };

    // =====================================
    // 1. Show USER message immediately
    // =====================================

    dispatch(
      addMessage({
        role: "user",
        content: text,
        conversationId: selectedConversation._id,
      })
    );

    // Clear input
    setMessage("");

    try {
      setLoading(true);

      // =====================================
      // 2. Send message to AI
      // =====================================

      const data = await ChatAgent(payload);

      console.log("AI Response:", data);

      // =====================================
      // 3. Show AI message immediately
      // =====================================

      dispatch(
        addMessage({
          role: "assistant",
          content: data.response,
          conversationId: selectedConversation._id,
        })
      );
    } catch (error) {
      console.error(
        "Chat Error:",
        error.response?.data || error.message
      );

      // Optional error message
      dispatch(
        addMessage({
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
          conversationId: selectedConversation._id,
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`
        w-full
        border-t
        px-4
        py-4
        transition-all
        duration-300
        ${
          dark
            ? "bg-black border-white/10"
            : "bg-white border-gray-200"
        }
      `}
    >
      
      <div className="mx-auto max-w-4xl">
        <div
          className={`
            group
            flex
            items-end
            gap-2
            rounded-xl
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
          {/* Attachment */}
          <button
            type="button"
            title="Attach file"
            className={`
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              transition-all
              hover:scale-105
              active:scale-95
              ${
                dark
                  ? "text-gray-400 hover:bg-white/10 hover:text-white"
                  : "text-gray-500 hover:bg-gray-200 hover:text-black"
              }
            `}
          >
            <FiPaperclip size={19} />
          </button>

          {/* Textarea */}
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
                : "Ask anything..."
            }
            rows={1}
            className={`
              max-h-32
              min-h-[40px]
              flex-1
              resize-none
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

          {/* Right Actions */}
          <div className="flex shrink-0 items-center gap-1">
            {/* Mic */}
            <button
              type="button"
              title="Voice input"
              disabled={loading}
              className={`
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                transition-all
                hover:scale-105
                active:scale-95
                ${
                  dark
                    ? "text-gray-400 hover:bg-white/10 hover:text-white"
                    : "text-gray-500 hover:bg-gray-200 hover:text-black"
                }
              `}
            >
              <FiMic size={19} />
            </button>

            {/* Send */}
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
                rounded-xl
                transition-all
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
  );
}

