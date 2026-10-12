import React from "react";
import { FaArrowLeft, FaFileAlt, FaMagic } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../BgContext/ThemeContext";
import BgContextBtn from "../BgContextBtn";

export default function ResumeHeader() {
  const navigate = useNavigate();
  const { dark } = useTheme();

  return (
    <header
      className={`
        sticky top-0 z-50 w-full
        border-b backdrop-blur-xl
        transition-all duration-300
        ${
          dark
            ? "bg-black/80 border-white/10 text-white"
            : "bg-white/80 border-black/10 text-gray-900"
        }
      `}
    >
      <div className="mx-auto flex min-h-[72px]  items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {}
        <div className="flex min-w-0 items-center gap-3">

          {}
          <button
            onClick={() => navigate("/")}
            className={`
              flex h-10 w-10 shrink-0 items-center justify-center
              rounded-full border
              transition-all duration-300
              hover:-translate-x-1
              ${
                dark
                  ? "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                  : "border-black/10 bg-black/5 text-gray-600 hover:bg-black/10 hover:text-black"
              }
            `}
            title="Back to Home"
          >
            <FaArrowLeft className="text-sm" />
          </button>

          {}
          <div className="flex min-w-0 items-center gap-3">
            

            <div className="min-w-0">
              <h1 className="truncate text-base font-bold sm:text-lg">
                Solvix AI
              </h1>

              <p
                className={`
                  hidden text-xs sm:block
                  ${dark ? "text-gray-400" : "text-gray-500"}
                `}
              >
                AI-powered career assistant
              </p>
            </div>
          </div>
        </div>

      {}
<div className="hidden md:block text-center">
  <div className="flex items-center justify-center gap-6 text-sm font-medium">
    <Link
      to="/resume"
      className={dark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-black"}
    >
      Resume Analyzer
    </Link>

    <Link
      to="/cv-generator"
      className={dark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-black"}
    >
      CV Generator
    </Link>

    <Link
      to="/portfolio"
      className={dark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-black"}
    >
      Portfolio
    </Link>

    <Link
      to="/mock-interview"
      className={dark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-black"}
    >
      Mock Interview
    </Link>
  </div>
</div>

        {}
        <div className="flex shrink-0 items-center">
         
            <div
              className={`
                fixed right-3 top-3
                rounded-full
                p-1
                transition-all duration-300
                hover:scale-110
                ${
                  dark
                    ? "bg-black  "
                    : "bg-white"
                }
              `}
            >
            
            
            </div>
              <BgContextBtn />
        </div>

      </div>
    </header>
  );
}

