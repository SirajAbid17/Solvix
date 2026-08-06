import React from "react";
import { FaGlobe, FaRocket } from "react-icons/fa";
import { useTheme } from "../../../BgContext/ThemeContext";

export default function PortfolioHero() {
  const { dark } = useTheme();

  return (
    <div
      className={`px-8 py-12 transition-all ${
        dark
          ? "border-white/10 bg-white/[0.03] text-white"
          : "border-gray-200 bg-gray-50 text-black"
      }`}
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        {/* Icon */}
        <div
          className={`mb-6 flex h-20 w-20 items-center justify-center rounded-3xl shadow-lg ${
            dark ? "bg-white text-black" : "bg-black text-white"
          }`}
        >
          <FaGlobe size={34} />
        </div>

        {/* Badge */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-green-500/10 px-5 py-2 text-sm font-semibold text-green-500">
          <FaRocket />
          AI Powered Portfolio Builder
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold leading-tight md:text-5xl">
          Build Your Portfolio
          <span
            className={`block ${
              dark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            From Your Resume PDF
          </span>
        </h1>

        {/* Description */}
        <p
          className={`mt-6 max-w-3xl text-base leading-8 ${
            dark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Upload your resume and let AI instantly generate a beautiful,
          responsive, and professional portfolio website. Your portfolio
          will automatically include your profile, experience, skills,
          projects, education, certifications, achievements, and contact
          information—ready to deploy in minutes.
        </p>

        {/* Features */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {[
            "⚡ AI Generated",
            "📄 Resume to Portfolio",
            "💼 Professional Design",
            "📱 Fully Responsive",
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