import React from "react";
import {
  FiActivity,
  FiCreditCard,
  FiAward,
  FiZap,
} from "react-icons/fi";
import { StatCard } from "./shared";

export default function StatsGrid({
  totalRequests,
  totalCreditsUsed,
  userPlan,
  activeAgents,
}) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={<FiActivity />}
        label="Paid Requests"
        value={totalRequests.toLocaleString()}
        subtext="paid services used"
        delay={0}
      />
      <StatCard
        icon={<FiCreditCard />}
        label="Credits Used"
        value={totalCreditsUsed.toLocaleString()}
        subtext="total credits consumed"
        delay={1}
      />
      <StatCard
        icon={<FiAward />}
        label="Current Plan"
        value={userPlan}
        subtext="active subscription"
        delay={2}
      />
      <StatCard
        icon={<FiZap />}
        label="Active Services"
        value={activeAgents}
        subtext="paid services used"
        delay={3}
      />
    </div>
  );
}