import React, { useRef } from "react";
import { FaCloudUploadAlt, FaFilePdf } from "react-icons/fa";
import { useTheme } from "../../../BgContext/ThemeContext";

export default function UploadPortfolioPdf() {
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
      <h3
        className={`mb-2 text-2xl font-bold ${
          dark ? "text-white" : "text-black"
        }`}
      >
        Upload Resume PDF
      </h3>

      <p
        className={`mb-8 ${
          dark ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Upload your resume PDF and our AI will generate a complete
        portfolio website with beautiful sections and responsive design.
      </p>

      <div
        onClick={() => inputRef.current.click()}
        className={`cursor-pointer rounded-3xl border-2 border-dashed p-12 text-center transition-all hover:scale-[1.01] ${
          dark
            ? "border-white/20 hover:border-white/50"
            : "border-gray-300 hover:border-black"
        }`}
      >
        <div
          className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full ${
            dark
              ? "bg-white text-black"
              : "bg-black text-white"
          }`}
        >
          <FaCloudUploadAlt size={35} />
        </div>

        <h4
          className={`text-xl font-semibold ${
            dark ? "text-white" : "text-black"
          }`}
        >
          Upload Resume PDF
        </h4>

        <p
          className={`mt-2 ${
            dark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Click here or drag & drop your resume.
        </p>

        <div
          className={`mx-auto mt-8 flex w-fit items-center gap-3 rounded-xl px-5 py-3 ${
            dark
              ? "bg-black text-white"
              : "bg-white text-black border"
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
          className={`rounded-xl px-8 py-3 font-semibold transition ${
            dark
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          Generate Portfolio
        </button>
      </div>
    </div>
  );
}