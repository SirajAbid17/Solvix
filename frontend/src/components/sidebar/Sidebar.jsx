import React, { useEffect, useState } from "react";

import { BsLayoutTextSidebarReverse } from "react-icons/bs";
import { BiSolidEditAlt } from "react-icons/bi";

import { useTheme } from "../../BgContext/ThemeContext";

import Register from "../Register";

import { useDispatch, useSelector } from "react-redux";

import {
  addConversation,
  clearConversations,
  setConversations,
} from "../../redux/conversationSlice";

import GetConversation from "../../Features/GetConversation";
import CreateConversation from "../../Features/CreateConversation";

import AllConverSation from "./AllConverSation";

import { useNavigate } from "react-router-dom";

import api from "../../utlis/axios";

import { setuserData } from "../../redux/userSlice";

import UserCelebration from "./UserCelebration";

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);

  const { dark } = useTheme();

  const { userdata } = useSelector((state) => state.user);

  // =========================================================
  // LOAD CONVERSATIONS
  // =========================================================

  useEffect(() => {
    const loadConversations = async () => {
      if (!userdata) {
        dispatch(clearConversations());
        return;
      }

      try {
        const data = await GetConversation();

        dispatch(setConversations(data || []));
      } catch (error) {
        console.error("Error loading conversations:", error);

        dispatch(clearConversations());
      }
    };

    loadConversations();
  }, [userdata, dispatch]);

  // =========================================================
  // NEW CHAT
  // =========================================================

  const handleNewChat = async () => {
    try {
      const data = await CreateConversation();

      if (data) {
        dispatch(addConversation(data));
      }

      console.log("New conversation created:", data);
    } catch (error) {
      console.error("Error creating new conversation:", error);
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");

      dispatch(setuserData(null));
      dispatch(clearConversations());

      setShowUserModal(false);

      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <aside
      className={`
        relative
        flex
        h-screen
        min-h-0
        shrink-0
        flex-col
        overflow-hidden
        border-r
        transition-[width]
        duration-300
        ease-in-out

        ${
          dark
            ? "border-white/[0.08] bg-black text-white"
            : "border-gray-200 bg-white text-black"
        }

        ${open ? "w-72" : "w-16"}
      `}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className={`
          flex
          h-14
          shrink-0
          items-center
          border-b
          px-3

          ${open ? "justify-between" : "justify-center"}

          ${dark ? "border-white/[0.08]" : "border-gray-200"}
        `}
      >
        {/* SIDEBAR TOGGLE */}

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={`
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-lg
            text-lg
            transition-all
            duration-200

            ${
              dark
                ? "text-gray-400 hover:bg-white/[0.06] hover:text-white"
                : "text-gray-500 hover:bg-gray-100 hover:text-black"
            }
          `}
          title={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          <BsLayoutTextSidebarReverse />
        </button>

        {/* LOGO */}

        {open && (
          <div
            className="
              flex
              min-w-0
              flex-1
              items-center
              justify-end
              gap-2
              pl-2
            "
          >
            <h1
              className={`
                min-w-0
                truncate
                text-lg
                font-extrabold
                tracking-wide
                sm:text-xl

                ${dark ? "text-white" : "text-black"}
              `}
            >
              Solvix AI
            </h1>

            {/* PLAN */}

            <span
              className={`
                shrink-0
                rounded-full
                border
                px-2
                py-0.5
                text-[8px]
                font-medium
                uppercase
                tracking-wider
                sm:text-[9px]

                ${
                  dark
                    ? "border-blue-500/20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300"
                    : "border-gray-200 bg-gray-100 text-gray-600"
                }
              `}
            >
              Free
            </span>

            {/* NEW CHAT ICON */}

            <button
              type="button"
              onClick={handleNewChat}
              className={`
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                text-lg
                transition-all
                duration-200
                hover:scale-105

                ${
                  dark
                    ? "text-gray-400 hover:bg-white/[0.06] hover:text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-black"
                }
              `}
              title="New chat"
            >
              <BiSolidEditAlt />
            </button>
          </div>
        )}
      </div>

      {/* =====================================================
          NEW CHAT BUTTON
      ===================================================== */}

      <div className="shrink-0 px-2 pt-2">
        <button
          type="button"
          onClick={handleNewChat}
          className={`
            flex
            h-10
            w-full
            items-center
            justify-center
            gap-2
            overflow-hidden
            rounded-lg
            border
            px-3
            text-sm
            font-medium
            transition-all
            duration-200
            active:scale-[0.98]

            ${
              dark
                ? "border-white/[0.15] bg-black text-white hover:border-white/30 hover:bg-white hover:text-black"
                : "border-gray-300 bg-white text-black hover:border-black hover:bg-black hover:text-white"
            }

            ${!open ? "px-2" : ""}
          `}
        >
          {open ? (
            <>
              <BiSolidEditAlt className="shrink-0 text-base" />

              <span className="truncate">New Chat</span>
            </>
          ) : (
            <BiSolidEditAlt className="shrink-0 text-lg" />
          )}
        </button>
      </div>

      {/* =====================================================
          CONVERSATIONS + CELEBRATION
          BALLOONS ARE LIMITED TO THIS AREA ONLY
      ===================================================== */}

      {open && (
        <div
          className="
            relative
            min-h-0
            min-w-0
            flex-1
            overflow-hidden
          "
        >
          {/* =================================================
              CELEBRATION LAYER

              This is inside the conversation area.
              It does NOT cover ChatArea or Coding.
          ================================================= */}

          {userdata && <UserCelebration />}

          {/* =================================================
              CONVERSATION LIST
          ================================================= */}

          <div
            className="
              relative
              z-[10]
              h-full
              min-h-0
              min-w-0
              w-full
              overflow-y-auto
              overflow-x-hidden
              overscroll-contain
              px-2
              pb-2
              pt-2
              scrollbar-thin
            "
          >
            <AllConverSation />
          </div>
        </div>
      )}

      {/* =====================================================
          USER SECTION
      ===================================================== */}

      <div
        className={`
          relative
          mt-auto
          w-full
          shrink-0
          border-t
          p-2

          ${dark ? "border-white/[0.08]" : "border-gray-200"}
        `}
      >
        {userdata ? (
          <>
            {/* =================================================
                OPEN USER
            ================================================= */}

            {open ? (
              <button
                type="button"
                onClick={() => setShowUserModal(true)}
                className={`
                  relative
                  z-[30]
                  flex
                  w-full
                  min-w-0
                  items-center
                  gap-2
                  rounded-lg
                  border
                  p-2
                  text-left
                  transition-all
                  duration-200

                  ${
                    dark
                      ? "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07]"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }
                `}
              >
                <img
                  src={userdata.avatar}
                  alt={userdata.name || "User"}
                  className={`
                    h-9
                    w-9
                    shrink-0
                    rounded-full
                    border
                    object-cover

                    ${dark ? "border-white/10" : "border-gray-200"}
                  `}
                />

                <div className="min-w-0 flex-1">
                  <h1
                    className={`
                      truncate
                      text-xs
                      font-semibold

                      ${dark ? "text-white" : "text-gray-900"}
                    `}
                  >
                    {userdata.name || "User"}
                  </h1>

                  <p className="mt-0.5 truncate text-[10px] text-gray-500">
                    Free Plan
                  </p>
                </div>

                <svg
                  className={`
                    h-4
                    w-4
                    shrink-0

                    ${dark ? "text-gray-500" : "text-gray-400"}
                  `}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ) : (
              /* =================================================
                 CLOSED USER
              ================================================= */

              <button
                type="button"
                onClick={() => setShowUserModal(true)}
                className="
                  relative
                  z-[30]
                  flex
                  w-full
                  items-center
                  justify-center
                "
              >
                <img
                  src={userdata.avatar}
                  alt={userdata.name || "User"}
                  className={`
                    h-9
                    w-9
                    rounded-full
                    border-2
                    object-cover
                    transition-all
                    duration-200
                    hover:scale-105

                    ${
                      dark
                        ? "border-white/20 hover:border-white/40"
                        : "border-gray-300 hover:border-gray-500"
                    }
                  `}
                />
              </button>
            )}
          </>
        ) : (
          <div className="w-full">
            <Register />
          </div>
        )}
      </div>

      {/* =====================================================
          USER MODAL
      ===================================================== */}

      {showUserModal && userdata && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/50
            p-4
            backdrop-blur-sm
          "
          onClick={() => setShowUserModal(false)}
        >
          <div
            className={`
              relative
              w-full
              max-w-sm
              rounded-2xl
              border
              p-6
              shadow-2xl

              ${
                dark
                  ? "border-white/[0.08] bg-[#111] text-white"
                  : "border-gray-200 bg-white text-gray-900"
              }
            `}
            onClick={(event) => event.stopPropagation()}
          >
            {/* CLOSE */}

            <button
              type="button"
              onClick={() => setShowUserModal(false)}
              className={`
                absolute
                right-3
                top-3
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                transition-all

                ${
                  dark
                    ? "text-gray-400 hover:bg-white/[0.06] hover:text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-black"
                }
              `}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* PROFILE */}

            <div className="flex flex-col items-center text-center">
              <img
                src={userdata.avatar}
                alt={userdata.name || "User"}
                className={`
                  mb-4
                  h-20
                  w-20
                  rounded-full
                  border-4
                  object-cover

                  ${dark ? "border-white/10" : "border-gray-200"}
                `}
              />

              <h2
                className={`
                  text-lg
                  font-bold

                  ${dark ? "text-white" : "text-gray-900"}
                `}
              >
                {userdata.name || "User"}
              </h2>

              <p className="mt-1 max-w-full truncate text-sm text-gray-500">
                {userdata.email || "user@email.com"}
              </p>

              <span
                className={`
                  mt-4
                  rounded-full
                  border
                  px-4
                  py-1.5
                  text-xs
                  font-medium

                  ${
                    dark
                      ? "border-blue-500/20 bg-blue-500/10 text-blue-300"
                      : "border-gray-200 bg-gray-100 text-gray-600"
                  }
                `}
              >
                Free Plan
              </span>

              <div className="mt-5 w-full space-y-2">
                {/* DASHBOARD */}

                <button
                  type="button"
                  onClick={() => {
                    setShowUserModal(false);
                    navigate("/user-dashboard");
                  }}
                  className={`
                    w-full
                    rounded-lg
                    border
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    transition-all
                    duration-200
                    active:scale-[0.98]

                    ${
                      dark
                        ? "border-white/10 bg-white/[0.05] hover:bg-white hover:text-black"
                        : "border-gray-200 bg-gray-100 hover:bg-black hover:text-white"
                    }
                  `}
                >
                  User Dashboard
                </button>

                {/* LOGOUT */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className={`
                    w-full
                    rounded-lg
                    border
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    transition-all
                    duration-200
                    active:scale-[0.98]

                    ${
                      dark
                        ? "border-red-500/20 text-red-400 hover:bg-red-500/10"
                        : "border-red-200 text-red-600 hover:bg-red-50"
                    }
                  `}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
