import React, { useEffect, useMemo, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../utlis/axios";
import { setuserData } from "../../redux/userSlice";
import { clearConversations } from "../../redux/conversationSlice";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import toast from "react-hot-toast";

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
  FiMap,
  FiClock,
  FiChevronRight,
  FiChevronDown,
  FiChevronUp,
  FiExternalLink,
  FiCheckCircle,
  FiTrendingUp,
  FiAward,
  FiPlus,
  FiLogOut,
} from "react-icons/fi";
import { useTheme } from "../../BgContext/ThemeContext";

import {
  createCustomAgent,
  getCustomAgents,
  updateCustomAgent,
  deleteCustomAgent,
  chatWithCustomAgent,
  getCustomAgentChatHistory,
} from "../../Features/agentBuilderAPI";


import {
  AGENT_CATEGORIES,
  AGENT_MODELS,
  FREE_MODELS,
  PAID_MODELS,
  defaultForm,
  CustomDropdown,
  ConfirmModal,
  LoadingState,
  Benefit,
  CategoryChip,
  AgentCard,
  EmptyState,
  Tab,
  ModelRow,
  AgentFormModal,
} from "./AgentComponents";


import AgentChatDrawer from "./AgentChat";

export default function AgentModel() {
  const { dark } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const container = useRef(null);
  const animatedOnce = useRef(false);

  const { userdata } = useSelector((s) => s.user);

  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [chatAgent, setChatAgent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const [activeTab, setActiveTab] = useState("free");
  const [showAll, setShowAll] = useState(false);
  const VISIBLE_COUNT = 2;

  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    agentId: null,
    agentName: "",
    deleting: false,
  });

  const loadAgents = async () => {
    setLoadingAgents(true);
    try {
      const res = await getCustomAgents({ limit: 100 });
      if (res?.success && Array.isArray(res.agents)) {
        setAgents(res.agents);
      } else {
        setAgents([]);
      }
    } catch {
      toast.error("Failed to load agents", {
        style: {
          background: dark ? "#1a1a1a" : "#fff",
          color: dark ? "#fff" : "#000",
          border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
        },
      });
      setAgents([]);
    } finally {
      setLoadingAgents(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const filteredAgents = useMemo(() => {
    return agents.filter((a) => {
      const matchesCategory = activeCategory === "all" || a.category === activeCategory;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q || a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [agents, activeCategory, search]);

  const visibleAgents = showAll ? filteredAgents : filteredAgents.slice(0, VISIBLE_COUNT);
  const hasMore = filteredAgents.length > VISIBLE_COUNT;

  useGSAP(
    () => {
      if (animatedOnce.current) return;
      animatedOnce.current = true;

      const tl = gsap.timeline();

      gsap.set(".sa-header", { opacity: 0, y: -20 });
      gsap.set(".sa-badge", { opacity: 0, y: 15 });
      gsap.set(".sa-title", { opacity: 0, y: 25 });
      gsap.set(".sa-desc", { opacity: 0, y: 20 });
      gsap.set(".sa-benefit", { opacity: 0, x: -20 });
      gsap.set(".sa-cta", { opacity: 0, y: 15 });
      gsap.set(".sa-sidebar", { opacity: 0, x: 30 });
      gsap.set(".sa-model-row", { opacity: 0, x: 15 });
      gsap.set(".sa-builder", { opacity: 0, y: 30 });
      gsap.set(".sa-card", { opacity: 0, y: 25, scale: 0.97 });
      gsap.set(".sa-footer", { opacity: 0, y: 10 });

      tl.to(".sa-header", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
        .to(".sa-badge", { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.35")
        .to(".sa-title", { opacity: 1, y: 0, duration: 0.7, ease: "power4.out" }, "-=0.3")
        .to(".sa-desc", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
        .to(".sa-benefit", { opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" }, "-=0.3")
        .to(".sa-cta", { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.2")
        .to(".sa-builder", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.2")
        .to(".sa-card", { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" }, "-=0.3")
        .to(".sa-sidebar", { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }, "-=0.6")
        .to(".sa-model-row", { opacity: 1, x: 0, duration: 0.4, stagger: 0.04, ease: "power2.out" }, "-=0.3")
        .to(".sa-footer", { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.2");
    },
    { scope: container }
  );

  const openCreate = () => {
    setEditingAgent(null);
    setForm(defaultForm);
    setErrors({});
    setIsFormOpen(true);
  };

  const openEdit = (agent) => {
    setEditingAgent(agent);
    setForm({
      name: agent.name,
      description: agent.description,
      systemPrompt: agent.systemPrompt,
      category: agent.category,
      model: agent.model,
      temperature: agent.temperature,
    });
    setErrors({});
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingAgent(null);
    setForm(defaultForm);
    setErrors({});
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (form.name.length > 40) e.name = "Max 40 characters";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.systemPrompt.trim()) e.systemPrompt = "System prompt is required";
    if (form.systemPrompt.length < 20) e.systemPrompt = "Write at least 20 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error("Please fix the errors first", {
        style: { background: dark ? "#1a1a1a" : "#fff", color: dark ? "#fff" : "#000" },
      });
      return;
    }

    setSaving(true);
    const toastId = toast.loading(editingAgent ? "Updating agent..." : "Creating agent...", {
      style: {
        background: dark ? "#1a1a1a" : "#fff",
        color: dark ? "#fff" : "#000",
        border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
      },
    });

    try {
      if (editingAgent) {
        const res = await updateCustomAgent(editingAgent._id, form);
        if (res?.success && res.agent) {
          setAgents((prev) => prev.map((a) => (a._id === editingAgent._id ? res.agent : a)));
          toast.success("Agent updated successfully", { id: toastId });
          closeForm();
        } else {
          toast.error(res?.message || "Failed to update agent", { id: toastId });
        }
      } else {
        const res = await createCustomAgent(form);
        if (res?.success && res.agent) {
          setAgents((prev) => [res.agent, ...prev]);
          toast.success("Agent created successfully", { id: toastId });
          closeForm();
        } else {
          if (res?.errors) {
            setErrors(res.errors);
            toast.error("Please fix validation errors", { id: toastId });
          } else {
            toast.error(res?.message || "Failed to create agent", { id: toastId });
          }
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    const agentToDelete = agents.find((a) => a._id === id);
    setDeleteConfirm({
      open: true,
      agentId: id,
      agentName: agentToDelete?.name || "this agent",
      deleting: false,
    });
  };

  const confirmDelete = async () => {
    const { agentId } = deleteConfirm;
    if (!agentId) return;

    setDeleteConfirm((prev) => ({ ...prev, deleting: true }));

    try {
      const res = await deleteCustomAgent(agentId);
      if (res?.success) {
        setAgents((prev) => prev.filter((a) => a._id !== agentId));
        toast.success("Agent deleted successfully", {
          style: { background: dark ? "#1a1a1a" : "#fff", color: dark ? "#fff" : "#000" },
        });
        setDeleteConfirm({ open: false, agentId: null, agentName: "", deleting: false });
      } else {
        toast.error(res?.message || "Failed to delete agent", {
          style: { background: dark ? "#1a1a1a" : "#fff", color: dark ? "#fff" : "#000" },
        });
        setDeleteConfirm((prev) => ({ ...prev, deleting: false }));
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete agent", {
        style: { background: dark ? "#1a1a1a" : "#fff", color: dark ? "#fff" : "#000" },
      });
      setDeleteConfirm((prev) => ({ ...prev, deleting: false }));
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ open: false, agentId: null, agentName: "", deleting: false });
  };

  const openChat = async (agent) => {
    setChatAgent(agent);

    const storageKey = `agent_conv_${agent._id}`;
    let storedConvId = localStorage.getItem(storageKey);

    if (!storedConvId) {
      storedConvId = `conv_${agent._id}_${Date.now()}`;
      localStorage.setItem(storageKey, storedConvId);
    }

    setConversationId(storedConvId);
    setChatInput("");

    const loadingId = toast.loading("Loading chat history...", {
      style: { background: dark ? "#1a1a1a" : "#fff", color: dark ? "#fff" : "#000" },
    });

    try {
      const res = await getCustomAgentChatHistory(agent._id, storedConvId);

      if (res?.success && Array.isArray(res.messages) && res.messages.length > 0) {
        setMessages(res.messages);
        toast.dismiss(loadingId);
      } else {
        setMessages([
          {
            role: "assistant",
            content: `Hi! I'm **${agent.name}**. ${agent.description} How can I help?`,
          },
        ]);
        toast.dismiss(loadingId);
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
      setMessages([
        {
          role: "assistant",
          content: `Hi! I'm **${agent.name}**. ${agent.description} How can I help?`,
        },
      ]);
      toast.dismiss(loadingId);
    }
  };

  const closeChat = () => {
    setChatAgent(null);
    setMessages([]);
    setChatInput("");
  };

  const sendMessage = async () => {
    if (!chatInput.trim() || chatLoading || !chatAgent) return;

    const userText = chatInput.trim();
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const history = messages.slice(1).map((m) => ({ role: m.role, content: m.content }));
      const res = await chatWithCustomAgent(chatAgent._id, userText, conversationId, history);

      if (res?.success && res.response) {
        setMessages((prev) => [...prev, { role: "assistant", content: res.response }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: res?.message || "Sorry, I couldn't generate a response. Please try again.",
          },
        ]);
        toast.error("Failed to get response", {
          style: { background: dark ? "#1a1a1a" : "#fff", color: dark ? "#fff" : "#000" },
        });
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `**Error:** ${err?.response?.data?.message || "Something went wrong."}`,
        },
      ]);
      toast.error("Chat failed", {
        style: { background: dark ? "#1a1a1a" : "#fff", color: dark ? "#fff" : "#000" },
      });
    } finally {
      setChatLoading(false);
    }
  };

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...", {
      style: { background: dark ? "#1a1a1a" : "#fff", color: dark ? "#fff" : "#000" },
    });
    try {
      await api.post("/auth/logout");
      dispatch(setuserData(null));
      dispatch(clearConversations());
      toast.success("Logged out successfully", { id: toastId });
      setTimeout(() => navigate("/"), 500);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout", { id: toastId });
    }
  };

  const textPrimary = dark ? "text-white" : "text-gray-900";
  const textSecondary = dark ? "text-gray-400" : "text-gray-500";

  const inputClass = `
    w-full rounded-xl border px-3.5 py-2.5 text-base sm:text-sm outline-none transition
    ${
      dark
        ? "bg-white/[0.03] border-white/10 text-white placeholder-gray-500 focus:border-white/30 focus:bg-white/[0.05]"
        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-2 focus:ring-black/5"
    }
  `;

  const labelClass = `text-xs font-medium mb-1.5 block ${textSecondary}`;

  return (
    <div
      ref={container}
      className={`relative min-h-screen w-full overflow-x-hidden ${
        dark ? "bg-[#030303] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <style>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .markdown-content { line-height: 1.7; }
        .markdown-content p { margin: 0.5rem 0; }
        .markdown-content p:first-child { margin-top: 0; }
        .markdown-content p:last-child { margin-bottom: 0; }
        .markdown-content h1, .markdown-content h2,
        .markdown-content h3, .markdown-content h4 {
          font-weight: 700;
          margin: 1rem 0 0.5rem;
          line-height: 1.3;
        }
        .markdown-content h1 { font-size: 1.35rem; }
        .markdown-content h2 { font-size: 1.2rem; }
        .markdown-content h3 { font-size: 1.05rem; }
        .markdown-content h4 { font-size: 0.95rem; }
        .markdown-content ul, .markdown-content ol {
          padding-left: 1.25rem;
          margin: 0.5rem 0;
        }
        .markdown-content ul { list-style-type: disc; }
        .markdown-content ol { list-style-type: decimal; }
        .markdown-content li { margin: 0.25rem 0; }
        .markdown-content strong { font-weight: 700; }
        .markdown-content em { font-style: italic; }
        .markdown-content code {
          font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
          font-size: 0.85em;
          padding: 0.15em 0.4em;
          border-radius: 4px;
        }
        .markdown-content pre {
          margin: 0.75rem 0;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          overflow-x: auto;
          font-size: 0.85em;
          line-height: 1.6;
        }
        .markdown-content pre code { padding: 0; background: transparent !important; }
        .markdown-content blockquote {
          border-left: 3px solid;
          padding-left: 0.75rem;
          margin: 0.75rem 0;
          font-style: italic;
        }
        .markdown-content table {
          border-collapse: collapse;
          margin: 0.75rem 0;
          font-size: 0.85em;
          width: 100%;
        }
        .markdown-content th, .markdown-content td {
          border: 1px solid;
          padding: 0.4rem 0.6rem;
          text-align: left;
        }
        .markdown-content th { font-weight: 700; }
        .markdown-content a { text-decoration: underline; text-underline-offset: 2px; }
        .markdown-content hr { margin: 1rem 0; border: none; border-top: 1px solid; }
      `}</style>

      <div
        className={`pointer-events-none absolute inset-0 ${
          dark
            ? "bg-[radial-gradient(circle_at_20%_0%,rgba(120,80,255,0.14),transparent_45%),radial-gradient(circle_at_85%_25%,rgba(0,150,255,0.1),transparent_45%)]"
            : "bg-[radial-gradient(circle_at_20%_0%,rgba(120,80,255,0.08),transparent_45%),radial-gradient(circle_at_85%_25%,rgba(0,150,255,0.06),transparent_45%)]"
        }`}
      />

      
      <header
        className={`sa-header relative z-20 border-b ${
          dark ? "border-white/10 bg-black/40 backdrop-blur-xl" : "border-gray-200 bg-white/80 backdrop-blur-xl"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-2 px-3 py-2.5 sm:px-6 sm:py-3 lg:px-10">
          <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl sm:h-9 sm:w-9 ${
                dark ? "bg-white text-black" : "bg-black text-white"
              }`}
            >
              <FiCpu className="text-sm sm:text-base" />
            </div>
            <div className="min-w-0 leading-tight">
              <p className={`truncate text-xs font-bold tracking-tight sm:text-sm ${textPrimary}`}>
                Solvix
              </p>
              <p className={`truncate text-[8px] uppercase tracking-[0.18em] sm:text-[9px] sm:tracking-[0.2em] ${textSecondary}`}>
                AI Workspace
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {userdata ? (
              <>
                <div className="flex items-center gap-2">
                  <img
                    src={userdata.avatar}
                    alt={userdata.name}
                    className={`h-7 w-7 rounded-full object-cover border sm:h-8 sm:w-8 ${
                      dark ? "border-white/15" : "border-gray-200"
                    }`}
                  />
                  <div className="hidden sm:block leading-tight">
                    <p className={`text-[9px] ${textSecondary}`}>Welcome, </p>
                    <p className={`max-w-[120px] truncate text-xs font-semibold ${textPrimary}`}>
                      {userdata.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className={`ml-1 flex h-8 items-center gap-1.5 rounded-lg border px-2 text-[11px] font-semibold transition active:scale-95 sm:px-2.5 ${
                    dark
                      ? "border-white/10 bg-white/[0.04] text-gray-200 hover:bg-white/10"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FiLogOut className="text-xs" />
                  <span className="hidden xs:inline sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login-required")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
                  dark ? "bg-white text-black" : "bg-black text-white"
                }`}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      
      <div className="relative mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-3 py-6 sm:px-6 sm:py-8 lg:flex-row lg:gap-6 lg:px-10 lg:py-8">
        <div className="w-full min-w-0 lg:flex-1 lg:pr-2">
          <div className="mx-auto max-w-4xl lg:mx-0">
            <div
              className="sa-badge inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] sm:px-3.5 sm:text-[10px] sm:tracking-[0.2em]"
              style={{
                borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                backgroundColor: dark ? "rgba(255,255,255,0.04)" : "#fff",
                color: dark ? "#9ca3af" : "#6b7280",
              }}
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
              Custom AI Agent Builder
            </div>

            <h1
              className={`sa-title mt-5 text-3xl font-bold leading-[1.08] tracking-[-0.03em] sm:mt-6 sm:text-4xl sm:tracking-[-0.04em] md:text-5xl lg:text-6xl ${textPrimary}`}
            >
              Build your own
              <br />
              <span
                className={`bg-gradient-to-r bg-clip-text text-transparent ${
                  dark
                    ? "from-white via-gray-400 to-gray-600"
                    : "from-gray-900 via-gray-600 to-gray-400"
                }`}
              >
                AI agent.
              </span>
            </h1>

            <p className={`sa-desc mt-4 max-w-2xl text-[13px] leading-6 sm:mt-6 sm:text-sm sm:leading-7 lg:text-base ${textSecondary}`}>
              Design a custom AI agent in seconds — give it a name, a personality,
              a system prompt, and the model of your choice. Whether you need a
              resume reviewer, a coding mentor, an interview coach, or a research
              assistant, your agent will work exactly the way you tell it to.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-2.5 sm:mt-8 sm:grid-cols-2 sm:gap-3">
              <Benefit dark={dark} Icon={FiCpu} title="Fully Custom" text="Name, prompt, model & temperature — all in your control." />
              <Benefit dark={dark} Icon={FiZap} title="Instant Setup" text="Create & chat with your agent in under 30 seconds." />
              <Benefit dark={dark} Icon={FiStar} title="Prompt Templates" text="Start from ready-made prompts or write your own." />
              <Benefit dark={dark} Icon={FiCheckCircle} title="Free Forever" text="Unlimited custom agents with no hidden paywall." />
            </div>

            <div className="sa-cta mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
              <button
                onClick={() => document.querySelector("#agent-builder")?.scrollIntoView({ behavior: "smooth" })}
                className={`group inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 active:scale-95 sm:px-5 ${
                  dark
                    ? "bg-white text-black hover:bg-gray-200 hover:shadow-[0_10px_30px_rgba(255,255,255,0.15)]"
                    : "bg-black text-white hover:bg-gray-800 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                }`}
              >
                Explore Agents
                <FiChevronRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <span className={`text-[11px] sm:text-xs ${textSecondary}`}>No credit card required</span>
            </div>

            <div id="agent-builder" className="sa-builder mt-10 sm:mt-16">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className={`text-lg font-bold tracking-tight sm:text-xl lg:text-2xl ${textPrimary}`}>
                    Your Agents
                  </h2>
                  <p className={`mt-0.5 text-[11px] sm:text-xs ${textSecondary}`}>
                    {loadingAgents
                      ? "Loading..."
                      : `${agents.length} agent${agents.length !== 1 ? "s" : ""} created · click to chat, edit, or delete`}
                  </p>
                </div>

                <button
                  onClick={openCreate}
                  className={`group inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 active:scale-95 sm:w-auto ${
                    dark
                      ? "bg-white text-black hover:bg-gray-200 hover:shadow-[0_10px_30px_rgba(255,255,255,0.15)]"
                      : "bg-black text-white hover:bg-gray-800 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                  }`}
                >
                  <FiPlus className="text-lg transition-transform duration-300 group-hover:rotate-90" />
                  New Agent
                </button>
              </div>

              <div className="mt-4 sm:mt-5">
                <div className="relative">
                  <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search agents by name or description..."
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div className="mt-4 -mx-3 flex gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <CategoryChip
                  active={activeCategory === "all"}
                  onClick={() => setActiveCategory("all")}
                  dark={dark}
                  label="All"
                  count={agents.length}
                />
                {AGENT_CATEGORIES.map((cat) => {
                  const count = agents.filter((a) => a.category === cat.id).length;
                  return (
                    <CategoryChip
                      key={cat.id}
                      active={activeCategory === cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      dark={dark}
                      Icon={cat.Icon}
                      label={cat.label}
                      count={count}
                    />
                  );
                })}
              </div>

              <div className="mt-5 sm:mt-6">
                {loadingAgents ? (
                  <LoadingState dark={dark} />
                ) : filteredAgents.length === 0 ? (
                  <EmptyState dark={dark} onCreate={openCreate} />
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                      {visibleAgents.map((agent) => (
                        <AgentCard
                          key={agent._id}
                          agent={agent}
                          dark={dark}
                          onChat={() => openChat(agent)}
                          onEdit={() => openEdit(agent)}
                          onDelete={() => handleDelete(agent._id)}
                        />
                      ))}
                    </div>

                    {hasMore && (
                      <div className="mt-5 flex justify-center sm:mt-6">
                        <button
                          onClick={() => setShowAll((v) => !v)}
                          className={`group inline-flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-xs font-semibold transition-all duration-300 active:scale-95 sm:w-auto ${
                            dark
                              ? "border-white/10 bg-white/[0.04] text-gray-200 hover:bg-white/10 hover:border-white/20"
                              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-300"
                          }`}
                        >
                          {showAll ? (
                            <>
                              Show Less
                              <FiChevronUp className="transition-transform duration-300 group-hover:-translate-y-0.5" />
                            </>
                          ) : (
                            <>
                              Show More ({filteredAgents.length - VISIBLE_COUNT})
                              <FiChevronDown className="transition-transform duration-300 group-hover:translate-y-0.5" />
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <section className="sa-sidebar w-full shrink-0 space-y-4 lg:sticky lg:top-24 lg:w-[340px] lg:self-start xl:w-[360px]">
          <div className="lg:hidden">
            <h1 className={`text-xl font-bold tracking-tight sm:text-2xl ${textPrimary}`}>Explore AI Agents</h1>
            <p className={`mt-1 text-xs sm:text-sm ${textSecondary}`}>Free and premium tools in one place.</p>
          </div>

          <div className={`flex gap-1 rounded-xl border p-1 ${dark ? "border-white/10 bg-white/[0.03]" : "border-gray-200 bg-white"}`}>
            <Tab active={activeTab === "free"} onClick={() => setActiveTab("free")} dark={dark} label="Free Models" />
            <Tab active={activeTab === "paid"} onClick={() => setActiveTab("paid")} dark={dark} label="Career Tools" />
          </div>

          <div className="space-y-2">
            {activeTab === "free"
              ? FREE_MODELS.map((m) => <ModelRow key={m.id} model={m} dark={dark} />)
              : PAID_MODELS.map((m) => <ModelRow key={m.id} model={m} dark={dark} />)}
          </div>

          <div
            className={`sa-model-row relative overflow-hidden rounded-2xl border p-4 ${
              dark
                ? "border-white/10 bg-gradient-to-br from-purple-500/[0.08] to-blue-500/[0.04]"
                : "border-gray-200 bg-gradient-to-br from-purple-500/[0.06] to-blue-500/[0.03]"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  dark ? "bg-white/[0.06] text-purple-300" : "bg-white text-purple-600 border border-purple-200"
                }`}
              >
                <FiClock />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className={`text-sm font-semibold ${textPrimary}`}>Auto-Job Apply</h3>
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      dark ? "bg-purple-500/20 text-purple-300" : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    24h
                  </span>
                </div>
                <p className={`mt-1 text-[11px] leading-5 ${textSecondary}`}>
                  Find & auto-apply to jobs. Available once every 24 hours.
                </p>
              </div>
            </div>
            <a
              href="/autoapply"
              className={`mt-3 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition active:scale-95 ${
                dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              Open Auto-Apply <FiExternalLink className="text-[10px]" />
            </a>
          </div>

          <div
            className={`sa-model-row relative overflow-hidden rounded-2xl border p-4 ${
              dark ? "border-white/10 bg-white/[0.03]" : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  dark ? "bg-white/[0.06] text-blue-300" : "bg-blue-50 text-blue-600 border border-blue-100"
                }`}
              >
                <FiMap />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className={`text-sm font-semibold ${textPrimary}`}>Career Roadmap</h3>
                <p className={`mt-1 text-[11px] leading-5 ${textSecondary}`}>
                  Ask any skill roadmap — get YouTube videos, notes & steps.
                </p>
              </div>
            </div>
            <a
              href="/roadmap"
              className={`mt-3 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition active:scale-95 ${
                dark ? "bg-white/[0.06] text-white hover:bg-white/15" : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
            >
              Open Roadmap <FiExternalLink className="text-[10px]" />
            </a>
          </div>

          <div
            className={`sa-model-row relative overflow-hidden rounded-2xl border p-4 ${
              dark
                ? "border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.08] via-teal-500/[0.04] to-cyan-500/[0.06]"
                : "border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  dark ? "bg-emerald-500/15 text-emerald-300" : "bg-white text-emerald-600 border border-emerald-200"
                }`}
              >
                <FiStar />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className={`text-sm font-semibold ${textPrimary}`}>Why Solvix AI?</h3>
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      dark ? "bg-emerald-500/20 text-emerald-300" : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    Free
                  </span>
                </div>
                <ul className={`mt-2 space-y-1.5 text-[11px] leading-5 ${textSecondary}`}>
                  <li className="flex items-start gap-1.5">
                    <FiCheckCircle className="mt-0.5 shrink-0 text-[10px] text-emerald-500" />
                    <span>Unlimited custom AI agents with no hidden paywall</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <FiCheckCircle className="mt-0.5 shrink-0 text-[10px] text-emerald-500" />
                    <span>Groq + Gemini models in one place</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <FiCheckCircle className="mt-0.5 shrink-0 text-[10px] text-emerald-500" />
                    <span>No credit card required to get started</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <FiCheckCircle className="mt-0.5 shrink-0 text-[10px] text-emerald-500" />
                    <span>Create, edit, delete agents anytime</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <FiCheckCircle className="mt-0.5 shrink-0 text-[10px] text-emerald-500" />
                    <span>Prompt templates — start in seconds</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <FiCheckCircle className="mt-0.5 shrink-0 text-[10px] text-emerald-500" />
                    <span>Fully responsive — works on all devices</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer
        className={`sa-footer relative z-10 border-t px-3 py-5 sm:px-6 sm:py-6 lg:px-10 ${
          dark ? "border-white/10" : "border-gray-200"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-1.5 text-center text-[11px] sm:flex-row sm:gap-2 sm:text-left sm:text-xs">
          <p className={textSecondary}>
            © {new Date().getFullYear()} Solvix AI — All rights reserved.
          </p>
          <p className={textSecondary}>
            Developed by :{" "}
            <span className={`font-semibold ${textPrimary}`}>M_SIRAJ_ABID</span>
          </p>
        </div>
      </footer>

      {isFormOpen && (
        <AgentFormModal
          dark={dark}
          form={form}
          setForm={setForm}
          errors={errors}
          editingAgent={editingAgent}
          onSave={handleSave}
          onClose={closeForm}
          inputClass={inputClass}
          labelClass={labelClass}
          saving={saving}
        />
      )}

      {chatAgent && (
        <AgentChatDrawer
          dark={dark}
          agent={chatAgent}
          messages={messages}
          input={chatInput}
          setInput={setChatInput}
          onSend={sendMessage}
          loading={chatLoading}
          onClose={closeChat}
          inputClass={inputClass}
        />
      )}

      <ConfirmModal
        dark={dark}
        open={deleteConfirm.open}
        title="Delete Agent?"
        message={`Are you sure you want to delete "${deleteConfirm.agentName}"? This action cannot be undone.`}
        confirmText="Delete Agent"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        loading={deleteConfirm.deleting}
        variant="danger"
      />
    </div>
  );
}