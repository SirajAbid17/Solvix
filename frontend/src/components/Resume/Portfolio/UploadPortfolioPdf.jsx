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

  // ============================================================
  // Generate Portfolio
  // ============================================================

  const handleGeneratePortfolio = async () => {
    if (!selectedFile) {
      toast.error("Please upload your resume PDF first.");
      return;
    }

    let portfolioId = null;

    try {
      // ========================================================
      // 1. START UPLOAD
      // ========================================================

      setUploading(true);

      dispatch(setPortfolioLoading(true));
      dispatch(setPortfolioError(null));
      dispatch(setPortfolioAnalysisError(null));

      // ========================================================
      // 2. CREATE FORM DATA
      // ========================================================

      const formData = new FormData();

      formData.append("pdf", selectedFile);

      console.log(
        "Uploading Portfolio PDF:",
        selectedFile.name
      );

      
      
      

      const uploadResponse = await uploadPortfolio(formData);

      console.log(
        "Portfolio Upload Response:",
        uploadResponse
      );

      
      
      

      if (!uploadResponse?.success) {
        throw new Error(
          uploadResponse?.message ||
            "Portfolio upload failed."
        );
      }

      
      
      

      portfolioId =
        uploadResponse?.portfolioId ||
        uploadResponse?.portfolio?._id ||
        uploadResponse?.data?.portfolioId ||
        uploadResponse?.data?._id;

      if (!portfolioId) {
        console.error(
          "Invalid upload response:",
          uploadResponse
        );

        throw new Error(
          "Portfolio ID was not returned by the server."
        );
      }

      console.log("Portfolio ID:", portfolioId);

      
      
      

      const uploadedPortfolio = {
        _id: portfolioId,

        id: portfolioId,

        title:
          uploadResponse?.title ||
          selectedFile.name.replace(/\.pdf$/i, ""),

        slug: uploadResponse?.slug || "",

        status:
          uploadResponse?.status ||
          "uploaded",

        analysisStatus:
          uploadResponse?.analysisStatus ||
          "pending",

        extractedCharacters:
          uploadResponse?.extractedCharacters || 0,

        totalPages:
          uploadResponse?.totalPages || 0,

        analysis: null,

        generatedCode: {
          html: "",
          css: "",
          js: "",
        },
      };

      // ========================================================
      // 5. STORE UPLOADED PORTFOLIO
      // ========================================================

      dispatch(
        addPortfolio(uploadedPortfolio)
      );

      dispatch(
        setCurrentPortfolio(uploadedPortfolio)
      );

      toast.success(
        "Resume uploaded successfully!"
      );

      // ========================================================
      // 6. STOP UPLOAD LOADING
      // ========================================================

      setUploading(false);

      dispatch(
        setPortfolioLoading(false)
      );

      // ========================================================
      // 7. START ANALYSIS
      // ========================================================

      setAnalyzing(true);

      dispatch(
        setPortfolioAnalyzing(true)
      );

      dispatch(
        setPortfolioAnalysisError(null)
      );

      toast.loading(
        "AI is generating your portfolio...",
        {
          id: "portfolio-analysis",
        }
      );

      
      
      

      console.log(
        "Analyzing Portfolio:",
        portfolioId
      );

      const analysisResponse =
        await analyzePortfolio(portfolioId);

      console.log(
        "Portfolio Analysis Response:",
        analysisResponse
      );

      
      
      

      if (!analysisResponse?.success) {
        throw new Error(
          analysisResponse?.message ||
            "Portfolio analysis failed."
        );
      }

      
      
      

      const analyzedPortfolio = {
        _id:
          analysisResponse?.portfolioId ||
          portfolioId,

        id:
          analysisResponse?.portfolioId ||
          portfolioId,

        title:
          analysisResponse?.title ||
          uploadedPortfolio.title,

        slug:
          analysisResponse?.slug ||
          uploadedPortfolio.slug,

        status:
          analysisResponse?.status ||
          "completed",

        analysisStatus:
          analysisResponse?.analysisStatus ||
          "completed",

        analysis:
          analysisResponse?.analysis ||
          null,

        generatedCode: {
          html:
            analysisResponse?.generatedCode?.html ||
            "",

          css:
            analysisResponse?.generatedCode?.css ||
            "",

          js:
            analysisResponse?.generatedCode?.js ||
            "",

          generatedAt:
            analysisResponse?.generatedCode?.generatedAt ||
            new Date(),
        },
      };

      // ========================================================
      // 10. VALIDATE GENERATED WEBSITE
      // ========================================================

      if (
        !analyzedPortfolio.generatedCode.html
      ) {
        throw new Error(
          "Portfolio website HTML was not generated."
        );
      }

      // ========================================================
      // 11. UPDATE CURRENT PORTFOLIO
      // ========================================================

      dispatch(
        setCurrentPortfolio(
          analyzedPortfolio
        )
      );

      // ========================================================
      // 12. UPDATE PORTFOLIO LIST
      // ========================================================

      dispatch(
        addPortfolio(
          analyzedPortfolio
        )
      );

      // ========================================================
      // 13. SUCCESS
      // ========================================================

      toast.success(
        "Portfolio generated successfully!",
        {
          id: "portfolio-analysis",
        }
      );

      console.log(
        "Generated Portfolio:",
        analyzedPortfolio
      );

      
      
      

      setSelectedFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      // ========================================================
      // 15. REDIRECT TO WEBSITE PREVIEW
      // ========================================================

      navigate(
        `/portfolio/preview/${analyzedPortfolio.slug}`,
        {
          state: {
            portfolio: analyzedPortfolio,
          },
        }
      );

    } catch (error) {
      console.error(
        "Portfolio Generation Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Portfolio generation failed.";

      dispatch(
        setPortfolioError(message)
      );

      dispatch(
        setPortfolioAnalysisError(message)
      );

      toast.error(message, {
        id: "portfolio-analysis",
      });

    } finally {
      setUploading(false);
      setAnalyzing(false);

      dispatch(
        setPortfolioLoading(false)
      );

      dispatch(
        setPortfolioAnalyzing(false)
      );
    }
  };

  
  
  

  const isProcessing =
    uploading || analyzing;

  
  
  

  return (
    <div
      className={` p-8 ${
        dark
          ? "border-white/10 bg-white/[0.03]"
          : "border-gray-200 bg-gray-50"
      }`}
    >
      {}

      <h3
        className={`mb-2 text-2xl font-bold ${
          dark ? "text-white" : "text-black"
        }`}
      >
        Upload Resume PDF
      </h3>

      <p
        className={`mb-8 ${
          dark
            ? "text-gray-400"
            : "text-gray-600"
        }`}
      >
        Upload your resume PDF and our AI will
        generate a complete portfolio website
        with beautiful sections and responsive
        design.
      </p>

      {}

      <div
        onClick={() =>
          !isProcessing &&
          inputRef.current?.click()
        }
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          cursor-pointer rounded-3xl
          border-2 border-dashed
          p-12 text-center
          transition-all duration-300

          ${
            isDragging
              ? dark
                ? "scale-[1.01] border-white bg-white/10"
                : "scale-[1.01] border-black bg-black/5"
              : dark
              ? "border-white/20 hover:border-white/50"
              : "border-gray-300 hover:border-black"
          }

          ${
            isProcessing
              ? "cursor-not-allowed opacity-70"
              : ""
          }
        `}
      >
        {}

        <div
          className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full ${
            dark
              ? "bg-white text-black"
              : "bg-black text-white"
          }`}
        >
          {isProcessing ? (
            <FaSpinner
              size={32}
              className="animate-spin"
            />
          ) : (
            <FaCloudUploadAlt
              size={35}
            />
          )}
        </div>

        {}

        <h4
          className={`text-xl font-semibold ${
            dark
              ? "text-white"
              : "text-black"
          }`}
        >
          {isDragging
            ? "Drop your resume here"
            : "Upload Resume PDF"}
        </h4>

        {}

        <p
          className={`mt-2 ${
            dark
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        >
          Click here or drag & drop your resume.
        </p>

        {}

        <div
          className={`mx-auto mt-8 flex w-fit items-center gap-3 rounded-xl px-5 py-3 ${
            dark
              ? "bg-black text-white"
              : "border bg-white text-black"
          }`}
        >
          <FaFilePdf className="text-red-500" />

          <span>
            PDF Files Only
          </span>
        </div>

        {}

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={handleInputChange}
          disabled={isProcessing}
        />
      </div>

      {}

      {selectedFile && (
        <div
          className={`mt-6 flex items-center justify-between rounded-2xl border p-4 ${
            dark
              ? "border-white/10 bg-white/[0.04]"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
              <FaFilePdf
                className="text-red-500"
                size={22}
              />
            </div>

            <div>
              <p
                className={`font-semibold ${
                  dark
                    ? "text-white"
                    : "text-black"
                }`}
              >
                {selectedFile.name}
              </p>

              <p
                className={`text-sm ${
                  dark
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                {(
                  selectedFile.size /
                  (1024 * 1024)
                ).toFixed(2)}{" "}
                MB
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
              className={`rounded-lg p-2 transition ${
                dark
                  ? "text-gray-400 hover:bg-white/10 hover:text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-black"
              }`}
            >
              <FaTimes />
            </button>
          )}
        </div>
      )}

      {}

      {uploading && (
        <div
          className={`mt-6 rounded-2xl border p-4 ${
            dark
              ? "border-white/10 bg-white/[0.03]"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <FaSpinner
              className="animate-spin"
            />

            <div>
              <p
                className={`font-semibold ${
                  dark
                    ? "text-white"
                    : "text-black"
                }`}
              >
                Uploading resume...
              </p>

              <p
                className={`text-sm ${
                  dark
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                Please wait while your resume
                is uploaded.
              </p>
            </div>
          </div>
        </div>
      )}

      {}

      {analyzing && (
        <div
          className={`mt-6 rounded-2xl border p-4 ${
            dark
              ? "border-white/10 bg-white/[0.03]"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <FaSpinner
              className="animate-spin"
            />

            <div>
              <p
                className={`font-semibold ${
                  dark
                    ? "text-white"
                    : "text-black"
                }`}
              >
                AI is generating your portfolio...
              </p>

              <p
                className={`text-sm ${
                  dark
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                Extracting information and
                creating your portfolio design.
              </p>
            </div>
          </div>
        </div>
      )}

      {}

      {!isProcessing &&
        selectedFile && (
          <div className="mt-4 flex items-center gap-2 text-sm text-green-500">
            <FaCheckCircle />

            <span>
              Resume ready to generate portfolio.
            </span>
          </div>
        )}

      {}

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleGeneratePortfolio}
          disabled={
            !selectedFile ||
            isProcessing
          }
          className={`
            flex items-center gap-3
            rounded-xl px-8 py-3
            font-semibold
            transition-all

            ${
              !selectedFile ||
              isProcessing
                ? dark
                  ? "cursor-not-allowed bg-white/10 text-gray-500"
                  : "cursor-not-allowed bg-gray-200 text-gray-400"
                : dark
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-black text-white hover:bg-gray-800"
            }
          `}
        >
          {isProcessing && (
            <FaSpinner
              className="animate-spin"
            />
          )}

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