// src/components/Dashboard/shared.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

// Card
export const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`
        rounded-2xl
        border
        border-white/[0.08]
        bg-[#050505]
        shadow-[0_10px_50px_rgba(0,0,0,0.35)]
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// SectionHeader
export const SectionHeader = ({ icon, title, description }) => {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-base font-bold text-white">{title}</h2>
        {description && (
          <p className="mt-1 text-xs text-gray-500">{description}</p>
        )}
      </div>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
        {icon}
      </div>
    </div>
  );
};

// StatCard
export const StatCard = ({ icon, label, value, subtext, delay = 0 }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const animation = gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.1 + delay * 0.08,
        ease: "power3.out",
      }
    );
    return () => animation.kill();
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className="group rounded-2xl border border-white/[0.08] bg-[#050505] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-[#080808] hover:shadow-[0_15px_50px_rgba(79,70,229,0.08)]"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 transition duration-300 group-hover:scale-110">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">
            {label}
          </p>
          <p className="mt-1 truncate text-2xl font-bold text-white">{value}</p>
          {subtext && <p className="mt-0.5 text-xs text-gray-600">{subtext}</p>}
        </div>
      </div>
    </div>
  );
};

// AgentUsageCard
export const AgentUsageCard = ({ name, count, icon, color = "blue" }) => {
  const colors = {
    blue: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    green: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    purple: "border-purple-500/20 bg-purple-500/10 text-purple-400",
    orange: "border-orange-500/20 bg-orange-500/10 text-orange-400",
    red: "border-red-500/20 bg-red-500/10 text-red-400",
    pink: "border-pink-500/20 bg-pink-500/10 text-pink-400",
    teal: "border-teal-500/20 bg-teal-500/10 text-teal-400",
    indigo: "border-indigo-500/20 bg-indigo-500/10 text-indigo-400",
  };

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#080808] p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/10 hover:bg-[#0b0b0b]">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${colors[color] || colors.blue} transition group-hover:scale-105`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{name}</p>
        <span className="text-[10px] text-gray-600">{count} requests</span>
      </div>
    </div>
  );
};

// EmptyState
export const EmptyState = ({ icon, title, description }) => {
  return (
    <div className="py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] text-2xl text-gray-700">
        {icon}
      </div>
      <p className="mt-4 text-sm font-medium text-gray-500">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-gray-700">{description}</p>
      )}
    </div>
  );
};