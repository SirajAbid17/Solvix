
import React, { useEffect, useRef } from "react";

import {
  FiCode,
  FiCopy,
  FiCheck,
  FiRefreshCw,
  FiMaximize2,
  FiMinimize2,
  FiAlertCircle,
  FiTool,
  FiCheckCircle,
  FiCpu,
} from "react-icons/fi";

import gsap from "gsap";

export default function CodePreviewUI({
  dark,
  latestCode,
  isFullscreen,
  isLoading,
  error,
  copied,
  iframeRef,
  handleCopy,
  executeCode,
  setIsFullscreen,
}) {
  const welcomeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const glowRef = useRef(null);

  /*
  ============================================================
  SOLVIX WELCOME SCREEN ANIMATION
  ============================================================
  */

  useEffect(() => {
    if (latestCode) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      // Initial states
      gsap.set(titleRef.current, {
        opacity: 0,
        y: 25,
        filter: "blur(8px)",
      });

      gsap.set(subtitleRef.current, {
        opacity: 0,
        y: 15,
        filter: "blur(5px)",
      });

      gsap.set(".solvix-agent", {
        opacity: 0,
        y: 18,
        scale: 0.9,
      });

      gsap.set(".solvix-icon", {
        opacity: 0,
        scale: 0.5,
        rotate: -20,
      });

      gsap.set(".solvix-status", {
        opacity: 0,
        y: 10,
      });

      // Icon entrance
      timeline
        .to(".solvix-icon", {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.7,
          ease: "back.out(1.7)",
        })

        // Heading
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
          },
          "-=0.35",
        )

        // Subtitle
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.6,
          },
          "-=0.45",
        )

        // Agents
        .to(
          ".solvix-agent",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.45,
            stagger: 0.055,
            ease: "back.out(1.4)",
          },
          "-=0.2",
        )

        // Status
        .to(
          ".solvix-status",
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          "-=0.15",
        );

      /*
      ==========================================================
      FLOATING AGENT ANIMATION
      ==========================================================
      */

      gsap.to(".solvix-agent", {
        y: -3,
        duration: 2,
        stagger: {
          each: 0.12,
          repeat: -1,
          yoyo: true,
        },
        ease: "sine.inOut",
      });

      /*
      ==========================================================
      BACKGROUND GLOW
      ==========================================================
      */

      gsap.to(glowRef.current, {
        scale: 1.2,
        opacity: 0.65,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, welcomeRef);

    return () => ctx.revert();
  }, [latestCode]);

  /*
  ============================================================
  AGENTS
  ============================================================
  */

  const agents = [
    "Chat",
    "Search",
    "Image",
    "Coding",
    "PPT",
    "PDF",
    "Resume Analysis",
    "CV Generator",
    "Portfolio Generator",
    "Mock Interview",
  ];

  /*
  ============================================================
  WELCOME SCREEN
  ============================================================
  */


if (!latestCode) {
  return (
    <div
      ref={welcomeRef}
      className="
        relative
        flex
        h-full
        min-h-[380px]
        w-full
        items-center
        justify-center
        overflow-hidden
        bg-black
      "
    >
      {/* Background GIF */}
      <img
        src="https://cdn.pixabay.com/animation/2025/08/15/07/22/07-22-21-420_512.gif"
        alt=""
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          opacity-80
        "
      />

      {/* Dark Overlay */}
      <div
        className="
          absolute
          inset-0
          bg-black/60
        "
      />

      {/* Center Glow */}
      <div
        ref={glowRef}
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-48
          w-48
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-white/[0.06]
          blur-3xl
        "
      />

      {/* Content */}
      <div
        className="
          relative
          z-10
          flex
          w-full
          max-w-2xl
          flex-col
          items-center
          px-4
          text-center
        "
      >
        {/* AI Icon */}
        <div
          className="
            solvix-icon
            mb-2.5
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            border
            border-white/10
            bg-white/[0.07]
            shadow-[0_0_25px_rgba(255,255,255,0.08)]
            backdrop-blur-xl
          "
        >
          <FiCpu
            size={15}
            className="text-white"
          />
        </div>

        {/* Title */}
        <h2
          ref={titleRef}
          className="
            max-w-xl
            text-base
            font-semibold
            leading-tight
            tracking-[-0.02em]
            text-white
            sm:text-lg
          "
        >
          All the AI Models and Agents You Need
          <span className="mx-1 text-white/25">
            —
          </span>
          <span
            className="
              bg-gradient-to-r
              from-white
              via-gray-300
              to-gray-500
              bg-clip-text
              text-transparent
            "
          >
            In One Powerful Platform.
          </span>
        </h2>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="
            mt-1
            max-w-lg
            text-[10px]
            leading-4
            text-white/45
          "
        >
          One intelligent workspace for chat, research, coding,
          creativity, documents, and career growth.
        </p>

        {/* Agents */}
        <div
          className="
            mt-3
            flex
            max-w-xl
            flex-wrap
            justify-center
            gap-1.5
          "
        >
          {agents.map((agent) => (
            <div
              key={agent}
              className="
                solvix-agent
                group
                cursor-default
                rounded-full
                border
                border-white/[0.10]
                bg-black/30
                px-2.5
                py-1
                text-[9px]
                font-medium
                text-white/75
                shadow-lg
                backdrop-blur-xl
                transition-all
                duration-300
                hover:border-white/25
                hover:bg-white/[0.10]
                hover:text-white
                hover:shadow-[0_0_20px_rgba(255,255,255,0.08)]
              "
            >
              <span className="flex items-center gap-1.5">
                <span
                  className="
                    h-1
                    w-1
                    rounded-full
                    bg-white/35
                    transition-all
                    duration-300
                    group-hover:bg-white
                    group-hover:shadow-[0_0_8px_rgba(255,255,255,0.8)]
                  "
                />

                {agent}
              </span>
            </div>
          ))}
        </div>

        {/* Status */}
        <div
          className="
            solvix-status
            mt-2.5
            flex
            items-center
            gap-1.5
            text-[8px]
            tracking-wide
            text-white/30
          "
        >
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="
                absolute
                inline-flex
                h-full
                w-full
                animate-ping
                rounded-full
                bg-white/40
              "
            />

            <span
              className="
                relative
                inline-flex
                h-1.5
                w-1.5
                rounded-full
                bg-white/60
              "
            />
          </span>

          Powered by Solvix AI Multi-Agent System
        </div>
      </div>
    </div>
  );
}



  /*
  ============================================================
  MAIN CODE PREVIEW
  ============================================================
  */

  return (
    <div
      className={`
        flex
        w-full
        flex-col
        overflow-hidden
        ${
          isFullscreen
            ? "fixed inset-0 z-[9999] h-screen w-screen"
            : "h-[420px]"
        }
        ${dark ? "bg-[#080808]" : "bg-gray-50"}
      `}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className={`
          flex
          h-12
          shrink-0
          items-center
          justify-between
          border-b
          px-3
          ${
            dark
              ? "border-white/[0.08] bg-[#0d0d0d]"
              : "border-gray-200 bg-white"
          }
        `}
      >
        {/* ===================================================
            LEFT SIDE
        ==================================================== */}

        <div className="flex items-center gap-2">
          <div
            className={`
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-lg
              ${
                dark
                  ? "bg-white/[0.06] text-gray-300"
                  : "bg-gray-100 text-gray-600"
              }
            `}
          >
            <FiCode size={14} />
          </div>

          <div className="flex flex-col">
            <span
              className={`
                text-xs
                font-semibold
                ${dark ? "text-gray-200" : "text-gray-800"}
              `}
            >
              Code Preview
            </span>

            <span
              className={`
                text-[9px]
                ${dark ? "text-gray-600" : "text-gray-400"}
              `}
            >
              {latestCode.isComingSoon
                ? "Coming Soon"
                : latestCode.language?.toUpperCase() || "HTML"}
            </span>
          </div>
        </div>

        {/* ===================================================
            ACTIONS
        ==================================================== */}

        <div className="flex items-center gap-1">
          {/* COPY */}

          <button
            type="button"
            onClick={handleCopy}
            title="Copy preview code"
            className={`
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-md
              transition-all
              ${
                dark
                  ? "text-gray-500 hover:bg-white/[0.06] hover:text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              }
            `}
          >
            {copied ? (
              <FiCheck
                size={13}
                className="text-green-500"
              />
            ) : (
              <FiCopy size={13} />
            )}
          </button>

          {/* REFRESH */}

          <button
            type="button"
            onClick={executeCode}
            disabled={isLoading}
            title="Refresh preview"
            className={`
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-md
              transition-all
              disabled:cursor-not-allowed
              disabled:opacity-50
              ${
                dark
                  ? "text-gray-500 hover:bg-white/[0.06] hover:text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              }
            `}
          >
            <FiRefreshCw
              size={13}
              className={isLoading ? "animate-spin" : ""}
            />
          </button>

          {/* FULLSCREEN */}

          <button
            type="button"
            onClick={() =>
              setIsFullscreen(
                (previous) => !previous,
              )
            }
            title={
              isFullscreen
                ? "Exit fullscreen"
                : "Fullscreen"
            }
            className={`
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-md
              transition-all
              ${
                dark
                  ? "text-gray-500 hover:bg-white/[0.06] hover:text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              }
            `}
          >
            {isFullscreen ? (
              <FiMinimize2 size={13} />
            ) : (
              <FiMaximize2 size={13} />
            )}
          </button>
        </div>
      </div>

      {/* =====================================================
          PREVIEW AREA
      ====================================================== */}

      <div
        className={`
          min-h-0
          flex-1
          overflow-hidden
          ${isFullscreen ? "p-0" : "p-1.5"}
        `}
      >
        <div
          className={`
            relative
            h-full
            overflow-hidden
            border
            ${isFullscreen ? "rounded-none border-0" : "rounded-lg"}
            ${
              dark
                ? "border-white/[0.08] bg-black"
                : "border-gray-200 bg-white"
            }
          `}
        >
          {/* =================================================
              ERROR
          ================================================== */}

          {error ? (
            <div
              className={`
                flex
                h-full
                items-center
                justify-center
                p-4
                ${dark ? "text-red-400" : "text-red-600"}
              `}
            >
              <div className="w-full max-w-xl">
                <div className="flex items-center gap-2">
                  <FiAlertCircle size={16} />

                  <span className="text-xs font-semibold">
                    Preview Error
                  </span>
                </div>

                <pre
                  className={`
                    mt-2
                    max-w-full
                    overflow-auto
                    whitespace-pre-wrap
                    break-words
                    rounded-lg
                    p-3
                    text-[11px]
                    ${
                      dark
                        ? "bg-red-950/20 text-red-300"
                        : "bg-red-50 text-red-700"
                    }
                  `}
                >
                  {error}
                </pre>

                <button
                  type="button"
                  onClick={executeCode}
                  className={`
                    mt-3
                    rounded-md
                    px-3
                    py-1.5
                    text-xs
                    font-medium
                    transition
                    ${
                      dark
                        ? "bg-white text-black hover:bg-gray-200"
                        : "bg-black text-white hover:bg-gray-800"
                    }
                  `}
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              title="Solvix Code Preview"
              className="block h-full w-full border-0"
              sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
              style={{
                overflow: "auto",
                display: "block",
              }}
            />
          )}

          {/* =================================================
              LOADING
          ================================================== */}

          {isLoading && !error && (
            <div
              className="
                absolute
                inset-0
                z-20
                flex
                items-center
                justify-center
                bg-black/20
                backdrop-blur-[2px]
              "
            >
              <div
                className={`
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  border
                  px-3
                  py-2
                  text-xs
                  shadow-xl
                  ${
                    dark
                      ? "border-white/[0.08] bg-[#111]/95 text-gray-300"
                      : "border-gray-200 bg-white/95 text-gray-700"
                  }
                `}
              >
                <FiRefreshCw
                  size={13}
                  className="animate-spin"
                />

                <span>
                  Loading preview...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      {!isFullscreen && (
        <div
          className={`
            flex
            h-6
            shrink-0
            items-center
            justify-between
            border-t
            px-3
            text-[9px]
            ${
              dark
                ? "border-white/[0.08] text-gray-600"
                : "border-gray-200 text-gray-400"
            }
          `}
        >
          <div className="flex items-center gap-1.5">
            {latestCode.isComingSoon ? (
              <>
                <FiTool size={10} />

                <span>
                  Coming Soon
                </span>
              </>
            ) : (
              <>
                <FiCheckCircle
                  size={10}
                  className="text-green-500"
                />

                <span>
                  Ready
                </span>
              </>
            )}
          </div>

          <span>
            {latestCode.code
              ? latestCode.code.split("\n").length
              : 0}{" "}
            lines
          </span>
        </div>
      )}
    </div>
  );
}

