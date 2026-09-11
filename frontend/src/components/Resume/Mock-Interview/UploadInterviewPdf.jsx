import React, { useRef, useState } from "react";
import {
  FaCloudUploadAlt,
  FaFilePdf,
  FaMagic,
  FaTimes,
  FaSpinner,
  FaCheckCircle,
} from "react-icons/fa";
import { useTheme } from "../../../BgContext/ThemeContext";
import { useNavigate } from "react-router-dom";

import { toast } from "react-hot-toast";
import { generateMockInterview } from "../../../Features/mockInterview";

export default function UploadInterviewPdf() {
  const { dark } = useTheme();
  const navigate = useNavigate();

  const inputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  // -----------------------------
  // Handle File
  // -----------------------------
  const handleFile = (file) => {
    if (!file) return;

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      toast.error("Please upload a PDF file only.");
      return;
    }

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB.");
      return;
    }

    setSelectedFile(file);
    setError(null);
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
    setError(null);
    setUploadProgress(0);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // -----------------------------
  // Generate Interview
  // -----------------------------
  const handleGenerateInterview = async () => {
    if (!selectedFile) {
      inputRef.current?.click();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setUploadProgress(10);

      const formData = new FormData();
      formData.append("resume", selectedFile);

      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const response = await generateMockInterview(formData);

      clearInterval(interval);
      setUploadProgress(100);

      console.log("✅ Interview Generated:", response);

      if (response.success) {
        toast.success("🎉 Mock interview generated successfully!");

        // Navigate to interview practice with the data
        navigate(`/interview-practice/${response.data._id}`, {
          state: {
            interview: response.data,
          },
        });
      } else {
        throw new Error(response.message || "Failed to generate interview");
      }
    } catch (error) {
      console.error("❌ Generate Error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to generate interview. Please try again.";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div
      className={`p-8 transition-colors duration-300 ${
        dark ? "border-white/10 bg-white/[0.03]" : "border-gray-200 bg-gray-50"
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
        onClick={() => !loading && inputRef.current?.click()}
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
        } ${loading ? "cursor-not-allowed opacity-70" : ""}`}
      >
        {/* Upload Icon */}
        <div
          className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full transition-transform duration-300 ${
            isDragging ? "scale-110" : ""
          } ${
            loading
              ? dark
                ? "bg-white/10 text-gray-400"
                : "bg-gray-200 text-gray-500"
              : dark
              ? "bg-white text-black"
              : "bg-black text-white"
          }`}
        >
          {loading ? (
            <FaSpinner size={34} className="animate-spin" />
          ) : (
            <FaCloudUploadAlt size={34} />
          )}
        </div>

        {/* Title */}
        <h3
          className={`text-xl font-semibold ${
            dark ? "text-white" : "text-black"
          }`}
        >
          {loading
            ? "Generating Interview..."
            : selectedFile
            ? "Resume Selected"
            : "Upload Resume PDF"}
        </h3>

        {/* Loading Progress */}
        {loading && (
          <div className="mt-4">
            <div className="h-2 w-full max-w-md mx-auto overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className={`mt-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
              {uploadProgress < 100 ? "Analyzing your resume..." : "Almost done..."}
            </p>
          </div>
        )}

        {/* Description */}
        {!loading && !selectedFile && (
          <p className={`mt-3 ${dark ? "text-gray-400" : "text-gray-500"}`}>
            Click here or drag & drop your PDF file.
          </p>
        )}

        {!loading && selectedFile && (
          <p
            className={`mx-auto mt-3 max-w-md truncate ${
              dark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {selectedFile.name}
          </p>
        )}

        {/* Error Message */}
        {error && !loading && (
          <p className="mt-3 text-sm text-red-500">{error}</p>
        )}

        {/* File Type / Selected File */}
        {!loading && selectedFile ? (
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
              disabled={loading}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                dark
                  ? "text-gray-400 hover:bg-white/10 hover:text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-black"
              } ${loading ? "cursor-not-allowed opacity-50" : ""}`}
              aria-label="Remove file"
            >
              <FaTimes />
            </button>
          </div>
        ) : !loading && (
          <div
            className={`mx-auto mt-8 flex w-fit items-center gap-3 rounded-xl px-5 py-3 ${
              dark
                ? "bg-black text-white"
                : "border border-gray-200 bg-white text-black"
            }`}
          >
            <FaFilePdf className="text-red-500" />
            PDF Files Only (Max 10MB)
          </div>
        )}

        {/* Hidden Input */}
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={loading}
        />
      </div>

      {/* Bottom Action */}
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleGenerateInterview}
          disabled={!selectedFile || loading}
          className={`flex items-center gap-2 rounded-xl px-8 py-3 font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
            !selectedFile || loading
              ? dark
                ? "cursor-not-allowed bg-white/10 text-gray-500"
                : "cursor-not-allowed bg-gray-200 text-gray-400"
              : dark
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FaMagic />
              {selectedFile ? "Generate Interview" : "Choose Resume"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}