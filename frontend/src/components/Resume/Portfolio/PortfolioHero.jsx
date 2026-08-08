import React from "react";
import {
  FaGlobe,
  FaRocket,
  FaRobot,
  FaFilePdf,
  FaPalette,
  FaMobileAlt,
  FaArrowRight,
} from "react-icons/fa";
import { useTheme } from "../../../BgContext/ThemeContext";
import GetAllWebsite from "./GetAllWebsite";

export default function PortfolioHero() {
  const { dark } = useTheme();

  const features = [
    {
      icon: FaRobot,
      text: "AI Generated",
    },
    {
      icon: FaFilePdf,
      text: "Resume to Portfolio",
    },
    {
      icon: FaPalette,
      text: "Professional Design",
    },
    {
      icon: FaMobileAlt,
      text: "Fully Responsive",
    },
  ];

  return (
    <>
     
      <div
        className={`
          relative
          overflow-hidden
          px-6
          py-12
          transition-all
          duration-300
          sm:px-8
          md:px-12
          ${
            dark
              ? "border-white/10 bg-white/[0.03] text-white"
              : "border-gray-200 bg-gray-50 text-black"
          }
        `}
      >
        {/* Background Glow */}
        <div
          className={`
            pointer-events-none
            absolute
            -right-20
            -top-20
            h-64
            w-64
            rounded-full
            blur-3xl
            ${
              dark
                ? "bg-white/[0.04]"
                : "bg-gray-200/70"
            }
          `}
        />

        <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* =========================
              HERO ICON
          ========================== */}
          <div
            className={`
              mb-6
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-3xl
              shadow-lg
              transition-transform
              duration-300
              hover:scale-105
              ${
                dark
                  ? "bg-white text-black"
                  : "bg-black text-white"
              }
            `}
          >
            <FaGlobe className="text-3xl" />
          </div>

          {/* =========================
              BADGE
          ========================== */}
          <div
            className="
              mb-5
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-green-500/10
              px-5
              py-2
              text-sm
              font-semibold
              text-green-500
            "
          >
            <FaRocket className="text-sm" />
            AI Powered Portfolio Builder
          </div>

          {/* =========================
              HEADING
          ========================== */}
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Build Your Portfolio

            <span
              className={`
                mt-2
                block
                ${
                  dark
                    ? "text-gray-300"
                    : "text-gray-600"
                }
              `}
            >
              From Your Resume PDF
            </span>
          </h1>

          {/* =========================
              DESCRIPTION
          ========================== */}
          <p
            className={`
              mt-6
              max-w-3xl
              text-base
              leading-8
              sm:text-lg
              ${
                dark
                  ? "text-gray-400"
                  : "text-gray-600"
              }
            `}
          >
            Upload your resume and let AI instantly generate a
            beautiful, responsive, and professional portfolio
            website. Your portfolio will automatically include
            your profile, experience, skills, projects, education,
            certifications, achievements, and contact information—
            ready to deploy in minutes.
          </p>

          {/* =========================
              FEATURES
          ========================== */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.text}
                  className={`
                    group
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    ${
                      dark
                        ? "border-white/10 bg-black/40 text-gray-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 hover:text-black"
                    }
                  `}
                >
                  <Icon
                    className={`
                      text-sm
                      transition-transform
                      duration-200
                      group-hover:scale-110
                      ${
                        dark
                          ? "text-gray-300"
                          : "text-gray-700"
                      }
                    `}
                  />

                  {feature.text}
                </div>
              );
            })}
          </div>

        
        </div>
      </div>

      {/* =========================
          ALL WEBSITES
      ========================== */}
      <GetAllWebsite />
    </>
  );
}

