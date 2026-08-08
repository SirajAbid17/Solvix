// AllConverSation.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../BgContext/ThemeContext";
import { setSelectedConversation, updateConversationTitle } from "../../redux/conversationSlice";
import { RiMessageAi3Fill } from "react-icons/ri";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";
import UpdateConversation from "../../Features/UpdateConversation";

export default function AllConverSation() {
  const dispatch = useDispatch();
  const { conversations, selectedConversation } = useSelector(
    (state) => state.conversation
  );
  const { dark } = useTheme();
  
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [titleLoading, setTitleLoading] = useState(false);

  // Log when conversations change
  useEffect(() => {
    console.log("Conversations updated:", conversations.map(c => ({ id: c._id, title: c.title })));
  }, [conversations]);

  // Log when selected conversation changes
  useEffect(() => {
    console.log("Selected conversation:", selectedConversation?.title);
  }, [selectedConversation]);

  const handleSelectConversation = (conversation) => {
    console.log("Selecting conversation:", conversation.title);
    dispatch(setSelectedConversation(conversation));
  };

  const handleStartEdit = (e, conversation) => {
    e.stopPropagation();
    setEditingId(conversation._id);
    setEditTitle(conversation.title || "New Conversation");
  };

  const handleSaveTitle = async (e, conversationId) => {
    e.stopPropagation();
    const trimmedTitle = editTitle.trim();
    
    if (!trimmedTitle) {
      setEditingId(null);
      return;
    }

    const conversation = conversations.find(c => c._id === conversationId);
    if (trimmedTitle === conversation.title) {
      setEditingId(null);
      return;
    }

    try {
      setTitleLoading(true);
      await UpdateConversation({
        id: conversationId,
        title: trimmedTitle,
      });

      dispatch(updateConversationTitle({
        id: conversationId,
        title: trimmedTitle,
      }));

      setEditingId(null);
    } catch (error) {
      console.error("Failed to update title:", error);
      alert("Failed to update title. Please try again.");
    } finally {
      setTitleLoading(false);
    }
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleKeyDown = (e, conversationId) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveTitle(e, conversationId);
    }
    if (e.key === "Escape") {
      handleCancelEdit(e);
    }
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

  // Get the conversation title with fallback
  const getConversationTitle = (conversation) => {
    if (conversation.title && conversation.title !== "New Conversation") {
      return conversation.title;
    }
    return "New Conversation";
  };

  return (
    <div
      className={`
        w-full
        h-[150px]              
        overflow-y-auto
        px-2 py-2              
        space-y-1

        scrollbar-thin

        ${
          dark
            ? "scrollbar-thumb-gray-700"
            : "scrollbar-thumb-gray-300"
        }

        scrollbar-track-transparent

        sm:h-[160px]
        md:h-[180px]
        lg:h-[250px]
        xl:h-[360px]
      `}
    >
      {conversations.length > 0 ? (
        conversations.map((item, index) => {
          const isSelected = selectedConversation?._id === item._id;
          const isEditing = editingId === item._id;
          const displayTitle = getConversationTitle(item);
          
          return (
            <div
              key={item._id || index}
              onClick={() => !isEditing && handleSelectConversation(item)}
              className={`
                group
                flex items-center
                gap-2
                px-3 py-2         
                rounded-md
                cursor-pointer

                transition-all duration-200

                sm:px-3 sm:py-2

                ${
                  isSelected
                    ? dark
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-lg shadow-blue-500/10"
                      : "bg-blue-50 text-blue-700 border border-blue-200 shadow-lg shadow-blue-500/10"
                    : dark
                      ? "hover:bg-white/5 border border-transparent"
                      : "hover:bg-gray-50 border border-transparent"
                }
              `}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span
                    className={`
                      text-[9px]
                      font-medium
                      sm:text-[10px]
                      ${
                        isSelected
                          ? dark
                            ? "text-blue-300/80"
                            : "text-blue-600/80"
                          : dark
                            ? "text-gray-500"
                            : "text-gray-400"
                      }
                    `}
                  >
                    {formatTime(item.updatedAt || item.createdAt)}
                  </span>
                  
                  {isSelected && !isEditing && (
                    <div
                      className={`
                        w-1 h-1
                        rounded-full
                        flex-shrink-0

                        sm:w-1.5 sm:h-1.5

                        ${dark ? "bg-blue-400" : "bg-blue-500"}
                      `}
                    />
                  )}
                </div>

                {isEditing ? (
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, item._id)}
                      autoFocus
                      disabled={titleLoading}
                      className={`
                        flex-1
                        min-w-0
                        px-2
                        py-1
                        text-xs
                        font-medium
                        rounded-lg
                        outline-none
                        border-2
                        transition-all
                        ${
                          dark
                            ? "bg-black/50 border-blue-500/50 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                            : "bg-white border-blue-400 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        }
                      `}
                      placeholder="Enter title..."
                    />
                    <button
                      onClick={(e) => handleSaveTitle(e, item._id)}
                      disabled={titleLoading}
                      className={`
                        p-1
                        rounded-lg
                        transition-all
                        hover:scale-110
                        active:scale-95
                        flex-shrink-0
                        ${
                          dark 
                            ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" 
                            : "bg-green-100 text-green-600 hover:bg-green-200"
                        }
                        ${titleLoading ? "opacity-50 cursor-not-allowed" : ""}
                      `}
                    >
                      <FiCheck size={12} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className={`
                        p-1
                        rounded-lg
                        transition-all
                        hover:scale-110
                        active:scale-95
                        flex-shrink-0
                        ${
                          dark 
                            ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
                            : "bg-red-100 text-red-600 hover:bg-red-200"
                        }
                      `}
                    >
                      <FiX size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-1.5">
                    <h1
                      className={`
                        text-xs
                        font-medium
                        truncate
                        flex-1
                        min-w-0

                        sm:text-sm

                        ${
                          isSelected
                            ? dark
                              ? "text-blue-300"
                              : "text-blue-700"
                            : dark
                              ? "text-gray-200"
                              : "text-gray-800"
                        }
                      `}
                    >
                      {displayTitle}
                    </h1>

                    <button
                      onClick={(e) => handleStartEdit(e, item)}
                      className={`
                        p-1
                        ml-1
                        rounded-sm
                        border

                        transition-all
                        hover:scale-110
                        active:scale-95
                        flex-shrink-0
                        ${
                          dark
                            ? "border-white/10 text-gray-400 hover:border-white/20 hover:bg-white/10 hover:text-white"
                            : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-200 hover:text-gray-900"
                        }
                      `}
                    >
                      <FiEdit2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div
              className={`
                text-3xl
                mb-2
                ${dark ? "text-gray-600" : "text-gray-300"}
              `}
            >
             <RiMessageAi3Fill />
            </div>
            <p
              className={`
                text-xs
                font-medium
                ${dark ? "text-gray-500" : "text-gray-400"}
              `}
            >
              No conversations yet
            </p>
            <p
              className={`
                text-[10px]
                mt-0.5
                ${dark ? "text-gray-600" : "text-gray-400"}
              `}
            >
              Start a new chat to begin
            </p>
          </div>
        </div>
      )}
    </div>
  );
}