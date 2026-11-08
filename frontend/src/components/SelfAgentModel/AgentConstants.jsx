import {
  FiCpu,
  FiCode,
  FiEdit3,
  FiFileText,
  FiMic,
  FiSearch,
  FiZap,
  FiStar,
  FiImage,
  FiMessageSquare,
  FiLayers,
  FiBriefcase,
  FiTrendingUp,
  FiAward,
  FiFile,
} from "react-icons/fi";

export const AGENT_CATEGORIES = [
  { id: "general", label: "General", Icon: FiCpu },
  { id: "coding", label: "Coding", Icon: FiCode },
  { id: "writing", label: "Writing", Icon: FiEdit3 },
  { id: "resume", label: "Resume / CV", Icon: FiFileText },
  { id: "interview", label: "Interview Prep", Icon: FiMic },
  { id: "research", label: "Research", Icon: FiSearch },
  { id: "productivity", label: "Productivity", Icon: FiZap },
  { id: "custom", label: "Custom", Icon: FiStar },
];

export const AGENT_MODELS = [
  { id: "openai/gpt-oss-20b", label: "GPT-OSS 20B", provider: "Groq", badge: "Default", desc: "Fastest · 1000 t/s" },
  { id: "openai/gpt-oss-120b", label: "GPT-OSS 120B", provider: "Groq", desc: "Deep reasoning · 500 t/s" },
  { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B", provider: "Groq", desc: "Balanced · 280 t/s" },
  { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B", provider: "Groq", desc: "Instant · 560 t/s" },
  { id: "gemini-1.5-flash", label: "Gemini 1.5 Flash", provider: "Google", desc: "Light coding" },
  { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro", provider: "Google", desc: "Advanced reasoning" },
];

export const AGENT_TOOLS = [
  { id: "chat", label: "Chat", description: "General conversation & answers", Icon: FiMessageSquare },
  { id: "search", label: "Web Search", description: "Real-time internet search", Icon: FiSearch },
  { id: "coding", label: "Coding", description: "Generate & debug code", Icon: FiCode },
  { id: "pdf", label: "PDF", description: "Create & download PDF docs", Icon: FiFileText },
  { id: "ppt", label: "PPT", description: "Generate PowerPoint slides", Icon: FiLayers },
  { id: "image", label: "Image", description: "Generate images from text", Icon: FiImage },
  { id: "file", label: "File Analysis", description: "Analyze uploaded files", Icon: FiFile },
  { id: "rag", label: "Doc Q&A", description: "Ask about your documents", Icon: FiSearch },
];

export const PROMPT_TEMPLATES = [
  { id: "resume-reviewer", label: "Resume Reviewer", description: "Reviews resumes like a senior recruiter.", systemPrompt: "You are a senior technical recruiter with 15 years of experience. Review resumes critically, highlight strengths, weaknesses, ATS issues, and give concrete rewrite suggestions." },
  { id: "code-reviewer", label: "Code Reviewer", description: "Reviews code for bugs, style, and performance.", systemPrompt: "You are a strict but fair senior software engineer. Review code for bugs, edge cases, readability, and performance. Suggest concrete improvements with examples." },
  { id: "interview-coach", label: "Interview Coach", description: "Conducts mock interviews and gives feedback.", systemPrompt: "You are an interview coach. Ask one behavioural or technical question at a time, wait for the answer, then give honest, actionable feedback and a score out of 10." },
  { id: "portfolio-writer", label: "Portfolio Writer", description: "Writes portfolio copy for developers.", systemPrompt: "You are a senior copywriter specialising in developer portfolios. Write concise, modern, benefit-driven portfolio copy with strong verbs and no fluff." },
];

export const FREE_MODELS = [
  { id: "free-chat", label: "Free Chat", description: "Unlimited chat with our base AI", Icon: FiMessageSquare, path: "/" },
  { id: "search", label: "Web Search", description: "Real-time web search agent", Icon: FiSearch, path: "/" },
  { id: "image", label: "Image Generation", description: "Generate images from text", Icon: FiImage, path: "/" },
  { id: "coding", label: "Coding", description: "Debug, build & explain code", Icon: FiCode, path: "/" },
  { id: "pdf", label: "PDF Chat", description: "Chat with your PDFs", Icon: FiFileText, path: "/" },
  { id: "ppt", label: "PPT Generator", description: "Auto-generate slide decks", Icon: FiLayers, path: "/" },
  { id: "pdf-analysis", label: "PDF Analysis", description: "Summarise & analyse documents", Icon: FiTrendingUp, path: "/" },
];

export const PAID_MODELS = [
  { id: "resume", label: "Resume Builder", description: "AI-crafted ATS resumes", Icon: FiFileText, path: "/resume", badge: "Pro" },
  { id: "resume-analysis", label: "Resume Analysis", description: "Get a full ATS report", Icon: FiAward, path: "/resume-analysis", badge: "Pro" },
  { id: "cv-generator", label: "CV Generator", description: "Long-form CV in one click", Icon: FiEdit3, path: "/cv-generator", badge: "Pro" },
  { id: "portfolio", label: "CV → Portfolio", description: "Turn your CV into a website", Icon: FiBriefcase, path: "/portfolio", badge: "Pro" },
  { id: "mock-interview-paid", label: "CV → Mock Interview", description: "Interview based on your CV", Icon: FiMic, path: "/mock-interview", badge: "Pro" },
];

export const defaultForm = {
  name: "",
  description: "",
  systemPrompt: "",
  category: "general",
  model: "openai/gpt-oss-20b",
  temperature: 0.7,
  tools: ["chat"],
};