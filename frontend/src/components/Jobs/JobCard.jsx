import React, { useState } from "react";
import {
  FiMapPin,
  FiDollarSign,
  FiClock,
  FiBriefcase,
  FiExternalLink,
  FiCopy,
  FiCheck,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { useTheme } from "../../BgContext/ThemeContext";
import toast from "react-hot-toast";

export default function JobCard({ job }) {
  const { dark } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(job.url);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const description = String(job.description || "");
  const previewLength = 180;
  const needsExpand = description.length > previewLength;
  const displayDescription =
    expanded || !needsExpand
      ? description
      : description.slice(0, previewLength) + "...";

  
  const initials = String(job.company || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`
        group
        rounded-xl
        border
        p-4
        transition-all
        duration-200
        ${
          dark
            ? "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04]"
            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
        }
      `}
    >
    
      <div className="mb-3 flex items-start gap-3">
       
        <div
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-lg
            text-xs
            font-bold
            ${
              dark
                ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-300"
                : "bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700"
            }
          `}
        >
          {initials}
        </div>

      
        <div className="min-w-0 flex-1">
          <h3
            className={`
              mb-1
              line-clamp-2
              text-sm
              font-semibold
              leading-snug
              ${dark ? "text-white" : "text-gray-900"}
            `}
          >
            {job.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <FiBriefcase
                size={10}
                className={dark ? "text-purple-400" : "text-purple-600"}
              />
              <span
                className={`text-[11px] font-medium ${
                  dark ? "text-purple-300" : "text-purple-700"
                }`}
              >
                {job.company}
              </span>
            </div>

            {job.jobType && job.jobType !== "Not specified" && (
              <span
                className={`
                  rounded-md
                  px-1.5
                  py-0.5
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-wide
                  ${
                    dark
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-emerald-50 text-emerald-700"
                  }
                `}
              >
                {job.jobType}
              </span>
            )}
          </div>
        </div>

     
        <button
          onClick={handleCopy}
          type="button"
          className={`
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-lg
            transition
            ${
              dark
                ? "text-gray-500 hover:bg-white/10 hover:text-white"
                : "text-gray-400 hover:bg-gray-100 hover:text-gray-800"
            }
          `}
          title="Copy link"
        >
          {copied ? (
            <FiCheck size={12} className="text-green-500" />
          ) : (
            <FiCopy size={12} />
          )}
        </button>
      </div>

     
      <div className="mb-3 flex flex-wrap gap-3 text-[11px]">
        <div className="flex items-center gap-1.5">
          <FiMapPin
            size={11}
            className={dark ? "text-gray-500" : "text-gray-400"}
          />
          <span className={dark ? "text-gray-400" : "text-gray-600"}>
            {job.location || "Not specified"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <FiDollarSign
            size={11}
            className={dark ? "text-gray-500" : "text-gray-400"}
          />
          <span className={dark ? "text-gray-400" : "text-gray-600"}>
            {job.salary || "Not specified"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <FiClock
            size={11}
            className={dark ? "text-emerald-500" : "text-emerald-600"}
          />
          <span
            className={`font-medium ${
              dark ? "text-emerald-400" : "text-emerald-700"
            }`}
          >
            {job.postedAt || "Recently"}
          </span>
        </div>
      </div>

     
      <div
        className={`
          mb-3
          rounded-lg
          p-3
          text-[11px]
          leading-relaxed
          ${dark ? "bg-white/[0.02] text-gray-400" : "bg-gray-50 text-gray-600"}
        `}
      >
        <p className="whitespace-pre-wrap break-words">{displayDescription}</p>

        {needsExpand && (
          <button
            onClick={() => setExpanded(!expanded)}
            type="button"
            className={`
              mt-2
              flex
              items-center
              gap-1
              text-[10px]
              font-medium
              transition
              ${
                dark
                  ? "text-purple-400 hover:text-purple-300"
                  : "text-purple-600 hover:text-purple-700"
              }
            `}
          >
            {expanded ? (
              <>
                <FiChevronUp size={11} />
                Show less
              </>
            ) : (
              <>
                <FiChevronDown size={11} />
                Show more
              </>
            )}
          </button>
        )}
      </div>

      
      <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-lg
          py-2.5
          text-xs
          font-semibold
          transition-all
          ${
            dark
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }
        `}
      >
        Apply Now
        <FiExternalLink size={12} />
      </a>
    </div>
  );
}
