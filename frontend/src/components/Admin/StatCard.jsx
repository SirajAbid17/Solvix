
import React from "react";

export default function StatCard({ icon: Icon, label, value, dark, accent }) {
  const accentClasses =
    accent === "amber"
      ? dark
        ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
        : "border-amber-200 bg-amber-50 text-amber-600"
      : accent === "emerald"
      ? dark
        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
        : "border-emerald-200 bg-emerald-50 text-emerald-600"
      : accent === "purple"
      ? dark
        ? "border-purple-500/20 bg-purple-500/10 text-purple-400"
        : "border-purple-200 bg-purple-50 text-purple-600"
      : dark
      ? "border-white/[0.1] bg-white/[0.05] text-white"
      : "border-gray-200 bg-gray-50 text-gray-700";

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 ${
        dark
          ? "border-white/[0.08] bg-white/[0.025] hover:border-white/[0.15] hover:bg-white/[0.04]"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg"
      }`}
    >
      <div className="relative">
        <div
          className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl border ${accentClasses}`}
        >
          <Icon size={18} />
        </div>

        <p
          className={`text-2xl font-semibold tracking-tight ${
            dark ? "text-white" : "text-gray-900"
          }`}
        >
          {value ?? 0}
        </p>

        <p className={`mt-1 text-xs ${dark ? "text-white/40" : "text-gray-500"}`}>
          {label}
        </p>
      </div>
    </div>
  );
}