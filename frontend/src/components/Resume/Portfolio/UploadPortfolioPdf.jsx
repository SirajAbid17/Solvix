import React, { useRef, useState } from "react";
import {
  FaCloudUploadAlt,
  FaFilePdf,
  FaCheckCircle,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useTheme } from "../../../BgContext/ThemeContext";

import {
  analyzePortfolio,
  uploadPortfolio,
} from "../../../Features/portfolio";

import {
  addPortfolio,
  setCurrentPortfolio,
  setPortfolioAnalysisError,
  setPortfolioAnalyzing,
  setPortfolioError,
  setPortfolioLoading,
} from "../../../redux/portfolioSlice";

export default function UploadPortfolioPdf() {
  const { dark } = useTheme();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const inputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleFileSelect = (file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please select a PDF file only.");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Only PDF files are supported.");
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("PDF size must be less than 10MB.");
      return;
    }

    setSelectedFile(file);
  };

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];
    handleFileSelect(file);
  };

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
    handleFileSelect(file);
  };

  const removeFile = () => {
    if (isProcessing) return;
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };


  const handleGeneratePortfolio = async () => {
    if (!selectedFile) {
      toast.error("Please upload your resume PDF first.");
      return;
    }

    let portfolioId = null;

    try {
     
      setUploading(true);
      dispatch(setPortfolioLoading(true));
      dispatch(setPortfolioError(null));
      dispatch(setPortfolioAnalysisError(null));

      const formData = new FormData();
      formData.append("pdf", selectedFile);

      console.log("Uploading Portfolio PDF:", selectedFile.name);

      const uploadResponse = await uploadPortfolio(formData);

      console.log("Portfolio Upload Response:", uploadResponse);

      if (!uploadResponse?.success) {
        throw new Error(uploadResponse?.message || "Portfolio upload failed.");
      }

      portfolioId =
        uploadResponse?.portfolioId ||
        uploadResponse?.portfolio?._id ||
        uploadResponse?.data?.portfolioId ||
        uploadResponse?.data?._id;

      if (!portfolioId) {
        console.error("Invalid upload response:", uploadResponse);
        throw new Error("Portfolio ID was not returned by the server.");
      }

      console.log("Portfolio ID:", portfolioId);

      const uploadedPortfolio = {
        _id: portfolioId,
        id: portfolioId,
        title:
          uploadResponse?.title ||
          selectedFile.name.replace(/\.pdf$/i, ""),
        slug: uploadResponse?.slug || "",
        status: uploadResponse?.status || "uploaded",
        analysisStatus: uploadResponse?.analysisStatus || "pending",
        extractedCharacters: uploadResponse?.extractedCharacters || 0,
        totalPages: uploadResponse?.totalPages || 0,
        analysis: null,
        generatedCode: {
          html: "",
          css: "",
          js: "",
        },
      };

   
      dispatch(addPortfolio(uploadedPortfolio));
      dispatch(setCurrentPortfolio(uploadedPortfolio));

      toast.success("Resume uploaded successfully!");

     
      setUploading(false);
      dispatch(setPortfolioLoading(false));

    
      setAnalyzing(true);
      dispatch(setPortfolioAnalyzing(true));
      dispatch(setPortfolioAnalysisError(null));

      toast.loading("AI is generating your portfolio...", {
        id: "portfolio-analysis",
      });

      console.log("Analyzing Portfolio:", portfolioId);

      const analysisResponse = await analyzePortfolio(portfolioId);

      console.log("Portfolio Analysis Response:", analysisResponse);

      if (!analysisResponse?.success) {
        throw new Error(
          analysisResponse?.message || "Portfolio analysis failed."
        );
      }

      
      const rawGeneratedAt =
        analysisResponse?.generatedCode?.generatedAt;

      const generatedAtIso = rawGeneratedAt
        ? new Date(rawGeneratedAt).toISOString()
        : new Date().toISOString();

      const analyzedPortfolio = {
        _id: analysisResponse?.portfolioId || portfolioId,
        id: analysisResponse?.portfolioId || portfolioId,
        title: analysisResponse?.title || uploadedPortfolio.title,
        slug: analysisResponse?.slug || uploadedPortfolio.slug,
        status: analysisResponse?.status || "completed",
        analysisStatus: analysisResponse?.analysisStatus || "completed",
        analysis: analysisResponse?.analysis || null,
        generatedCode: {
          html: analysisResponse?.generatedCode?.html || "",
          css: analysisResponse?.generatedCode?.css || "",
          js: analysisResponse?.generatedCode?.js || "",
          generatedAt: generatedAtIso, 
        },
      };

  
      if (!analyzedPortfolio.generatedCode.html) {
        throw new Error("Portfolio website HTML was not generated.");
      }

     
      dispatch(setCurrentPortfolio(analyzedPortfolio));
      dispatch(addPortfolio(analyzedPortfolio));

    
      toast.success("Portfolio generated successfully!", {
        id: "portfolio-analysis",
      });

      console.log("Generated Portfolio:", analyzedPortfolio);

      setSelectedFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }

      
      navigate(`/portfolio/preview/${analyzedPortfolio.slug}`, {
        state: {
          portfolio: analyzedPortfolio,
        },
      });
    } catch (error) {
      console.error("Portfolio Generation Error:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Portfolio generation failed.";

      dispatch(setPortfolioError(message));
      dispatch(setPortfolioAnalysisError(message));

      toast.error(message, {
        id: "portfolio-analysis",
      });
    } finally {
      setUploading(false);
      setAnalyzing(false);
      dispatch(setPortfolioLoading(false));
      dispatch(setPortfolioAnalyzing(false));
    }
  };

  const isProcessing = uploading || analyzing;



  return (
    <div
      className={`w-full px-3 py-5 transition-colors duration-300 sm:px-5 sm:py-6 md:px-6 md:py-8 lg:px-8 lg:py-10 ${
        dark
          ? "bg-white/[0.03] text-white"
          : "bg-gray-50 text-black"
      }`}
    >
     
      <h3 className="mb-2 text-lg font-bold sm:text-xl md:text-2xl">
        Upload Resume PDF
      </h3>

      <p
        className={`mb-6 text-xs leading-5 sm:mb-8 sm:text-sm sm:leading-6 md:text-base ${
          dark ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Upload your resume PDF and our AI will generate a complete portfolio
        website with beautiful sections and responsive design.
      </p>

      
      <div
        onClick={() => !isProcessing && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          cursor-pointer rounded-2xl border-2 border-dashed
          p-6 text-center transition-all duration-300
          sm:rounded-3xl sm:p-10 md:p-12
          ${
            isDragging
              ? dark
                ? "scale-[1.01] border-white bg-white/10"
                : "scale-[1.01] border-black bg-black/5"
              : dark
                ? "border-white/20 hover:border-white/50"
                : "border-gray-300 hover:border-black"
          }
          ${isProcessing ? "cursor-not-allowed opacity-70" : ""}
        `}
      >
       
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full sm:mb-5 sm:h-16 sm:w-16 md:h-20 md:w-20 ${
            dark ? "bg-white text-black" : "bg-black text-white"
          }`}
        >
          {isProcessing ? (
            <FaSpinner size={22} className="animate-spin sm:size-[28px] md:size-[32px]" />
          ) : (
            <FaCloudUploadAlt size={22} className="sm:size-[28px] md:size-[35px]" />
          )}
        </div>

      
        <h4 className="text-base font-semibold sm:text-lg md:text-xl">
          {isDragging ? "Drop your resume here" : "Upload Resume PDF"}
        </h4>

     
        <p
          className={`mt-1.5 text-xs sm:mt-2 sm:text-sm ${
            dark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Click here or drag & drop your resume.
        </p>

      
        <div
          className={`mx-auto mt-5 flex w-fit items-center gap-2 rounded-xl px-3.5 py-2 text-[11px] sm:mt-7 sm:gap-3 sm:px-5 sm:py-2.5 sm:text-xs md:text-sm ${
            dark ? "bg-black text-white" : "border bg-white text-black"
          }`}
        >
          <FaFilePdf className="text-red-500" size={13} />
          <span>PDF Files Only</span>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={handleInputChange}
          disabled={isProcessing}
        />
      </div>

   
      {selectedFile && (
        <div
          className={`mt-4 flex items-center justify-between gap-2 rounded-xl border p-3 sm:mt-6 sm:rounded-2xl sm:p-4 ${
            dark
              ? "border-white/10 bg-white/[0.04]"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10 sm:h-12 sm:w-12 sm:rounded-xl">
              <FaFilePdf className="text-red-500" size={18} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-semibold sm:text-sm">
                {selectedFile.name}
              </p>

              <p
                className={`text-[10px] sm:text-xs ${
                  dark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>

          {!isProcessing && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                removeFile();
              }}
              className={`shrink-0 rounded-lg p-1.5 transition sm:p-2 ${
                dark
                  ? "text-gray-400 hover:bg-white/10 hover:text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-black"
              }`}
            >
              <FaTimes size={14} />
            </button>
          )}
        </div>
      )}

      
      {uploading && (
        <div
          className={`mt-4 flex items-start gap-3 rounded-xl border p-3 sm:mt-6 sm:rounded-2xl sm:p-4 ${
            dark
              ? "border-white/10 bg-white/[0.03]"
              : "border-gray-200 bg-white"
          }`}
        >
          <FaSpinner className="mt-0.5 shrink-0 animate-spin text-sm sm:text-base" />
          <div className="min-w-0">
            <p className="text-xs font-semibold sm:text-sm">
              Uploading resume...
            </p>
            <p
              className={`mt-0.5 text-[10px] sm:text-xs ${
                dark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Please wait while your resume is uploaded.
            </p>
          </div>
        </div>
      )}

      {analyzing && (
        <div
          className={`mt-4 flex items-start gap-3 rounded-xl border p-3 sm:mt-6 sm:rounded-2xl sm:p-4 ${
            dark
              ? "border-white/10 bg-white/[0.03]"
              : "border-gray-200 bg-white"
          }`}
        >
          <FaSpinner className="mt-0.5 shrink-0 animate-spin text-sm sm:text-base" />
          <div className="min-w-0">
            <p className="text-xs font-semibold sm:text-sm">
              AI is generating your portfolio...
            </p>
            <p
              className={`mt-0.5 text-[10px] sm:text-xs ${
                dark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Extracting information and creating your portfolio design.
            </p>
          </div>
        </div>
      )}

      
      {!isProcessing && selectedFile && (
        <div className="mt-3 flex items-center gap-2 text-[11px] text-green-500 sm:mt-4 sm:text-xs md:text-sm">
          <FaCheckCircle />
          <span>Resume ready to generate portfolio.</span>
        </div>
      )}

     
      <div className="mt-5 flex justify-end sm:mt-6 md:mt-8">
        <button
          type="button"
          onClick={handleGeneratePortfolio}
          disabled={!selectedFile || isProcessing}
          className={`
            flex w-full items-center justify-center gap-2 rounded-xl
            px-5 py-2.5 text-xs font-semibold transition-all
            sm:w-auto sm:gap-3 sm:px-6 sm:py-3 sm:text-sm md:px-8
            ${
              !selectedFile || isProcessing
                ? dark
                  ? "cursor-not-allowed bg-white/10 text-gray-500"
                  : "cursor-not-allowed bg-gray-200 text-gray-400"
                : dark
                  ? "bg-white text-black hover:bg-gray-200"
                  : "bg-black text-white hover:bg-gray-800"
            }
          `}
        >
          {isProcessing && <FaSpinner className="animate-spin" />}
          {uploading
            ? "Uploading..."
            : analyzing
              ? "Generating..."
              : "Generate Portfolio"}
        </button>
      </div>
    </div>
  );
}