import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCpu } from "react-icons/fi";

const ContactHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="contact-header fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-[#08090b]/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Brand */}
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Go to Solvix home"
          className="group flex items-center gap-3"
        >
          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#c9a468]/20 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

            <FiCpu
              size={15}
              className="relative text-white/75 transition group-hover:text-white"
            />
          </div>

          <div className="hidden text-left sm:block">
            <div className="font-serif text-[15px] font-medium text-white">
              Solvix
            </div>

            <div className="text-[8px] uppercase tracking-[0.18em] text-white/30">
              Intelligence
            </div>
          </div>
        </button>

        {/* Center title */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <div className="text-[9px] font-medium uppercase tracking-[0.25em] text-white/30">
            Support / Contact
          </div>
        </div>

        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Back to home"
          className="group flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[10px] text-white/50 transition duration-300 hover:border-white/15 hover:bg-white/[0.06] hover:text-white"
        >
          <FiArrowLeft
            size={12}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />

          <span className="hidden sm:inline">Back home</span>
          <span className="sm:hidden">Back</span>
        </button>
      </div>
    </header>
  );
};

export default ContactHeader;