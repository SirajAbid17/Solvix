import React from "react";
import { useSelector } from "react-redux";
import { useTheme } from "../../BgContext/ThemeContext";
import { FaCrown } from "react-icons/fa";
import { FiCpu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { dark } = useTheme();
  const navigate = useNavigate();

  const ResumeHendle = () => {
    navigate("/resume");
  };

  const CustomAgentHandle = () => {
    navigate("/agent");
  };

  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );

  const messages = useSelector((state) => state.message.messages);

  return (
    <div
      className={`
        w-full
        px-3 sm:px-6
        py-2
        border-b
        transition-colors
        duration-300
        ${
          dark
            ? "bg-black text-white border-white/10"
            : "bg-white text-black border-gray-200"
        }
      `}
    >
      {selectedConversation ? (
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h1
              className={`
                truncate
                text-base sm:text-lg
                font-semibold
                tracking-wide
                ${dark ? "text-white" : "text-black"}
              `}
            >
              {selectedConversation.title}
            </h1>

            <p
              className={`
                mt-1
                text-[10px] sm:text-xs
                ${dark ? "text-gray-400" : "text-gray-500"}
              `}
            >
              {messages.length} Messages
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`
                hidden sm:inline-flex
                px-3
                py-1.5
                rounded-lg
                text-xs
                font-medium
                ${
                  dark
                    ? "bg-white/10 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                }
              `}
            >
              Active
            </span>

           
            <button
              onClick={CustomAgentHandle}
              title="Build custom AI agents"
              className={`
                flex items-center gap-1.5 sm:gap-2
                px-2 sm:px-3
                py-1.5 sm:py-2
                rounded-lg
                text-[11px] sm:text-sm
                font-medium
                transition-all
                active:scale-95
                ${
                  dark
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                }
              `}
            >
              <FiCpu className="text-[11px] sm:text-sm" />
              <span className="whitespace-nowrap">Custom Agent</span>
            </button>

           
            <button
              onClick={ResumeHendle}
              title="Analyze your resume"
              className={`
                flex items-center gap-1.5 sm:gap-2
                px-2 sm:px-3
                py-1.5 sm:py-2
                rounded-lg
                text-[11px] sm:text-sm
                font-medium
                transition-all
                active:scale-95
                ${
                  dark
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-black text-white hover:bg-gray-800"
                }
              `}
            >
              <FaCrown className="text-yellow-500 text-[11px] sm:text-sm" />
              <span className="whitespace-nowrap">Resume Analyze</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h1
              className={`
                text-base sm:text-lg
                font-semibold
                ${dark ? "text-white" : "text-black"}
              `}
            >
              New Chat
            </h1>

            <p
              className={`
                mt-1
                text-[10px] sm:text-xs
                ${dark ? "text-gray-400" : "text-gray-500"}
              `}
            >
              No conversation selected
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            
            <button
              onClick={CustomAgentHandle}
              title="Build custom AI agents"
              className={`
                flex items-center gap-1.5 sm:gap-2
                px-2 sm:px-3
                py-1.5 sm:py-2
                rounded-lg
                text-[11px] sm:text-sm
                font-medium
                transition-all
                active:scale-95
                ${
                  dark
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                }
              `}
            >
              <FiCpu className="text-[11px] sm:text-sm" />
              <span className="whitespace-nowrap">Custom Agent</span>
            </button>

          
            <button
              onClick={ResumeHendle}
              title="Analyze your resume"
              className={`
                flex items-center gap-1.5 sm:gap-2
                px-2 sm:px-3
                py-1.5 sm:py-2
                rounded-lg
                text-[11px] sm:text-sm
                font-medium
                transition-all
                active:scale-95
                ${
                  dark
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-black text-white hover:bg-gray-800"
                }
              `}
            >
              <FaCrown className="text-yellow-500 text-[11px] sm:text-sm" />
              <span className="whitespace-nowrap">Resume Analyze</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}