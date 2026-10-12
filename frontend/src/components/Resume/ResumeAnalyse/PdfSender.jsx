
import React, { useRef, useState, useEffect } from "react";
import {
  FaCloudUploadAlt,
  FaFilePdf,
  FaFileImage,
  FaCheckCircle,
  FaTimes,
  FaSpinner,
  FaRocket,
  FaArrowRight,
} from "react-icons/fa";
import { useTheme } from "../../../BgContext/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { uploadResume, getMyResumes } from "../../../Features/ResumeAnalysis";
import { setResumes } from "../../../redux/ResumeSlice";
import { useNavigate } from "react-router-dom";

export default function PdfSender() {
  const { dark } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const resumes = useSelector((state) => state.resume.resumes);

  
  useEffect(() => {
    if (resumes && resumes.length > 0) {
      setAnalysisData(resumes[0]);
      setAnalysisComplete(true);
    }
  }, [resumes]);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a resume.");
      return;
    }

    
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setUploadProgress(0);
      setAnalysisComplete(false);

      const formData = new FormData();
      formData.append("resume", file);

      
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const data = await uploadResume(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      console.log("Upload Response:", data);

      if (data.success) {
        
        dispatch(setResumes([data.analysis]));
        setAnalysisData(data.analysis);
        setAnalysisComplete(true);

        
        const successMessage = data.analysis?.name
          ? `Resume for ${data.analysis.name} analyzed successfully!`
          : "Resume analyzed successfully!";
        
        toast.success(successMessage);

        
        setFile(null);
        setUploadProgress(0);
        
        
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      setError(error.response?.data?.message || error.message || "Upload failed");
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
      
      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);
    }
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    setError(null);
    setAnalysisComplete(false);

    
    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      const errorMsg = "Please upload a PDF, PNG, or JPG file.";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    
    if (selectedFile.size > 10 * 1024 * 1024) {
      const errorMsg = "File size exceeds 10MB limit.";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setFile(selectedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setError(null);
    setUploadProgress(0);
    setAnalysisComplete(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const goToAnalysis = () => {
    navigate('/resume-analysis');
  };

  return (
    <div
      className={`
        min-h-[calc(100vh-72px)]
        px-4 py-10
        transition-colors duration-300
        sm:px-6 lg:px-10
        ${
          dark
            ? "bg-black text-white"
            : "bg-white text-gray-900"
        }
      `}
    >
      <div className="mx-auto flex min-h-[calc(100vh-150px)] max-w-4xl items-center justify-center">
        <div className="w-full">

          {}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold sm:text-3xl">
              Upload Your Resume
            </h1>

            <p
              className={`
                mx-auto mt-3 max-w-lg
                text-sm leading-6 sm:text-base
                ${dark ? "text-gray-400" : "text-gray-500"}
              `}
            >
              Upload your resume and let Solvix analyze your skills,
              experience, and career profile to provide personalized insights.
            </p>
          </div>

          {}
          {analysisComplete && analysisData && (
            <div className="mx-auto max-w-2xl mb-6">
              <div className={`
                relative overflow-hidden rounded-2xl p-8 text-center
                ${dark ? "bg-white/[0.05] border border-white/10" : "bg-gray-50 border border-gray-200"}
              `}>
                {}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 left-1/4 w-64 h-64 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-30 animate-ping"></div>
                      <div className="relative bg-green-500/20 rounded-full p-4">
                        <FaCheckCircle className="text-5xl text-green-500" />
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold mb-2">
                     Analysis Complete!
                  </h2>
                  
                  <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-600"} mb-1`}>
                    Your resume has been successfully analyzed.
                  </p>
                  
                  {analysisData.name && (
                    <p className={`text-sm font-medium ${dark ? "text-gray-200" : "text-gray-700"}`}>
                      Name: {analysisData.name}
                    </p>
                  )}
                  
                  {analysisData.resumeScore && (
                    <div className="mt-3 flex justify-center items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Score:</span>
                        <span className="text-lg font-bold text-green-500">{analysisData.resumeScore}%</span>
                      </div>
                      {analysisData.grade && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Grade:</span>
                          <span className="text-lg font-bold text-purple-500">{analysisData.grade}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={goToAnalysis}
                      className={`
                        px-6 py-3 rounded-xl font-semibold
                        flex items-center gap-2
                        transition-all duration-300
                        hover:scale-105
                        ${dark 
                          ? "bg-white text-black hover:bg-gray-200" 
                          : "bg-black text-white hover:bg-gray-800"
                        }
                      `}
                    >
                      View Analysis
                      <FaArrowRight />
                    </button>

                    <button
                      onClick={() => {
                        setAnalysisComplete(false);
                        setAnalysisData(null);
                      }}
                      className={`
                        px-6 py-3 rounded-xl font-semibold
                        transition-all duration-300
                        hover:scale-105
                        ${dark 
                          ? "bg-white/10 text-white hover:bg-white/20" 
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }
                      `}
                    >
                      Upload Another
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {}
          {!analysisComplete && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => !loading && fileInputRef.current.click()}
              className={`
                group relative mx-auto flex min-h-[320px]
                w-full max-w-2xl cursor-pointer
                flex-col items-center justify-center
                overflow-hidden rounded-3xl
                border-2 border-dashed
                p-6 text-center
                transition-all duration-300
                sm:min-h-[360px] sm:p-10

                ${
                  loading
                    ? "opacity-70 cursor-not-allowed"
                    : isDragging
                      ? dark
                        ? "scale-[1.01] border-white bg-white/10"
                        : "scale-[1.01] border-black bg-gray-100"
                      : dark
                        ? "border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06]"
                        : "border-gray-300 bg-gray-50 hover:border-gray-500 hover:bg-gray-100"
                }
              `}
            >
              {}
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
                  <div className="text-center">
                    <FaSpinner className="text-4xl text-white animate-spin mx-auto" />
                    <p className="mt-3 text-white font-semibold">
                      Analyzing... {uploadProgress}%
                    </p>
                    <div className="w-48 h-1 bg-white/20 rounded-full mt-2 mx-auto overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {}
              <div
                className={`
                  mb-5 flex h-20 w-20
                  items-center justify-center
                  rounded-2xl shadow-md
                  transition-transform duration-300
                  group-hover:-translate-y-1
                  ${
                    dark
                      ? "bg-white/10"
                      : "bg-white"
                  }
                `}
              >
                {file ? (
                  file.type === "application/pdf" ? (
                    <FaFilePdf className="text-3xl text-red-500" />
                  ) : (
                    <FaFileImage className="text-3xl text-blue-500" />
                  )
                ) : (
                  <FaCloudUploadAlt
                    className={`
                      text-3xl
                      ${dark ? "text-gray-300" : "text-gray-700"}
                    `}
                  />
                )}
              </div>

              {}
              {file ? (
                <>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" />

                    <h2 className="max-w-[250px] truncate text-base font-semibold sm:max-w-md">
                      {file.name}
                    </h2>
                  </div>

                  <p
                    className={`
                      mt-1 text-xs
                      ${dark ? "text-gray-400" : "text-gray-500"}
                    `}
                  >
                    {formatFileSize(file.size)}
                  </p>

                  <p
                    className={`
                      mt-2 text-sm
                      ${dark ? "text-gray-400" : "text-gray-500"}
                    `}
                  >
                    File selected successfully
                  </p>

                  <button
                    onClick={removeFile}
                    disabled={loading}
                    className={`
                      mt-5 rounded-lg border
                      px-4 py-2 text-xs font-medium
                      transition flex items-center gap-2
                      ${
                        dark
                          ? "border-white/10 hover:bg-white/10"
                          : "border-gray-200 hover:bg-gray-100"
                      }
                      ${loading ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    <FaTimes />
                    Choose Another File
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-bold sm:text-xl">
                    Drag & Drop your resume here
                  </h2>

                  <p
                    className={`
                      mt-2 text-sm
                      ${dark ? "text-gray-400" : "text-gray-500"}
                    `}
                  >
                    or click anywhere to browse from your computer
                  </p>

                  {}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current.click();
                    }}
                    className={`
                      mt-6 flex items-center gap-2
                      rounded-xl px-6 py-3
                      text-sm font-semibold
                      transition-all duration-300
                      hover:-translate-y-1 hover:shadow-xl
                      ${
                        dark
                          ? "bg-white text-black hover:bg-gray-200"
                          : "bg-black text-white hover:bg-gray-800"
                      }
                    `}
                  >
                    <FaCloudUploadAlt />
                    Choose Resume
                  </button>

                  <p
                    className={`
                      mt-5 text-xs
                      ${dark ? "text-gray-500" : "text-gray-400"}
                    `}
                  >
                    Supported formats: PDF, JPG, JPEG, PNG (Max 10MB)
                  </p>
                </>
              )}

              {}
              {error && (
                <div className="mt-4 text-red-500 text-sm font-medium">
                  {error}
                </div>
              )}

              {}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {}
          {!analysisComplete && (
            <div
              className={`
                mx-auto mt-6 flex max-w-2xl
                flex-col items-center justify-center
                gap-3 text-center text-xs
                sm:flex-row
                ${dark ? "text-gray-500" : "text-gray-500"}
              `}
            >
              <span className="flex items-center gap-1">
                <FaCheckCircle className="text-green-500" />
                Secure file processing
              </span>

              <span className="hidden sm:block">•</span>

              <span>Maximum file size: 10MB</span>

              <span className="hidden sm:block">•</span>

              <span>AI-powered analysis</span>
            </div>
          )}

          {}
          {file && !analysisComplete && (
            <div className="flex justify-center mt-6">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpload();
                }}
                disabled={loading}
                className={`
                  rounded-xl px-8 py-3 font-semibold transition
                  flex items-center gap-2
                  ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : dark
                        ? "bg-white text-black hover:bg-gray-200 hover:scale-105"
                        : "bg-black text-white hover:bg-gray-800 hover:scale-105"
                  }
                  transform transition-all duration-300
                `}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FaCloudUploadAlt />
                    Analyze Resume
                  </>
                )}
              </button>
            </div>
          )}

          {}
          {resumes && resumes.length > 0 && !analysisComplete && !file && (
            <div className="flex justify-center mt-6">
              <button
                onClick={goToAnalysis}
                className={`
                  rounded-xl px-8 py-3 font-semibold transition
                  flex items-center gap-2
                  ${dark
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                  transform transition-all duration-300 hover:scale-105
                `}
              >
                <FaRocket />
                View Existing Analysis
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}