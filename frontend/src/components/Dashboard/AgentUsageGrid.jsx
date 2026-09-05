// src/components/Dashboard/AgentUsageGrid.jsx
import React from "react";
import {
  FiCpu,
  FiMessageSquare,
  FiCode,
  FiUsers,
  FiFileText,
  FiLayout,
  FiCreditCard,
  FiActivity,
  FiClock,
  FiSearch,
  FiImage,
} from "react-icons/fi";  // ✅ ALL ICONS IMPORTED

import { Card, SectionHeader, AgentUsageCard, EmptyState } from "./shared";

const agentMap = {
  Chat: { icon: <FiMessageSquare />, color: "blue" },
  Agent: { icon: <FiCode />, color: "purple" },
  Resume: { icon: <FiUsers />, color: "teal" },
  "Resume Upload": { icon: <FiFileText />, color: "orange" },
  Portfolio: { icon: <FiLayout />, color: "purple" },
  CV: { icon: <FiFileText />, color: "indigo" },
  Billing: { icon: <FiCreditCard />, color: "green" },
  Auth: { icon: <FiUsers />, color: "blue" },
  Activity: { icon: <FiActivity />, color: "pink" },
  Search: { icon: <FiSearch />, color: "green" },
  Image: { icon: <FiImage />, color: "pink" },
  "get-conversation": { icon: <FiMessageSquare />, color: "teal" },
  "get-messages": { icon: <FiMessageSquare />, color: "blue" },
  "create-conversation": { icon: <FiMessageSquare />, color: "green" },
  history: { icon: <FiClock />, color: "purple" },
};

export default function AgentUsageGrid({ serviceUsage }) {
  const hasData = Object.keys(serviceUsage || {}).length > 0;

  return (
    <Card className="mb-6 p-6">
      <SectionHeader
        title="Agent Usage"
        description="Your AI agent usage statistics"
        icon={<FiCpu />}
      />
      {hasData ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {Object.entries(serviceUsage).map(([name, count]) => {
            const agent = agentMap[name] || { icon: <FiCpu />, color: "blue" };
            return (
              <AgentUsageCard
                key={name}
                name={name}
                count={count}
                icon={agent.icon}
                color={agent.color}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<FiCpu />}
          title="No agent usage data available"
          description="Start using Solvix AI to see your usage."
        />
      )}
    </Card>
  );
}