import React from "react";

import {
  FiCheck,
  FiCpu,
  FiZap,
} from "react-icons/fi";

import { HiSparkles } from "react-icons/hi2";

export default function LoginHero() {
  return (
    <section className="small-item">
      {/* ==========================================
          BADGE
      ========================================== */}

      <div
        className="
          mb-6
          inline-flex
          items-center
          gap-2
          rounded-full
          border
          border-white/10
          bg-white/[0.045]
          px-3.5
          py-2
          text-xs
          text-gray-400
        "
      >
        <span className="relative flex h-2 w-2">
          <span
            className="
              absolute
              inline-flex
              h-full
              w-full
              animate-ping
              rounded-full
              bg-green-400
              opacity-50
            "
          />

          <span
            className="
              relative
              inline-flex
              h-2
              w-2
              rounded-full
              bg-green-400
            "
          />
        </span>

        <span>AI Platform</span>

        <HiSparkles className="text-gray-500" />
      </div>

      {/* ==========================================
          HEADING
      ========================================== */}

      <h1
        className="
          max-w-2xl
          text-[3.2rem]
          font-bold
          leading-[0.92]
          tracking-[-0.06em]
          sm:text-6xl
          md:text-7xl
          lg:text-[5.4rem]
        "
      >
        Your AI
        <br />

        <span
          className="
            bg-gradient-to-r
            from-white
            via-gray-400
            to-gray-700
            bg-clip-text
            text-transparent
          "
        >
          workspace.
        </span>
      </h1>

      {/* ==========================================
          DESCRIPTION
      ========================================== */}

      <p
        className="
          mt-7
          max-w-lg
          text-sm
          leading-7
          text-gray-500
          sm:text-base
        "
      >
        Build your career with intelligent AI tools.
        Create resumes, generate portfolios, analyze
        your CV and prepare for interviews — plus access
        free AI agents for chat, coding, image generation,
        PDF, PPT and web search, all in one powerful
        workspace.
      </p>

      {/* ==========================================
          FEATURES
      ========================================== */}

      <div className="mt-8 grid grid-cols-2 gap-3">

        {/* AI TOOLS */}

        <div
          className="
            group
            rounded-2xl
            border
            border-white/10
            bg-white/[0.025]
            p-4
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-white/20
            hover:bg-white/[0.05]
          "
        >
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-white/[0.06]
              transition-transform
              duration-300
              group-hover:scale-110
            "
          >
            <FiCpu className="text-lg text-gray-300" />
          </div>

          <p className="mt-3 text-sm font-semibold">
            AI Agents
          </p>

          <p className="mt-1 text-xs leading-5 text-gray-600">
            Chat, coding, image, PDF & more
          </p>
        </div>

        {/* FAST */}

        <div
          className="
            group
            rounded-2xl
            border
            border-white/10
            bg-white/[0.025]
            p-4
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-white/20
            hover:bg-white/[0.05]
          "
        >
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-white/[0.06]
              transition-transform
              duration-300
              group-hover:scale-110
            "
          >
            <FiZap className="text-lg text-gray-300" />
          </div>

          <p className="mt-3 text-sm font-semibold">
            Free Access
          </p>

          <p className="mt-1 text-xs leading-5 text-gray-600">
            Start using AI tools instantly
          </p>
        </div>

      </div>

      {/* ==========================================
          TRUST ITEMS
      ========================================== */}

      <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2">

        <div className="flex items-center gap-2 text-xs text-gray-600">
          <FiCheck className="text-green-500" />
          AI-powered
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-600">
          <FiCheck className="text-green-500" />
          Free AI Agents
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-600">
          <FiCheck className="text-green-500" />
          Secure
        </div>

      </div>
    </section>
  );
}