import React from "react";
import { FiMail, FiCreditCard, FiAward } from "react-icons/fi";
import { Card } from "./shared";

export default function UserProfileCard({
  userName,
  userEmail,
  userAvatar,
  userPlan,
  userCredits,
  initials,
}) {
  const planKey = String(userPlan || "").toLowerCase();

  const planBadge =
    planKey === "pro"
      ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400"
      : planKey === "starter"
      ? "border-blue-500/30 bg-blue-500/10 text-blue-500 dark:text-blue-400"
      : "border-gray-200 bg-gray-100 text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400";

  return (
    <Card className="mb-6 overflow-hidden">
      <div className="relative p-5 sm:p-6">
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/[0.06] blur-3xl" />

        <div className="relative flex flex-col gap-5 md:flex-row md:items-center">
        
          <div className="relative shrink-0">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="
                  h-16 w-16 rounded-full border-4 border-gray-100 object-cover shadow-xl
                  sm:h-20 sm:w-20
                  dark:border-white/[0.08]
                "
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-bold text-white shadow-xl shadow-indigo-500/20 sm:h-20 sm:w-20 sm:text-2xl">
                {initials}
              </div>
            )}
            <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-emerald-400 shadow-lg shadow-emerald-400/30 sm:h-5 sm:w-5 dark:border-black" />
          </div>

         
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h2 className="truncate text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
                {userName}
              </h2>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${planBadge}`}
              >
                {userPlan} Plan
              </span>
            </div>

            <p className="mt-1 flex items-center gap-2 truncate text-xs text-gray-500 sm:text-sm dark:text-gray-500">
              <FiMail size={13} className="shrink-0" />
              <span className="truncate">{userEmail}</span>
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <FiCreditCard
                  size={14}
                  className="text-amber-500 dark:text-amber-400"
                />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {userCredits}
                </span>
                <span className="text-[11px] text-gray-500 dark:text-gray-600">
                  credits
                </span>
              </div>

              <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700" />

              <div className="flex items-center gap-2">
                <FiAward
                  size={14}
                  className="text-indigo-500 dark:text-indigo-400"
                />
                <span className="text-[11px] text-gray-500 dark:text-gray-500">
                  {userPlan} subscription
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}