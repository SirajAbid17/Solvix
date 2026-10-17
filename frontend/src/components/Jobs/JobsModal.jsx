import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FiX,
  FiSearch,
  FiLoader,
  FiClock,
  FiBriefcase,
  FiAlertCircle,
  FiMapPin,
  FiGlobe,
  FiChevronDown,
} from "react-icons/fi";
import { useTheme } from "../../BgContext/ThemeContext";
import { searchJobs, getJobSearchStatus } from "../../Features/jobService";
import JobCard from "./JobCard";
import toast from "react-hot-toast";

const SUGGESTED_SEARCHES = [
  "MERN Stack Developer",
  "React Developer",
  "Full Stack Developer",
  "Node.js Developer",
  "Frontend Developer",
  "Backend Developer",
  "AI Engineer",
  "Python Developer",
];

const COUNTRIES = [
  "Pakistan",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "UAE",
  "India",
  "Saudi Arabia",
  "Netherlands",
  "Singapore",
  "Any",
];

export default function JobsModal({ isOpen, onClose }) {
  const { dark } = useTheme();

  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [searched, setSearched] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);


  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

 
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        if (showCountryDropdown) setShowCountryDropdown(false);
        else onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose, showCountryDropdown]);

 
  useEffect(() => {
    if (!isOpen) return;

    const loadStatus = async () => {
      try {
        setStatusLoading(true);
        const status = await getJobSearchStatus();

        if (status?.success) {
          if (!status.canSearch && status.cachedJobs?.length > 0) {
            setJobs(status.cachedJobs);
            setSearched(true);
            setQuery(status.cachedQuery || "");
            setTimeRemaining(status.timeRemaining);
            setCooldown(true);
          } else if (!status.canSearch) {
            setTimeRemaining(status.timeRemaining);
            setCooldown(true);
          }
        }
      } catch (err) {
        console.error("Load status error:", err);
      } finally {
        setStatusLoading(false);
      }
    };

    loadStatus();
  }, [isOpen]);

  const handleSearch = async (searchQuery) => {
    const q = (searchQuery || query).trim();

    if (!q) {
      toast.error("Please enter job keywords");
      return;
    }

    try {
      setLoading(true);
      setQuery(q);

      const response = await searchJobs({
        query: q,
        city: city.trim(),
        country: country.trim(),
      });

      if (response?.cooldown) {
        setCooldown(true);
        setTimeRemaining(response.timeRemaining);
        if (response.cachedResults?.length > 0) {
          setJobs(response.cachedResults);
          setSearched(true);
        }
        toast.error(response.message);
        return;
      }

      if (response?.success) {
        setJobs(response.jobs || []);
        setSearched(true);

        if (response.jobs?.length > 0) {
          toast.success(`Found ${response.jobs.length} fresh jobs!`);
        } else {
          toast.error(response.message || "No jobs found");
        }
      } else {
        toast.error(response?.message || "Search failed");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error(
        error.response?.data?.message || "Search failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        zIndex: 99999,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          relative
          flex
          h-[92vh]
          max-h-[820px]
          w-full
          max-w-2xl
          flex-col
          overflow-hidden
          rounded-2xl
          border
          ${
            dark
              ? "border-white/[0.1] bg-[#0a0a0a] text-white"
              : "border-gray-200 bg-white text-gray-900"
          }
        `}
        style={{ zIndex: 100000 }}
      >
       
        <div
          className={`
            relative
            flex
            shrink-0
            items-center
            justify-between
            border-b
            px-5
            py-4
            ${
              dark ? "border-white/[0.07] bg-black" : "border-gray-200 bg-white"
            }
          `}
        >
        
          <div
            className="
              absolute
              left-0
              right-0
              top-0
              h-[2px]
              bg-gradient-to-r
              from-transparent
              via-purple-500/60
              to-transparent
            "
          />

          <div className="flex items-center gap-3">
            <div
              className={`
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                ${
                  dark
                    ? "bg-purple-500/15 text-purple-400"
                    : "bg-purple-100 text-purple-600"
                }
              `}
            >
              <FiBriefcase size={18} />
            </div>

            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Find Jobs
              </h2>
              <div className="flex items-center gap-1.5">
                <span className="flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                <p
                  className={`text-[10px] ${
                    dark ? "text-white/40" : "text-gray-500"
                  }`}
                >
                  Fresh jobs from the last 3 days
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              transition
              ${
                dark
                  ? "text-white/50 hover:bg-white/[0.06] hover:text-white"
                  : "text-gray-400 hover:bg-gray-100 hover:text-gray-800"
              }
            `}
          >
            <FiX size={17} />
          </button>
        </div>

       
        {cooldown && (
          <div
            className={`
              flex
              shrink-0
              items-center
              gap-3
              border-b
              px-5
              py-3
              ${
                dark
                  ? "border-amber-500/20 bg-amber-500/[0.06]"
                  : "border-amber-200 bg-amber-50"
              }
            `}
          >
            <div
              className={`
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                ${
                  dark
                    ? "bg-amber-500/15 text-amber-400"
                    : "bg-amber-100 text-amber-600"
                }
              `}
            >
              <FiClock size={15} />
            </div>
            <div className="flex-1">
              <p
                className={`text-xs font-semibold ${
                  dark ? "text-amber-300" : "text-amber-800"
                }`}
              >
                You have already searched for jobs today
              </p>
              <p
                className={`text-[10px] ${
                  dark ? "text-amber-400/70" : "text-amber-700"
                }`}
              >
                Next search available in {timeRemaining || "24h"}
              </p>
            </div>
          </div>
        )}

        
        <div
          className={`
            shrink-0
            border-b
            px-5
            py-4
            ${dark ? "border-white/[0.07]" : "border-gray-200"}
          `}
        >
         
          <div className="mb-3">
            <label
              className={`
                mb-1.5
                block
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                ${dark ? "text-white/40" : "text-gray-500"}
              `}
            >
              Job Role
            </label>
            <div className="relative">
              <FiSearch
                size={15}
                className={`
                  absolute
                  left-3.5
                  top-1/2
                  -translate-y-1/2
                  ${dark ? "text-white/30" : "text-gray-400"}
                `}
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading || cooldown}
                placeholder="e.g. MERN Stack Developer"
                autoFocus
                className={`
                  h-11
                  w-full
                  rounded-xl
                  border
                  pl-10
                  pr-3
                  text-sm
                  outline-none
                  transition
                  ${
                    dark
                      ? "border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/25 focus:border-purple-500/40"
                      : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-purple-500"
                  }
                  disabled:opacity-50
                `}
              />
            </div>
          </div>

       
          <div className="mb-3 grid grid-cols-2 gap-3">
           
            <div>
              <label
                className={`
                  mb-1.5
                  block
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wider
                  ${dark ? "text-white/40" : "text-gray-500"}
                `}
              >
                City
              </label>
              <div className="relative">
                <FiMapPin
                  size={14}
                  className={`
                    absolute
                    left-3.5
                    top-1/2
                    -translate-y-1/2
                    ${dark ? "text-white/30" : "text-gray-400"}
                  `}
                />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={loading || cooldown}
                  placeholder="e.g. Lahore"
                  className={`
                    h-10
                    w-full
                    rounded-xl
                    border
                    pl-9
                    pr-3
                    text-xs
                    outline-none
                    transition
                    ${
                      dark
                        ? "border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/25 focus:border-purple-500/40"
                        : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-purple-500"
                    }
                    disabled:opacity-50
                  `}
                />
              </div>
            </div>

          
            <div className="relative">
              <label
                className={`
                  mb-1.5
                  block
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wider
                  ${dark ? "text-white/40" : "text-gray-500"}
                `}
              >
                Country
              </label>

              <button
                type="button"
                onClick={() =>
                  !loading && !cooldown && setShowCountryDropdown((p) => !p)
                }
                disabled={loading || cooldown}
                className={`
                  flex
                  h-10
                  w-full
                  items-center
                  justify-between
                  gap-2
                  rounded-xl
                  border
                  px-3
                  text-xs
                  transition
                  ${
                    dark
                      ? "border-white/[0.08] bg-white/[0.03] text-white hover:border-white/20"
                      : "border-gray-200 bg-white text-gray-900 hover:border-gray-300"
                  }
                  disabled:opacity-50
                `}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FiGlobe
                    size={14}
                    className={`shrink-0 ${
                      dark ? "text-white/30" : "text-gray-400"
                    }`}
                  />
                  <span className="truncate">{country || "Any country"}</span>
                </div>
                <FiChevronDown
                  size={14}
                  className={`
                    shrink-0
                    transition-transform
                    ${showCountryDropdown ? "rotate-180" : ""}
                    ${dark ? "text-white/40" : "text-gray-400"}
                  `}
                />
              </button>

              {showCountryDropdown && (
                <div
                  className={`
                    absolute
                    left-0
                    right-0
                    top-full
                    z-10
                    mt-2
                    max-h-56
                    overflow-y-auto
                    rounded-xl
                    border
                    ${
                      dark
                        ? "border-white/[0.1] bg-[#0a0a0a] shadow-black/60"
                        : "border-gray-200 bg-white shadow-gray-300/60"
                    }
                  `}
                  style={{
                    boxShadow: dark
                      ? "0 10px 40px rgba(0, 0, 0, 0.6)"
                      : "0 10px 40px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {COUNTRIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCountry(c === "Any" ? "" : c);
                        setShowCountryDropdown(false);
                      }}
                      className={`
                        flex
                        w-full
                        items-center
                        gap-2
                        px-3
                        py-2
                        text-left
                        text-xs
                        transition
                        ${
                          dark
                            ? "text-white/80 hover:bg-white/[0.06] hover:text-white"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }
                        ${
                          country === c || (c === "Any" && !country)
                            ? dark
                              ? "bg-purple-500/10 text-purple-300"
                              : "bg-purple-50 text-purple-700"
                            : ""
                        }
                      `}
                    >
                      <FiGlobe
                        size={12}
                        className={
                          country === c
                            ? dark
                              ? "text-purple-400"
                              : "text-purple-600"
                            : dark
                              ? "text-white/30"
                              : "text-gray-400"
                        }
                      />
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

         
          <button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim() || cooldown}
            className={`
              flex
              h-11
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              text-sm
              font-semibold
              transition
              disabled:cursor-not-allowed
              disabled:opacity-50
              ${
                dark
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }
            `}
          >
            {loading ? (
              <>
                <FiLoader size={15} className="animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <FiSearch size={15} />
                Search Jobs
              </>
            )}
          </button>

         
          {!searched && !cooldown && (
            <div className="mt-3">
              <p
                className={`
                  mb-2
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-wider
                  ${dark ? "text-white/30" : "text-gray-400"}
                `}
              >
                Quick searches
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_SEARCHES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSearch(s)}
                    disabled={loading}
                    className={`
                      rounded-full
                      border
                      px-2.5
                      py-1
                      text-[10px]
                      font-medium
                      transition
                      disabled:opacity-50
                      ${
                        dark
                          ? "border-white/[0.08] bg-white/[0.03] text-white/60 hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-purple-300"
                          : "border-gray-200 bg-white text-gray-600 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
                      }
                    `}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

       
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {statusLoading ? (
            <div className="flex h-full items-center justify-center">
              <FiLoader
                size={22}
                className={`animate-spin ${
                  dark ? "text-purple-400" : "text-purple-600"
                }`}
              />
            </div>
          ) : loading ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <FiLoader
                size={32}
                className={`animate-spin ${
                  dark ? "text-purple-400" : "text-purple-600"
                }`}
              />
              <p
                className={`mt-4 text-sm ${
                  dark ? "text-white/60" : "text-gray-600"
                }`}
              >
                Searching fresh jobs...
              </p>
              <p
                className={`mt-1 text-[11px] ${
                  dark ? "text-white/30" : "text-gray-400"
                }`}
              >
                Looking for jobs from the last 3 days. This may take 15-30
                seconds
              </p>
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-3">
              <div className="mb-2 flex items-center justify-between">
                <p
                  className={`text-[11px] font-medium ${
                    dark ? "text-white/50" : "text-gray-500"
                  }`}
                >
                  {jobs.length} job{jobs.length > 1 ? "s" : ""} found
                  {city || country
                    ? ` in ${[city, country].filter(Boolean).join(", ")}`
                    : ""}
                </p>
              </div>

              {jobs.map((job, idx) => (
                <JobCard key={idx} job={job} />
              ))}
            </div>
          ) : searched ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div
                className={`
                  mb-3
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  ${
                    dark
                      ? "bg-white/[0.03] text-white/30"
                      : "bg-gray-100 text-gray-400"
                  }
                `}
              >
                <FiAlertCircle size={22} />
              </div>
              <p
                className={`text-sm font-medium ${
                  dark ? "text-white/70" : "text-gray-700"
                }`}
              >
                No fresh jobs found
              </p>
              <p
                className={`mt-1 max-w-xs text-[11px] ${
                  dark ? "text-white/40" : "text-gray-500"
                }`}
              >
                Try different keywords, a broader role, or remove location
                filters
              </p>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div
                className={`
                  mb-3
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  ${
                    dark
                      ? "bg-purple-500/10 text-purple-400"
                      : "bg-purple-50 text-purple-600"
                  }
                `}
              >
                <FiBriefcase size={22} />
              </div>
              <p
                className={`text-sm font-medium ${
                  dark ? "text-white/70" : "text-gray-700"
                }`}
              >
                Start your job search
              </p>
              <p
                className={`mt-1 max-w-xs text-[11px] ${
                  dark ? "text-white/40" : "text-gray-500"
                }`}
              >
                Enter a job role and optional location to find fresh
                opportunities from the last 3 days
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
