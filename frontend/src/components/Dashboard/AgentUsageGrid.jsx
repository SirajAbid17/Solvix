import React from "react";
import {
  FiUploadCloud,
  FiUserCheck,
  FiFileText,
  FiLayout,
  FiMic,
  FiBriefcase,
  FiActivity,
} from "react-icons/fi";

import { Card, SectionHeader, AgentUsageCard, EmptyState } from "./shared";

const agentMap = {
  "Resume Upload": {
    icon: <FiUploadCloud size={16} />,
    color: "orange",
  },
  "Resume Analyzer": {
    icon: <FiUserCheck size={16} />,
    color: "teal",
  },
  "CV Generator": {
    icon: <FiFileText size={16} />,
    color: "indigo",
  },
  "Portfolio Generator": {
    icon: <FiLayout size={16} />,
    color: "purple",
  },
  "Mock Interview": {
    icon: <FiMic size={16} />,
    color: "pink",
  },
};

const PAID_SERVICES = [
  "Resume Upload",
  "Resume Analyzer",
  "CV Generator",
  "Portfolio Generator",
  "Mock Interview",
];

export default function AgentUsageGrid({ serviceUsage }) {
  const entries = Object.entries(serviceUsage || {}).filter(([name]) =>
    PAID_SERVICES.some((service) => name.includes(service)),
  );

  const hasData = entries.length > 0;

  return (
    <Card
      className="
        mb-6
        overflow-hidden
        border border-gray-200
        bg-white
        p-0
        shadow-sm
        dark:border-white/[0.07]
        dark:bg-[#0d0f12]
      "
    >
      <div
        className="
          flex flex-col gap-4
          border-b border-gray-200
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
          icon={<FiActivity size={18} />}
        />

        {hasData && (
          <div
            className="
              flex w-fit items-center gap-2
              rounded-full
              border border-gray-200
              bg-gray-50
              px-3 py-1.5
              text-xs font-medium
              text-gray-600
              dark:border-white/[0.08]
              dark:bg-white/[0.03]
              dark:text-gray-400
            "
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            {entries.length} {entries.length === 1 ? "service" : "services"}{" "}
            used
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 lg:p-6">
        {hasData ? (
          <div
            className="
              grid
              grid-cols-1
              gap-3
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              2xl:grid-cols-5
            "
          >
            {entries.map(([name, count]) => {
              const agent = agentMap[name] || {
                icon: <FiBriefcase size={16} />,
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
              icon={<FiActivity size={24} />}
              title="No paid service usage yet"
              description="Use Resume Upload, CV Generator, or Portfolio Generator to see activity."
            />
          </div>
        )}
      </div>
    </Card>
  );
}
