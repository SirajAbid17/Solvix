
import React from "react";
import { FiCreditCard, FiTrendingUp } from "react-icons/fi";
import { Card } from "./shared";
export default function CreditCards({ userCredits, userPlan, totalRequests }) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card className="group p-6 transition hover:border-amber-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
              Available Credits
            </p>
            <p className="mt-1 text-4xl font-extrabold text-white">{userCredits}</p>
            <p className="mt-1 text-xs text-gray-600">Current {userPlan} plan</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-2xl text-amber-400 transition group-hover:scale-110">
            <FiCreditCard />
          </div>
        </div>
      </Card>

      <Card className="group p-6 transition hover:border-indigo-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
              Total Requests
            </p>
            <p className="mt-1 text-4xl font-extrabold text-white">
              {totalRequests.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-gray-600">All time usage</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-2xl text-indigo-400 transition group-hover:scale-110">
            <FiTrendingUp />
          </div>
        </div>
      </Card>
    </div>
  );
}