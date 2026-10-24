import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { UploadFile } from "../../Features/UploadFile";
import ChatAgent from "../../Features/ChatAgent";
import { getJobSearchStatus, searchJobs } from "../../Features/jobService";

import JobSearchScreen from "./JobSearchScreen";
import JobWorkspace from "./JobWorkspace";
import ConfirmModal from "./ConfirmModal";

export default function JobApply() {
  const user = useSelector((s) => s.user.userdata);


  const [showSearch, setShowSearch] = useState(true);
  const [searchPrompt, setSearchPrompt] = useState(
    "Find MERN Stack Developer jobs in Lahore, Pakistan"
  );
  const [jobLimit, setJobLimit] = useState(5);
  const [searching, setSearching] = useState(false);
  const [cooldownInfo, setCooldownInfo] = useState(null);

  
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [currentQuery, setCurrentQuery] = useState("");

  
  const [cvFile, setCvFile] = useState(null);
  const [cvName, setCvName] = useState("");
  const [cvUploading, setCvUploading] = useState(false);
  const [cvFileId, setCvFileId] = useState(null);
  const [cvFileContext, setCvFileContext] = useState("");
  const fileInputRef = useRef(null);


  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [activeTab, setActiveTab] = useState("edit");
  const [generatingEmail, setGeneratingEmail] = useState(false);

  
  const [applying, setApplying] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  
  const [notice, setNotice] = useState({ type: "", text: "" });

  useEffect(() => {
    if (showConfirm) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [showConfirm]);

  useEffect(() => {
    if (!showConfirm) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !applying) setShowConfirm(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showConfirm, applying]);

  useEffect(() => {
    if (!user?._id) return;
    (async () => {
      const res = await getJobSearchStatus();
      if (res?.success && !res.canSearch) {
        setCooldownInfo({
          timeRemaining: res.timeRemaining,
          nextAvailableAt: res.nextAvailableAt,
        });
        if (res.cachedJobs?.length) {
          setJobs(res.cachedJobs.map((j, i) => ({ ...j, id: j.id || i + 1 })));
          setSelectedJob(res.cachedJobs[0]);
          setShowSearch(false);
        }
      }
    })();
  }, [user?._id]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchPrompt.trim()) {
      setNotice({ type: "error", text: "Please enter a job search prompt." });
      return;
    }

    setSearching(true);
    setNotice({ type: "", text: "" });

    try {
      const res = await searchJobs({
        query: searchPrompt.trim(),
        city: "",
        country: "Pakistan",
      });

      if (res?.cooldown) {
        setCooldownInfo({
          timeRemaining: res.timeRemaining,
          nextAvailableAt: res.nextAvailableAt,
        });
        if (res.cachedResults?.length) {
          setJobs(res.cachedResults);
          setSelectedJob(res.cachedResults[0]);
          setShowSearch(false);
        }
        setNotice({ type: "warning", text: res.message });
        return;
      }

      if (!res?.success || !res.jobs?.length) {
        setNotice({
          type: "error",
          text: res?.message || "No fresh jobs found. Try different keywords.",
        });
        return;
      }

      const normalized = res.jobs.slice(0, jobLimit).map((j, i) => ({
        ...j,
        id: j.url || i + 1,
        status: "Draft ready",
      }));

      setJobs(normalized);
      setCurrentQuery(res.query || searchPrompt);
      setSelectedJob(normalized[0]);
      generateEmailForJob(normalized[0]);
      setShowSearch(false);
      setNotice({
        type: "success",
        text: res.message || `Found ${normalized.length} fresh jobs.`,
      });
    } catch (err) {
      setNotice({
        type: "error",
        text: err?.response?.data?.message || "Search failed. Try again.",
      });
    } finally {
      setSearching(false);
    }
  };

  const generateEmailForJob = async (job) => {
    if (!job || !user?._id) return;

    setGeneratingEmail(true);
    setSubject(`Application for ${job.title} position`);
    setBody("");

    try {
      const prompt = `Write a professional, concise job application email.

Job Title: ${job.title}
Company: ${job.company || "the company"}
Location: ${job.location || "Pakistan"}
${job.description ? `Job Description: ${job.description.slice(0, 500)}` : ""}

Requirements:
- Professional greeting
- 3-4 short paragraphs
- Mention MERN stack, React, Node.js, Next.js, MongoDB, GenAI experience
- Express interest and enthusiasm
- Professional closing with "Best regards, ${user.name || "Applicant"}"
- Return ONLY the email body (no subject, no markdown, no labels)`;

      const res = await ChatAgent({
        prompt,
        conversationId: `job-apply-${Date.now()}`,
        agent: "chat",
        userId: user._id,
      });

      const text = String(res?.response || "").trim();
      if (text) setBody(text);
      else setBody("Dear Hiring Manager,\n\nI am writing to apply for this position...");
    } catch {
      setBody(`Dear Hiring Manager,

I am writing to express my strong interest in the ${job.title} position at ${job.company || "your company"}.

With hands-on experience in MongoDB, Express.js, React.js, Node.js, Next.js and Generative AI technologies, I have built scalable web applications and AI-powered solutions. I am confident I can contribute meaningfully to your team.

I would welcome the opportunity to discuss how my skills align with your requirements. Please find my CV attached.

Thank you for your time and consideration.

Best regards,
${user.name || "Applicant"}`);
    } finally {
      setGeneratingEmail(false);
    }
  };

  const selectJob = (job, isUpdateOnly = false) => {
    setSelectedJob(job);
    if (!isUpdateOnly) {
      generateEmailForJob(job);
      setActiveTab("edit");
      setNotice({ type: "", text: "" });
    }
  };

  const handleCvChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setNotice({ type: "error", text: "Please select a PDF file." });
      e.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setNotice({ type: "error", text: "CV must be under 10MB." });
      return;
    }

    setCvFile(file);
    setCvName(file.name);
    setCvUploading(true);
    setNotice({ type: "", text: "" });

    try {
      const res = await UploadFile(file, user._id);
      if (res?.success && res.file) {
        setCvFileId(res.file.fileId);
        setCvFileContext(res.file.fullText || "");
        setNotice({
          type: "success",
          text: "CV uploaded & parsed successfully.",
        });
      } else {
        throw new Error(res?.message || "Upload failed");
      }
    } catch (err) {
      setNotice({
        type: "error",
        text: err?.response?.data?.message || "CV upload failed. Try again.",
      });
      setCvFile(null);
      setCvName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setCvUploading(false);
    }
  };

  const applyToJob = async () => {
    if (!selectedJob || !cvFileId) {
      setNotice({ type: "error", text: "Please upload your CV first." });
      return;
    }
    if (!body.trim()) {
      setNotice({ type: "error", text: "Email body is empty." });
      return;
    }

    setApplying(true);
    setNotice({ type: "", text: "" });

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/agent/jobs/apply`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user._id,
          },
          body: JSON.stringify({
            job: {
              title: selectedJob.title,
              company: selectedJob.company,
              location: selectedJob.location,
              url: selectedJob.url,
              email: selectedJob.email || null,
            },
            to: selectedJob.email || null,
            subject,
            body,
            cvFileId,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Application failed");
      }

      setAppliedJobs((prev) => ({
        ...prev,
        [selectedJob.id]: {
          status: "sent",
          sentAt: new Date().toISOString(),
          messageId: data.messageId,
        },
      }));
      setJobs((prev) =>
        prev.map((j) =>
          j.id === selectedJob.id ? { ...j, status: "Applied ✓" } : j
        )
      );
      setSelectedJob((s) => ({ ...s, status: "Applied ✓" }));
      setNotice({
        type: "success",
        text: `Application sent to ${selectedJob.company || "employer"}!`,
      });
    } catch (err) {
      setNotice({
        type: "error",
        text: err.message || "Failed to send. Please try again.",
      });
    } finally {
      setApplying(false);
      setShowConfirm(false);
    }
  };

  const openJobLink = (url) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  if (showSearch) {
    return (
      <JobSearchScreen
        searchPrompt={searchPrompt}
        setSearchPrompt={setSearchPrompt}
        jobLimit={jobLimit}
        setJobLimit={setJobLimit}
        searching={searching}
        onSearch={handleSearch}
        cooldownInfo={cooldownInfo}
        notice={notice}
        hasCachedJobs={jobs.length > 0}
        onBackToResults={() => {
          setShowSearch(false);
          setNotice({ type: "", text: "" });
        }}
      />
    );
  }

  return (
    <>
      <JobWorkspace
        user={user}
        jobs={jobs}
        selectedJob={selectedJob}
        currentQuery={currentQuery}
        onSelectJob={selectJob}
        cvName={cvName}
        cvUploading={cvUploading}
        cvFileId={cvFileId}
        fileInputRef={fileInputRef}
        onCvChange={handleCvChange}
        subject={subject}
        setSubject={setSubject}
        body={body}
        setBody={setBody}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        generatingEmail={generatingEmail}
        onRegenerateEmail={() => generateEmailForJob(selectedJob)}
        applying={applying}
        appliedJobs={appliedJobs}
        onOpenConfirm={() => setShowConfirm(true)}
        onNewSearch={() => {
          setShowSearch(true);
          setNotice({ type: "", text: "" });
        }}
        notice={notice}
        setNotice={setNotice}
        onOpenJobLink={openJobLink}
      />

      <ConfirmModal
        show={showConfirm}
        applying={applying}
        selectedJob={selectedJob}
        cvName={cvName}
        user={user}
        onClose={() => setShowConfirm(false)}
        onConfirm={applyToJob}
      />
    </>
  );
}