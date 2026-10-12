
import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FiCreditCard, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function DashboardHeader({
  userCredits,
  userPlan,
  loggingOut,
  handleLogout,
}) {
  const navigate = useNavigate();

  return (
    <header className="dashboard-header  fixed left-0 right-0 top-0 z-50 border-b border-white/[0.08] bg-black/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          {}
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-gray-400 transition hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-white"
            >
              <FaArrowLeft />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-[9px] font-bold text-white shadow-lg shadow-indigo-600/20">
                  Solvix AI
                </span>
                <span className="text-gray-700">/</span>
                <h1 className="truncate text-lg font-bold text-white">Dashboard</h1>
              </div>
              <p className="hidden text-[10px] text-gray-600 sm:block">
                Manage your Solvix AI account and usage
              </p>
            </div>
          </div>

          {}
          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs sm:flex">
              <FiCreditCard className="text-amber-400" />
              <span className="font-semibold text-white">{userCredits}</span>
              <span className="text-gray-600">credits</span>
              <span className="text-gray-700">·</span>
              <span className="text-gray-500">{userPlan}</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-gray-400 transition hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiLogOut />
              <span className="hidden sm:inline">
                {loggingOut ? "Logging out..." : "Logout"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}