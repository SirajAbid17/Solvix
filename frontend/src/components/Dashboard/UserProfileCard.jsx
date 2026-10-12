
import React from "react";
import { FiMessageSquare, FiCreditCard, FiTag } from "react-icons/fi";
import { Card } from "./Card";

export default function UserProfileCard({
  userName,
  userEmail,
  userAvatar,
  userPlan,
  userCredits,
  initials,
}) {
  return (
    <Card className="mb-6 overflow-hidden">
      <div className="relative p-6">
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/[0.05] blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
          {}
          <div className="relative shrink-0">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="h-20 w-20 rounded-full border-4 border-white/[0.08] object-cover shadow-2xl"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl font-bold text-white shadow-xl shadow-indigo-500/20">
                {initials}
              </div>
            )}
            <span className="absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-black bg-emerald-400 shadow-lg shadow-emerald-400/30" />
          </div>

          {}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="truncate text-2xl font-bold text-white">{userName}</h2>
              <span
                className={`rounded-full border px-3 py-1 text-[9px] font-bold uppercase tracking-wider ${
                  userPlan.toLowerCase() === "pro"
                    ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-400"
                    : userPlan.toLowerCase() === "starter"
                    ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
                    : "border-white/10 bg-white/5 text-gray-400"
                }`}
              >
                {userPlan} Plan
              </span>
            </div>
            <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <FiMessageSquare className="text-xs" /> {userEmail}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <FiCreditCard className="text-amber-400" />
                <span className="text-sm font-semibold text-white">{userCredits}</span>
                <span className="text-xs text-gray-600">credits available</span>
              </div>
              <span className="h-1 w-1 rounded-full bg-gray-700" />
              <div className="flex items-center gap-2">
                <FiTag className="text-indigo-400" />
                <span className="text-xs text-gray-500">{userPlan} subscription</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}