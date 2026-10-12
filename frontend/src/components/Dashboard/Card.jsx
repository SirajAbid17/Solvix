
import React from "react";

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

export default Card;