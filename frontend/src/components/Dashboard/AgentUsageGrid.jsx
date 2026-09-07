// src/components/Dashboard/AgentUsageGrid.jsx

import React from "react";
import {
  FiCpu,
  FiFileText,
  FiLayout,
  FiUsers,
} from "react-icons/fi";

import {
  Card,
  SectionHeader,
  AgentUsageCard,
  EmptyState,
} from "./shared";

// ✅ SIRF PAID SERVICES KE ICONS
const agentMap = {
  "Resume Upload": {
    icon: <FiFileText />,
    color: "orange",
  },
  "Resume Analyzer": {
    icon: <FiUsers />,
    color: "teal",
  },
  "CV Generator": {
    icon: <FiFileText />,
    color: "indigo",
  },
  "Portfolio Generator": {
    icon: <FiLayout />,
    color: "purple",
  },
  "Mock Interview": {
    icon: <FiUsers />,
    color: "pink",
  },
};

// ✅ PAID SERVICES LIST
const PAID_SERVICES = [
  'Resume Upload',
  'Resume Analyzer',
  'CV Generator',
  'Portfolio Generator',
  'Mock Interview',
];

export default function AgentUsageGrid({ serviceUsage }) {
  // ✅ SIRF PAID SERVICES FILTER KAREIN
  const entries = Object.entries(serviceUsage || {})
    .filter(([name]) => PAID_SERVICES.some(service => name.includes(service)));

  const hasData = entries.length > 0;

  return (
    <Card
      className="
        mb-6
        overflow-hidden
        border border-slate-200/80
        bg-white
        p-0
        shadow-sm
        dark:border-white/[0.07]
        dark:bg-[#0d0f12]
      "
    >
      {/* Header */}
      <div
        className="
          flex flex-col gap-4
          border-b border-slate-200/80
          px-5 py-5
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:px-6
          dark:border-white/[0.07]
        "
      >
        <SectionHeader
          title="Paid Services Usage"
          description="Monitor your paid AI service requests"
          icon={<FiCpu />}
        />

        {hasData && (
          <div
            className="
              flex w-fit items-center gap-2
              rounded-full
              border border-slate-200
              bg-slate-50
              px-3 py-1.5
              text-xs font-medium
              text-slate-600
              dark:border-white/[0.08]
              dark:bg-white/[0.03]
              dark:text-slate-400
            "
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {entries.length} {entries.length === 1 ? "service" : "services"} used
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 lg:p-6">
        {hasData ? (
          <div
            className="
              grid
              grid-cols-2
              gap-3
              sm:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-5
              2xl:grid-cols-6
            "
          >
            {entries.map(([name, count]) => {
              const agent = agentMap[name] || {
                icon: <FiCpu />,
                color: "blue",
              };

              return (
                <div
                  key={name}
                  className="
                    min-w-0
                    rounded-xl
                    transition-transform
                    duration-200
                    hover:-translate-y-0.5
                  "
                >
                  <AgentUsageCard
                    name={name}
                    count={count}
                    icon={agent.icon}
                    color={agent.color}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 sm:py-10">
            <EmptyState
              icon={<FiCpu />}
              title="No paid service usage yet"
              description="Use Resume Upload, CV Generator, or Portfolio Generator to see activity."
            />
          </div>
        )}
      </div>
    </Card>
  );
}