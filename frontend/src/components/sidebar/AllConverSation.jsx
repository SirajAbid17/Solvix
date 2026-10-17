import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../BgContext/ThemeContext";

import {
  setSelectedConversation,
  updateConversationTitle,
} from "../../redux/conversationSlice";

import { RiMessageAi3Fill } from "react-icons/ri";
import { FiEdit2, FiCheck, FiX, FiMessageSquare } from "react-icons/fi";

import { gsap } from "gsap";

import UpdateConversation from "../../Features/UpdateConversation";

export default function AllConverSation() {
  const dispatch = useDispatch();

  const { conversations, selectedConversation } = useSelector(
    (state) => state.conversation,
  );

  const { dark } = useTheme();

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [titleLoading, setTitleLoading] = useState(false);

  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const emptyStateRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = cardsRef.current.filter(Boolean);
    if (!cards.length) return;

    gsap.set(cards, {
      opacity: 0,
      y: 18,
      scale: 0.97,
      filter: "blur(4px)",
    });

    gsap.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: 0.65,
      stagger: 0.08,
      ease: "power3.out",
      clearProps: "filter",
    });

    return () => {
      gsap.killTweensOf(cards);
    };
  }, [conversations]);

  useEffect(() => {
    if (!emptyStateRef.current || conversations.length > 0) return;

    const elements = emptyStateRef.current.querySelectorAll(
      "[data-empty-animation]",
    );

    gsap.set(elements, {
      opacity: 0,
      y: 15,
    });

    gsap.to(elements, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: "power3.out",
    });

    return () => {
      gsap.killTweensOf(elements);
    };
  }, [conversations.length]);

  const handleSelectConversation = (conversation) => {
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

    const conversation = conversations.find((c) => c._id === conversationId);

    if (!conversation) {
      setEditingId(null);
      return;
    }

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

      dispatch(
        updateConversationTitle({
          id: conversationId,
          title: trimmedTitle,
        }),
      );

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

  const handleCardEnter = (element) => {
    if (!element) return;
    gsap.to(element, {
      y: -2,
      scale: 1.008,
      duration: 0.35,
      ease: "power2.out",
    });
  };

  const handleCardLeave = (element) => {
    if (!element) return;
    gsap.to(element, {
      y: 0,
      scale: 1,
      duration: 0.45,
      ease: "power3.out",
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString();
  };

  const getConversationTitle = (conversation) => {
    if (conversation.title && conversation.title !== "New Conversation") {
      return conversation.title;
    }
    return "New Conversation";
  };

  return (
    <div
      ref={containerRef}
      className={`
        relative
        h-full
        w-full
        space-y-1
        overflow-y-auto
        scroll-smooth
        scrollbar-thin
        sm:space-y-1.5
        ${dark ? "scrollbar-thumb-white/10 scrollbar-track-transparent" : "scrollbar-thumb-gray-300 scrollbar-track-transparent"}
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
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              onClick={() => !isEditing && handleSelectConversation(item)}
              onMouseEnter={(e) =>
                !isEditing && handleCardEnter(e.currentTarget)
              }
              onMouseLeave={(e) =>
                !isEditing && handleCardLeave(e.currentTarget)
              }
              className={`
                group
                relative
                flex
                w-full
                items-center
                gap-2
                overflow-hidden
                rounded-lg
                border
                px-2
                py-2
                transition-colors
                duration-300
                ease-out
                cursor-pointer
                sm:gap-2.5
                sm:rounded-xl
                sm:px-3
                sm:py-2.5
                ${
                  isSelected
                    ? dark
                      ? "border-blue-500/25 bg-blue-500/[0.10] shadow-[0_4px_20px_rgba(59,130,246,0.08)]"
                      : "border-blue-200 bg-blue-50/80 shadow-[0_4px_18px_rgba(59,130,246,0.10)]"
                    : dark
                      ? "border-white/[0.055] bg-white/[0.025] hover:border-white/[0.10] hover:bg-white/[0.055]"
                      : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50/80"
                }
              `}
            >
            
              <div
                className={`
                  absolute
                  left-0
                  top-1/2
                  w-[3px]
                  -translate-y-1/2
                  rounded-r-full
                  transition-all
                  duration-500
                  ${
                    isSelected
                      ? dark
                        ? "h-6 bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.7)] sm:h-7"
                        : "h-6 bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.35)] sm:h-7"
                      : "h-0 bg-transparent"
                  }
                `}
              />

         
              <div
                className={`
                  relative
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-md
                  transition-all
                  duration-300
                  group-hover:scale-[1.04]
                  sm:h-9
                  sm:w-9
                  sm:rounded-lg
                  ${
                    isSelected
                      ? dark
                        ? "bg-blue-500/15 text-blue-400"
                        : "bg-blue-100 text-blue-600"
                      : dark
                        ? "bg-white/[0.045] text-gray-500 group-hover:bg-white/[0.08] group-hover:text-gray-300"
                        : "bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700"
                  }
                `}
              >
                <FiMessageSquare size={12} strokeWidth={2} className="sm:size-[15px]" />
                {isSelected && (
                  <span
                    className={`
                      absolute
                      -right-0.5
                      -top-0.5
                      h-1.5
                      w-1.5
                      rounded-full
                      animate-pulse
                      sm:h-2
                      sm:w-2
                      ${dark ? "bg-blue-400 ring-2 ring-[#111827]" : "bg-blue-500 ring-2 ring-white"}
                    `}
                  />
                )}
              </div>

              {/* Content */}
              <div className="relative z-10 min-w-0 flex-1">
                {/* Time row */}
                <div className="mb-0.5 flex items-center justify-between gap-1.5 sm:mb-1 sm:gap-2">
                  <span
                    className={`
                      truncate
                      text-[8px]
                      font-medium
                      uppercase
                      tracking-wide
                      transition-colors
                      duration-300
                      sm:text-[9px]
                      lg:text-[10px]
                      ${
                        isSelected
                          ? dark
                            ? "text-blue-400/80"
                            : "text-blue-600/75"
                          : dark
                            ? "text-gray-600"
                            : "text-gray-400"
                      }
                    `}
                  >
                    {formatTime(item.updatedAt || item.createdAt)}
                  </span>

                  {isSelected && !isEditing && (
                    <span
                      className={`
                        h-1
                        w-1
                        shrink-0
                        animate-pulse
                        rounded-full
                        sm:h-1.5
                        sm:w-1.5
                        ${dark ? "bg-blue-400" : "bg-blue-500"}
                      `}
                    />
                  )}
                </div>

             
                {isEditing ? (
                  <div
                    className="flex w-full items-center gap-1 sm:gap-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, item._id)}
                      autoFocus
                      disabled={titleLoading}
                      className={`
                        w-full
                        min-w-0
                        rounded-md
                        border
                        px-1.5
                        py-1
                        text-[10px]
                        font-medium
                        outline-none
                        transition-all
                        sm:rounded-lg
                        sm:px-2.5
                        sm:py-1.5
                        sm:text-xs
                        ${
                          dark
                            ? "border-blue-500/30 bg-black/30 text-white placeholder:text-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10"
                            : "border-blue-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                        }
                      `}
                      placeholder="Enter title..."
                    />

                    <button
                      onClick={(e) => handleSaveTitle(e, item._id)}
                      disabled={titleLoading}
                      aria-label="Save title"
                      className={`
                        flex
                        h-6
                        w-6
                        shrink-0
                        items-center
                        justify-center
                        rounded-md
                        transition-all
                        duration-200
                        hover:scale-105
                        active:scale-95
                        sm:h-7
                        sm:w-7
                        sm:rounded-lg
                        ${
                          dark
                            ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        }
                        ${titleLoading ? "cursor-not-allowed opacity-50" : ""}
                      `}
                    >
                      <FiCheck size={11} className="sm:size-[13px]" />
                    </button>

                    <button
                      onClick={handleCancelEdit}
                      aria-label="Cancel editing"
                      className={`
                        flex
                        h-6
                        w-6
                        shrink-0
                        items-center
                        justify-center
                        rounded-md
                        transition-all
                        duration-200
                        hover:scale-105
                        active:scale-95
                        sm:h-7
                        sm:w-7
                        sm:rounded-lg
                        ${
                          dark
                            ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            : "bg-red-50 text-red-600 hover:bg-red-100"
                        }
                      `}
                    >
                      <FiX size={11} className="sm:size-[13px]" />
                    </button>
                  </div>
                ) : (
                  <div className="flex w-full items-center gap-1.5 sm:gap-2">
                    <h1
                      title={displayTitle}
                      className={`
                        min-w-0
                        flex-1
                        truncate
                        text-[10px]
                        font-semibold
                        leading-4
                        tracking-[-0.01em]
                        transition-colors
                        duration-300
                        sm:text-[11px]
                        sm:leading-5
                        lg:text-xs
                        ${
                          isSelected
                            ? dark
                              ? "text-blue-200"
                              : "text-blue-700"
                            : dark
                              ? "text-gray-200 group-hover:text-white"
                              : "text-gray-700 group-hover:text-gray-900"
                        }
                      `}
                    >
                      {displayTitle}
                    </h1>

                    <button
                      onClick={(e) => handleStartEdit(e, item)}
                      aria-label="Edit conversation title"
                      className={`
                        flex
                        h-5
                        w-5
                        shrink-0
                        items-center
                        justify-center
                        rounded-md
                        border
                        opacity-0
                        transition-all
                        duration-300
                        group-hover:opacity-100
                        focus:opacity-100
                        hover:scale-110
                        active:scale-95
                        sm:h-6
                        sm:w-6
                        ${
                          dark
                            ? "border-white/10 bg-white/[0.04] text-gray-500 hover:border-white/20 hover:bg-white/[0.10] hover:text-gray-200"
                            : "border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                        }
                      `}
                    >
                      <FiEdit2 size={9} className="sm:size-[11px]" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div
          ref={emptyStateRef}
          className="flex min-h-full items-center justify-center px-3 sm:px-4"
        >
          <div className="text-center">
            <div
              data-empty-animation
              className={`
                mx-auto
                mb-2
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                sm:mb-3
                sm:h-12
                sm:w-12
                sm:rounded-2xl
                ${
                  dark
                    ? "border-white/[0.06] bg-white/[0.035] text-gray-600"
                    : "border-gray-100 bg-gray-50 text-gray-300"
                }
              `}
            >
              <RiMessageAi3Fill size={18} className="sm:size-[23px]" />
            </div>

            <p
              data-empty-animation
              className={`text-[11px] font-semibold sm:text-xs lg:text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}
            >
              No conversations yet
            </p>

            <p
              data-empty-animation
              className={`mt-1 text-[9px] sm:text-[10px] lg:text-[11px] ${dark ? "text-gray-600" : "text-gray-400"}`}
            >
              Start a new chat to begin
            </p>
          </div>
        </div>
      )}
    </div>
  );
}