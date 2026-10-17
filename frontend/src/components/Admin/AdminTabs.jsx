
import React from "react";
import { FiBarChart2, FiUsers, FiCpu, FiCreditCard } from "react-icons/fi";

const TABS = [
  { id: "overview", label: "Overview", icon: FiBarChart2 },
  { id: "users", label: "Users", icon: FiUsers },
  { id: "agents", label: "Agents", icon: FiCpu },
  { id: "transactions", label: "Transactions", icon: FiCreditCard },
];

export default function AdminTabs({ dark, activeTab, onChange }) {
  return (
    <div
      className={`mb-7 flex gap-1 overflow-x-auto rounded-2xl border p-1 ${
        dark
          ? "border-white/[0.07] bg-white/[0.025]"
          : "border-gray-200 bg-white"
      }`}
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium transition-all ${
              active
                ? dark
                  ? "bg-white text-black shadow-lg"
                  : "bg-black text-white shadow-lg"
                : dark
                ? "text-white/40 hover:bg-white/[0.04] hover:text-white"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Icon size={15} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}