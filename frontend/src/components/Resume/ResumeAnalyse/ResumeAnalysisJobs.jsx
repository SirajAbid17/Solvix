// ResumeAnalysisJobs.jsx
import React, { useState } from "react";
import {
  FaSearch,
  FaBriefcase,
  FaExternalLinkAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

// Job Card Component
function JobCard({ job, dark }) {
  const handleApply = () => {
    if (job.url) {
      window.open(job.url, '_blank');
    }
  };

  return (
    <div className={`rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 ${
      dark ? "bg-black/10 hover:bg-black/20" : "bg-white/10 hover:bg-white/20"
    }`}>
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${
        dark ? "bg-black text-white" : "bg-white text-black"
      }`}>
        <FaBriefcase className="text-xs" />
      </div>
      <h3 className="text-sm font-bold leading-5 line-clamp-2">{job.title || "Position"}</h3>
      
      {job.company && (
        <p className="mt-1 text-xs text-gray-400 line-clamp-1">{job.company}</p>
      )}
      
      {job.description && (
        <p className="mt-2 line-clamp-3 text-xs text-gray-400">
          {job.description}
        </p>
      )}
      
      <div className="mt-3 flex items-center justify-between">
        {job.url && (
          <button
            onClick={handleApply}
            className={`flex items-center gap-1 text-xs font-medium transition hover:scale-105 ${
              dark ? "text-black hover:text-white" : "text-black/80 hover:text-black"
            }`}
          >
            Apply <FaExternalLinkAlt className="text-[8px]" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function ResumeAnalysisJobs({ jobs, dark, initialShowCount = 4 }) {
  const [showAllJobs, setShowAllJobs] = useState(false);
  const displayedJobs = showAllJobs ? jobs : jobs.slice(0, initialShowCount);

  if (jobs.length === 0) return null;

  return (
    <div className={`mt-6 rounded-2xl p-6 ${dark ? "bg-white text-black" : "bg-black text-white"}`}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
            dark ? "bg-black/10" : "bg-white/10"
          }`}>
            <FaSearch />
          </div>
          <div>
            <h2 className="font-bold">Jobs Matching Your Profile</h2>
            <p className="mt-1 text-xs opacity-60">{jobs.length} opportunities match your skills</p>
          </div>
        </div>
        {jobs.length > initialShowCount && (
          <button 
            onClick={() => setShowAllJobs(!showAllJobs)}
            className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition hover:-translate-y-1 ${
              dark ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            {showAllJobs ? (
              <>Show Less <FaChevronUp className="text-xs" /></>
            ) : (
              <>View All Jobs <FaChevronDown className="text-xs" /></>
            )}
          </button>
        )}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayedJobs.map((job, i) => (
          <JobCard key={i} job={job} dark={dark} />
        ))}
      </div>
    </div>
  );
}