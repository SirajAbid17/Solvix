import React from "react";
import {
  FaUserTie,
  FaRobot,
  FaBrain,
  FaBolt,
} from "react-icons/fa";
import { useTheme } from "../../../BgContext/ThemeContext";

export default function InterviewHero() {
  const { dark } = useTheme();

  return (
    <div
      className={`px-8 py-12 ${
        dark
          ? "border-white/10 bg-white/[0.03] text-white"
          : "border-gray-200 bg-gray-50 text-black"
      }`}
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">

        <div
          className={`mb-6 flex h-20 w-20 items-center justify-center rounded-3xl ${
            dark ? "bg-white text-black" : "bg-black text-white"
          }`}
        >
          <FaUserTie size={34} />
        </div>

        <div className="mb-5 flex items-center gap-2 rounded-full bg-green-500/10 px-5 py-2 text-sm font-semibold text-green-500">
          <FaRobot />
          AI Mock Interview Generator
        </div>

        <h1 className="text-4xl font-bold md:text-5xl">
          Generate Your Interview
          <span
            className={`block ${
              dark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            From Resume PDF
          </span>
        </h1>

        <p
          className={`mt-6 max-w-3xl text-base leading-8 ${
            dark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Upload your resume and AI will analyze your experience,
          projects, skills, education, and technologies to generate a
          personalized mock interview with technical, behavioral, and HR
          questions tailored specifically to your profile.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {[
            "🤖 AI Questions",
            "💻 Technical Round",
            "👨‍💼 HR Interview",
            "🧠 Personalized",
            "⚡ Instant",
          ].map((item) => (
            <span
              key={item}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                dark
                  ? "border border-white/10 bg-black"
                  : "border border-gray-300 bg-white"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}