// Sidebar.jsx - Updated Register section
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

export default function Sidebar() {
  const navigate=useNavigate()
  const [open, setOpen] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const { dark } = useTheme();
  const dispatch = useDispatch();
  const { userdata } = useSelector((state) => state.user);

  useEffect(() => {
    const loadConversations = async () => {
      if (!userdata) {
        dispatch(clearConversations());
        return;
      }

      try {
        const data = await GetConversation();
        dispatch(setConversations(data));
      } catch (error) {
        console.error("Error loading conversations:", error);
        dispatch(clearConversations());
      }
    };

    loadConversations();
  }, [userdata, dispatch]);

  const handleNewChat = async () => {
    try {
      const data = await CreateConversation();
      dispatch(addConversation(data));
      console.log("New conversation created:", data);
    } catch (error) {
      console.error("Error creating new conversation:", error);
    }
  };

  return (
    <div
      className={`
        h-screen
        flex flex-col
        overflow-hidden
        transition-all duration-500 ease-in-out
        relative

        ${dark ? "bg-black text-white" : "bg-white text-black"}

        border-r
        ${dark ? "border-white/5" : "border-gray-200"}

        ${open ? "w-72" : "w-16"}

        sm:${open ? "w-72" : "w-16"}
        md:${open ? "w-64" : "w-16"}
        lg:${open ? "w-72" : "w-16"}
        xl:${open ? "w-80" : "w-16"}
        2xl:${open ? "w-96" : "w-16"}
      `}
    >
      {/* Header */}
      <div
        className={`
          flex items-center
          ${open ? "justify-between" : "justify-center"}
          p-3

          sm:p-4

          border-b
          ${dark ? "border-white/10" : "border-gray-200"}
        `}
      >
        {/* Sidebar Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className={`
            text-xl
            transition-all duration-300
            hover:scale-110
            p-1

            sm:text-2xl

            ${dark
              ? "text-gray-400 hover:text-white"
              : "text-gray-500 hover:text-black"
            }
          `}
        >
          <BsLayoutTextSidebarReverse />
        </button>

        {/* Logo + Plan + New Chat Icon */}
        {open && (
          <div className="flex items-center  sm:gap-3">
            {/* Logo */}
            <h1
              className={`
                text-xl
                mr-6
                font-extrabold
                tracking-wide
                sm:text-2xl

                ${dark ? "text-white" : "text-black"}
              `}
            >
              Solvix
            </h1>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Plan */}
              <span
                className={`
                  text-[8px]
                  px-2 py-0.5
                  rounded-full
                  border
                  font-medium
                  tracking-wider
                  uppercase

                  sm:text-[10px]
                  sm:px-2.5
                  sm:py-1

                  ${dark
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/20"
                    : "bg-gray-100 text-gray-600 border-gray-200"
                  }
                `}
              >
                Free
              </span>

              {/* New Chat Icon */}
              <button
                onClick={handleNewChat}
                className={`
                  text-lg
                  p-1
                  rounded-lg
                  hover:scale-110
                  transition-all

                  sm:text-xl
                  sm:p-1.5

                  ${dark
                    ? "text-gray-400 hover:text-white hover:bg-white/10"
                    : "text-gray-500 hover:text-black hover:bg-gray-100"
                  }
                `}
              >
                <BiSolidEditAlt />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Chat Button */}
      <button
        onClick={handleNewChat}
        className={`
          flex items-center justify-center
          gap-2

          mx-2 mt-2
          px-3 py-2

          font-medium
          rounded-lg
          border

          active:scale-95
          transition-all duration-300

          sm:mx-3 sm:mt-3
          sm:px-4 sm:py-3

          ${dark
            ? "bg-black text-white border-white/20 hover:bg-white hover:text-black hover:border-white"
            : "bg-white text-black border-gray-300 hover:bg-black hover:text-white hover:border-black"
          }

          ${!open && "px-2"}
        `}
      >
        {open ? (
          <span className="text-xs sm:text-sm">+ New Chat</span>
        ) : (
          <BiSolidEditAlt className="text-lg sm:text-xl" />
        )}
      </button>

      {/* Conversations */}
      {open && (
        <div className="flex-1 overflow-hidden mt-2">
          <AllConverSation />
        </div>
      )}

      {/* User Profile - Updated */}
      <div className="mt-auto">
        {userdata ? (
          <div
            className={`
              p-2
              border-t
              transition-colors duration-300
              ${dark ? "border-white/10" : "border-gray-200"}
            `}
          >
            {open ? (
              // Full user info when sidebar is open
              <div
                className={`
                  flex items-center gap-2
                  p-2
                  rounded-sm
                  border
                  transition-all duration-200
                  cursor-pointer
                  ${dark
                    ? "bg-white/5 border-white/10 hover:bg-white/10"
                    : "bg-white border-gray-200 hover:bg-gray-50 shadow-sm"
                  }
                `}
                onClick={() => setShowUserModal(true)}
              >
                {/* Avatar */}
                <img
                  src={userdata.avatar}
                  alt={userdata.name}
                  className={`
                    w-8 h-8
                    rounded-full
                    object-cover
                    border
                    ${dark ? "border-white/10" : "border-gray-200"}
                  `}
                />

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <h1
                    className={`
                      text-xs
                      font-semibold
                      truncate
                      ${dark ? "text-white" : "text-gray-900"}
                    `}
                  >
                    {userdata.name}
                  </h1>

                  <p
                    className={`
                      text-[10px]
                      mt-0.5
                      ${dark ? "text-gray-400" : "text-gray-500"}
                    `}
                  >
                    Free Plan
                  </p>
                </div>

                {/* Arrow indicator */}
                <svg
                  className={`w-4 h-4 ${dark ? "text-gray-400" : "text-gray-500"}`}
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
              </div>
            ) : (
              // Only avatar when sidebar is closed
              <div
                className="flex justify-center cursor-pointer"
                onClick={() => setShowUserModal(true)}
              >
                <img
                  src={userdata.avatar}
                  alt={userdata.name}
                  className={`
                    w-10 h-10
                    rounded-full
                    object-cover
                    border-2
                    transition-all duration-200
                    hover:scale-110
                    ${dark
                      ? "border-white/20 hover:border-white/40"
                      : "border-gray-300 hover:border-gray-500"
                    }
                  `}
                />
              </div>
            )}
          </div>
        ) : (
          // Login button when no user
          <Register />
        )}
      </div>

      {/* User Modal - Center of screen */}
      {showUserModal && userdata && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowUserModal(false)}
        >
          <div
            className={`
              w-96
              max-w-[90vw]
              rounded-2xl
              shadow-2xl
              p-6
              relative
              transition-all
              duration-300
              scale-100
              ${dark
                ? "bg-gray-900 text-white border border-white/10"
                : "bg-white text-gray-900 border border-gray-200"
              }
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowUserModal(false)}
              className={`
                absolute top-3 right-3
                p-1
                rounded-full
                transition-all
                hover:scale-110
                ${dark
                  ? "text-gray-400 hover:text-white hover:bg-white/10"
                  : "text-gray-500 hover:text-black hover:bg-gray-100"
                }
              `}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* User Profile Content */}
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <img
                src={userdata.avatar}
                alt={userdata.name}
                className={`
                  w-24 h-24
                  rounded-full
                  object-cover
                  border-4
                  mb-4
                  ${dark ? "border-white/20" : "border-gray-200"}
                `}
              />

              {/* Name */}
              <h2
                className={`
                  text-xl
                  font-bold
                  mb-1
                  ${dark ? "text-white" : "text-gray-900"}
                `}
              >
                {userdata.name}
              </h2>

              {/* Email */}
              <p
                className={`
                  text-sm
                  mb-4
                  ${dark ? "text-gray-400" : "text-gray-500"}
                `}
              >
                {userdata.email || "user@email.com"}
              </p>

              {/* Plan Badge */}
              <span
                className={`
                  text-xs
                  px-4 py-1.5
                  rounded-full
                  border
                  font-medium
                  mb-4
                  ${dark
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/20"
                    : "bg-gray-100 text-gray-600 border-gray-200"
                  }
                `}
              >
                Free Plan
              </span>

              {/* Buttons */}
              <div className="w-full space-y-2">
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    // Navigate to user dashboard
                    navigate("/user-dashboard");
                  }}
                  className={`
                    w-full
                    px-4 py-2.5
                    rounded-lg
                    text-sm
                    font-semibold
                    border
                    transition-all duration-200
                    active:scale-95
                    ${dark
                      ? "bg-white/10 border-white/20 hover:bg-white hover:text-black"
                      : "bg-gray-100 border-gray-200 hover:bg-black hover:text-white hover:border-black"
                    }
                  `}
                >
                  User Dashboard
                </button>

                <button
                  onClick={() => {
                    setShowUserModal(false);
                    // Handle logout
                    const logout = async () => {
                      try {
                        await api.post("/auth/logout");
                        dispatch(setuserData(null));
                        dispatch(clearConversations());
                        navigate("/");
                      } catch (error) {
                        console.log(error);
                      }
                    };
                    logout();
                  }}
                  className={`
                    w-full
                    px-4 py-2.5
                    rounded-lg
                    text-sm
                    font-semibold
                    border
                    transition-all duration-200
                    active:scale-95
                    ${dark
                      ? "text-red-400 border-red-400/30 hover:bg-red-500/10"
                      : "text-red-600 border-red-300 hover:bg-red-50"
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
    </div>
  );
}