
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
import { FiArrowUpRight, FiGrid, FiLogOut, FiUser } from "react-icons/fi";

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userdata, isAdmin } = useSelector((state) => state.user);

  const [open, setOpen] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);

  const { dark } = useTheme();

  const planName = userdata?.plan
    ? userdata.plan.charAt(0).toUpperCase() + userdata.plan.slice(1)
    : "Free";

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

  const handleNewChat = async () => {
    try {
      const data = await CreateConversation();
      if (data) dispatch(addConversation(data));
    } catch (error) {
      console.error("Error creating new conversation:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      dispatch(setuserData(null));
      dispatch(clearConversations());
      setShowUserModal(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    }
  };

  const avatar =
    userdata?.avatar && userdata.avatar.trim() !== "" ? userdata.avatar : null;

  return (
    <aside
      className={`
        relative
        flex
        h-full
        min-h-0
        shrink-0
        flex-col
        overflow-hidden
        border-r
        transition-[width]
        duration-300
        ease-in-out
        ${dark ? "border-white/[0.08] bg-black text-white" : "border-gray-200 bg-white text-black"}
        ${open ? "w-64 sm:w-72" : "w-14 sm:w-16"}
      `}
    >
      
      <div
        className={`
          flex
          h-12
          shrink-0
          items-center
          border-b
          px-2
          sm:h-14
          sm:px-3
          ${open ? "justify-between" : "justify-center"}
          ${dark ? "border-white/[0.08]" : "border-gray-200"}
        `}
      >
        
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={`
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            text-base
            transition-all
            duration-200
            sm:h-9
            sm:w-9
            sm:text-lg
            ${dark ? "text-gray-400 hover:bg-white/[0.06] hover:text-white" : "text-gray-500 hover:bg-gray-100 hover:text-black"}
          `}
          title={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          <BsLayoutTextSidebarReverse />
        </button>

        {open && (
          <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 pl-2 sm:gap-2">
            <h1
              className={`
                min-w-0
                truncate
                text-base
                font-extrabold
                tracking-wide
                sm:text-lg
                lg:text-xl
                ${dark ? "text-white" : "text-black"}
              `}
            >
              Solvix AI
            </h1>

            <span
              className={`
                shrink-0
                rounded-full
                border
                px-1.5
                py-0.5
                text-[7px]
                font-medium
                uppercase
                tracking-wider
                sm:px-2
                sm:text-[8px]
                lg:text-[9px]
                ${
                  dark
                    ? "border-blue-500/20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300"
                    : "border-gray-200 bg-gray-100 text-gray-600"
                }
              `}
            >
              {planName}
            </span>

            <button
              type="button"
              onClick={handleNewChat}
              className={`
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-lg
                text-base
                transition-all
                duration-200
                hover:scale-105
                sm:h-8
                sm:w-8
                sm:text-lg
                ${dark ? "text-gray-400 hover:bg-white/[0.06] hover:text-white" : "text-gray-500 hover:bg-gray-100 hover:text-black"}
              `}
              title="New chat"
            >
              <BiSolidEditAlt />
            </button>
          </div>
        )}
      </div>

     
      <div className="shrink-0 px-2 pt-2">
        <button
          type="button"
          onClick={handleNewChat}
          className={`
            flex
            h-9
            w-full
            items-center
            justify-center
            gap-1.5
            overflow-hidden
            rounded-lg
            border
            px-2
            text-xs
            font-medium
            transition-all
            duration-200
            active:scale-[0.98]
            sm:h-10
            sm:gap-2
            sm:px-3
            sm:text-sm
            ${
              dark
                ? "border-white/[0.15] bg-black text-white hover:border-white/30 hover:bg-white hover:text-black"
                : "border-gray-300 bg-white text-black hover:border-black hover:bg-black hover:text-white"
            }
          `}
        >
          {open ? (
            <>
              <BiSolidEditAlt className="shrink-0 text-sm sm:text-base" />
              <span className="truncate">New Chat</span>
            </>
          ) : (
            <BiSolidEditAlt className="shrink-0 text-lg" />
          )}
        </button>
      </div>

     
      {open && (
        <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
          {userdata && <UserCelebration />}
          <div className="relative z-[10] h-full min-h-0 min-w-0 w-full overflow-y-auto overflow-x-hidden overscroll-contain px-2 pb-2 pt-2 scrollbar-thin">
            <AllConverSation />
          </div>
        </div>
      )}

      
      <div
        className={`
          relative
          mt-auto
          w-full
          shrink-0
          border-t
          p-1.5
          sm:p-2
          ${dark ? "border-white/[0.08]" : "border-gray-200"}
        `}
      >
        {userdata ? (
          <>
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
                  gap-1.5
                  rounded-lg
                  border
                  p-1.5
                  text-left
                  transition-all
                  duration-200
                  sm:gap-2
                  sm:p-2
                  ${
                    dark
                      ? "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07]"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }
                `}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt={userdata.name || "User"}
                    className={`h-8 w-8 shrink-0 rounded-full border object-cover sm:h-9 sm:w-9 ${dark ? "border-white/10" : "border-gray-200"}`}
                  />
                ) : (
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold sm:h-9 sm:w-9 sm:text-xs ${dark ? "border-white/10 bg-white/10 text-white" : "border-gray-200 bg-gray-100 text-gray-700"}`}
                  >
                    {userdata.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h1
                    className={`truncate text-[11px] font-semibold sm:text-xs ${dark ? "text-white" : "text-gray-900"}`}
                  >
                    {userdata.name || "User"}
                  </h1>
                  <p className="mt-0.5 truncate text-[9px] text-gray-500 sm:text-[10px]">
                    {planName} Plan
                  </p>
                </div>

                <svg
                  className={`h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 ${dark ? "text-gray-500" : "text-gray-400"}`}
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
              <button
                type="button"
                onClick={() => setShowUserModal(true)}
                className="relative z-[30] flex w-full items-center justify-center"
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt={userdata.name || "User"}
                    className={`h-9 w-9 rounded-full border-2 object-cover transition-all duration-200 hover:scale-105 ${dark ? "border-white/20 hover:border-white/40" : "border-gray-300 hover:border-gray-500"}`}
                  />
                ) : (
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold ${dark ? "border-white/20 bg-white/10 text-white" : "border-gray-300 bg-gray-100 text-gray-700"}`}
                  >
                    {userdata.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
              </button>
            )}
          </>
        ) : (
          <div className="w-full">
            <Register />
          </div>
        )}
      </div>

      
      {showUserModal && userdata && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setShowUserModal(false)}
        >
          <div
            className={`
              relative
              max-h-[92vh]
              w-full
              max-w-sm
              overflow-y-auto
              rounded-2xl
              border
              p-4
              shadow-2xl
              sm:p-6
              ${dark ? "border-white/[0.08] bg-[#111] text-white" : "border-gray-200 bg-white text-gray-900"}
            `}
            onClick={(event) => event.stopPropagation()}
          >
          
            <button
              type="button"
              onClick={() => setShowUserModal(false)}
              className={`absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full transition-all sm:right-3 sm:top-3 sm:h-8 sm:w-8 ${dark ? "text-gray-400 hover:bg-white/[0.06] hover:text-white" : "text-gray-500 hover:bg-gray-100 hover:text-black"}`}
            >
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5"
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

            <div className="flex flex-col items-center text-center">
              {avatar ? (
                <img
                  src={avatar}
                  alt={userdata.name || "User"}
                  className={`mb-3 h-16 w-16 rounded-full border-4 object-cover sm:mb-4 sm:h-20 sm:w-20 ${dark ? "border-white/10" : "border-gray-200"}`}
                />
              ) : (
                <div
                  className={`mb-3 flex h-16 w-16 items-center justify-center rounded-full border-4 text-xl font-bold sm:mb-4 sm:h-20 sm:w-20 sm:text-2xl ${dark ? "border-white/10 bg-white/10 text-white" : "border-gray-200 bg-gray-100 text-gray-700"}`}
                >
                  {userdata.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              <h2
                className={`text-base font-bold sm:text-lg ${dark ? "text-white" : "text-gray-900"}`}
              >
                {userdata.name || "User"}
              </h2>

              <p className="mt-1 max-w-full truncate text-xs text-gray-500 sm:text-sm">
                {userdata.email || "user@email.com"}
              </p>

              <span
                className={`mt-3 rounded-full border px-3 py-1 text-[10px] font-medium sm:mt-4 sm:px-4 sm:py-1.5 sm:text-xs ${dark ? "border-blue-500/20 bg-blue-500/10 text-blue-300" : "border-gray-200 bg-gray-100 text-gray-600"}`}
              >
                {planName} Plan
              </span>

              <div className="mt-3 w-full space-y-1.5 sm:mt-4 sm:space-y-2">
               
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserModal(false);
                      navigate("/admin-dashboard");
                    }}
                    className={`
                      group flex w-full items-center gap-2.5 rounded-lg border
                      px-2.5 py-2 text-xs font-semibold transition-all duration-200
                      active:scale-[0.98]
                      sm:gap-3 sm:rounded-xl sm:px-3.5 sm:text-sm
                      ${dark ? "border-white/10 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.09]" : "border-gray-200 bg-gray-50 text-gray-800 hover:border-gray-300 hover:bg-gray-100"}
                    `}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200 sm:h-8 sm:w-8 ${dark ? "bg-white/[0.07] text-gray-300 group-hover:bg-white group-hover:text-black" : "bg-white text-gray-600 shadow-sm group-hover:bg-black group-hover:text-white"}`}
                    >
                      <FiGrid size={14} className="sm:size-[16px]" />
                    </span>
                    <span className="flex-1 text-left">Admin Dashboard</span>
                    <FiArrowUpRight
                      size={13}
                      className="shrink-0 opacity-40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 sm:size-[15px]"
                    />
                  </button>
                )}

                
                <button
                  type="button"
                  onClick={() => {
                    setShowUserModal(false);
                    navigate("/user-dashboard");
                  }}
                  className={`
                    group flex w-full items-center gap-2.5 rounded-lg border
                    px-2.5 py-2 text-xs font-semibold transition-all duration-200
                    active:scale-[0.98]
                    sm:gap-3 sm:rounded-xl sm:px-3.5 sm:text-sm
                    ${dark ? "border-white/10 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.09]" : "border-gray-200 bg-gray-50 text-gray-800 hover:border-gray-300 hover:bg-gray-100"}
                  `}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200 sm:h-8 sm:w-8 ${dark ? "bg-white/[0.07] text-gray-300 group-hover:bg-white group-hover:text-black" : "bg-white text-gray-600 shadow-sm group-hover:bg-black group-hover:text-white"}`}
                  >
                    <FiUser size={14} className="sm:size-[16px]" />
                  </span>
                  <span className="flex-1 text-left">User Dashboard</span>
                  <FiArrowUpRight
                    size={13}
                    className="shrink-0 opacity-40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 sm:size-[15px]"
                  />
                </button>

                <div
                  className={`my-1 h-px w-full sm:my-1.5 ${dark ? "bg-white/[0.08]" : "bg-gray-200"}`}
                />

               
                <button
                  type="button"
                  onClick={handleLogout}
                  className={`
                    group flex w-full items-center gap-2.5 rounded-lg border
                    px-2.5 py-2 text-xs font-semibold transition-all duration-200
                    active:scale-[0.98]
                    sm:gap-3 sm:rounded-xl sm:px-3.5 sm:text-sm
                    ${dark ? "border-red-500/15 bg-red-500/[0.04] text-red-400 hover:border-red-500/30 hover:bg-red-500/10" : "border-red-200 bg-red-50/50 text-red-600 hover:border-red-300 hover:bg-red-50"}
                  `}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200 sm:h-8 sm:w-8 ${dark ? "bg-red-500/10 text-red-400 group-hover:bg-red-500 group-hover:text-white" : "bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white"}`}
                  >
                    <FiLogOut size={14} className="sm:size-[16px]" />
                  </span>
                  <span className="flex-1 text-left">Logout</span>
                  <FiArrowUpRight
                    size={13}
                    className="shrink-0 opacity-40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 sm:size-[15px]"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}