import React, { useState } from "react";
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
  FaEye,
  FaBriefcase,
  FaCode,
  FaComments,
  FaPlus,
} from "react-icons/fa";
import { useTheme } from "../../../BgContext/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function InterviewHero() {
  const { dark } = useTheme();
    
  const [interviews, setInterviews] = useState([
    {
      id: 1,
      title: "1st Interview Generated",
      pdfName: "Siraj_Abid_Resume.pdf",
      date: "Today",
      questions: 20,
      technical: 10,
      behavioral: 5,
      hr: 5,
      status: "Ready",
    },
    {
      id: 2,
      title: "2nd Interview Generated",
      pdfName: "MERN_Developer_Resume.pdf",
      date: "Yesterday",
      questions: 25,
      technical: 12,
      behavioral: 6,
      hr: 7,
      status: "Ready",
    },
  ]);

  const deleteInterview = (id) => {
    setInterviews((prev) =>
      prev.filter((interview) => interview.id !== id)
    );
  };

  return (
    <div
      className={`min-h-screen px-4 py-10 sm:px-6 lg:px-8 ${
        dark
          ? "bg-[#09090b] text-white"
          : "bg-gray-50 text-black"
      }`}
    >
      <div className="mx-auto max-w-7xl">

        {/* =========================================================
            HERO
        ========================================================== */}
        <div
          className={`relative overflow-hidden rounded-3xl border px-6 py-12 sm:px-10 lg:px-14 ${
            dark
              ? "border-white/10 bg-white/[0.03]"
              : "border-gray-200 bg-white"
          }`}
        >
          {/* Background Glow */}
          <div
            className={`pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full blur-3xl ${
              dark
                ? "bg-green-500/10"
                : "bg-green-500/5"
            }`}
          />

          <div
            className={`pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full blur-3xl ${
              dark
                ? "bg-blue-500/10"
                : "bg-blue-500/5"
            }`}
          />

          <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">

            {/* ICON */}
            <div
              className={`mb-6 flex h-20 w-20 items-center justify-center rounded-3xl shadow-xl ${
                dark
                  ? "bg-white text-black"
                  : "bg-black text-white"
              }`}
            >
              <FaUserTie size={34} />
            </div>

            {/* BADGE */}
            <div className="mb-5 flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-5 py-2 text-sm font-semibold text-green-500">
              <FaRobot />
              AI Mock Interview Generator
            </div>

           

            {/* DESCRIPTION */}
            <p
              className={`mt-6 max-w-3xl text-base leading-8 ${
                dark
                  ? "text-gray-400"
                  : "text-gray-600"
              }`}
            >
              Upload your resume and AI will analyze your
              experience, projects, skills, education, and
              technologies to generate a personalized mock
              interview with technical, behavioral, and HR
              questions tailored specifically to your profile.
            </p>

            {/* FEATURES */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {[
                {
                  label: "🤖 AI Questions",
                  color: "green",
                },
                {
                  label: "💻 Technical Round",
                  color: "blue",
                },
                {
                  label: "👨‍💼 HR Interview",
                  color: "purple",
                },
                {
                  label: "🧠 Personalized",
                  color: "yellow",
                },
                {
                  label: "⚡ Instant",
                  color: "orange",
                },
              ].map((item) => (
                <span
                  key={item.label}
                  className={`rounded-full border px-4 py-2 text-sm font-medium ${
                    dark
                      ? "border-white/10 bg-black/40 text-gray-200"
                      : "border-gray-200 bg-gray-50 text-gray-700"
                  }`}
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================
            GENERATED INTERVIEWS HEADER
        ========================================================== */}
        <div className="mt-12">

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/10 text-green-500">
                  <FaBrain />
                </div>

                <span className="text-xs font-bold uppercase tracking-widest text-green-500">
                  Interview History
                </span>
              </div>

              <h2 className="text-2xl font-black sm:text-3xl">
                Your Generated Interviews
              </h2>

              <p
                className={`mt-2 text-sm ${
                  dark
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                Your AI-generated interviews from uploaded
                resume PDFs are saved here.
              </p>
            </div>

        
          </div>

          {/* =======================================================
              INTERVIEW CARDS
          ======================================================== */}
          {interviews.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-2">

              {interviews.map((interview, index) => (
                <div
                  key={interview.id}
                  className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                    dark
                      ? "border-white/10 bg-white/[0.035] hover:border-green-500/20"
                      : "border-gray-200 bg-white hover:border-green-300"
                  }`}
                >

                  {/* TOP ACCENT */}
                  <div
                    className={`absolute left-0 right-0 top-0 h-[2px] ${
                      index === 0
                        ? "bg-gradient-to-r from-green-400 to-emerald-600"
                        : "bg-gradient-to-r from-blue-400 to-violet-600"
                    }`}
                  />

                  {/* CARD HEADER */}
                  <div className="flex items-start justify-between gap-4">

                    <div className="flex items-center gap-4">

                      {/* PDF ICON */}
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                          dark
                            ? "bg-red-500/10 text-red-400"
                            : "bg-red-50 text-red-500"
                        }`}
                      >
                        <FaFilePdf size={24} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold">
                            {interview.title}
                          </h3>

                          <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-[10px] font-bold uppercase text-green-500">
                            {interview.status}
                          </span>
                        </div>

                        <p
                          className={`mt-1 text-xs ${
                            dark
                              ? "text-gray-500"
                              : "text-gray-500"
                          }`}
                        >
                          Generated from resume
                        </p>
                      </div>
                    </div>

                    {/* DELETE */}
                    <button
                      onClick={() =>
                        deleteInterview(interview.id)
                      }
                      title="Delete interview"
                      className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                        dark
                          ? "text-gray-500 hover:bg-red-500/10 hover:text-red-400"
                          : "text-gray-400 hover:bg-red-50 hover:text-red-500"
                      }`}
                    >
                      <FaTrash size={13} />
                    </button>
                  </div>

                  {/* PDF NAME */}
                  <div
                    className={`mt-5 flex items-center gap-3 rounded-xl border p-3 ${
                      dark
                        ? "border-white/10 bg-black/20"
                        : "border-gray-100 bg-gray-50"
                    }`}
                  >
                    <FaFilePdf className="shrink-0 text-red-500" />

                    <span
                      className={`truncate text-xs font-medium ${
                        dark
                          ? "text-gray-300"
                          : "text-gray-600"
                      }`}
                    >
                      {interview.pdfName}
                    </span>

                    <span className="ml-auto shrink-0 rounded-md bg-red-500/10 px-2 py-1 text-[10px] font-bold text-red-500">
                      PDF
                    </span>
                  </div>

                  {/* STATS */}
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">

                    <div
                      className={`rounded-xl border p-3 ${
                        dark
                          ? "border-white/10 bg-white/[0.025]"
                          : "border-gray-100 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-blue-400">
                        <FaQuestionCircle size={12} />
                        <span className="text-[10px] font-bold uppercase">
                          Questions
                        </span>
                      </div>

                      <p className="mt-2 text-lg font-black">
                        {interview.questions}
                      </p>
                    </div>

                    <div
                      className={`rounded-xl border p-3 ${
                        dark
                          ? "border-white/10 bg-white/[0.025]"
                          : "border-gray-100 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-violet-400">
                        <FaCode size={12} />
                        <span className="text-[10px] font-bold uppercase">
                          Technical
                        </span>
                      </div>

                      <p className="mt-2 text-lg font-black">
                        {interview.technical}
                      </p>
                    </div>

                    <div
                      className={`rounded-xl border p-3 ${
                        dark
                          ? "border-white/10 bg-white/[0.025]"
                          : "border-gray-100 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-orange-400">
                        <FaComments size={12} />
                        <span className="text-[10px] font-bold uppercase">
                          Behavioral
                        </span>
                      </div>

                      <p className="mt-2 text-lg font-black">
                        {interview.behavioral}
                      </p>
                    </div>

                    <div
                      className={`rounded-xl border p-3 ${
                        dark
                          ? "border-white/10 bg-white/[0.025]"
                          : "border-gray-100 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-green-400">
                        <FaBriefcase size={12} />
                        <span className="text-[10px] font-bold uppercase">
                          HR
                        </span>
                      </div>

                      <p className="mt-2 text-lg font-black">
                        {interview.hr}
                      </p>
                    </div>
                  </div>

                  {/* DATE */}
                  <div
                    className={`mt-5 flex items-center gap-2 text-xs ${
                      dark
                        ? "text-gray-500"
                        : "text-gray-500"
                    }`}
                  >
                    <FaCalendarAlt />
                    Generated {interview.date}
                  </div>

                  {/* ACTIONS */}
                  <div
                    className={`mt-5 flex gap-3 border-t pt-5 ${
                      dark
                        ? "border-white/10"
                        : "border-gray-100"
                    }`}
                  >
                    <button
                      className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${
                        dark
                          ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.08]"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <FaEye />
                      View Interview
                    </button>

                    <button
                    onClick={useNavigate('/user-interview')}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-600"
                    >
                      Continue
                      <FaArrowRight />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* =====================================================
                EMPTY STATE
            ====================================================== */
            <div
              className={`rounded-3xl border border-dashed p-10 text-center ${
                dark
                  ? "border-white/10 bg-white/[0.02]"
                  : "border-gray-300 bg-white"
              }`}
            >
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
                  dark
                    ? "bg-white/5 text-gray-500"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <FaRobot size={25} />
              </div>

              <h3 className="mt-5 text-xl font-bold">
                No Interviews Generated Yet
              </h3>

              <p
                className={`mx-auto mt-2 max-w-md text-sm leading-6 ${
                  dark
                    ? "text-gray-500"
                    : "text-gray-500"
                }`}
              >
                Upload your resume PDF and generate your
                first personalized AI mock interview.
              </p>

              <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-600">
                <FaPlus />
                Generate Interview
              </button>
            </div>
          )}

          {/* =======================================================
              INFO BOX
          ======================================================== */}
          <div
            className={`mt-8 flex gap-4 rounded-2xl border p-5 ${
              dark
                ? "border-blue-500/20 bg-blue-500/[0.04]"
                : "border-blue-100 bg-blue-50"
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <FaBolt />
            </div>

            <div>
              <h4 className="font-bold">
                Your interviews are saved automatically
              </h4>

              <p
                className={`mt-1 text-sm leading-6 ${
                  dark
                    ? "text-gray-400"
                    : "text-gray-600"
                }`}
              >
                Whenever you generate an interview from a
                resume PDF, it can appear here so you can
                return to your previous interview practice
                anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}