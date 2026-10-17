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
  FiZap,
  FiLayers,
  FiSearch,
  FiImage,
  FiFileText,
  FiUser,
  FiBriefcase,
  FiX,
} from "react-icons/fi";

import { HiOutlineSparkles } from "react-icons/hi";
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

  useEffect(() => {
    if (latestCode) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      gsap.set(titleRef.current, { opacity: 0, y: 25, filter: "blur(8px)" });
      gsap.set(subtitleRef.current, { opacity: 0, y: 15, filter: "blur(5px)" });
      gsap.set(".solvix-agent", { opacity: 0, y: 18, scale: 0.9 });
      gsap.set(".solvix-icon", { opacity: 0, scale: 0.5, rotate: -20 });
      gsap.set(".solvix-status", { opacity: 0, y: 10 });

      timeline
        .to(".solvix-icon", {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.7,
          ease: "back.out(1.7)",
        })
        .to(
          titleRef.current,
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8 },
          "-=0.35",
        )
        .to(
          subtitleRef.current,
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6 },
          "-=0.45",
        )
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
        .to(".solvix-status", { opacity: 1, y: 0, duration: 0.5 }, "-=0.15");

      gsap.to(".solvix-agent", {
        y: -3,
        duration: 2,
        stagger: { each: 0.12, repeat: -1, yoyo: true },
        ease: "sine.inOut",
      });

      gsap.to(glowRef.current, {
        scale: 1.3,
        opacity: 0.4,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, welcomeRef);

    return () => ctx.revert();
  }, [latestCode]);

  const agents = [
    { name: "Chat", icon: FiCpu },
    { name: "Search", icon: FiSearch },
    { name: "Image", icon: FiImage },
    { name: "Coding", icon: FiCode },
    { name: "PPT", icon: FiFileText },
    { name: "PDF", icon: FiFileText },
    { name: "Resume Analysis", icon: FiBriefcase },
    { name: "CV Generator", icon: FiUser },
    { name: "Portfolio Generator", icon: FiLayers },
    { name: "Mock Interview", icon: FiZap },
  ];

  if (!latestCode) {
    return (
      <div
        ref={welcomeRef}
        className={`relative flex h-full w-full items-center justify-center overflow-hidden px-3 py-6 sm:px-4 ${
          dark ? "bg-black" : "bg-white"
        }`}
      >
        <div
          ref={glowRef}
          className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl sm:h-72 sm:w-72"
          style={{
            background: dark
              ? "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
          <div
            className={`solvix-icon relative mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border sm:mb-4 sm:h-12 sm:w-12 ${
              dark
                ? "border-white/10 bg-white/[0.03] text-white"
                : "border-gray-200 bg-gray-100 text-gray-700"
            }`}
          >
            <FiCpu size={20} className="sm:size-[22px]" />
            <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500" />
            </span>
          </div>

          <h2
            ref={titleRef}
            className={`max-w-xl text-sm font-semibold leading-snug tracking-[-0.02em] sm:text-base sm:leading-tight md:text-lg ${
              dark ? "text-white" : "text-gray-900"
            }`}
          >
            All the AI Models and Agents You Need
            <span
              className={dark ? "mx-1 text-white/25" : "mx-1 text-gray-300"}
            >
              —
            </span>
            <span
              className={
                dark
                  ? "bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 bg-clip-text text-transparent"
              }
            >
              In One Powerful Platform.
            </span>
          </h2>

          <p
            ref={subtitleRef}
            className={`mt-2 max-w-lg px-2 text-[10px] leading-4 sm:text-[11px] sm:leading-5 ${
              dark ? "text-white/45" : "text-gray-500"
            }`}
          >
            One intelligent workspace for chat, research, coding, creativity,
            documents, and career growth.
          </p>

          <div className="mt-4 flex max-w-xl flex-wrap justify-center gap-1.5 px-2 sm:mt-5 sm:gap-2">
            {agents.map((agent) => {
              const Icon = agent.icon;
              return (
                <div
                  key={agent.name}
                  className={`solvix-agent flex cursor-default items-center gap-1 rounded-lg border px-2 py-1 text-[9px] font-medium transition-colors duration-200 sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-[10px] ${
                    dark
                      ? "border-white/[0.08] bg-white/[0.02] text-white/70 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    size={10}
                    className="shrink-0 opacity-70 sm:size-[11px]"
                  />
                  <span className="truncate">{agent.name}</span>
                </div>
              );
            })}
          </div>

          <div
            className={`solvix-status mt-4 flex flex-wrap items-center justify-center gap-2 px-2 text-[9px] tracking-wide sm:mt-5 sm:text-[10px] ${
              dark ? "text-white/40" : "text-gray-500"
            }`}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-center">
              Powered by Solvix AI Multi-Agent System
            </span>
            <HiOutlineSparkles size={11} className="text-purple-400" />
          </div>
        </div>
      </div>
    );
  }

 
  const panelBg = dark ? "#000000" : "#ffffff";
  const borderColor = dark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)";
  const btnBg = dark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)";
  const btnBorder = dark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.15)";
  const btnColor = dark ? "#ffffff" : "#111111";

  return (
    <>
      {isFullscreen && (
        <div
          onClick={() => setIsFullscreen(false)}
          className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-md"
        />
      )}

      <div
        className={`
          flex flex-col overflow-hidden
          ${
            isFullscreen
              ? "fixed left-1/2 top-1/2 z-[9999] h-[90vh] w-[90vw] max-w-[1300px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border shadow-[0_25px_80px_rgba(0,0,0,0.9)]"
              : "relative h-full w-full"
          }
        `}
        style={{
          backgroundColor: panelBg,
          borderColor: isFullscreen ? borderColor : "transparent",
          borderWidth: isFullscreen ? "1px" : "0",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            backgroundColor: panelBg, 
          }}
        >
          {error ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                padding: "16px",
                color: "#f87171",
              }}
            >
              <div style={{ width: "100%", maxWidth: "600px" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <FiAlertCircle size={16} />
                  <span style={{ fontSize: "12px", fontWeight: 600 }}>
                    Preview Error
                  </span>
                </div>
                <pre
                  style={{
                    marginTop: "8px",
                    maxWidth: "100%",
                    overflow: "auto",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    borderRadius: "8px",
                    backgroundColor: "rgba(127, 29, 29, 0.2)",
                    padding: "12px",
                    fontSize: "11px",
                    color: "#fca5a5",
                  }}
                >
                  {error}
                </pre>
                <button
                  type="button"
                  onClick={executeCode}
                  style={{
                    marginTop: "12px",
                    borderRadius: "6px",
                    backgroundColor: dark ? "#ffffff" : "#111111",
                    color: dark ? "#000000" : "#ffffff",
                    padding: "6px 12px",
                    fontSize: "12px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              title="Solvix Code Preview"
              sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                border: "0",
                overflow: "auto",
               
                backgroundColor: dark ? "#000000" : "#ffffff",
              }}
            />
          )}

          {isLoading && !error && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(2px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  borderRadius: "8px",
                  border: `1px solid ${borderColor}`,
                  backgroundColor: dark
                    ? "rgba(0, 0, 0, 0.95)"
                    : "rgba(255, 255, 255, 0.95)",
                  padding: "8px 12px",
                  fontSize: "12px",
                  color: dark ? "#d1d5db" : "#374151",
                }}
              >
                <FiRefreshCw
                  size={13}
                  style={{ animation: "spin 1s linear infinite" }}
                />
                <span>Loading preview...</span>
              </div>
            </div>
          )}

          {isFullscreen && (
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              title="Close"
              aria-label="Close preview"
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                zIndex: 50,
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px",
                backgroundColor: dark
                  ? "rgba(0, 0, 0, 0.85)"
                  : "rgba(255, 255, 255, 0.95)",
                border: `1px solid ${btnBorder}`,
                backdropFilter: "blur(12px)",
                color: btnColor,
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(239, 68, 68, 0.4)";
                e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.7)";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = dark
                  ? "rgba(0, 0, 0, 0.85)"
                  : "rgba(255, 255, 255, 0.95)";
                e.currentTarget.style.borderColor = btnBorder;
                e.currentTarget.style.color = btnColor;
              }}
            >
              <FiX size={18} />
            </button>
          )}

          <div
            style={{
              position: "absolute",
              bottom: "16px",
              right: "16px",
              zIndex: 30,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px",
              borderRadius: "12px",
              backgroundColor: dark
                ? "rgba(0, 0, 0, 0.75)"
                : "rgba(255, 255, 255, 0.9)",
              border: `1px solid ${btnBorder}`,
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            <button
              type="button"
              onClick={handleCopy}
              title="Copy code"
              aria-label="Copy code"
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                backgroundColor: copied ? "rgba(52, 211, 153, 0.2)" : btnBg,
                border: `1px solid ${btnBorder}`,
                color: copied ? "#34d399" : btnColor,
                cursor: "pointer",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(168, 85, 247, 0.4)";
                e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.7)";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = copied
                  ? "rgba(52, 211, 153, 0.2)"
                  : btnBg;
                e.currentTarget.style.borderColor = btnBorder;
                e.currentTarget.style.color = copied ? "#34d399" : btnColor;
              }}
            >
              {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
            </button>

            <button
              type="button"
              onClick={executeCode}
              disabled={isLoading}
              title="Refresh preview"
              aria-label="Refresh preview"
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                backgroundColor: btnBg,
                border: `1px solid ${btnBorder}`,
                color: btnColor,
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.4 : 1,
                transition: "all 0.2s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor =
                    "rgba(168, 85, 247, 0.4)";
                  e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.7)";
                  e.currentTarget.style.color = "#ffffff";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = btnBg;
                e.currentTarget.style.borderColor = btnBorder;
                e.currentTarget.style.color = btnColor;
              }}
            >
              <FiRefreshCw
                size={16}
                style={{
                  animation: isLoading ? "spin 1s linear infinite" : "none",
                }}
              />
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen((prev) => !prev)}
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                backgroundColor: btnBg,
                border: `1px solid ${btnBorder}`,
                color: btnColor,
                cursor: "pointer",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(168, 85, 247, 0.4)";
                e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.7)";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = btnBg;
                e.currentTarget.style.borderColor = btnBorder;
                e.currentTarget.style.color = btnColor;
              }}
            >
              {isFullscreen ? (
                <FiMinimize2 size={16} />
              ) : (
                <FiMaximize2 size={16} />
              )}
            </button>
          </div>

          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              zIndex: 30,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "999px",
              backgroundColor: dark
                ? "rgba(0, 0, 0, 0.75)"
                : "rgba(255, 255, 255, 0.9)",
              border: `1px solid ${btnBorder}`,
              backdropFilter: "blur(12px)",
              fontSize: "10px",
              fontWeight: 600,
              color: latestCode.isComingSoon ? "#fbbf24" : "#34d399",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            {latestCode.isComingSoon ? (
              <>
                <FiTool size={11} />
                <span>Coming Soon</span>
              </>
            ) : (
              <>
                <FiCheckCircle size={11} />
                <span>Ready</span>
              </>
            )}
          </div>

          {!isFullscreen && (
            <div
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                zIndex: 30,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                borderRadius: "999px",
                backgroundColor: dark
                  ? "rgba(0, 0, 0, 0.75)"
                  : "rgba(255, 255, 255, 0.9)",
                border: "1px solid rgba(168, 85, 247, 0.4)",
                backdropFilter: "blur(12px)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#a855f7",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              }}
            >
              <FiCode size={11} />
              <span>
                {latestCode.isComingSoon
                  ? "Soon"
                  : latestCode.language?.toUpperCase() || "HTML"}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}