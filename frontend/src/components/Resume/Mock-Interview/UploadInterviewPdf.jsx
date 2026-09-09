
import React, { useRef, useState } from "react";
import {
  FaCloudUploadAlt,
  FaFilePdf,
  FaMagic,
  FaTimes,
} from "react-icons/fa";
import { useTheme } from "../../../BgContext/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function UploadInterviewPdf() {
  const { dark } = useTheme();
  const navigate = useNavigate();

  const inputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // -----------------------------
  // Handle File
  // -----------------------------
  const handleFile = (file) => {
    if (!file) return;

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      alert("Please upload a PDF file only.");
      return;
    }

    setSelectedFile(file);
  };

  // -----------------------------
  // File Input
  // -----------------------------
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  // -----------------------------
  // Drag Events
  // -----------------------------
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  // -----------------------------
  // Remove File
  // -----------------------------
  const removeFile = (event) => {
    event.stopPropagation();

    setSelectedFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // -----------------------------
  // Generate Interview
  // -----------------------------
  const handleGenerateInterview = () => {
    if (!selectedFile) {
      inputRef.current?.click();
      return;
    }

    // You can upload/process the PDF here
    // before navigating if your backend requires it.

    navigate("/interview-practice", {
      state: {
        resumeFile: selectedFile,
      },
    });
  };

  return (
    <div
      className={`p-8 transition-colors duration-300 ${
        dark
          ? "border-white/10 bg-white/[0.03]"
          : "border-gray-200 bg-gray-50"
      }`}
    >
      {/* Header */}
      <div>
        <h2
          className={`text-2xl font-bold ${
            dark ? "text-white" : "text-black"
          }`}
        >
          Upload Resume PDF
        </h2>

        <p
          className={`mt-2 max-w-3xl leading-6 ${
            dark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Upload your resume and AI will create a personalized interview
          based on your skills, experience, projects, and job profile.
        </p>
      </div>

      {/* Upload Area */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`mt-8 cursor-pointer rounded-3xl border-2 border-dashed p-14 text-center transition-all duration-300 ${
          isDragging
            ? dark
              ? "scale-[1.01] border-white bg-white/[0.06]"
              : "scale-[1.01] border-black bg-gray-100"
            : dark
            ? "border-white/15 hover:border-white/40 hover:bg-white/[0.02]"
            : "border-gray-300 bg-white hover:border-black hover:bg-gray-100"
        }`}
      >
        {/* Upload Icon */}
        <div
          className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full transition-transform duration-300 ${
            isDragging ? "scale-110" : ""
          } ${
            dark
              ? "bg-white text-black"
              : "bg-black text-white"
          }`}
        >
          <FaCloudUploadAlt size={34} />
        </div>

        {/* Title */}
        <h3
          className={`text-xl font-semibold ${
            dark ? "text-white" : "text-black"
          }`}
        >
          {selectedFile ? "Resume Selected" : "Upload Resume PDF"}
        </h3>

        {/* Description */}
        {!selectedFile ? (
          <p
            className={`mt-3 ${
              dark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Click here or drag & drop your PDF file.
          </p>
        ) : (
          <p
            className={`mx-auto mt-3 max-w-md truncate ${
              dark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {selectedFile.name}
          </p>
        )}

        {/* File Type / Selected File */}
        {selectedFile ? (
          <div
            onClick={(event) => event.stopPropagation()}
            className={`mx-auto mt-8 flex max-w-md items-center justify-between gap-4 rounded-2xl border px-5 py-4 ${
              dark
                ? "border-white/10 bg-black/40"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                <FaFilePdf className="text-xl text-red-500" />
              </div>

              <div className="min-w-0 text-left">
                <p
                  className={`truncate text-sm font-semibold ${
                    dark ? "text-white" : "text-black"
                  }`}
                >
                  {selectedFile.name}
                </p>

                <p
                  className={`mt-1 text-xs ${
                    dark ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={removeFile}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                dark
                  ? "text-gray-400 hover:bg-white/10 hover:text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-black"
              }`}
              aria-label="Remove file"
            >
              <FaTimes />
            </button>
          </div>
        ) : (
          <div
            className={`mx-auto mt-8 flex w-fit items-center gap-3 rounded-xl px-5 py-3 ${
              dark
                ? "bg-black text-white"
                : "border border-gray-200 bg-white text-black"
            }`}
          >
            <FaFilePdf className="text-red-500" />
            PDF Files Only
          </div>
        )}

        {/* Hidden Input */}
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Bottom Action */}
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleGenerateInterview}
          className={`flex items-center gap-2 rounded-xl px-8 py-3 font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
            dark
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          <FaMagic />

          {selectedFile ? "Generate Interview" : "Choose Resume"}
        </button>
      </div>
    </div>
  );
}
