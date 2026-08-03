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

export default function Sidebar() {
  const [open, setOpen] = useState(true);
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

      console.log("Conversations loaded:", data);
    } catch (error) {
      console.error("Error loading conversations:", error);
      dispatch(clearConversations());
    }
  };

  loadConversations();
}, [userdata, dispatch]);

  // Create new conversation
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

        ${dark ? "bg-black text-white" : "bg-white text-black"}

        border-r
        ${dark ? "border-white/10" : "border-gray-200"}

        ${open ? "w-72" : "w-16"}
      `}
    >
      {/* Header */}
      <div
        className={`
          flex items-center
          ${
            open
              ? "justify-between"
              : "justify-center"
          }
          p-4

          border-b
          ${dark ? "border-white/10" : "border-gray-200"}
        `}
      >
        {/* Sidebar Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className={`
            text-2xl
            transition-all duration-300
            hover:scale-110

            ${
              dark
                ? "text-gray-400 hover:text-white"
                : "text-gray-500 hover:text-black"
            }
          `}
        >
          <BsLayoutTextSidebarReverse />
        </button>

        {/* Logo + Plan + New Chat Icon */}
        {open && (
          <div className="flex items-center gap-3">
            {/* Logo */}
            <h1
              className={`
                mr-6
                text-2xl
                font-extrabold
                tracking-wide

                ${dark ? "text-white" : "text-black"}
              `}
            >
              Solvix
            </h1>

            <div className="flex items-center gap-3">
              {/* Plan */}
              <span
                className={`
                  text-[10px]
                  px-2.5 py-1
                  rounded-full
                  border
                  font-medium
                  tracking-wider
                  uppercase

                  ${
                    dark
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
                  text-xl
                  p-1.5
                  rounded-lg
                  hover:scale-110
                  transition-all

                  ${
                    dark
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

          mx-3 mt-3
          px-4 py-3

          font-medium
          rounded-lg
          border

          active:scale-95
          transition-all duration-300

          ${
            dark
              ? "bg-black text-white border-white/20 hover:bg-white hover:text-black hover:border-white"
              : "bg-white text-black border-gray-300 hover:bg-black hover:text-white hover:border-black"
          }

          ${!open && "px-2"}
        `}
      >
        {open ? (
          "+ New Chat"
        ) : (
          <BiSolidEditAlt className="text-xl" />
        )}
      </button>

      {/* Conversations */}
      {open && (
        <div className="flex-1 overflow-hidden mt-2">
          <AllConverSation />
        </div>
      )}

      {/* User Profile */}
      <div className="mt-auto">
        <Register />
      </div>
    </div>
  );
}