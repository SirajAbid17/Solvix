
import React from "react";

export default function SectionCard({ children, dark, className = "" }) {
  return (
    <div
      className={`rounded-2xl border ${
        dark
          ? "border-white/[0.08] bg-white/[0.025]"
          : "border-gray-200 bg-white"
      } ${className}`}
    >
      {children}
    </div>
  );
}