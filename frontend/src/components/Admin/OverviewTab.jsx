
import React from "react";
import {
  FiUsers,
  FiUserCheck,
  FiCreditCard,
  FiActivity,
  FiTrendingUp,
  FiCpu,
} from "react-icons/fi";

import StatCard from "./StatCard";
import SectionCard from "./SectionCard";
import EmptyState from "./EmptyState";
import AgentCard from "./AgentCard";

export default function OverviewTab({ dark, stats, combinedAgentUsage }) {
  const statCards = [
    {
      icon: FiUsers,
      label: "Total Users",
      value: stats.totalUsers,
      accent: "default",
    },
    {
      icon: FiUserCheck,
      label: "Active Users",
      value: stats.activeUsers,
      accent: "emerald",
    },
    {
      icon: FiCreditCard,
      label: "Credits Used",
      value: stats.totalCreditsUsed,
      accent: "purple",
    },
    {
      icon: FiActivity,
      label: "Paid Requests",
      value: stats.totalRequests,
      accent: "default",
    },
    {
      icon: FiTrendingUp,
      label: "Total Revenue",
      value: `$${Number(stats.totalRevenue || 0).toFixed(2)}`,
      accent: "amber",
    },
  ];

  return (
    <div className="space-y-6">
     
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} dark={dark} />
        ))}
      </div>

     
      <SectionCard dark={dark} className="overflow-hidden">
        <div
          className={`border-b px-5 py-4 ${
            dark ? "border-white/[0.07]" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Agent Usage Overview</h3>
              <p
                className={`mt-1 text-xs ${
                  dark ? "text-white/30" : "text-gray-400"
                }`}
              >
                Paid services usage
              </p>
            </div>

            <FiCpu
              size={17}
              className={dark ? "text-white/30" : "text-gray-400"}
            />
          </div>
        </div>

        {combinedAgentUsage.length > 0 ? (
          <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {combinedAgentUsage.map((agent) => (
              <AgentCard key={agent.name} agent={agent} dark={dark} />
            ))}
          </div>
        ) : (
          <EmptyState
            message="No agent data available"
            dark={dark}
            icon={FiCpu}
          />
        )}
      </SectionCard>
    </div>
  );
}