import React from "react";
import { FiArrowUpRight, FiCpu } from "react-icons/fi";

const PrivacyFooter = ({
  onHome,
  onTerms,
}) => {
  return (
    <footer className="border-t border-white/[0.08]">
      <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <button
            onClick={onHome}
            className="group flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition group-hover:border-white/20 group-hover:bg-white/[0.07]">
              <FiCpu size={15} />
            </div>

            <div className="text-left">
              <p className="font-serif text-sm font-medium">
                Solvix
              </p>

              <p className="text-[9px] text-white/30">
                Intelligence
              </p>
            </div>
          </button>

          <div className="flex items-center gap-5 text-[11px]">
            <button
              onClick={onHome}
              className="text-white/35 transition hover:text-white/75"
            >
              Home
            </button>

           
            <span className="text-white/65">
              Privacy
            </span>
          </div>
        </div>

        <div className="mt-7 h-px bg-white/[0.06]" />

        <div className="mt-5 flex flex-col justify-between gap-2 text-[10px] text-white/25 sm:flex-row">
          <span>
            © 2026 Solvix AI. All rights reserved.
          </span>

          <span className="inline-flex items-center gap-1.5">
            Built for intelligent work.

            <FiArrowUpRight size={11} />
          </span>
        </div>
      </div>
    </footer>
  );
};

export default PrivacyFooter;