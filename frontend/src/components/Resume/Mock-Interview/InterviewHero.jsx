import React, { useEffect, useState } from "react";
import {
  FaUserTie,
  FaRobot,
  FaBrain,
  FaBolt,
  FaFilePdf,
  FaCalendarAlt,
  FaQuestionCircle,
  FaArrowRight,
  FaTrash,
  FaBriefcase,
  FaCode,
  FaComments,
  FaPlus,
  FaSpinner,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaLayerGroup,
} from "react-icons/fa";
import { useTheme } from "../../../BgContext/ThemeContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  deleteInterview,
  getMyInterviews,
} from "../../../Features/mockInterview";

export default function InterviewHero() {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);
  const [showCount, setShowCount] = useState(2);
  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getMyInterviews();

      console.log("📥 Fetched interviews:", response);

      if (response.success) {
        setInterviews(response.data || []);
      } else {
        setError(response.message || "Failed to load interviews");
      }
    } catch (err) {
      console.error("Fetch interviews error:", err);
      setError(err.message || "Failed to load interviews");
      toast.error("Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this interview?")) {
      return;
    }

    try {
      setDeleting(id);

      const response = await deleteInterview(id);

      if (response.success) {
        toast.success("Interview deleted successfully");

        setInterviews((prev) => prev.filter((item) => item._id !== id));

        if (interviews.length - 1 < showCount) {
          setShowCount(Math.max(2, interviews.length - 1));
        }
      } else {
        toast.error(response.message || "Failed to delete interview");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "Failed to delete interview");
    } finally {
      setDeleting(null);
    }
  };

  const handleViewInterview = (id) => {
    navigate(`/interview-practice/${id}`);
  };

  const handleContinueInterview = (id) => {
    navigate(`/interview-practice/${id}`);
  };

  const handleGenerateInterview = () => {
    navigate("/mock-interview");
  };

  const handleShowMore = () => {
    setShowCount((prev) => prev + 4);
  };

  const handleShowLess = () => {
    setShowCount(2);

    const element = document.getElementById("interviews-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;

      if (diff < 60 * 60 * 1000) return "Today";
      if (diff < 24 * 60 * 60 * 1000) return "Yesterday";
      if (diff < 7 * 24 * 60 * 60 * 1000) {
        return date.toLocaleDateString("en-US", { weekday: "long" });
      }

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  };


  const getPdfName = (interview) => {
    if (interview?.pdf?.originalName) {
      return interview.pdf.originalName;
    }
    return "Resume.pdf";
  };

  const getBatchCount = (interview) => {
    const total = interview?.totalQuestions || 0;
    return Math.max(1, Math.ceil(total / 15));
  };


  const displayedInterviews = interviews.slice(0, showCount);
  const hasMore = interviews.length > showCount;


  const pageBackground = dark
    ? "bg-[#080808] text-white"
    : "bg-[#f7f7f7] text-black";

  const cardBackground = dark
    ? "border-white/[0.08] bg-[#101010]"
    : "border-black/[0.08] bg-white";

  const mutedText = dark ? "text-white/50" : "text-black/50";


  return (
    <div
      className={`min-h-screen px-4 py-8 transition-colors duration-300 sm:px-6 lg:px-8 ${pageBackground}`}
    >
      <div className="mx-auto max-w-7xl">
        {}

        <section
          className={`relative overflow-hidden rounded-[28px] border px-6 py-12 shadow-sm sm:px-10 lg:px-14 lg:py-16 ${cardBackground}`}
        >
          <div
            className={`pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full blur-3xl ${
              dark ? "bg-white/[0.025]" : "bg-black/[0.025]"
            }`}
          />

          <div
            className={`pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full blur-3xl ${
              dark ? "bg-white/[0.02]" : "bg-black/[0.02]"
            }`}
          />

          <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
            {}
            <div
              className={`mb-7 flex h-20 w-20 items-center justify-center rounded-[24px] border shadow-xl ${
                dark
                  ? "border-white/10 bg-white text-black"
                  : "border-black/10 bg-black text-white"
              }`}
            >
              <FaUserTie size={32} />
            </div>

            {}
            <div
              className={`mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider ${
                dark
                  ? "border-white/10 bg-white/[0.04] text-white/70"
                  : "border-black/10 bg-black/[0.035] text-black/70"
              }`}
            >
              <FaRobot />
              <span>AI Mock Interview Generator</span>
            </div>

            {}
            <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Prepare Smarter.
              <br />
              <span className={dark ? "text-white/40" : "text-black/40"}>
                Interview Better.
              </span>
            </h1>

            {}
            <p
              className={`mt-6 max-w-3xl text-sm leading-7 sm:text-base sm:leading-8 ${mutedText}`}
            >
              Upload your resume and AI will analyze your experience,
              projects, skills, education, and technologies to generate a
              personalized mock interview with technical, behavioral, and HR
              questions tailored specifically to your profile.
            </p>

            {}
            <div className="mt-8 flex flex-wrap justify-center gap-2.5">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                  dark
                    ? "border-white/10 bg-white/[0.035] text-white/65 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                    : "border-black/10 bg-black/[0.025] text-black/60 hover:border-black/20 hover:bg-black/[0.06] hover:text-black"
                }`}
              >
                <FaRobot className="text-sm" />
                AI Questions
              </span>

              <span
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                  dark
                    ? "border-white/10 bg-white/[0.035] text-white/65 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                    : "border-black/10 bg-black/[0.025] text-black/60 hover:border-black/20 hover:bg-black/[0.06] hover:text-black"
                }`}
              >
                <FaCode className="text-sm" />
                Technical
              </span>

              <span
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                  dark
                    ? "border-white/10 bg-white/[0.035] text-white/65 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                    : "border-black/10 bg-black/[0.025] text-black/60 hover:border-black/20 hover:bg-black/[0.06] hover:text-black"
                }`}
              >
                <FaComments className="text-sm" />
                Behavioral
              </span>

              <span
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                  dark
                    ? "border-white/10 bg-white/[0.035] text-white/65 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                    : "border-black/10 bg-black/[0.025] text-black/60 hover:border-black/20 hover:bg-black/[0.06] hover:text-black"
                }`}
              >
                <FaBriefcase className="text-sm" />
                HR Round
              </span>

              <span
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                  dark
                    ? "border-white/10 bg-white/[0.035] text-white/65 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                    : "border-black/10 bg-black/[0.025] text-black/60 hover:border-black/20 hover:bg-black/[0.06] hover:text-black"
                }`}
              >
                <FaBrain className="text-sm" />
                Personalized
              </span>
            </div>
          </div>
        </section>

        {}

        <section id="interviews-section" className="mt-14">
          {}
          <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                    dark
                      ? "border-white/10 bg-white/[0.05]"
                      : "border-black/10 bg-black/[0.035]"
                  }`}
                >
                  <FaBrain className="text-sm" />
                </div>

                <span
                  className={`text-[11px] font-black uppercase tracking-[0.18em] ${mutedText}`}
                >
                  Interview History
                </span>
              </div>

              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                Your Generated Interviews
              </h2>

              <p className={`mt-2 max-w-xl text-sm leading-6 ${mutedText}`}>
                Your AI-generated interviews from uploaded resume PDFs are
                saved here for future practice.
              </p>

              {interviews.length > 0 && !loading && (
                <div
                  className={`mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
                    dark
                      ? "border-white/10 bg-white/[0.03] text-white/45"
                      : "border-black/10 bg-black/[0.025] text-black/45"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  Showing {Math.min(showCount, interviews.length)} of{" "}
                  {interviews.length} interviews
                </div>
              )}
            </div>
          </div>

          {}
          {loading && (
            <div
              className={`flex flex-col items-center justify-center rounded-3xl border py-24 ${cardBackground}`}
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${
                  dark
                    ? "border-white/10 bg-white/[0.04]"
                    : "border-black/10 bg-black/[0.035]"
                }`}
              >
                <FaSpinner className="animate-spin text-xl" />
              </div>

              <p className={`mt-5 text-sm font-medium ${mutedText}`}>
                Loading your interviews...
              </p>
            </div>
          )}

          {}
          {error && !loading && (
            <div className={`rounded-3xl border p-10 text-center ${cardBackground}`}>
              <div
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border ${
                  dark
                    ? "border-white/10 bg-white/[0.04]"
                    : "border-black/10 bg-black/[0.035]"
                }`}
              >
                <FaRobot />
              </div>

              <p className="mt-4 text-sm font-semibold">{error}</p>

              <button
                onClick={fetchInterviews}
                className={`mt-5 rounded-xl px-5 py-2.5 text-sm font-bold transition ${
                  dark
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-black text-white hover:bg-black/85"
                }`}
              >
                Retry
              </button>
            </div>
          )}

          {}
          {!loading && !error && interviews.length > 0 ? (
            <>
              <div className="grid gap-5 lg:grid-cols-2">
                {displayedInterviews.map((interview, index) => {
                  const batchCount = getBatchCount(interview);

                  return (
                    <article
                      key={interview._id || interview.id || index}
                      className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                        dark
                          ? "border-white/[0.08] bg-[#101010] hover:border-white/[0.16]"
                          : "border-black/[0.08] bg-white hover:border-black/[0.15]"
                      }`}
                    >
                      {}
                      <div
                        className={`absolute left-0 right-0 top-0 h-px ${
                          dark ? "bg-white/20" : "bg-black/20"
                        }`}
                      />

                      {}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-4">
                          {}
                          <div
                            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${
                              dark
                                ? "border-white/10 bg-white/[0.04] text-white"
                                : "border-black/10 bg-black/[0.035] text-black"
                            }`}
                          >
                            <FaFilePdf size={23} />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate font-bold">
                                {interview.title || "Mock Interview"}
                              </h3>

                              {}
                              <span
                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-black uppercase tracking-wider ${
                                  dark
                                    ? "border-white/10 bg-white/[0.05] text-white/60"
                                    : "border-black/10 bg-black/[0.035] text-black/60"
                                }`}
                              >
                                <FaCheckCircle />
                                {interview.status || "Ready"}
                              </span>
                            </div>

                            <p className={`mt-1 text-xs ${mutedText}`}>
                              Generated from resume
                            </p>
                          </div>
                        </div>

                        {}
                        <button
                          onClick={() => handleDelete(interview._id)}
                          disabled={deleting === interview._id}
                          title="Delete interview"
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                            deleting === interview._id
                              ? "cursor-not-allowed opacity-40"
                              : dark
                              ? "text-white/35 hover:bg-white/[0.07] hover:text-white"
                              : "text-black/30 hover:bg-black/[0.05] hover:text-black"
                          }`}
                        >
                          {deleting === interview._id ? (
                            <FaSpinner className="animate-spin" size={13} />
                          ) : (
                            <FaTrash size={13} />
                          )}
                        </button>
                      </div>

                      {}
                      <div
                        className={`mt-5 flex items-center gap-3 rounded-xl border p-3.5 ${
                          dark
                            ? "border-white/[0.08] bg-white/[0.025]"
                            : "border-black/[0.07] bg-black/[0.02]"
                        }`}
                      >
                        <FaFilePdf className="shrink-0" />

                        <span
                          className={`truncate text-xs font-semibold ${
                            dark ? "text-white/65" : "text-black/60"
                          }`}
                        >
                          {getPdfName(interview)}
                        </span>

                        <span
                          className={`ml-auto shrink-0 rounded-md border px-2 py-1 text-[9px] font-black tracking-wider ${
                            dark
                              ? "border-white/10 text-white/45"
                              : "border-black/10 text-black/45"
                          }`}
                        >
                          PDF
                        </span>
                      </div>

                      {}
                      <div
                        className={`mt-4 flex items-center gap-3 rounded-xl border p-3.5 ${
                          dark
                            ? "border-purple-500/20 bg-purple-500/[0.04]"
                            : "border-purple-200 bg-purple-50/60"
                        }`}
                      >
                        <FaLayerGroup
                          className={`shrink-0 ${
                            dark ? "text-purple-400" : "text-purple-700"
                          }`}
                        />

                        <div className="flex flex-col">
                          <span
                            className={`text-xs font-bold ${
                              dark ? "text-purple-300" : "text-purple-700"
                            }`}
                          >
                            {batchCount}{" "}
                            {batchCount === 1 ? "Batch" : "Batches"} Generated
                          </span>

                          <span
                            className={`text-[10px] ${
                              dark ? "text-purple-300/60" : "text-purple-600/70"
                            }`}
                          >
                            {interview.totalQuestions || 0} questions total ·{" "}
                            {batchCount} × 15
                          </span>
                        </div>
                      </div>

                      {}
                      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                       


                      

                      
                      </div>

                      {}
                      <div
                        className={`mt-5 flex items-center gap-2 text-xs ${mutedText}`}
                      >
                        <FaCalendarAlt />
                        <span>
                          Generated {formatDate(interview.createdAt)}
                        </span>
                      </div>

                      {}
                      <div
                        className={`mt-5 flex gap-3 border-t pt-5 ${
                          dark ? "border-white/[0.08]" : "border-black/[0.07]"
                        }`}
                      >
                        <button
                          onClick={() => handleContinueInterview(interview._id)}
                          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-bold transition-all hover:-translate-y-0.5 ${
                            dark
                              ? "bg-white text-black hover:bg-white/90"
                              : "bg-black text-white hover:bg-black/85"
                          }`}
                        >
                          Continue Practice
                          <FaArrowRight className="text-xs" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              {}
              <div className="mt-9 flex justify-center">
                {hasMore ? (
                  <button
                    onClick={handleShowMore}
                    className={`group inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 ${
                      dark
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:border-emerald-400/50 hover:bg-emerald-500/15 hover:text-emerald-300"
                        : "border-emerald-600/20 bg-emerald-50 text-emerald-700 hover:border-emerald-600/40 hover:bg-emerald-100 hover:text-emerald-800"
                    }`}
                  >
                    <FaChevronDown className="transition-transform duration-200 group-hover:translate-y-0.5" />
                    <span>Show More</span>
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                        dark
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-emerald-600/10 text-emerald-700"
                      }`}
                    >
                      {Math.min(4, interviews.length - showCount)}
                    </span>
                  </button>
                ) : showCount > 2 ? (
                  <button
                    onClick={handleShowLess}
                    className={`inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 ${
                      dark
                        ? "border-white/10 bg-white/[0.03] text-white/65 hover:bg-white/[0.08] hover:text-white"
                        : "border-black/10 bg-white text-black/65 hover:bg-black/[0.04] hover:text-black"
                    }`}
                  >
                    <FaChevronUp />
                    Show Less
                  </button>
                ) : null}
              </div>

              {interviews.length > 2 && (
                <p className={`mt-4 text-center text-xs ${mutedText}`}>
                  Showing {Math.min(showCount, interviews.length)} of{" "}
                  {interviews.length} interviews
                </p>
              )}
            </>
          ) : !loading && !error && interviews.length === 0 ? (
            
            <div
              className={`rounded-3xl border border-dashed p-12 text-center ${cardBackground}`}
            >
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border ${
                  dark
                    ? "border-white/10 bg-white/[0.04] text-white/50"
                    : "border-black/10 bg-black/[0.035] text-black/40"
                }`}
              >
                <FaRobot size={25} />
              </div>

              <h3 className="mt-5 text-xl font-black">
                No Interviews Generated Yet
              </h3>

              <p className={`mx-auto mt-2 max-w-md text-sm leading-6 ${mutedText}`}>
                Upload your resume PDF and generate your first personalized AI
                mock interview.
              </p>

              <button
                onClick={handleGenerateInterview}
                className={`mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all hover:-translate-y-0.5 ${
                  dark
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-black text-white hover:bg-black/85"
                }`}
              >
                <FaPlus />
                Generate Interview
              </button>
            </div>
          ) : null}

          {}
          <div
            className={`mt-8 flex gap-4 rounded-2xl border p-5 ${
              dark
                ? "border-white/[0.08] bg-white/[0.025]"
                : "border-black/[0.08] bg-white"
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                dark
                  ? "border-white/10 bg-white/[0.04]"
                  : "border-black/10 bg-black/[0.035]"
              }`}
            >
              <FaBolt />
            </div>

            <div>
              <h4 className="font-bold">
                Your interviews are saved automatically
              </h4>

              <p className={`mt-1 text-sm leading-6 ${mutedText}`}>
                Whenever you generate an interview from a resume PDF, it
                appears here so you can return to your previous interview
                practice anytime.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}