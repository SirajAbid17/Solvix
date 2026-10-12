
import React from "react";
import {
  FaCheckCircle,
  FaChartLine,
  FaCode,
  FaRocket,
  FaSearch,
  FaLightbulb,
  FaBriefcase,
  FaGraduationCap,
  FaExclamationTriangle,
  FaTimesCircle,
  FaAward,
} from "react-icons/fa";


function RoadmapItem({ item, dark }) {
  const isCompleted = item?.completed || false;
  const number = item?.number || "01";
  const title = item?.title || "Step";
  const text = item?.text || "";

  return (
    <div className="flex gap-4">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
        isCompleted ? "bg-black text-white dark:bg-white dark:text-black" : 
        dark ? "bg-white/10 text-gray-400" : "bg-gray-200 text-gray-500"
      }`}>
        {isCompleted ? <FaCheckCircle /> : number}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold">{title}</h3>
          {isCompleted && (
            <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-500">
              Completed
            </span>
          )}
        </div>
        {text && <p className="mt-1 text-xs leading-5 text-gray-500">{text}</p>}
      </div>
    </div>
  );
}


function LearningItem({ item, dark }) {
  const title = typeof item === 'string' ? item : item?.title || 'Course';
  const description = typeof item === 'object' ? item?.description : '';

  return (
    <div className={`rounded-xl border p-4 ${
      dark ? "border-white/10 bg-white/5" : "border-gray-200 bg-white"
    }`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          dark ? "bg-white/10" : "bg-gray-100"
        }`}>
          <FaGraduationCap className="text-xs" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {description && (
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResumeAnalysisOverview({ analysis, dark }) {
  return (
    <>
      {}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {}
        <div className={`rounded-2xl border p-5 ${
          dark ? "border-white/10 bg-white/[0.03]" : "border-gray-200 bg-gray-50"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Resume Score</p>
              <h2 className="mt-2 text-3xl font-bold">
                {analysis.score}<span className="text-base text-gray-400">/100</span>
              </h2>
            </div>
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-8 border-gray-200 dark:border-white/10">
              <div className="absolute inset-[-8px] rounded-full border-8 border-transparent border-t-black border-r-black dark:border-t-white dark:border-r-white" />
              <span className="text-sm font-bold">{analysis.score}%</span>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
            <div className="h-full rounded-full bg-black dark:bg-white" style={{ width: `${analysis.score}%` }} />
          </div>
        </div>

        {}
        <div className={`rounded-2xl border p-5 ${
          dark ? "border-white/10 bg-white/[0.03]" : "border-gray-200 bg-gray-50"
        }`}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <FaSearch />
            </div>
            <div>
              <p className="text-xs text-gray-500">ATS Score</p>
              <h2 className="text-2xl font-bold">
                {analysis.atsScore}<span className="text-base text-gray-400">/100</span>
              </h2>
            </div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
            <div className="h-full rounded-full bg-blue-500" style={{ width: `${analysis.atsScore}%` }} />
          </div>
          <p className="mt-2 text-xs text-gray-500">Applicant Tracking System compatibility</p>
        </div>

     {}
<div
  className={`rounded-2xl border p-5 ${
    dark
      ? "border-white/10 bg-white/[0.03]"
      : "border-gray-200 bg-gray-50"
  }`}
>
  <div className="flex items-center gap-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
      <FaCheckCircle />
    </div>

    <div>
     

      <h2 className="text-md text-gray-500">
        Thanks for choosing Solvix
      </h2>
    </div>
  </div>

  <p
    className={`mt-3 text-sm leading-6 ${
      dark ? "text-gray-400" : "text-gray-600"
    }`}
  >
    Your resume has been successfully analyzed. We appreciate your trust in
    Solvix. 
  </p>
</div>

        {}
        <div className={`rounded-2xl border p-5 ${
          dark ? "border-white/10 bg-white/[0.03]" : "border-gray-200 bg-gray-50"
        }`}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-500">
              <FaLightbulb />
            </div>
            <div>
              <p className="text-xs text-gray-500">AI Summary</p>
            </div>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-3">
            {analysis.summary}
          </p>
        </div>
      </div>

      {}
      {Object.keys(analysis.sectionScores).length > 0 && (
        <div className={`mt-6 rounded-2xl border p-5 ${
          dark ? "border-white/10 bg-white/[0.03]" : "border-gray-200 bg-gray-50"
        }`}>
          <h3 className="text-sm font-semibold mb-4">Section-wise Scores</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {Object.entries(analysis.sectionScores).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-xs capitalize text-gray-500">{key}</p>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
                    <div 
                      className="h-full rounded-full bg-black dark:bg-white" 
                      style={{ width: `${Math.min(value, 100)}%` }} 
                    />
                  </div>
                  <p className="mt-1 text-xs font-semibold">{value}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {}
      {analysis.missingKeywords.length > 0 && (
        <div className={`mt-6 rounded-2xl border p-5 ${
          dark ? "border-white/10 bg-white/[0.03]" : "border-gray-200 bg-gray-50"
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
              <FaTimesCircle />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Missing Keywords</h3>
              <p className="text-xs text-gray-500">Keywords detected in job descriptions but missing from your resume</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.missingKeywords.map((keyword, i) => (
              <span
  key={i}
  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-black transition hover:bg-gray-100"
>
  {keyword}
</span>
            ))}
          </div>
        </div>
      )}

      {}
      {analysis.recommendedRoles.length > 0 && (
        <div className={`mt-6 rounded-2xl border p-5 ${
          dark ? "border-white/10 bg-white/[0.03]" : "border-gray-200 bg-gray-50"
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
              <FaBriefcase />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Recommended Roles</h3>
              <p className="text-xs text-gray-500">Career roles that match your profile</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.recommendedRoles.map((role, i) => (
            <span
  key={i}
  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-black transition hover:bg-gray-100"
>
  {role}
</span>
            ))}
          </div>
        </div>
      )}

      {}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {}
        <div className="space-y-6">
          {}
          <div className={`rounded-2xl border ${
            dark ? "border-white/10 bg-white/[0.03]" : "border-gray-200 bg-gray-50"
          }`}>
            <div className="border-b border-gray-200 p-5 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 text-white">
                  <FaCheckCircle />
                </div>
                <div>
                  <h2 className="font-bold">Your Strengths</h2>
                  <p className="mt-1 text-xs text-gray-500">What makes your profile strong</p>
                </div>
              </div>
            </div>
            <div className="space-y-3 p-5">
              {analysis.strengths.length > 0 ? (
                analysis.strengths.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <FaCheckCircle className="mt-0.5 shrink-0 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-300">{item}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">No strengths identified yet</p>
              )}
            </div>
          </div>

          {}
          <div className={`rounded-2xl border ${
            dark ? "border-white/10 bg-white/[0.03]" : "border-gray-200 bg-gray-50"
          }`}>
            <div className="border-b border-gray-200 p-5 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500 text-white">
                  <FaExclamationTriangle />
                </div>
                <div>
                  <h2 className="font-bold">Areas to Improve</h2>
                  <p className="mt-1 text-xs text-gray-500">Focus areas from AI analysis</p>
                </div>
              </div>
            </div>
            <div className="space-y-3 p-5">
              {analysis.weaknesses.length > 0 ? (
                analysis.weaknesses.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <FaLightbulb className="mt-0.5 shrink-0 text-yellow-500" />
                    <span className="text-gray-600 dark:text-gray-300">{item}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">No areas identified yet</p>
              )}
            </div>
          </div>
        </div>

        {}
        <div className="space-y-6">
          {}
          <div className={`rounded-2xl border ${
            dark ? "border-white/10 bg-white/[0.03]" : "border-gray-200 bg-gray-50"
          }`}>
            <div className="border-b border-gray-200 p-5 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-black">
                  <FaRocket />
                </div>
                <div>
                  <h2 className="font-bold">Your Career Roadmap</h2>
                  <p className="mt-1 text-xs text-gray-500">Personalized steps based on your resume</p>
                </div>
              </div>
            </div>
            <div className="space-y-5 p-5">
              {analysis.roadmap.length > 0 ? (
                analysis.roadmap.map((item, i) => (
                  <RoadmapItem key={i} item={item} dark={dark} />
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">No roadmap items available</p>
              )}
            </div>
          </div>

          {}
          <div className={`rounded-2xl border p-5 ${
            dark ? "border-white/10 bg-white/[0.03]" : "border-gray-200 bg-gray-50"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-black">
                  <FaCode />
                </div>
                <div>
                  <h2 className="font-bold">Skills to Improve</h2>
                  <p className="mt-1 text-xs text-gray-500">Recommended skills for your career growth</p>
                </div>
              </div>
              <FaChartLine className="text-gray-400" />
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {analysis.skillsToImprove.length > 0 ? (
                analysis.skillsToImprove.map((skill, i) => (
                  <div key={i} className={`rounded-xl border px-3 py-3 text-xs font-medium transition hover:-translate-y-1 ${
                    dark ? "border-white/10 bg-white/5 hover:bg-white/10" : "border-gray-200 bg-white hover:bg-gray-100"
                  }`}>
                    {skill}
                  </div>
                ))
              ) : (
                <p className="col-span-2 text-xs text-gray-400 text-center">No skills identified</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {}
      {analysis.nextLearning.length > 0 && (
        <div className={`mt-6 rounded-2xl border ${
          dark ? "border-white/10 bg-white/[0.03]" : "border-gray-200 bg-gray-50"
        }`}>
          <div className="border-b border-gray-200 p-5 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-black">
                <FaGraduationCap />
              </div>
              <div>
                <h2 className="font-bold">What To Learn Next</h2>
                <p className="mt-1 text-xs text-gray-500">Advanced skills recommended for you</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-3">
            {analysis.nextLearning.map((item, i) => (
              <LearningItem key={i} item={item} dark={dark} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}