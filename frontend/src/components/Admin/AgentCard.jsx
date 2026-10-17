
import React from "react";
import {
  FiZap,
  FiDollarSign,
  FiGift,
  FiLock,
  FiUnlock,
  FiTrendingUp,
} from "react-icons/fi";
import { getAgentIcon } from "./utils";

export default function AgentCard({ agent, dark }) {
  const isPaid = agent.type === "paid";
  const hasUsage = (agent.count || 0) > 0;
  const usage = Math.min(100, Math.max(0, Number(agent.usage) || 0));
  const isMultiagent = agent.name === "Free Multiagent Models";

  const MainIcon = isMultiagent ? FiZap : isPaid ? FiDollarSign : FiGift;

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 ${
        dark
          ? "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.13]"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
      }`}
    >
      
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              isPaid
                ? dark
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-amber-50 text-amber-600"
                : isMultiagent
                ? dark
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-emerald-50 text-emerald-600"
                : dark
                ? "bg-white/[0.06] text-white/70"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <MainIcon size={17} />
          </div>

          <div>
            <p
              className={`text-sm font-medium ${
                dark ? "text-white" : "text-gray-900"
              }`}
            >
              {agent.name}
            </p>

            <div
              className={`mt-0.5 flex items-center gap-1.5 text-[11px] ${
                isPaid
                  ? dark
                    ? "text-amber-400/70"
                    : "text-amber-600"
                  : dark
                  ? "text-emerald-400/70"
                  : "text-emerald-600"
              }`}
            >
              {isPaid ? (
                <>
                  <FiLock size={10} />
                  <span>Paid Service</span>
                </>
              ) : (
                <>
                  <FiUnlock size={10} />
                  <span>Free Service</span>
                </>
              )}
            </div>
          </div>
        </div>

        <span
          className={`text-sm font-semibold ${
            dark ? "text-white" : "text-gray-900"
          }`}
        >
          {hasUsage ? `${usage}%` : "—"}
        </span>
      </div>

     
      <div
        className={`h-2 overflow-hidden rounded-full ${
          dark ? "bg-white/[0.06]" : "bg-gray-100"
        }`}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            isPaid ? "bg-amber-500" : "bg-emerald-500"
          }`}
          style={{ width: `${usage}%` }}
        />
      </div>

   
      {isMultiagent && agent.agents && agent.agents.length > 0 ? (
        <div className="mt-3 space-y-2">
          {agent.agents
            .filter((a) => (a.count || 0) > 0)
            .map((subAgent) => {
              const SubIcon = getAgentIcon(subAgent.name);
              return (
                <div
                  key={subAgent.name}
                  className={`flex items-center justify-between rounded-lg px-2 py-1.5 ${
                    dark ? "hover:bg-white/[0.03]" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <SubIcon
                      size={13}
                      className={
                        dark ? "text-emerald-400/70" : "text-emerald-600"
                      }
                    />
                    <span
                      className={`text-[11px] ${
                        dark ? "text-white/60" : "text-gray-600"
                      }`}
                    >
                      {subAgent.name}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] font-medium ${
                      dark ? "text-white/80" : "text-gray-800"
                    }`}
                  >
                    {subAgent.count}
                  </span>
                </div>
              );
            })}

          <div
            className={`mt-2 flex items-center justify-between border-t pt-2 ${
              dark ? "border-white/[0.06]" : "border-gray-100"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <FiTrendingUp
                size={12}
                className={dark ? "text-emerald-400" : "text-emerald-600"}
              />
              <span
                className={`text-[11px] font-semibold ${
                  dark ? "text-white/70" : "text-gray-700"
                }`}
              >
                Total
              </span>
            </div>

            <span
              className={`text-[11px] font-semibold ${
                dark ? "text-emerald-400" : "text-emerald-600"
              }`}
            >
              {agent.count || 0} requests
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-2 flex items-center justify-between">
          <p
            className={`text-[11px] ${
              dark ? "text-white/40" : "text-gray-500"
            }`}
          >
            {agent.count || 0} requests
          </p>

          {isPaid && hasUsage && (
            <p
              className={`text-[11px] font-medium ${
                dark ? "text-amber-400" : "text-amber-600"
              }`}
            >
              {agent.count * 2} credits used
            </p>
          )}
        </div>
      )}
    </div>
  );
}