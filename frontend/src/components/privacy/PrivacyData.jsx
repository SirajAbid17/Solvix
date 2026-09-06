import React, {
  useEffect,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import PrivacyHero from "./PrivacyHero";
import PrivacyContent from "./PrivacyContent";
import PrivacyFooter from "./PrivacyFooter";

gsap.registerPlugin(ScrollTrigger);

const PrivacyData = () => {
  const navigate = useNavigate();

  const pageRef = useRef(null);
  const orbRef = useRef(null);
  const gridRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) return;

      gsap.to(orbRef.current, {
        x: 80,
        y: 50,
        scale: 1.15,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(gridRef.current, {
        y: 25,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.utils
        .toArray(".privacy-section")
        .forEach((section) => {
          gsap.fromTo(
            section,
            {
              opacity: 0,
              y: 24,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });

      const updateProgress = () => {
        const scrollTop = window.scrollY;

        const height =
          document.documentElement.scrollHeight -
          window.innerHeight;

        const progress =
          height > 0 ? (scrollTop / height) * 100 : 0;

        gsap.to(progressRef.current, {
          width: `${progress}%`,
          duration: 0.15,
          ease: "none",
        });
      };

      window.addEventListener("scroll", updateProgress);
      updateProgress();

      return () => {
        window.removeEventListener(
          "scroll",
          updateProgress
        );
      };
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const goHome = () => navigate("/");

  return (
    <main
      ref={pageRef}
      className="min-h-screen overflow-hidden bg-[#0b0c0e] text-[#e9e7e2] antialiased"
    >
      {/* Progress */}

      <div className="fixed left-0 top-0 z-[100] h-[2px] w-full bg-white/[0.06]">
        <div
          ref={progressRef}
          className="h-full w-0 bg-[#c9a468]"
        />
      </div>

      <PrivacyHero
        orbRef={orbRef}
        gridRef={gridRef}
        onBack={goHome}
      />

      <PrivacyContent />

      <PrivacyFooter
        onHome={goHome}
        onTerms={() => navigate("/terms")}
      />
    </main>
  );
};

export default PrivacyData;