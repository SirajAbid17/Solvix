import React from "react";

export default function ResumeFooter() {
  return (
    <footer className="w-full border-t border-gray-200 px-4 py-5 dark:border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-sm text-gray-500 sm:flex-row">
        <p>
          © {new Date().getFullYear()} Solvix AI. All rights reserved.
        </p>

       <p className="text-center text-sm tracking-wide text-gray-600 dark:text-gray-400">
  Unlock your future with
  <span className="ml-1.5 font-semibold text-gray-900 dark:text-white">
    Solvix AI
  </span>
</p>
      </div>
    </footer>
  );
}

