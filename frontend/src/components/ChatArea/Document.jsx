import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiFileText,
  FiUser,
  FiFolder,
  FiMic,
  FiZap,
  FiLock,
} from "react-icons/fi";
import { useTheme } from "../../BgContext/ThemeContext";

export default function Document() {
  const { dark } = useTheme();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const popupRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const options = [
    {
      name: "Resume Analyzer",
      icon: FiFileText,
      path: "/resume",
    },
    {
      name: "CV Generator",
      icon: FiUser,
      path: "/cv-generator",
    },
    {
      name: "Portfolio Generate",
      icon: FiFolder,
      path: "/portfolio",
    },
    {
      name: "Mock Interview",
      icon: FiMic,
      path: "/mock-interview",
    },
  ];

  const handleNavigate = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div ref={popupRef} className="relative">
      {/* Plus Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        title="Solvix Tools"
        className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95 ${
          dark
            ? "bg-[rgb(41,41,41)] text-gray-300 hover:bg-[rgb(55,55,55)] hover:text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black"
        }`}
      >
        <FiPlus size={18} />
      </button>

      {/* Menu */}
      {open && (
        <div
          className={`absolute bottom-full left-0 z-50 mb-3.5 w-56 rounded-md border p-2 shadow-2xl ${
            dark
              ? "border-white/10 bg-[#1a1a1a]"
              : "border-gray-200 bg-white"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2">
            <p
              className={`text-xs font-semibold ${
                dark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Solvix Tools
            </p>

            <div
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-bold tracking-wide ${
                dark
                  ? "bg-yellow-500/10 text-yellow-400"
                  : "bg-yellow-50 text-yellow-600"
              }`}
            >
              <FiZap size={10} />
              <span>PRO</span>
            </div>
          </div>

          <div
            className={`my-1 h-px ${
              dark ? "bg-white/5" : "bg-gray-100"
            }`}
          />

          {/* Options */}
          <div className="h-53 space-y-1">
            {options.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleNavigate(item.path)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 ${
                    dark
                      ? "text-gray-300 hover:bg-white/5 hover:text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {/* Icon */}
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      dark
                        ? "bg-white/5 text-gray-400"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Icon size={16} />
                  </span>

                  {/* Name */}
                  <span className="truncate text-xs font-medium">
                    {item.name}
                  </span>

                  {/* Paid */}
                  <span
                    className={`ml-auto flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 text-[9px] font-semibold ${
                      dark
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-yellow-50 text-yellow-600"
                    }`}
                  >
                    <FiLock size={9} />
                    Paid
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
