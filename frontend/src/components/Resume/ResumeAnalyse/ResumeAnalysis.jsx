
import React, { useState, useEffect } from "react";
import {
  FaArrowRight,
  FaCheckCircle,
  FaChartLine,
  FaCode,
  FaRocket,
  FaSearch,
  FaLightbulb,
  FaBriefcase,
  FaGraduationCap,
  FaStar,
  FaExclamationTriangle,
  FaSpinner,
  FaExternalLinkAlt,
  FaFilePdf,
  FaChevronDown,
  FaChevronUp,
  FaTimesCircle,
  FaAward,
  FaBrain,
  FaDatabase,
  FaCloud,
  FaCog,
} from "react-icons/fa";
import { useTheme } from "../../../BgContext/ThemeContext";
import { getMyResumes } from "../../../Features/ResumeAnalysis";
import ResumeAnalysisOverview from "./ResumeAnalysisOverview";
import ResumeAnalysisJobs from "./ResumeAnalysisJobs";
import ResumeHeader from "../ResumeHeader";
import ResumeFooter from "../ResumeFooter";

export default function ResumeAnalysis() {
  const { dark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [resumeUrl, setResumeUrl] = useState("");
  const [showAllJobs, setShowAllJobs] = useState(false);

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const response = await getMyResumes();
      
      if (response.success && response.data && response.data.length > 0) {
        const sortedResumes = [...response.data].sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA;
        });
        
        const latest = sortedResumes[0];
        setData(latest);
        setJobs(latest.jobs || []);
        if (latest.resume && latest.resume.fileUrl) {
          setResumeUrl(latest.resume.fileUrl);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };


  const processRoadmap = (roadmapData) => {
    if (!roadmapData || !Array.isArray(roadmapData)) return [];
    return roadmapData.map((item, index) => {
      if (typeof item === 'string') {
        return {
          number: String(index + 1).padStart(2, '0'),
          title: item,
          text: '',
          completed: index === 0
        };
      }
      if (item && typeof item === 'object') {
        return {
          number: item.number || String(index + 1).padStart(2, '0'),
          title: item.title || item._id || `Step ${index + 1}`,
          text: item.text || '',
          completed: item.completed || index === 0
        };
      }
      return {
        number: String(index + 1).padStart(2, '0'),
        title: String(item),
        text: '',
        completed: index === 0
      };
    });
  };

  const processSkills = (skillsData) => {
    if (!skillsData || !Array.isArray(skillsData)) return [];
    return skillsData.map(item => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') {
        return item.title || item.name || String(item);
      }
      return String(item);
    });
  };

  const processMissingKeywords = (keywordsData) => {
    if (!keywordsData || !Array.isArray(keywordsData)) return [];
    return keywordsData.map(item => typeof item === 'string' ? item : String(item));
  };

  const analysis = {
    score: data?.resumeScore || 0,
    atsScore: data?.atsScore || 0,
   
    strengths: processSkills(data?.strengths),
    weaknesses: processSkills(data?.improvements),
    skillsToImprove: processSkills(data?.skillsToImprove),
    roadmap: processRoadmap(data?.roadmap),
    nextLearning: data?.nextLearning || [],
    missingKeywords: processMissingKeywords(data?.missingKeywords),
    recommendedRoles: data?.recommendedRoles || [],
    sectionScores: data?.sectionScores || {},
    summary: data?.summary || "Your resume analysis is ready.",
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${dark ? "bg-black" : "bg-white"}`}>
        <div className="text-center">
          <FaSpinner className={`text-4xl animate-spin mx-auto ${dark ? "text-white" : "text-black"}`} />
          <p className={`mt-4 ${dark ? "text-gray-400" : "text-gray-500"}`}>Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`min-h-screen px-4 py-8 ${dark ? "bg-black text-white" : "bg-white text-gray-900"}`}>
        <div className="max-w-4xl mx-auto text-center mt-20">
          <FaRocket className="text-6xl mx-auto text-gray-400 mb-6" />
          <h2 className="text-2xl font-bold mb-4">No Resume Found</h2>
          <p className="text-gray-500 mb-6">Upload your resume to get AI-powered analysis.</p>
          <button 
            onClick={() => window.location.href = '/resume'}
            className={`px-6 py-3 rounded-xl font-semibold transition hover:scale-105 ${
              dark ? "bg-white text-black" : "bg-black text-white"
            }`}
          >
            Upload Resume
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <ResumeHeader/>
    <div className={`min-h-screen px-4 py-8 transition-colors duration-300 sm:px-6 lg:px-10 ${
      dark ? "bg-black text-white" : "bg-white text-gray-900"
    }`}>
      <div className="mx-auto max-w-7xl">
       
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                dark ? "bg-white text-black" : "bg-black text-white"
              }`}>
                <FaRocket />
              </div>
              <div>
                <h1 className="text-xl font-bold sm:text-2xl">Resume Analysis</h1>
                <p className={`mt-1 text-xs sm:text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
                  AI-powered insights to improve your career profile
                </p>
              </div>
            </div>
          </div>
        </div>

        {}
        <ResumeAnalysisOverview 
          analysis={analysis} 
          dark={dark} 
        />

        {}
        <ResumeAnalysisJobs 
          jobs={jobs}
          dark={dark}
          initialShowCount={4}
        />

        {}
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-dashed border-gray-200 p-4 dark:border-white/10">
          <FaStar className="mt-0.5 text-gray-400" />
          <p className="text-xs leading-5 text-gray-500">
            This analysis is generated using AI based on your resume. Your score, recommended skills, 
            roadmap, and job matches will become more accurate as we connect your resume data with the AI analysis engine.
          </p>
        </div>
      </div>
  
    </div>
     <ResumeFooter/>
    </>
  );
}