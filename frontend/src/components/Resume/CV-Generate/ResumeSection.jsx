
import React from "react";

export default function ResumeSection({
  icon: Icon,
  title,
  subtitle,
  children,
  dark,
  cardStyle,
}) {
  return (
    <div className={cardStyle}>
      <div className="mb-4 flex items-center gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${dark ? "bg-white text-black" : "bg-black text-white"}`}
        >
          <Icon />
        </div>
        <div>
          <h3 className="font-bold">{title}</h3>
          <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>
            {subtitle}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
