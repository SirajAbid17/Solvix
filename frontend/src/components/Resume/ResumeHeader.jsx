import React, { useState, useEffect, useRef } from "react";
import {
  FaArrowLeft,
  FaBars,
  FaTimes,
  FaFileAlt,
  FaUser,
  FaFolder,
  FaMicrophone,
  FaHome,
  FaChevronRight,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../BgContext/ThemeContext";
import BgContextBtn from "../BgContextBtn";

const NAV_LINKS = [
  { to: "/resume", label: "Resume Analyzer", icon: FaFileAlt },
  { to: "/cv-generator", label: "CV Generator", icon: FaUser },
  { to: "/portfolio", label: "Portfolio", icon: FaFolder },
  { to: "/mock-interview", label: "Mock Interview", icon: FaMicrophone },
];

export default function ResumeHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header
        className={`
          sticky top-0 z-50 w-full
          border-b backdrop-blur-xl
          transition-all duration-300
          ${
            dark
              ? "border-white/10 bg-black/80 text-white"
              : "border-black/10 bg-white/80 text-gray-900"
          }
        `}
      >
        <div className="mx-auto flex min-h-[60px] items-center justify-between gap-2 px-3 sm:min-h-[72px] sm:gap-4 sm:px-6 lg:px-8">
          
          <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate("/")}
              className={`
                flex h-9 w-9 shrink-0 items-center justify-center
                rounded-full border transition-all duration-300
                active:scale-95
                hover:-translate-x-0.5
                sm:h-10 sm:w-10
                ${
                  dark
                    ? "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                    : "border-black/10 bg-black/5 text-gray-600 hover:bg-black/10 hover:text-black"
                }
              `}
              title="Back to Home"
              aria-label="Back to Home"
            >
              <FaArrowLeft className="text-xs sm:text-sm" />
            </button>

            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <div className="min-w-0">
                <h1 className="truncate text-sm font-bold sm:text-base lg:text-lg">
                  Solvix AI
                </h1>
                <p
                  className={`
                    hidden text-[10px] sm:block sm:text-xs
                    ${dark ? "text-gray-400" : "text-gray-500"}
                  `}
                >
                  AI-powered career assistant
                </p>
              </div>
            </div>
          </div>

        
          <nav className="hidden flex-1 justify-center md:flex">
            <div className="flex items-center gap-5 lg:gap-7">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.to);

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`
                      group relative flex items-center gap-1.5 py-2 text-xs font-medium
                      transition-colors duration-200
                      lg:gap-2 lg:text-sm
                      ${
                        active
                          ? dark
                            ? "text-white"
                            : "text-black"
                          : dark
                            ? "text-gray-400 hover:text-white"
                            : "text-gray-500 hover:text-black"
                      }
                    `}
                  >
                    
                    <Icon
                      className={`
                        shrink-0 text-[11px] transition-transform duration-200
                        group-hover:scale-110 lg:text-xs
                        ${active ? "opacity-100" : "opacity-60 group-hover:opacity-100"}
                      `}
                    />

                   
                    <span className="hidden lg:inline">{link.label}</span>
                    <span className="lg:hidden">
                      {link.label.split(" ")[0]}
                    </span>

                    
                    <span
                      className={`
                        absolute
                        bottom-0
                        left-0
                        right-0
                        h-[2px]
                        origin-center
                        rounded-full
                        bg-gradient-to-r
                        from-transparent
                        via-current
                        to-transparent
                        transition-all
                        duration-300
                        ${
                          active
                            ? "scale-x-100 opacity-100"
                            : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-60"
                        }
                      `}
                    />
                  </Link>
                );
              })}
            </div>
          </nav>

         
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <BgContextBtn />

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className={`
                flex h-9 w-9 items-center justify-center rounded-lg border
                transition-all duration-200 active:scale-95
                sm:h-10 sm:w-10
                md:hidden
                ${
                  dark
                    ? "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                    : "border-black/10 bg-black/5 text-gray-600 hover:bg-black/10 hover:text-black"
                }
              `}
              aria-label="Open menu"
              title="Open menu"
            >
              <FaBars className="text-sm sm:text-base" />
            </button>
          </div>
        </div>
      </header>

      
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className={`absolute inset-0 backdrop-blur-sm transition-opacity duration-300 ${
              dark ? "bg-black/70" : "bg-black/40"
            }`}
          />

          <div
            ref={menuRef}
            className={`
              absolute right-0 top-0 flex h-full w-[85vw] max-w-[320px]
              flex-col border-l shadow-2xl transition-transform duration-300
              ${
                dark
                  ? "border-white/10 bg-[#0a0a0a] text-white"
                  : "border-gray-200 bg-white text-gray-900"
              }
            `}
            style={{ animation: "slideIn 0.25s ease-out" }}
          >
            <div
              className={`
                flex shrink-0 items-center justify-between border-b px-4 py-4
                ${dark ? "border-white/10" : "border-gray-200"}
              `}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    dark ? "bg-white/5 text-gray-300" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <FaBars size={14} />
                </div>
                <div>
                  <p className="text-sm font-bold">Menu</p>
                  <p
                    className={`text-[10px] ${
                      dark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Navigate pages
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex h-8 w-8 items-center justify-center rounded-lg
                  transition-all active:scale-95
                  ${
                    dark
                      ? "text-gray-400 hover:bg-white/10 hover:text-white"
                      : "text-gray-500 hover:bg-gray-100 hover:text-black"
                  }
                `}
                aria-label="Close menu"
              >
                <FaTimes size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-3">
              <div className="space-y-1">
                {NAV_LINKS.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.to);

                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        group flex items-center gap-3 rounded-xl border px-3 py-3
                        transition-all duration-200 active:scale-[0.98]
                        ${
                          active
                            ? dark
                              ? "border-white/20 bg-white/10 text-white"
                              : "border-gray-300 bg-gray-100 text-black"
                            : dark
                              ? "border-transparent bg-white/[0.02] text-gray-300 hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
                              : "border-transparent bg-gray-50/50 text-gray-700 hover:border-gray-200 hover:bg-gray-100 hover:text-black"
                        }
                      `}
                    >
                      <span
                        className={`
                          flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
                          transition-colors duration-200
                          ${
                            active
                              ? dark
                                ? "bg-white text-black"
                                : "bg-black text-white"
                              : dark
                                ? "bg-white/[0.05] text-gray-400 group-hover:bg-white/[0.1] group-hover:text-white"
                                : "bg-white text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-800"
                          }
                        `}
                      >
                        <Icon size={14} />
                      </span>

                      <span className="flex-1 text-sm font-medium">
                        {link.label}
                      </span>

                      <FaChevronRight
                        size={11}
                        className={`shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 ${
                          dark ? "text-gray-600" : "text-gray-400"
                        }`}
                      />
                    </Link>
                  );
                })}
              </div>

              <div
                className={`
                  mt-3 border-t pt-3
                  ${dark ? "border-white/[0.06]" : "border-gray-100"}
                `}
              >
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    group flex items-center gap-3 rounded-xl border border-transparent px-3 py-3
                    transition-all duration-200 active:scale-[0.98]
                    ${
                      dark
                        ? "text-gray-400 hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
                        : "text-gray-500 hover:border-gray-200 hover:bg-gray-100 hover:text-black"
                    }
                  `}
                >
                  <span
                    className={`
                      flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
                      transition-colors duration-200
                      ${
                        dark
                          ? "bg-white/[0.05] text-gray-400 group-hover:bg-white/[0.1] group-hover:text-white"
                          : "bg-white text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-800"
                      }
                    `}
                  >
                    <FaHome size={14} />
                  </span>
                  <span className="flex-1 text-sm font-medium">Home</span>
                  <FaChevronRight
                    size={11}
                    className={`shrink-0 transition-transform group-hover:translate-x-0.5 ${
                      dark ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                </Link>
              </div>
            </div>

            <div
              className={`
                shrink-0 border-t px-4 py-3
                ${dark ? "border-white/10" : "border-gray-200"}
              `}
            >
              <p
                className={`text-center text-[10px] tracking-wide ${
                  dark ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Solvix AI · v1.0
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}