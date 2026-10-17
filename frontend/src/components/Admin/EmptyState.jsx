
import React from "react";
import { FiBarChart2 } from "react-icons/fi";

export default function EmptyState({ message, dark, icon: Icon = FiBarChart2 }) {
  return (
    <div className="flex min-h-[200px] items-center justify-center px-6">
      <div className="text-center">
        <div
          className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border ${
            dark
              ? "border-white/[0.08] bg-white/[0.03] text-white/30"
              : "border-gray-200 bg-gray-50 text-gray-400"
          }`}
        >
          <Icon size={20} />
        </div>

        <p className={`text-sm ${dark ? "text-white/40" : "text-gray-500"}`}>
          {message}
        </p>
      </div>
    </div>
  );
}