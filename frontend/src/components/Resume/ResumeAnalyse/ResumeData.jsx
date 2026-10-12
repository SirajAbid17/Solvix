import React from "react";
import {
  FaArrowRight,
  FaCheckCircle,
  FaChartLine,
  FaBriefcase,
  FaCode,
  FaGraduationCap,
  FaRocket,
  FaSearch,
  FaFileAlt,
  FaLightbulb,
} from "react-icons/fa";
import { useTheme } from "../../../BgContext/ThemeContext";


export default function ResumeData() {
  const { dark } = useTheme();

  return (
    <div
      className={`
        min-h-screen px-4 py-10
        transition-colors duration-300
        sm:px-6 lg:px-10
        ${
          dark
            ? "bg-black text-white"
            : "bg-white text-gray-900"
        }
      `}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">

        {}

        <div className="flex flex-col justify-center">

          {}
          <div
            className={`
              mb-3 inline-flex w-fit items-center gap-2
              rounded-full border
              px-3 py-1.5 text-xs font-medium
              ${
                dark
                  ? "border-white/10 bg-white/5 text-gray-300"
                  : "border-gray-200 bg-gray-50 text-gray-600"
              }
            `}
          >
            <FaRocket className="text-[10px]" />
            AI-Powered Career Intelligence
          </div>

          {}
          <h1 className="max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Land more interviews with{" "}
            <span
              className={
                dark ? "text-gray-400" : "text-gray-500"
              }
            >
              AI-powered
            </span>{" "}
            resume insights.
          </h1>

          {}
          <div
            className={`
              mt-4 max-w-xl space-y-4
              text-sm leading-6 sm:text-base
              ${
                dark
                  ? "text-gray-400"
                  : "text-gray-600"
              }
            `}
          >

            {}
            <p>
              <span
                className={
                  dark
                    ? "font-bold text-white"
                    : "font-bold text-gray-900"
                }
              >
              1.
              </span>{" "}
             Your resume is more than a document — it's your gateway to better opportunities. Solvix analyzes your skills, experience, projects, and career goals to understand your professional profile.

            </p>

            {}
            <p>
              <span
                className={
                  dark
                    ? "font-bold text-white"
                    : "font-bold text-gray-900"
                }
              >
                2.
              </span>{" "}
              Get your resume score, discover skill gaps, and receive personalized recommendations to improve your profile and become a stronger candidate.
.
            </p>
            {}
<p>
  <span
    className={
      dark
        ? "font-bold text-white"
        : "font-bold text-gray-900"
    }
  >
    3.
  </span>{" "}
  Discover jobs that match your skills, follow a personalized learning roadmap, and receive AI-powered insights to help you prepare for interviews and accelerate your career growth.
</p>

          </div>

          {}
          <div className="mt-5 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">

            <Feature
              icon={<FaChartLine />}
              title="Resume Score"
              text="Get an AI-powered score with detailed feedback."
            />

            <Feature
              icon={<FaLightbulb />}
              title="Skill Improvement"
              text="Discover the skills you need to improve."
            />

            <Feature
              icon={<FaGraduationCap />}
              title="Learning Roadmap"
              text="Know exactly what to learn next."
            />

            <Feature
              icon={<FaBriefcase />}
              title="Find Better Jobs"
              text="Discover jobs matching your skills."
            />

          </div>

         

        </div>

        {}

        <div className="flex items-center justify-center">
          <img
            src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXM1bHY1dnU5cXE5Mnl4bG85azd0MWVuZ2MyMnF4Z2xoYmM4MDQydSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/bjnevZHF4kPi96vo3X/giphy.webp"
            alt="AI Resume Analysis"
            className="w-full max-w-[500px] rounded-md"
          />
        </div>

      </div>
    </div>
  );
}




function Feature({ icon, title, text }) {
  return (
    <div className="flex gap-3">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300">
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-semibold">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
          {text}
        </p>
      </div>

    </div>
  );
}

