import React from "react";

export default function DashboardTabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="dashboard-tabs mb-6 flex gap-2 overflow-x-auto border-b border-white/[0.08] pb-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setActiveTab(tab.id)}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
            activeTab === tab.id
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
              : "text-gray-500 hover:bg-white/[0.04] hover:text-white"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}