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

  useEffect(() => {
    console.log(
      "Conversations updated:",
      conversations.map((c) => ({
        id: c._id,
        title: c.title,
      })),
    );
  }, [conversations]);

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

    if (diff < 60000) {
      return "Just now";
    }

    if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}m ago`;
    }

    if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}h ago`;
    }

    if (diff < 604800000) {
      return `${Math.floor(diff / 86400000)}d ago`;
    }

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
        w-full

        h-[150px]
        sm:h-[165px]
        md:h-[190px]
        lg:h-[260px]
        xl:h-[370px]

        overflow-y-auto

        px-2
        sm:px-2.5
        lg:px-3

        py-2
        sm:py-2.5

        space-y-1.5
        sm:space-y-2

        scroll-smooth

        scrollbar-thin

        ${
          dark
            ? "scrollbar-thumb-white/10 scrollbar-track-transparent"
            : "scrollbar-thumb-gray-300 scrollbar-track-transparent"
        }
      `}
    >
      {}

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

                w-full

                flex
                items-center

                gap-2.5

                px-3
                py-2.5

                sm:px-3.5
                sm:py-3

                rounded-xl

                cursor-pointer

                border

                transition-colors
                duration-300
                ease-out

                overflow-hidden

                ${
                  isSelected
                    ? dark
                      ? `
                        bg-blue-500/[0.10]
                        border-blue-500/25
                        shadow-[0_4px_20px_rgba(59,130,246,0.08)]
                      `
                      : `
                        bg-blue-50/80
                        border-blue-200
                        shadow-[0_4px_18px_rgba(59,130,246,0.10)]
                      `
                    : dark
                      ? `
                        bg-white/[0.025]
                        border-white/[0.055]

                        hover:bg-white/[0.055]
                        hover:border-white/[0.10]

                        hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)]
                      `
                      : `
                        bg-white
                        border-gray-100

                        hover:bg-gray-50/80
                        hover:border-gray-200

                        hover:shadow-[0_8px_20px_rgba(0,0,0,0.05)]
                      `
                }
              `}
            >
              {}

              <div
                className={`
                  pointer-events-none
                  absolute
                  inset-0

                  opacity-0
                  group-hover:opacity-100

                  transition-opacity
                  duration-500

                  ${
                    dark
                      ? "bg-gradient-to-r from-transparent via-white/[0.025] to-transparent"
                      : "bg-gradient-to-r from-transparent via-blue-500/[0.025] to-transparent"
                  }
                `}
              />

              {}

              <div
                className={`
                  absolute
                  left-0
                  top-1/2

                  -translate-y-1/2

                  w-[3px]

                  rounded-r-full

                  transition-all
                  duration-500

                  ${
                    isSelected
                      ? dark
                        ? "h-7 bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.7)]"
                        : "h-7 bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.35)]"
                      : "h-0 bg-transparent"
                  }
                `}
              />

              {}

              <div
                className={`
                  relative
                  flex
                  items-center
                  justify-center

                  flex-shrink-0

                  w-8
                  h-8

                  sm:w-9
                  sm:h-9

                  rounded-lg

                  transition-all
                  duration-300

                  group-hover:scale-[1.04]

                  ${
                    isSelected
                      ? dark
                        ? `
                          bg-blue-500/15
                          text-blue-400
                          shadow-[0_0_15px_rgba(59,130,246,0.08)]
                        `
                        : `
                          bg-blue-100
                          text-blue-600
                        `
                      : dark
                        ? `
                          bg-white/[0.045]
                          text-gray-500

                          group-hover:bg-white/[0.08]
                          group-hover:text-gray-300
                        `
                        : `
                          bg-gray-100
                          text-gray-500

                          group-hover:bg-gray-200
                          group-hover:text-gray-700
                        `
                  }
                `}
              >
                <FiMessageSquare size={15} strokeWidth={2} />

                {}

                {isSelected && (
                  <span
                    className={`
                      absolute
                      -right-0.5
                      -top-0.5

                      w-2
                      h-2

                      rounded-full

                      ${dark ? "bg-blue-400" : "bg-blue-500"}

                      ring-2

                      ${dark ? "ring-[#111827]" : "ring-white"}

                      animate-pulse
                    `}
                  />
                )}
              </div>

              {}

              <div className="min-w-0 flex-1 relative z-10">
                {}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-2

                    mb-1
                  "
                >
                  <span
                    className={`
                      text-[9px]

                      sm:text-[10px]

                      font-medium

                      tracking-wide

                      uppercase

                      truncate

                      transition-colors
                      duration-300

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

                  {}

                  {isSelected && !isEditing && (
                    <span
                      className={`
                        flex-shrink-0

                        w-1.5
                        h-1.5

                        rounded-full

                        ${dark ? "bg-blue-400" : "bg-blue-500"}

                        animate-pulse
                      `}
                    />
                  )}
                </div>

                {}

                {isEditing ? (
                  <div
                    className="
                      flex
                      items-center
                      gap-1.5

                      w-full
                    "
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

                        px-2.5
                        py-1.5

                        text-xs
                        font-medium

                        rounded-lg

                        outline-none

                        border

                        transition-all

                        ${
                          dark
                            ? `
                              bg-black/30
                              border-blue-500/30
                              text-white

                              placeholder:text-gray-600

                              focus:border-blue-400
                              focus:ring-2
                              focus:ring-blue-500/10
                            `
                            : `
                              bg-white
                              border-blue-200
                              text-gray-900

                              placeholder:text-gray-400

                              focus:border-blue-500
                              focus:ring-2
                              focus:ring-blue-500/10
                            `
                        }
                      `}
                      placeholder="Enter title..."
                    />

                    {}

                    <button
                      onClick={(e) => handleSaveTitle(e, item._id)}
                      disabled={titleLoading}
                      aria-label="Save title"
                      className={`
                        flex
                        items-center
                        justify-center

                        w-7
                        h-7

                        rounded-lg

                        flex-shrink-0

                        transition-all
                        duration-200

                        hover:scale-105
                        active:scale-95

                        ${
                          dark
                            ? `
                              bg-emerald-500/10
                              text-emerald-400

                              hover:bg-emerald-500/20
                            `
                            : `
                              bg-emerald-50
                              text-emerald-600

                              hover:bg-emerald-100
                            `
                        }

                        ${titleLoading ? "opacity-50 cursor-not-allowed" : ""}
                      `}
                    >
                      <FiCheck size={13} />
                    </button>

                    {}

                    <button
                      onClick={handleCancelEdit}
                      aria-label="Cancel editing"
                      className={`
                        flex
                        items-center
                        justify-center

                        w-7
                        h-7

                        rounded-lg

                        flex-shrink-0

                        transition-all
                        duration-200

                        hover:scale-105
                        active:scale-95

                        ${
                          dark
                            ? `
                              bg-red-500/10
                              text-red-400

                              hover:bg-red-500/20
                            `
                            : `
                              bg-red-50
                              text-red-600

                              hover:bg-red-100
                            `
                        }
                      `}
                    >
                      <FiX size={13} />
                    </button>
                  </div>
                ) : (
                  <div
                    className="
                      flex
                      items-center
                      gap-2

                      w-full
                    "
                  >
                    <h1
                      title={displayTitle}
                      className={`
                        min-w-0
                        flex-1

                        truncate

                        text-[11px]

                        sm:text-xs

                        lg:text-sm

                        font-semibold

                        leading-5

                        tracking-[-0.01em]

                        transition-colors
                        duration-300

                        ${
                          isSelected
                            ? dark
                              ? "text-blue-200"
                              : "text-blue-700"
                            : dark
                              ? `
                                text-gray-200

                                group-hover:text-white
                              `
                              : `
                                text-gray-700

                                group-hover:text-gray-900
                              `
                        }
                      `}
                    >
                      {displayTitle}
                    </h1>

                    {}

                    <button
                      onClick={(e) => handleStartEdit(e, item)}
                      aria-label="Edit conversation title"
                      className={`
                        flex
                        items-center
                        justify-center

                        w-6
                        h-6

                        rounded-md

                        flex-shrink-0

                        border

                        opacity-0

                        group-hover:opacity-100

                        focus:opacity-100

                        transition-all
                        duration-300

                        hover:scale-110
                        active:scale-95

                        ${
                          dark
                            ? `
                              border-white/10
                              bg-white/[0.04]

                              text-gray-500

                              hover:bg-white/[0.10]
                              hover:border-white/20
                              hover:text-gray-200
                            `
                            : `
                              border-gray-200
                              bg-white

                              text-gray-400

                              hover:bg-gray-100
                              hover:border-gray-300
                              hover:text-gray-700
                            `
                        }
                      `}
                    >
                      <FiEdit2 size={11} />
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
          className="
            min-h-full

            flex
            items-center
            justify-center

            px-4
          "
        >
          <div className="text-center">
            {}

            <div
              data-empty-animation
              className={`
                mx-auto

                flex
                items-center
                justify-center

                w-12
                h-12

                mb-3

                rounded-2xl

                border

                ${
                  dark
                    ? `
                      bg-white/[0.035]
                      border-white/[0.06]
                      text-gray-600
                    `
                    : `
                      bg-gray-50
                      border-gray-100
                      text-gray-300
                    `
                }
              `}
            >
              <RiMessageAi3Fill size={23} />
            </div>

            {}

            <p
              data-empty-animation
              className={`
                text-xs
                sm:text-sm

                font-semibold

                ${dark ? "text-gray-400" : "text-gray-600"}
              `}
            >
              No conversations yet
            </p>

            {}

            <p
              data-empty-animation
              className={`
                text-[10px]
                sm:text-[11px]

                mt-1

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
