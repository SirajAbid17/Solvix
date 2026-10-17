import React from "react";
import { FiCreditCard, FiTrendingUp } from "react-icons/fi";
import { Card } from "./shared";

export default function CreditCards({ userCredits, userPlan, totalRequests }) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
    
      <Card
        className="
          group relative overflow-hidden p-5 transition-all duration-300
          hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5
          sm:p-6
          dark:hover:border-amber-500/30
        "
      >
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-500/[0.06] blur-3xl" />

        <div className="relative flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-600">
              Available Credits
            </p>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
              {userCredits}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-600">
              Current {userPlan} plan
            </p>
          </div>

          <div
            className="
              flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl
              border border-amber-500/30 bg-amber-500/10 text-amber-500
              transition duration-300 group-hover:scale-110
              sm:h-14 sm:w-14
              dark:text-amber-400
            "
          >
            <FiCreditCard size={22} />
          </div>
        </div>
      </Card>

     
      <Card
        className="
          group relative overflow-hidden p-5 transition-all duration-300
          hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5
          sm:p-6
          dark:hover:border-indigo-500/30
        "
      >
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-500/[0.06] blur-3xl" />

        <div className="relative flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-600">
              Paid Requests
            </p>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
              {totalRequests.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-600">
              Paid services used
            </p>
          </div>

          <div
            className="
              flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl
              border border-indigo-500/30 bg-indigo-500/10 text-indigo-500
              transition duration-300 group-hover:scale-110
              sm:h-14 sm:w-14
              dark:text-indigo-400
            "
          >
            <FiTrendingUp size={22} />
          </div>
        </div>
      </Card>
    </div>
  );
}
