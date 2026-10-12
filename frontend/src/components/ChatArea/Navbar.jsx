
import React from "react";
import { useSelector } from "react-redux";
import { useTheme } from "../../BgContext/ThemeContext";
import { FaCrown } from "react-icons/fa";
import {useNavigate} from "react-router-dom"
export default function Navbar() {
  const { dark } = useTheme();
  const navigate=useNavigate()
const ResumeHendle=()=>{
  navigate('/resume')
}
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );

  const messages = useSelector(
    (state) => state.message.messages
  );

  return (
    <div
      className={`
        w-full
        px-6
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
        <div className="flex items-center justify-between">
          
         
          <div>
            <h1
              className={`
                text-lg
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
                text-xs
                ${dark ? "text-gray-400" : "text-gray-500"}
              `}
            >
              {messages.length} Messages
            </p>
          </div>

          {}
          <div className="flex items-center gap-3">
            <span
              className={`
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
      onClick={ResumeHendle}
  className={`
    flex items-center gap-2
    px-2
    py-2
    rounded-sm
    text-sm
    font-medium
    transition-all
    ${
      dark
        ? "bg-white text-black hover:bg-gray-200"
        : "bg-black text-white hover:bg-gray-800"
    }
  `}
>
  <FaCrown className="text-yellow-500" />
  Resume Analyze
</button>
          </div>

        </div>
      ) : (
        <div className="flex items-center justify-between">
          
          {}
          <div>
            <h1
              className={`
                text-lg
                font-semibold
                ${dark ? "text-white" : "text-black"}
              `}
            >
              New Chat
            </h1>

            <p
              className={`
                mt-1
                text-xs
                ${dark ? "text-gray-400" : "text-gray-500"}
              `}
            >
              No conversation selected
            </p>
          </div>

      <button
      onClick={ResumeHendle}
  className={`
    flex items-center gap-2
    px-2
    py-2
    rounded-sm
    text-sm
    font-medium
    transition-all
    ${
      dark
        ? "bg-white text-black hover:bg-gray-200"
        : "bg-black text-white hover:bg-gray-800"
    }
  `}
>
  <FaCrown className="text-yellow-500" />
  Resume Analyze
</button>

        </div>
      )}
    </div>
  );
}

