// AllConverSation.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../BgContext/ThemeContext";
import { setSelectedConversation } from "../../redux/conversationSlice";

export default function AllConverSation() {
  const dispatch = useDispatch();
  const { conversations, selectedConversation } = useSelector(
    (state) => state.conversation
  );
  const { dark } = useTheme();

  const handleSelectConversation = (conversation) => {
    dispatch(setSelectedConversation(conversation));
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`
        w-full
        h-[287px]
        overflow-y-auto
        px-2 py-3
        space-y-1

        scrollbar-thin

        ${
          dark
            ? "scrollbar-thumb-gray-700"
            : "scrollbar-thumb-gray-300"
        }

        scrollbar-track-transparent

        sm:h-[300px]
        md:h-[320px]
        lg:h-[350px]
        xl:h-[360px]
      `}
    >
      {conversations.length > 0 ? (
        conversations.map((item, index) => {
          const isSelected = selectedConversation?._id === item._id;
          
          return (
            <div
              key={item._id || index}
              onClick={() => handleSelectConversation(item)}
              className={`
                group
                flex items-center
                gap-2
                px-2 py-2
                rounded-lg
                cursor-pointer

                transition-all duration-200

                sm:gap-3
                sm:px-3
                sm:py-2.5

                ${
                  isSelected
                    ? dark
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      : "bg-blue-100 text-blue-700 border border-blue-300"
                    : dark
                      ? "hover:bg-white/10 border border-transparent"
                      : "hover:bg-gray-100 border border-transparent"
                }
              `}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h1
                    className={`
                      text-xs
                      font-medium
                      truncate
                      max-w-[100px]

                      sm:text-sm
                      sm:max-w-[140px]

                      md:max-w-[180px]
                      lg:max-w-[200px]
                      xl:max-w-[240px]

                      ${
                        isSelected
                          ? dark
                            ? "text-blue-300"
                            : "text-blue-700"
                          : dark
                            ? "text-gray-200 group-hover:text-white"
                            : "text-gray-800 group-hover:text-black"
                      }
                    `}
                  >
                    {item.title || "New Conversation"}
                  </h1>

                  <span
                    className={`
                      text-[8px]
                      flex-shrink-0
                      ml-1

                      sm:text-[10px]
                      sm:ml-2

                      ${
                        dark
                          ? "text-gray-500"
                          : "text-gray-400"
                      }
                    `}
                  >
                    {formatTime(item.updatedAt || item.createdAt)}
                  </span>
                </div>

                <p
                  className={`
                    text-[10px]
                    mt-0.5
                    truncate

                    sm:text-[11px]

                    ${
                      isSelected
                        ? dark
                          ? "text-blue-300/70"
                          : "text-blue-600/70"
                        : dark
                          ? "text-gray-500"
                          : "text-gray-500"
                    }
                  `}
                >
                  Conversation {index + 1}
                </p>
              </div>

              {isSelected && (
                <div
                  className={`
                    w-1.5 h-1.5
                    rounded-full
                    flex-shrink-0

                    sm:w-2 sm:h-2

                    ${dark ? "bg-blue-400" : "bg-blue-500"}
                  `}
                />
              )}
            </div>
          );
        })
      ) : (
        <div className="h-full flex items-center justify-center">
          <p
            className={`
              text-xs
              sm:text-sm
              ${dark ? "text-gray-500" : "text-gray-500"}
            `}
          >
            No conversations yet
          </p>
        </div>
      )}
    </div>
  );
}