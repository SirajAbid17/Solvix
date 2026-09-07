import React from "react";
import { ClipLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505]">
      <ClipLoader
        color="#6366f1"
        size={42}
        speedMultiplier={0.8}
      />

      <p className="mt-5 text-sm font-medium tracking-wide text-white/70">
        Preparing your workspace...
      </p>

      <p className="mt-1 text-xs text-white/35">
        Please wait a moment
      </p>
    </div>
  );
}