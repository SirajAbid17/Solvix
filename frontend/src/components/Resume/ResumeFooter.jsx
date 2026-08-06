import React from "react";

export default function ResumeFooter() {
  return (
    <footer className="w-full border-t border-gray-200 px-4 py-5 dark:border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-sm text-gray-500 sm:flex-row">
        <p>
          © {new Date().getFullYear()} Solvix AI. All rights reserved.
        </p>

        <p>
          Build your career. <span className="font-medium text-gray-700 dark:text-gray-300">Solvix AI.</span>
        </p>
      </div>
    </footer>
  );
}

