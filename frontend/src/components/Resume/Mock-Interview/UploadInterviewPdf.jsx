import React, { useRef } from "react";
import {
  FaCloudUploadAlt,
  FaFilePdf,
  FaMagic,
} from "react-icons/fa";
import { useTheme } from "../../../BgContext/ThemeContext";

export default function UploadInterviewPdf() {
  const { dark } = useTheme();

  const inputRef = useRef();

  return (
    <div
      className={`p-8 ${
        dark
          ? "border-white/10 bg-white/[0.03]"
          : "border-gray-200 bg-gray-50"
      }`}
    >
      <h2
        className={`text-2xl font-bold ${
          dark ? "text-white" : "text-black"
        }`}
      >
        Upload Resume PDF
      </h2>

      <p
        className={`mt-2 ${
          dark ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Upload your resume and AI will create a personalized interview
        based on your skills, experience, projects, and job profile.
      </p>

      <div
        onClick={() => inputRef.current.click()}
        className={`mt-8 cursor-pointer rounded-3xl border-2 border-dashed p-14 text-center transition-all hover:scale-[1.01] ${
          dark
            ? "border-white/15 hover:border-white/40"
            : "border-gray-300 hover:border-black"
        }`}
      >
        <div
          className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
            dark
              ? "bg-white text-black"
              : "bg-black text-white"
          }`}
        >
          <FaCloudUploadAlt size={34} />
        </div>

        <h3
          className={`text-xl font-semibold ${
            dark ? "text-white" : "text-black"
          }`}
        >
          Upload Resume PDF
        </h3>

        <p
          className={`mt-3 ${
            dark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Click here or drag & drop your PDF file.
        </p>

        <div
          className={`mx-auto mt-8 flex w-fit items-center gap-3 rounded-xl px-5 py-3 ${
            dark
              ? "bg-black text-white"
              : "border bg-white text-black"
          }`}
        >
          <FaFilePdf className="text-red-500" />
          PDF Files Only
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
        />
      </div>

      <div className="mt-8 flex justify-end">
        <button
          className={`flex items-center gap-2 rounded-xl px-8 py-3 font-semibold transition-all ${
            dark
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          <FaMagic />
          Generate Interview
        </button>
      </div>
    </div>
  );
}