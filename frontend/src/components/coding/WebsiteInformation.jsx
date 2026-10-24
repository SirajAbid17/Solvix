import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../BgContext/ThemeContext";
import JobsModal from "../Jobs/JobsModal";
import {
  FiBriefcase,
  FiMoreVertical,
  FiDollarSign,
  FiMail,
  FiShield,
  FiChevronRight,
  FiChevronDown,
  FiSend,
  FiMap,
  FiTrendingUp,
} from "react-icons/fi";

export default function WebsiteInformation() {
  const navigate = useNavigate();
  const { dark } = useTheme();

  const [showJobsModal, setShowJobsModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showJobsDropdown, setShowJobsDropdown] = useState(false);

  const menuRef = useRef(null);
  const jobsDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }

      if (
        jobsDropdownRef.current &&
        !jobsDropdownRef.current.contains(e.target)
      ) {
        setShowJobsDropdown(false);
      }
    };

    if (showMenu || showJobsDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu, showJobsDropdown]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowMenu(false);
        setShowJobsDropdown(false);
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const menuItems = [
    {
      id: "pricing",
      label: "Pricing",
      description: "View our plans",
      icon: FiDollarSign,
      action: () => navigate("/pricing"),
    },
    {
      id: "contact",
      label: "Contact",
      description: "Get in touch",
      icon: FiMail,
      action: () => navigate("/contact"),
    },
    {
      id: "privacy",
      label: "Privacy",
      description: "Privacy policy",
      icon: FiShield,
      action: () => navigate("/privacy"),
    },
  ];

  const jobsDropdownItems = [
    {
      id: "jobs",
      label: "Job Opportunities",
      description: "Browse open positions",
      icon: FiBriefcase,
      action: () => setShowJobsModal(true),
    },
    {
      id: "autoapply",
      label: "Auto Job Email",
      description: "Send job emails automatically",
      icon: FiSend,
      action: () => navigate("/autoapply"),
    },
  ];

  const handleMenuClick = (item) => {
    item.action();
    setShowMenu(false);
  };

  const handleJobsDropdownClick = (item) => {
    item.action();
    setShowJobsDropdown(false);
  };

  return (
    <>
      <div
        className={`
          relative
          flex
          w-full
          shrink-0
          items-center
          justify-between
          gap-2
          border-t
          px-3
          py-2.5
          ${dark ? "border-white/[0.08] bg-black" : "border-gray-200 bg-white"}
        `}
      >
        
        <div className="relative order-1 min-w-0 flex-1">
         
          <div
            className="
              flex
              items-center
              gap-2
              overflow-x-auto
              overflow-y-visible
              scrollbar-hide
              scroll-smooth
              py-0.5
            "
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            
            <div ref={jobsDropdownRef} className="relative shrink-0">
              <button
                onClick={() => {
                  setShowJobsDropdown((prev) => !prev);
                  setShowMenu(false);
                }}
                type="button"
                aria-expanded={showJobsDropdown}
                aria-haspopup="true"
                className={`
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  whitespace-nowrap
                  transition-all
                  duration-200
                  bg-purple-600
                  text-white
                  hover:bg-purple-700
                `}
                style={{ minWidth: "115px" }}
              >
                <FiBriefcase size={13} />
                <span>Job Opportunities</span>
                <FiChevronDown
                  size={12}
                  className={`shrink-0 transition-transform duration-200 ${
                    showJobsDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

             
              {showJobsDropdown && (
                <div
                  className={`
                    fixed
                    z-[99999]
                    w-64
                    overflow-hidden
                    rounded-xl
                    border
                    ${
                      dark
                        ? "border-white/[0.1] bg-[#0a0a0a]"
                        : "border-gray-200 bg-white"
                    }
                  `}
                  style={{
                    boxShadow: dark
                      ? "0 10px 40px rgba(0, 0, 0, 0.7)"
                      : "0 10px 40px rgba(0, 0, 0, 0.15)",
                    animation: "dropdownSlide 0.15s ease-out",
                    
                  }}
                  ref={(el) => {
                    if (el && jobsDropdownRef.current) {
                      const btn = jobsDropdownRef.current.querySelector("button");
                      if (btn) {
                        const rect = btn.getBoundingClientRect();
                        el.style.left = `${rect.left}px`;
                        el.style.bottom = `${window.innerHeight - rect.top + 8}px`;
                        el.style.top = "auto";
                      }
                    }
                  }}
                >
                  <div
                    className={`
                      border-b
                      px-4
                      py-2.5
                      ${
                        dark
                          ? "border-white/[0.06] bg-white/[0.02]"
                          : "border-gray-100 bg-gray-50"
                      }
                    `}
                  >
                    <p
                      className={`text-[10px] font-semibold uppercase tracking-wider ${
                        dark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Jobs &amp; Automation
                    </p>
                  </div>

                  <div className="p-1.5">
                    {jobsDropdownItems.map((item) => {
                      const Icon = item.icon;
                      const isAutoApply = item.id === "autoapply";

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleJobsDropdownClick(item)}
                          type="button"
                          className={`
                            group
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-lg
                            px-3
                            py-2.5
                            text-left
                            transition-colors
                            duration-150
                            ${
                              dark
                                ? isAutoApply
                                  ? "hover:bg-purple-600/10"
                                  : "hover:bg-white/[0.06]"
                                : isAutoApply
                                  ? "hover:bg-purple-50"
                                  : "hover:bg-gray-50"
                            }
                          `}
                        >
                          <div
                            className={`
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-md
                              ${
                                isAutoApply
                                  ? dark
                                    ? "bg-purple-600/20 text-purple-400"
                                    : "bg-purple-100 text-purple-600"
                                  : dark
                                    ? "bg-white/[0.05] text-gray-400"
                                    : "bg-gray-100 text-gray-600"
                              }
                            `}
                          >
                            <Icon size={14} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-xs font-medium ${
                                dark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {item.label}
                            </p>

                            <p className="mt-0.5 text-[10px] text-gray-500">
                              {item.description}
                            </p>
                          </div>

                          <FiChevronRight
                            size={13}
                            className={`shrink-0 ${
                              isAutoApply
                                ? dark
                                  ? "text-purple-500/60"
                                  : "text-purple-400"
                                : dark
                                  ? "text-gray-600"
                                  : "text-gray-400"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

         
            <button
              onClick={() => navigate("/roadmap")}
              type="button"
              className={`
                group
                relative
                flex
                shrink-0
                items-center
                justify-center
                gap-2
                overflow-hidden
                rounded-lg
                border
                px-4
                py-2
                text-xs
                font-semibold
                whitespace-nowrap
                transition-all
                duration-300
                ${
                  dark
                    ? "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-200 hover:border-emerald-400/40 hover:bg-emerald-400/[0.12]"
                    : "border-emerald-500/20 bg-emerald-50 text-emerald-700 hover:border-emerald-500/40 hover:bg-emerald-100"
                }
              `}
              style={{ minWidth: "130px" }}
            >
              <FiMap
                size={13}
                className="shrink-0 transition-transform duration-300 group-hover:scale-110"
              />
              <span>Job Roadmap</span>
              <FiTrendingUp
                size={12}
                className="shrink-0 opacity-70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
              />
            </button>
          </div>
        </div>

     
        <div ref={menuRef} className="relative order-2 shrink-0">
          <button
            onClick={() => {
              setShowMenu((prev) => !prev);
              setShowJobsDropdown(false);
            }}
            type="button"
            aria-expanded={showMenu}
            aria-haspopup="true"
            className={`
              flex
              items-center
              gap-2
              rounded-lg
              border
              px-3
              py-2
              text-xs
              font-medium
              whitespace-nowrap
              transition-colors
              duration-200
              ${
                showMenu
                  ? dark
                    ? "border-white/20 bg-white/10 text-white"
                    : "border-gray-400 bg-gray-100 text-gray-900"
                  : dark
                    ? "border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
              }
            `}
          >
            <FiMoreVertical
              size={14}
              className={`transition-transform duration-200 ${
                showMenu ? "rotate-90" : ""
              }`}
            />
            <span>More</span>
          </button>

          {showMenu && (
            <div
              className={`
                absolute
                bottom-full
                right-0
                z-[9999]
                mb-2
                w-64
                overflow-hidden
                rounded-xl
                border
                ${
                  dark
                    ? "border-white/[0.1] bg-[#0a0a0a]"
                    : "border-gray-200 bg-white"
                }
              `}
              style={{
                boxShadow: dark
                  ? "0 10px 40px rgba(0, 0, 0, 0.6)"
                  : "0 10px 40px rgba(0, 0, 0, 0.1)",
                animation: "dropdownSlide 0.15s ease-out",
              }}
            >
              <div
                className={`
                  border-b
                  px-4
                  py-2.5
                  ${
                    dark
                      ? "border-white/[0.06] bg-white/[0.02]"
                      : "border-gray-100 bg-gray-50"
                  }
                `}
              >
                <p
                  className={`text-[10px] font-semibold uppercase tracking-wider ${
                    dark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Quick Links
                </p>
              </div>

              <div className="p-1.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item)}
                      type="button"
                      className={`
                        group
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-lg
                        px-3
                        py-2.5
                        text-left
                        transition-colors
                        duration-150
                        ${dark ? "hover:bg-white/[0.06]" : "hover:bg-gray-50"}
                      `}
                    >
                      <div
                        className={`
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-md
                          ${
                            dark
                              ? "bg-white/[0.05] text-gray-400"
                              : "bg-gray-100 text-gray-600"
                          }
                        `}
                      >
                        <Icon size={14} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-xs font-medium ${
                            dark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item.label}
                        </p>

                        <p className="mt-0.5 text-[10px] text-gray-500">
                          {item.description}
                        </p>
                      </div>

                      <FiChevronRight
                        size={13}
                        className={`shrink-0 ${
                          dark ? "text-gray-600" : "text-gray-400"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {showJobsModal && (
        <JobsModal
          isOpen={showJobsModal}
          onClose={() => setShowJobsModal(false)}
        />
      )}

      <style>{`
        @keyframes dropdownSlide {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
        .scrollbar-hide {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
    </>
  );
}