import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";


export const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-[0_10px_40px_rgba(0,0,0,0.06)]
        dark:border-white/[0.08]
        dark:bg-[#050505]
        dark:shadow-[0_10px_50px_rgba(0,0,0,0.35)]
        ${className}
      `}
    >
      {children}
    </div>
  );
};


export const SectionHeader = ({ icon, title, description }) => {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="truncate text-base font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        {description && (
          <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-500">
            {description}
          </p>
        )}
      </div>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
        {icon}
      </div>
    </div>
  );
};


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
      },
    );
    return () => animation.kill();
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className="
        group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm
        transition-all duration-300
        hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5
        dark:border-white/[0.08] dark:bg-[#050505] dark:shadow-[0_10px_40px_rgba(0,0,0,0.25)]
        dark:hover:border-indigo-500/30 dark:hover:bg-[#080808]
      "
    >
      <div className="flex items-start gap-4">
        <div
          className="
            flex h-11 w-11 shrink-0 items-center justify-center rounded-xl
            border border-indigo-500/20 bg-indigo-500/10 text-indigo-500
            transition duration-300 group-hover:scale-110
            dark:text-indigo-400
          "
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-500">
            {label}
          </p>
          <p className="mt-1 truncate text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {subtext && (
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-600">
              {subtext}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


export const AgentUsageCard = ({ name, count, icon, color = "blue" }) => {
  const colors = {
    blue: {
      light: "border-blue-200 bg-blue-50 text-blue-600",
      dark: "dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400",
    },
    green: {
      light: "border-emerald-200 bg-emerald-50 text-emerald-600",
      dark: "dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400",
    },
    purple: {
      light: "border-purple-200 bg-purple-50 text-purple-600",
      dark: "dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-400",
    },
    orange: {
      light: "border-orange-200 bg-orange-50 text-orange-600",
      dark: "dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400",
    },
    red: {
      light: "border-red-200 bg-red-50 text-red-600",
      dark: "dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400",
    },
    pink: {
      light: "border-pink-200 bg-pink-50 text-pink-600",
      dark: "dark:border-pink-500/20 dark:bg-pink-500/10 dark:text-pink-400",
    },
    teal: {
      light: "border-teal-200 bg-teal-50 text-teal-600",
      dark: "dark:border-teal-500/20 dark:bg-teal-500/10 dark:text-teal-400",
    },
    indigo: {
      light: "border-indigo-200 bg-indigo-50 text-indigo-600",
      dark: "dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400",
    },
  };

  const c = colors[color] || colors.blue;

  return (
    <div
      className="
        group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm
        transition-all duration-200
        hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md
        dark:border-white/[0.06] dark:bg-[#080808] dark:hover:border-white/10 dark:hover:bg-[#0b0b0b]
      "
    >
      <div
        className={`
          flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border
          ${c.light} ${c.dark}
          transition group-hover:scale-105
        `}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
          {name}
        </p>
        <span className="text-[10px] text-gray-500 dark:text-gray-600">
          {count} {count === 1 ? "request" : "requests"}
        </span>
      </div>
    </div>
  );
};


export const EmptyState = ({ icon, title, description }) => {
  return (
    <div className="py-10 text-center">
      <div
        className="
          mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border
          border-gray-200 bg-gray-50 text-2xl text-gray-400
          dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-gray-700
        "
      >
        {icon}
      </div>
      <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-500">
        {title}
      </p>
      {description && (
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-700">
          {description}
        </p>
      )}
    </div>
  );
};
