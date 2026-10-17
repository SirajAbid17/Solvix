
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiShield,
  FiRefreshCw,
  FiLogOut,
} from "react-icons/fi";

export default function AdminHeader({ dark, refreshing, onRefresh }) {
  const navigate = useNavigate();

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full border-b backdrop-blur-2xl ${
        dark
          ? "border-white/[0.07] bg-black/85"
          : "border-gray-200 bg-white/85"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
       
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
              dark
                ? "border-white/[0.08] bg-white/[0.03] text-white/50 hover:border-white/15 hover:bg-white/[0.06] hover:text-white"
                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-900"
            }`}
          >
            <FiArrowLeft size={17} />
          </button>

          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                dark
                  ? "border-white/[0.1] bg-white/[0.05] text-white"
                  : "border-gray-200 bg-gray-100 text-gray-800"
              }`}
            >
              <FiShield size={18} />
            </div>

            <div>
              <h1 className="text-sm font-semibold tracking-wide">
                Admin Panel
              </h1>
              <p
                className={`text-[10px] ${
                  dark ? "text-white/30" : "text-gray-400"
                }`}
              >
                System Management
              </p>
            </div>
          </div>
        </div>

       
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className={`flex h-9 items-center gap-2 rounded-xl border px-3 text-xs font-medium transition disabled:opacity-50 ${
              dark
                ? "border-white/[0.08] bg-white/[0.03] text-white/60 hover:border-white/15 hover:bg-white/[0.06] hover:text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            <FiRefreshCw
              size={13}
              className={refreshing ? "animate-spin" : ""}
            />
            <span className="hidden sm:inline">
              {refreshing ? "Refreshing" : "Refresh"}
            </span>
          </button>

          <button
            onClick={() => navigate("/")}
            className={`flex h-9 items-center gap-2 rounded-xl border px-3 text-xs font-medium transition ${
              dark
                ? "border-white/[0.08] bg-white/[0.03] text-white/60 hover:border-white/15 hover:bg-white/[0.06] hover:text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            <FiLogOut size={13} />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </div>
    </header>
  );
}