
import React from "react";
import { FiLock, FiZap, FiDollarSign, FiGift } from "react-icons/fi";

import SectionCard from "./SectionCard";
import EmptyState from "./EmptyState";
import AgentCard from "./AgentCard";

export default function AgentsTab({
  dark,
  paidAgents,
  freeAgents,
  totalFreeCount,
}) {
  return (
    <div className="space-y-6">
   
      <SectionCard dark={dark} className="overflow-hidden">
        <div
          className={`border-b px-5 py-4 ${
            dark ? "border-white/[0.07]" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  dark
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                <FiLock size={18} />
              </div>

              <div>
                <h3 className="text-sm font-semibold">Paid Services</h3>
                <p
                  className={`mt-0.5 text-xs ${
                    dark ? "text-white/30" : "text-gray-400"
                  }`}
                >
                  Services that deduct 2 credits per request
                </p>
              </div>
            </div>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                dark
                  ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                  : "border-amber-200 bg-amber-50 text-amber-700"
              }`}
            >
              {paidAgents.reduce((sum, a) => sum + (a.count || 0), 0)} total
              requests
            </span>
          </div>
        </div>

        {paidAgents.length > 0 ? (
          <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {paidAgents.map((agent) => (
              <AgentCard key={agent.name} agent={agent} dark={dark} />
            ))}
          </div>
        ) : (
          <EmptyState
            message="No paid service usage yet"
            dark={dark}
            icon={FiDollarSign}
          />
        )}
      </SectionCard>

      
      <SectionCard dark={dark} className="overflow-hidden">
        <div
          className={`border-b px-5 py-4 ${
            dark ? "border-white/[0.07]" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  dark
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                <FiZap size={18} />
              </div>

              <div>
                <h3 className="text-sm font-semibold">
                  Free Multiagent Models
                </h3>
                <p
                  className={`mt-0.5 text-xs ${
                    dark ? "text-white/30" : "text-gray-400"
                  }`}
                >
                  Free agents — no credits deducted
                </p>
              </div>
            </div>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                dark
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              {totalFreeCount} total requests
            </span>
          </div>
        </div>

        {freeAgents.length > 0 ? (
          <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {freeAgents.map((agent) => (
              <AgentCard key={agent.name} agent={agent} dark={dark} />
            ))}
          </div>
        ) : (
          <EmptyState
            message="No free service usage yet"
            dark={dark}
            icon={FiGift}
          />
        )}
      </SectionCard>
    </div>
  );
}