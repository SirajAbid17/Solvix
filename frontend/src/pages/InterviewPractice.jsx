import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaCode,
  FaHome,
  FaLightbulb,
  FaTrophy,
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaSpinner,
  FaFilePdf,
  FaRobot,
  FaBrain,
  FaComments,
  FaBriefcase,
} from "react-icons/fa";
import { SiJavascript, SiPython } from "react-icons/si";
import { useTheme } from "../BgContext/ThemeContext";
import { toast } from "react-hot-toast";
import CodeBlock from "../components/Resume/Mock-Interview/CodeBlock";
import { getInterviewById } from "../Features/mockInterview";

// ============================================================
// STYLES CONFIGURATION
// ============================================================

const styles = {
  container: (dark) => `
    min-h-screen
    transition-colors
    duration-300
    ${dark ? "bg-[#080808] text-white" : "bg-[#f7f7f7] text-[#111111]"}
  `,

  card: (dark) => `
    overflow-hidden
    rounded-2xl
    border
    shadow-sm
    transition-all
    duration-300
    ${
      dark
        ? "border-white/[0.08] bg-[#101010]"
        : "border-black/[0.08] bg-white"
    }
  `,

  muted: (dark) =>
    dark ? "text-white/50" : "text-black/50",

  secondaryText: (dark) =>
    dark ? "text-white/65" : "text-black/65",

  button: {
    primary: (dark) => `
      inline-flex
      items-center
      justify-center
      gap-2
      rounded-xl
      px-6
      py-3
      text-sm
      font-bold
      transition-all
      duration-200
      focus:outline-none
      ${
        dark
          ? "bg-white text-black hover:bg-white/90"
          : "bg-black text-white hover:bg-black/85"
      }
    `,

    secondary: (dark) => `
      inline-flex
      items-center
      justify-center
      gap-2
      rounded-xl
      border
      px-5
      py-3
      text-sm
      font-bold
      transition-all
      duration-200
      ${
        dark
          ? "border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08]"
          : "border-black/10 bg-white text-black hover:bg-black/[0.04]"
      }
    `,

    success: (dark) => `
      inline-flex
      items-center
      justify-center
      gap-2
      rounded-xl
      border
      px-5
      py-3
      text-sm
      font-bold
      transition-all
      duration-200
      ${
        dark
          ? "border-white/10 bg-white text-black hover:bg-white/90"
          : "border-black/10 bg-black text-white hover:bg-black/85"
      }
    `,
  },
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function InterviewPractice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { dark } = useTheme();

  // ============================================================
  // STATE MANAGEMENT
  // ============================================================

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState([]);
  const [language, setLanguage] = useState("javascript");

  // ============================================================
  // LOAD INTERVIEW DATA
  // ============================================================

  useEffect(() => {
    const loadInterview = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check navigation state first
        if (location.state?.interview) {
          setInterview(location.state.interview);
          setLoading(false);
          return;
        }

        // Otherwise fetch from API
        if (id) {
          const response = await getInterviewById(id);

          if (response.success) {
            setInterview(response.data);
          } else {
            setError("Interview not found");
          }
        } else {
          setError("No interview ID provided");
        }
      } catch (err) {
        console.error("Load interview error:", err);

        setError(
          err.message || "Failed to load interview"
        );

        toast.error("Failed to load interview");
      } finally {
        setLoading(false);
      }
    };

    loadInterview();
  }, [id, location.state]);

  // ============================================================
  // HELPER FUNCTIONS
  // ============================================================

  const getAllQuestions = () => {
    if (!interview) return [];

    const questions = [];

    const types = [
      {
        key: "dsaQuestions",
        label: "DSA",
      },
      {
        key: "technicalQuestions",
        label: "Technical",
      },
      {
        key: "projectQuestions",
        label: "Project",
      },
      {
        key: "behavioralQuestions",
        label: "Behavioral",
      },
      {
        key: "hrQuestions",
        label: "HR",
      },
    ];

    types.forEach(({ key, label }) => {
      if (interview[key]) {
        interview[key].forEach((q) => {
          questions.push({
            ...q,
            type: key
              .replace("Questions", "")
              .toLowerCase(),
            typeLabel: label,
          });
        });
      }
    });

    return questions;
  };

  const allQuestions = getAllQuestions();

  const currentQuestion =
    allQuestions[currentQuestionIndex];

  const progress = allQuestions.length
    ? Math.round(
        ((currentQuestionIndex + 1) /
          allQuestions.length) *
          100
      )
    : 0;

  const isCurrentCompleted = completed.includes(
    currentQuestionIndex
  );

  const isBatchComplete =
    currentQuestionIndex ===
      allQuestions.length - 1 &&
    isCurrentCompleted;

  // ============================================================
  // EVENT HANDLERS
  // ============================================================

  const markCompleted = () => {
    if (!completed.includes(currentQuestionIndex)) {
      setCompleted((prev) => [
        ...prev,
        currentQuestionIndex,
      ]);

      toast.success("Question marked as completed!");
    }
  };

  const nextQuestion = () => {
    markCompleted();

    if (
      currentQuestionIndex <
      allQuestions.length - 1
    ) {
      setCurrentQuestionIndex(
        (prev) => prev + 1
      );

      setShowAnswer(false);
      setLanguage("javascript");
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(
        (prev) => prev - 1
      );

      setShowAnswer(false);
      setLanguage("javascript");
    }
  };

  const jumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setShowAnswer(false);
    setLanguage("javascript");
  };

  const downloadPDF = () => {
    toast.success("PDF download coming soon!");
  };

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center ${
          dark ? "bg-[#080808]" : "bg-[#f7f7f7]"
        }`}
      >
        <div className="text-center">
          <div
            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border ${
              dark
                ? "border-white/10 bg-white/[0.04]"
                : "border-black/10 bg-white"
            }`}
          >
            <FaSpinner
              className={`animate-spin ${
                dark
                  ? "text-white"
                  : "text-black"
              }`}
            />
          </div>

          <p
            className={`mt-4 text-sm ${
              dark
                ? "text-white/50"
                : "text-black/50"
            }`}
          >
            Loading interview...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR STATE
  // ============================================================

  if (error || !interview) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center px-4 ${
          dark ? "bg-[#080808]" : "bg-[#f7f7f7]"
        }`}
      >
        <div
          className={`w-full max-w-md rounded-3xl border p-8 text-center ${
            dark
              ? "border-white/[0.08] bg-[#101010]"
              : "border-black/[0.08] bg-white"
          }`}
        >
          <div
            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border ${
              dark
                ? "border-red-500/20 bg-red-500/10 text-red-400"
                : "border-red-200 bg-red-50 text-red-600"
            }`}
          >
            <FaRobot />
          </div>

          <p className="mt-5 text-xl font-bold">
            {error || "Interview not found"}
          </p>

          <p
            className={`mt-2 text-sm ${
              dark
                ? "text-white/45"
                : "text-black/45"
            }`}
          >
            We couldn't load this interview.
          </p>

          <button
            onClick={() =>
              navigate("/mock-interview")
            }
            className={`mt-6 ${styles.button.primary(
              dark
            )}`}
          >
            <FaHome />
            Go to Interviews
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // NO QUESTIONS
  // ============================================================

  if (allQuestions.length === 0) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center px-4 ${
          dark ? "bg-[#080808]" : "bg-[#f7f7f7]"
        }`}
      >
        <div
          className={`w-full max-w-md rounded-3xl border p-8 text-center ${
            dark
              ? "border-white/[0.08] bg-[#101010]"
              : "border-black/[0.08] bg-white"
          }`}
        >
          <div
            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border ${
              dark
                ? "border-white/10 bg-white/[0.04]"
                : "border-black/10 bg-black/[0.03]"
            }`}
          >
            <FaCode />
          </div>

          <p className="mt-5 text-xl font-bold">
            No questions found
          </p>

          <p
            className={`mt-2 text-sm ${
              dark
                ? "text-white/45"
                : "text-black/45"
            }`}
          >
            There are no questions available in
            this interview.
          </p>

          <button
            onClick={() =>
              navigate("/mock-interview")
            }
            className={`mt-6 ${styles.button.primary(
              dark
            )}`}
          >
            <FaHome />
            Go to Interviews
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className={styles.container(dark)}>
      {/* ======================================================
          HEADER
      ======================================================= */}

      <header
        className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
          dark
            ? "border-white/[0.08] bg-[#080808]/90"
            : "border-black/[0.08] bg-white/90"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* BACK */}

          <button
            onClick={() =>
              navigate("/mock-interview")
            }
            className={`group ${styles.button.secondary(
              dark
            )}`}
          >
            <FaArrowLeft className="transition-transform group-hover:-translate-x-1" />

            <span className="hidden sm:inline">
              Back to Interviews
            </span>

            <span className="sm:hidden">
              Back
            </span>
          </button>

          {/* CENTER TITLE */}

          <div className="hidden items-center gap-3 sm:flex">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                dark
                  ? "border-white/10 bg-white text-black"
                  : "border-black/10 bg-black text-white"
              }`}
            >
              <FaCode />
            </div>

            <div>
              <p className="text-sm font-bold">
                {interview.title ||
                  "Interview Practice"}
              </p>

              <p
                className={`text-xs ${styles.muted(
                  dark
                )}`}
              >
                Mock Interview
              </p>
            </div>
          </div>

          {/* QUESTION COUNT */}

          <div
            className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
              dark
                ? "border-white/10 bg-white/[0.04] text-white/60"
                : "border-black/10 bg-black/[0.03] text-black/60"
            }`}
          >
            {allQuestions.length} Questions
          </div>
        </div>
      </header>

      {/* ======================================================
          MAIN
      ======================================================= */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ====================================================
            HERO
        ===================================================== */}

        <section
          className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 lg:p-10 ${
            dark
              ? "border-white/[0.08] bg-[#101010]"
              : "border-black/[0.08] bg-white"
          }`}
        >
          {/* Subtle accent */}

          <div
            className={`pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl ${
              dark
                ? "bg-indigo-500/[0.06]"
                : "bg-indigo-500/[0.04]"
            }`}
          />

          <div
            className={`pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full blur-3xl ${
              dark
                ? "bg-emerald-500/[0.035]"
                : "bg-emerald-500/[0.025]"
            }`}
          />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_340px] lg:items-center">
            {/* LEFT */}

            <div>
              <div
                className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold tracking-wider ${
                  dark
                    ? "border-white/10 bg-white/[0.04] text-white/60"
                    : "border-black/10 bg-black/[0.03] text-black/60"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                REAL INTERVIEW PRACTICE
              </div>

              <h1 className="max-w-3xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Master Coding Problems

                <span
                  className={`block ${
                    dark
                      ? "text-white/45"
                      : "text-black/45"
                  }`}
                >
                  Asked in Interviews
                </span>
              </h1>

              <p
                className={`mt-5 max-w-2xl text-sm leading-7 sm:text-base ${styles.muted(
                  dark
                )}`}
              >
                Practice real coding interview
                problems. Every challenge includes
                a function-based problem, test cases,
                JavaScript solution, and Python
                solution.
              </p>

              {/* FEATURE PILLS */}

              <div className="mt-6 flex flex-wrap gap-2.5">
                <div
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold ${
                    dark
                      ? "border-white/10 bg-white/[0.03] text-white/65"
                      : "border-black/10 bg-black/[0.025] text-black/60"
                  }`}
                >
                  <FaCode />
                  {allQuestions.length} Problems
                </div>

                <div
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold ${
                    dark
                      ? "border-white/10 bg-white/[0.03] text-white/65"
                      : "border-black/10 bg-black/[0.025] text-black/60"
                  }`}
                >
                  <SiJavascript />
                  JavaScript
                </div>

                <div
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold ${
                    dark
                      ? "border-white/10 bg-white/[0.03] text-white/65"
                      : "border-black/10 bg-black/[0.025] text-black/60"
                  }`}
                >
                  <SiPython />
                  Python
                </div>
              </div>
            </div>

            {/* PROGRESS CARD */}

            <div
              className={`rounded-2xl border p-5 shadow-sm ${
                dark
                  ? "border-white/[0.08] bg-[#0b0b0b]"
                  : "border-black/[0.08] bg-[#fafafa]"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <span
                  className={`text-sm ${styles.muted(
                    dark
                  )}`}
                >
                  Your Progress
                </span>

                <span
                  className={`text-sm font-black ${
                    dark
                      ? "text-emerald-400"
                      : "text-emerald-600"
                  }`}
                >
                  {progress}%
                </span>
              </div>

              {/* PROGRESS BAR */}

              <div
                className={`h-2.5 overflow-hidden rounded-full ${
                  dark
                    ? "bg-white/[0.08]"
                    : "bg-black/[0.07]"
                }`}
              >
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div className="mt-4 flex items-center justify-between text-xs">
                <span className={styles.muted(dark)}>
                  Question{" "}
                  {currentQuestionIndex + 1}
                </span>

                <span className={styles.muted(dark)}>
                  {allQuestions.length} Total
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div
                  className={`rounded-xl border p-3 ${
                    dark
                      ? "border-white/[0.08] bg-white/[0.02]"
                      : "border-black/[0.07] bg-white"
                  }`}
                >
                  <p
                    className={`text-xs ${styles.muted(
                      dark
                    )}`}
                  >
                    Completed
                  </p>

                  <p className="mt-1 text-xl font-black">
                    {completed.length}
                  </p>
                </div>

                <div
                  className={`rounded-xl border p-3 ${
                    dark
                      ? "border-white/[0.08] bg-white/[0.02]"
                      : "border-black/[0.07] bg-white"
                  }`}
                >
                  <p
                    className={`text-xs ${styles.muted(
                      dark
                    )}`}
                  >
                    Remaining
                  </p>

                  <p className="mt-1 text-xl font-black">
                    {Math.max(
                      allQuestions.length -
                        completed.length,
                      0
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            QUESTION NAVIGATOR
        ===================================================== */}

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-bold">
                Question Navigator
              </h2>

              <p
                className={`text-xs ${styles.muted(
                  dark
                )}`}
              >
                Jump directly to any question
              </p>
            </div>

            <span
              className={`text-xs font-semibold ${styles.muted(
                dark
              )}`}
            >
              {completed.length}/
              {allQuestions.length} completed
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {allQuestions.map((item, index) => {
              const isActive =
                index === currentQuestionIndex;

              const isDone =
                completed.includes(index);

              return (
                <button
                  key={index}
                  onClick={() =>
                    jumpToQuestion(index)
                  }
                  title={`Question ${index + 1}`}
                  className={`
                    relative flex h-10 w-10
                    items-center justify-center
                    rounded-xl border
                    text-xs font-bold
                    transition-all duration-200
                    ${
                      isActive
                        ? dark
                          ? "border-white bg-white text-black shadow-lg"
                          : "border-black bg-black text-white shadow-lg"
                        : isDone
                        ? dark
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border-emerald-600/20 bg-emerald-50 text-emerald-700"
                        : dark
                        ? "border-white/[0.08] bg-[#101010] text-white/45 hover:border-white/15 hover:bg-white/[0.05] hover:text-white"
                        : "border-black/[0.08] bg-white text-black/45 hover:border-black/15 hover:bg-black/[0.025] hover:text-black"
                    }
                  `}
                >
                  {isDone && !isActive ? (
                    <FaCheckCircle />
                  ) : (
                    index + 1
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* ====================================================
            QUESTION CARD
        ===================================================== */}

        <section className="mt-8">
          <div className={styles.card(dark)}>
            {/* QUESTION HEADER */}

            <div
              className={`border-b p-5 sm:p-7 ${
                dark
                  ? "border-white/[0.08]"
                  : "border-black/[0.07]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-5">
                <div className="flex min-w-0 items-center gap-3">
                  {/* NUMBER */}

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                      dark
                        ? "bg-white text-black"
                        : "bg-black text-white"
                    }`}
                  >
                    {currentQuestionIndex + 1}
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`text-xs font-bold uppercase tracking-widest ${styles.muted(
                        dark
                      )}`}
                    >
                      {currentQuestion?.typeLabel ||
                        "Coding"}{" "}
                      Challenge
                    </p>

                    <h2 className="mt-1 truncate text-lg font-black sm:text-xl">
                      {currentQuestion?.question ||
                        currentQuestion?.title ||
                        "Question"}
                    </h2>
                  </div>
                </div>

                {/* BADGES */}

                <div className="flex flex-wrap items-center gap-2">
                  {currentQuestion?.difficulty && (
                    <span
                      className={`
                        rounded-full border px-3 py-1.5
                        text-xs font-bold
                        ${
                          currentQuestion.difficulty ===
                          "Hard"
                            ? dark
                              ? "border-red-500/20 bg-red-500/10 text-red-400"
                              : "border-red-200 bg-red-50 text-red-600"
                            : currentQuestion.difficulty ===
                              "Medium"
                            ? dark
                              ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                              : "border-amber-200 bg-amber-50 text-amber-700"
                            : dark
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700"
                        }
                      `}
                    >
                      {currentQuestion.difficulty}
                    </span>
                  )}

                  {currentQuestion?.topic && (
                    <span
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                        dark
                          ? "border-white/10 text-white/50"
                          : "border-black/10 text-black/50"
                      }`}
                    >
                      {currentQuestion.topic}
                    </span>
                  )}

                  {currentQuestion?.timeComplexity && (
                    <span
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                        dark
                          ? "border-white/10 text-white/50"
                          : "border-black/10 text-black/50"
                      }`}
                    >
                      <FaClock />

                      {currentQuestion.timeComplexity}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* QUESTION BODY */}

            <div className="p-5 sm:p-7 lg:p-9">
              {/* PROBLEM */}

              <div className="max-w-4xl">
                <p
                  className={`text-xs font-black uppercase tracking-widest ${
                    dark
                      ? "text-white/40"
                      : "text-black/40"
                  }`}
                >
                  Problem Statement
                </p>

                <h3 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
                  {currentQuestion?.question ||
                    currentQuestion?.title ||
                    "Question"}
                </h3>

                {currentQuestion?.description && (
                  <p
                    className={`mt-4 text-sm leading-7 sm:text-base ${styles.muted(
                      dark
                    )}`}
                  >
                    {currentQuestion.description}
                  </p>
                )}

                {currentQuestion?.whatInterviewerTests && (
                  <div className="mt-5">
                    <p className="text-sm font-bold">
                      What Interviewer Tests
                    </p>

                    <p
                      className={`mt-1 text-sm leading-7 ${styles.muted(
                        dark
                      )}`}
                    >
                      {
                        currentQuestion.whatInterviewerTests
                      }
                    </p>
                  </div>
                )}

                {currentQuestion?.expectedAnswerPoints &&
                  currentQuestion.expectedAnswerPoints
                    .length > 0 && (
                    <div className="mt-5">
                      <p className="text-sm font-bold">
                        Expected Answer Points
                      </p>

                      <ul
                        className={`mt-2 list-disc pl-5 text-sm leading-7 ${styles.muted(
                          dark
                        )}`}
                      >
                        {currentQuestion.expectedAnswerPoints.map(
                          (point, i) => (
                            <li key={i}>
                              {point}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </div>

              {/* ==================================================
                  DSA CODE
              =================================================== */}

              {currentQuestion?.type === "dsa" && (
                <div className="mt-8">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    {/* LANGUAGE SWITCHER */}

                    <div
                      className={`inline-flex rounded-xl border p-1 ${
                        dark
                          ? "border-white/[0.08] bg-white/[0.03]"
                          : "border-black/[0.08] bg-black/[0.025]"
                      }`}
                    >
                      {/* JAVASCRIPT */}

                      <button
                        onClick={() =>
                          setLanguage("javascript")
                        }
                        className={`
                          flex items-center gap-2
                          rounded-lg px-4 py-2
                          text-sm font-bold
                          transition
                          ${
                            language ===
                            "javascript"
                              ? dark
                                ? "bg-white text-black"
                                : "bg-black text-white"
                              : styles.muted(dark)
                          }
                        `}
                      >
                        <SiJavascript />
                        JavaScript
                      </button>

                      {/* PYTHON */}

                      <button
                        onClick={() =>
                          setLanguage("python")
                        }
                        className={`
                          flex items-center gap-2
                          rounded-lg px-4 py-2
                          text-sm font-bold
                          transition
                          ${
                            language === "python"
                              ? dark
                                ? "bg-white text-black"
                                : "bg-black text-white"
                              : styles.muted(dark)
                          }
                        `}
                      >
                        <SiPython />
                        Python
                      </button>
                    </div>

                    <span
                      className={`text-xs font-semibold ${styles.muted(
                        dark
                      )}`}
                    >
                      Solution Code
                    </span>
                  </div>

                  {language === "javascript" &&
                    currentQuestion?.javascript && (
                      <CodeBlock
                        language="javascript"
                        code={
                          currentQuestion.javascript
                        }
                        darkMode={dark}
                      />
                    )}

                  {language === "python" &&
                    currentQuestion?.python && (
                      <CodeBlock
                        language="python"
                        code={currentQuestion.python}
                        darkMode={dark}
                      />
                    )}
                </div>
              )}

              {/* ==================================================
                  FOLLOW UP
              =================================================== */}

              {currentQuestion?.followUps &&
                currentQuestion.followUps.length >
                  0 && (
                  <div className="mt-7">
                    <p
                      className={`text-xs font-black uppercase tracking-widest ${
                        dark
                          ? "text-white/40"
                          : "text-black/40"
                      }`}
                    >
                      Follow-up Questions
                    </p>

                    <ul
                      className={`mt-2 list-disc pl-5 text-sm leading-7 ${styles.muted(
                        dark
                      )}`}
                    >
                      {currentQuestion.followUps.map(
                        (followUp, i) => (
                          <li key={i}>
                            {followUp}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              {/* ==================================================
                  INTERVIEW TIP
              =================================================== */}

              <div
                className={`mt-7 rounded-2xl border p-5 ${
                  dark
                    ? "border-amber-500/15 bg-amber-500/[0.04]"
                    : "border-amber-200 bg-amber-50/70"
                }`}
              >
                <div className="flex gap-3">
                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      dark
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    <FaLightbulb />
                  </div>

                  <div>
                    <p
                      className={`font-bold ${
                        dark
                          ? "text-amber-400"
                          : "text-amber-700"
                      }`}
                    >
                      Interview Tip
                    </p>

                    <p
                      className={`mt-1 text-sm leading-6 ${styles.muted(
                        dark
                      )}`}
                    >
                      {currentQuestion?.type ===
                      "dsa"
                        ? "First try solving the problem yourself. Explain your approach, time complexity, and space complexity before checking the solution."
                        : currentQuestion?.type ===
                          "behavioral"
                        ? "Use the STAR method (Situation, Task, Action, Result) to structure your answer."
                        : currentQuestion?.type ===
                          "hr"
                        ? "Be honest and align your answer with the company's values and culture."
                        : "Take your time to understand the question and think through your answer before responding."}
                    </p>
                  </div>
                </div>
              </div>

              {/* ==================================================
                  TEST CASES
              =================================================== */}

              {currentQuestion?.type === "dsa" &&
                currentQuestion?.testCases && (
                  <div className="mt-8">
                    <div className="mb-4">
                      <p
                        className={`text-xs font-black uppercase tracking-widest ${
                          dark
                            ? "text-white/40"
                            : "text-black/40"
                        }`}
                      >
                        Test Cases
                      </p>

                      <h3 className="mt-1 text-lg font-black">
                        Verify your solution
                      </h3>
                    </div>

                    <div
                      className={`overflow-hidden rounded-2xl border ${
                        dark
                          ? "border-white/[0.08]"
                          : "border-black/[0.08]"
                      }`}
                    >
                      {/* TABLE HEADER */}

                      <div
                        className={`grid grid-cols-[1fr_1fr] border-b px-4 py-3 text-xs font-bold uppercase tracking-wider ${
                          dark
                            ? "border-white/[0.08] bg-white/[0.03] text-white/40"
                            : "border-black/[0.07] bg-black/[0.025] text-black/40"
                        }`}
                      >
                        <span>Input</span>
                        <span>
                          Expected Output
                        </span>
                      </div>

                      {currentQuestion.testCases.map(
                        (test, index) => (
                          <div
                            key={index}
                            className={`grid grid-cols-[1fr_1fr] border-b px-4 py-4 last:border-b-0 ${
                              dark
                                ? "border-white/[0.08]"
                                : "border-black/[0.07]"
                            }`}
                          >
                            <code
                              className={`pr-3 text-xs sm:text-sm ${styles.muted(
                                dark
                              )}`}
                            >
                              {typeof test ===
                              "object"
                                ? test.input ||
                                  test[0] ||
                                  ""
                                : test}
                            </code>

                            <code
                              className={`text-xs font-semibold sm:text-sm ${
                                dark
                                  ? "text-emerald-400"
                                  : "text-emerald-700"
                              }`}
                            >
                              {typeof test ===
                              "object"
                                ? test.output ||
                                  test[1] ||
                                  ""
                                : test}
                            </code>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* ==================================================
                  REVEAL SOLUTION
              =================================================== */}

              <div className="mt-8">
                <button
                  onClick={() =>
                    setShowAnswer(
                      (prev) => !prev
                    )
                  }
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl border px-5 py-4 text-sm font-bold transition-all duration-200 ${
                    dark
                      ? "border-white/10 bg-white text-black hover:bg-white/90"
                      : "border-black/10 bg-black text-white hover:bg-black/85"
                  }`}
                >
                  <FaLightbulb />

                  {showAnswer
                    ? "Hide Solution Approach"
                    : "Reveal Solution Approach"}

                  {showAnswer ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </button>

                {/* SOLUTION */}

                {showAnswer && (
                  <div
                    className={`mt-4 rounded-2xl border p-5 ${
                      dark
                        ? "border-white/[0.08] bg-white/[0.025]"
                        : "border-black/[0.08] bg-black/[0.018]"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          dark
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        <FaCheckCircle />
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-bold">
                          Solution Approach
                        </h4>

                        <p
                          className={`mt-2 text-sm leading-7 ${styles.muted(
                            dark
                          )}`}
                        >
                          {currentQuestion?.type ===
                          "dsa"
                            ? currentQuestion?.expectedApproach ||
                              "Try to understand the pattern used in the solution rather than memorizing the code."
                            : "Think about the key points that the interviewer is looking for and structure your answer accordingly."}
                        </p>

                        {/* COMPLEXITY */}

                        {currentQuestion?.type ===
                          "dsa" && (
                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div
                              className={`rounded-xl border p-4 ${
                                dark
                                  ? "border-white/[0.08]"
                                  : "border-black/[0.07]"
                              }`}
                            >
                              <p
                                className={`text-xs font-black uppercase ${
                                  dark
                                    ? "text-white/40"
                                    : "text-black/40"
                                }`}
                              >
                                Time Complexity
                              </p>

                              <p
                                className={`mt-2 text-sm ${styles.muted(
                                  dark
                                )}`}
                              >
                                {currentQuestion?.timeComplexity ||
                                  "O(n)"}
                              </p>
                            </div>

                            <div
                              className={`rounded-xl border p-4 ${
                                dark
                                  ? "border-white/[0.08]"
                                  : "border-black/[0.07]"
                              }`}
                            >
                              <p
                                className={`text-xs font-black uppercase ${
                                  dark
                                    ? "text-white/40"
                                    : "text-black/40"
                                }`}
                              >
                                Space Complexity
                              </p>

                              <p
                                className={`mt-2 text-sm ${styles.muted(
                                  dark
                                )}`}
                              >
                                {currentQuestion?.spaceComplexity ||
                                  "O(1)"}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ==================================================
                  NAVIGATION BUTTONS
              =================================================== */}

              <div
                className={`mt-8 flex flex-col gap-3 border-t pt-7 sm:flex-row sm:items-center sm:justify-between ${
                  dark
                    ? "border-white/[0.08]"
                    : "border-black/[0.07]"
                }`}
              >
                {/* PREVIOUS */}

                <button
                  onClick={previousQuestion}
                  disabled={
                    currentQuestionIndex === 0
                  }
                  className={`flex items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-bold transition-all ${
                    currentQuestionIndex === 0
                      ? "cursor-not-allowed opacity-30"
                      : dark
                      ? "border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08]"
                      : "border-black/10 bg-white text-black hover:bg-black/[0.04]"
                  }`}
                >
                  <FaArrowLeft />
                  Previous
                </button>

                {/* COMPLETE */}

                <button
                  onClick={markCompleted}
                  className={`
                    flex items-center
                    justify-center gap-2
                    rounded-xl border
                    px-5 py-3
                    text-sm font-bold
                    transition-all
                    ${
                      isCurrentCompleted
                        ? dark
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                          : "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : dark
                        ? "border-white/10 bg-white text-black hover:bg-white/90"
                        : "border-black/10 bg-black text-white hover:bg-black/85"
                    }
                  `}
                >
                  <FaCheckCircle />

                  {isCurrentCompleted
                    ? "Completed"
                    : "Mark as Completed"}
                </button>

                {/* NEXT */}

                <button
                  onClick={nextQuestion}
                  disabled={
                    currentQuestionIndex ===
                    allQuestions.length - 1
                  }
                  className={`
                    flex items-center
                    justify-center gap-2
                    rounded-xl border
                    px-6 py-3
                    text-sm font-bold
                    transition-all
                    ${
                      currentQuestionIndex ===
                      allQuestions.length - 1
                        ? "cursor-not-allowed opacity-30"
                        : dark
                        ? "border-white bg-white text-black hover:bg-white/90"
                        : "border-black bg-black text-white hover:bg-black/85"
                    }
                  `}
                >
                  Next Question
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            COMPLETION
        ===================================================== */}

        {isBatchComplete && (
          <section className="mt-8">
            <div
              className={`relative overflow-hidden rounded-3xl border p-6 text-center sm:p-10 ${
                dark
                  ? "border-emerald-500/15 bg-emerald-500/[0.04]"
                  : "border-emerald-200 bg-emerald-50/70"
              }`}
            >
              <div
                className={`pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full blur-3xl ${
                  dark
                    ? "bg-emerald-500/[0.06]"
                    : "bg-emerald-500/[0.05]"
                }`}
              />

              <div className="relative">
                <div
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
                    dark
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  <FaTrophy className="text-2xl" />
                </div>

                <p
                  className={`mt-5 text-xs font-black uppercase tracking-[0.2em] ${
                    dark
                      ? "text-emerald-400"
                      : "text-emerald-700"
                  }`}
                >
                  INTERVIEW COMPLETED
                </p>

                <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                  🎉 Amazing! You completed this
                  interview
                </h2>

                <p
                  className={`mx-auto mt-3 max-w-2xl text-sm leading-6 ${styles.muted(
                    dark
                  )}`}
                >
                  You successfully completed all{" "}
                  {allQuestions.length} interview
                  questions. Keep going and improve
                  your problem-solving speed.
                </p>

                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                  {/* HOME */}

                  <button
                    onClick={() =>
                      navigate("/mock-interview")
                    }
                    className={styles.button.secondary(
                      dark
                    )}
                  >
                    <FaHome />
                    Back to Interviews
                  </button>

                  {/* PDF */}

                  <button
                    onClick={downloadPDF}
                    className={styles.button.primary(
                      dark
                    )}
                  >
                    <FaFilePdf />
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ====================================================
            BOTTOM CTA
        ===================================================== */}

        {!isBatchComplete && (
          <section className="mt-8">
            <div
              className={`rounded-2xl border p-5 ${
                dark
                  ? "border-white/[0.08] bg-[#101010]"
                  : "border-black/[0.08] bg-white"
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold">
                    Keep practicing 
                  </p>

                  <p
                    className={`mt-1 text-sm ${styles.muted(
                      dark
                    )}`}
                  >
                    Don't reveal the solution until
                    you have tried the problem yourself.
                  </p>
                </div>

                <div className="flex gap-2">
                  {/* HOME */}

                  <button
                    onClick={() =>
                      navigate("/mock-interview")
                    }
                    className={styles.button.secondary(
                      dark
                    )}
                  >
                    <FaHome />
                    Home
                  </button>

                  {/* NEXT */}

                  {currentQuestionIndex <
                    allQuestions.length - 1 && (
                    <button
                      onClick={nextQuestion}
                      className={styles.button.primary(
                        dark
                      )}
                    >
                      Next
                      <FaArrowRight />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}