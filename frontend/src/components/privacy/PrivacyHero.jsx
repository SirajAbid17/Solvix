import React, { useEffect, useRef } from "react";
import {
  FiArrowLeft,
  FiCheck,
  FiCpu,
  FiLock,
  FiShield,
  FiUserCheck,
} from "react-icons/fi";
import gsap from "gsap";

const PrivacyHero = ({ orbRef, gridRef, onBack }) => {
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const metaRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) return;

      const timeline = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      gsap.set(
        [
          ".privacy-badge",
          titleRef.current,
          textRef.current,
          metaRef.current,
          ".privacy-stat",
          ".hero-line",
          ".privacy-visual",
        ],
        {
          opacity: 0,
          y: 25,
        },
      );

      timeline
        .to(".privacy-badge", {
          opacity: 1,
          y: 0,
          duration: 0.6,
        })
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
          },
          "-=0.25",
        )
        .to(
          textRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
          },
          "-=0.4",
        )
        .to(
          metaRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
          },
          "-=0.3",
        )
        .to(
          ".hero-line",
          {
            opacity: 1,
            y: 0,
            scaleX: 1,
            duration: 0.7,
          },
          "-=0.2",
        )
        .to(
          ".privacy-visual",
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          "-=0.35",
        )
        .to(
          ".privacy-stat",
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
          },
          "-=0.3",
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden border-b border-white/[0.08] pt-[68px]">
      

      <header className="fixed left-0 top-0 z-50 w-full border-b border-white/[0.08] bg-[#0b0c0e]/85 backdrop-blur-2xl">
        <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <button onClick={onBack} className="group flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.05]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#c9a468]/20 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

              <FiCpu size={17} className="relative text-white/80" />
            </div>

            <div className="text-left">
              <div className="font-serif text-[16px] font-medium">Solvix</div>

              <div className="text-[10px] text-white/40">Intelligence</div>
            </div>
          </button>

          <div className="hidden items-center gap-2 text-[12px] md:flex">
            <span className="text-white/35">Legal</span>

            <span className="text-white/15">/</span>

            <span className="text-white/70">Privacy & data</span>
          </div>

          <button
            onClick={onBack}
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/70 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
          >
            <FiArrowLeft
              size={13}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Back home
          </button>
        </div>
      </header>

     

      <div className="relative mx-auto w-full max-w-[1400px] px-5 py-2 sm:px-8 sm:py-24 lg:px-12 lg:py-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="privacy-badge inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] text-white/60">
              Privacy by design
            </div>

            <h1
              ref={titleRef}
              className="max-w-3xl font-serif text-[clamp(2.8rem,6vw,6.25rem)] font-medium leading-[1.02] tracking-[-0.025em]"
            >
              Your data
              <br />
              <span className="text-white/40">stays yours.</span>
            </h1>

            <p
              ref={textRef}
              className="mt-7 max-w-xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8"
            >
              Solvix is built around a simple principle: AI should empower you
              without compromising your privacy. Here&apos;s how we collect,
              process, protect, and manage your data.
            </p>

            <div
              ref={metaRef}
              className="mt-7 flex flex-wrap items-center gap-4 text-[11px] text-white/35"
            >
              <span>Last updated September 6, 2026</span>

              <span className="h-1 w-1 rounded-full bg-white/20" />

              <span>Privacy Policy v1.0</span>
            </div>

            <div className="hero-line mt-8 h-px max-w-xl origin-left scale-x-0 bg-white/15" />
          </div>

          {}

          <div className="privacy-visual w-full">
            <div className="rounded-3xl border border-white/[0.08] bg-[#111214] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.3)] sm:p-6">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
                      <FiShield size={17} />
                    </div>

                    <div>
                      <p className="font-serif text-base">Privacy layer</p>

                      <p className="mt-0.5 text-[10px] text-white/30">
                        Protected environment
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-2.5 py-1 text-[9px] text-emerald-300">
                    Protected
                  </span>
                </div>

                <div className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
                  {[
                    [FiLock, "Secure authentication"],
                    [FiShield, "Controlled access"],
                    [FiCpu, "Protected processing"],
                  ].map(([Icon, text]) => (
                    <div key={text} className="flex items-center gap-3 py-4">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04]">
                        <Icon size={13} className="text-white/55" />
                      </div>

                      <span className="text-xs text-white/55">{text}</span>

                      <FiCheck size={13} className="ml-auto text-[#c9a468]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {}

        <div className="mt-16 grid border-t border-white/[0.08] sm:grid-cols-3">
          {[
            {
              icon: FiLock,
              title: "Secure",
              text: "Protection-focused infrastructure",
            },
            {
              icon: FiCpu,
              title: "Transparent",
              text: "Clear AI data processing",
            },
            {
              icon: FiUserCheck,
              title: "Your control",
              text: "Manage your eligible data",
            },
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={`privacy-stat border-white/[0.08] py-6 sm:px-6 ${
                  index !== 0 ? "border-t sm:border-l sm:border-t-0" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={14} className="text-white/45" />

                  <span className="text-[13px] font-medium text-white/75">
                    {item.title}
                  </span>
                </div>

                <p className="mt-1 text-[12px] text-white/35">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PrivacyHero;
