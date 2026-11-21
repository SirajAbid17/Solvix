import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../utlis/axios";
import { setuserData } from "../../redux/userSlice";
import { clearConversations } from "../../redux/conversationSlice";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import toast from "react-hot-toast";
import { useTheme } from "../../BgContext/ThemeContext";

import {
  createCustomAgent,
  getCustomAgents,
  updateCustomAgent,
  deleteCustomAgent,
  chatWithCustomAgent,
  getCustomAgentChatHistory,
} from "../../Features/agentBuilderAPI";

import { defaultForm, ConfirmModal, AgentFormModal } from "./AgentComponents";

import AgentChatDrawer from "./AgentChat";
import AgentHeader from "./AgentHeader";
import AgentSidebar from "./AgentSidebar";
import AgentMainContent from "./AgentMainContent";

export default function AgentModel() {
  const { dark } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const container = useRef(null);
  const animatedOnce = useRef(false);
  const cardsAnimatedKey = useRef("");

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
          border: dark
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid rgba(0,0,0,0.1)",
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
      const matchesCategory =
        activeCategory === "all" || a.category === activeCategory;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [agents, activeCategory, search]);

  const visibleAgents = showAll
    ? filteredAgents
    : filteredAgents.slice(0, VISIBLE_COUNT);
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
      gsap.set(".sa-footer", { opacity: 0, y: 10 });

      tl.to(".sa-header", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      })
        .to(
          ".sa-badge",
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
          "-=0.35",
        )
        .to(
          ".sa-title",
          { opacity: 1, y: 0, duration: 0.7, ease: "power4.out" },
          "-=0.3",
        )
        .to(
          ".sa-desc",
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.4",
        )
        .to(
          ".sa-benefit",
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.3",
        )
        .to(
          ".sa-cta",
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
          "-=0.2",
        )
        .to(
          ".sa-builder",
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.2",
        )
        .to(
          ".sa-sidebar",
          { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
          "-=0.6",
        )
        .to(
          ".sa-model-row",
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.04,
            ease: "power2.out",
          },
          "-=0.3",
        )
        .to(
          ".sa-footer",
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          "-=0.2",
        );
    },
    { scope: container },
  );


  useGSAP(
    () => {
      if (!container.current) return;

      const cards = container.current.querySelectorAll(".sa-card");
      if (!cards || cards.length === 0) return;

      
      const currentKey = visibleAgents.map((a) => a._id).join(",");
      if (cardsAnimatedKey.current === currentKey) return;
      cardsAnimatedKey.current = currentKey;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 25, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: "power3.out",
          clearProps: "transform",
        },
      );
    },
    { scope: container, dependencies: [visibleAgents] },
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
      tools:
        Array.isArray(agent.tools) && agent.tools.length > 0
          ? agent.tools
          : ["chat"],
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
    if (form.systemPrompt.length < 20)
      e.systemPrompt = "Write at least 20 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error("Please fix the errors first", {
        style: {
          background: dark ? "#1a1a1a" : "#fff",
          color: dark ? "#fff" : "#000",
        },
      });
      return;
    }

    setSaving(true);
    const toastId = toast.loading(
      editingAgent ? "Updating agent..." : "Creating agent...",
      {
        style: {
          background: dark ? "#1a1a1a" : "#fff",
          color: dark ? "#fff" : "#000",
          border: dark
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid rgba(0,0,0,0.1)",
        },
      },
    );

    try {
      const payload = {
        ...form,
        tools:
          Array.isArray(form.tools) && form.tools.length > 0
            ? form.tools
            : ["chat"],
      };

      if (editingAgent) {
        const res = await updateCustomAgent(editingAgent._id, payload);
        if (res?.success && res.agent) {
          setAgents((prev) =>
            prev.map((a) => (a._id === editingAgent._id ? res.agent : a)),
          );
          toast.success("Agent updated successfully", { id: toastId });
          closeForm();
        } else {
          toast.error(res?.message || "Failed to update agent", {
            id: toastId,
          });
        }
      } else {
        const res = await createCustomAgent(payload);
        if (res?.success && res.agent) {
          setAgents((prev) => [res.agent, ...prev]);
          toast.success("Agent created successfully", { id: toastId });
          closeForm();
        } else {
          if (res?.errors) {
            setErrors(res.errors);
            toast.error("Please fix validation errors", { id: toastId });
          } else {
            toast.error(res?.message || "Failed to create agent", {
              id: toastId,
            });
          }
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
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
          style: {
            background: dark ? "#1a1a1a" : "#fff",
            color: dark ? "#fff" : "#000",
          },
        });
        setDeleteConfirm({
          open: false,
          agentId: null,
          agentName: "",
          deleting: false,
        });
      } else {
        toast.error(res?.message || "Failed to delete agent", {
          style: {
            background: dark ? "#1a1a1a" : "#fff",
            color: dark ? "#fff" : "#000",
          },
        });
        setDeleteConfirm((prev) => ({ ...prev, deleting: false }));
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete agent", {
        style: {
          background: dark ? "#1a1a1a" : "#fff",
          color: dark ? "#fff" : "#000",
        },
      });
      setDeleteConfirm((prev) => ({ ...prev, deleting: false }));
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({
      open: false,
      agentId: null,
      agentName: "",
      deleting: false,
    });
  };

  const openChat = async (agent) => {
    if (!agent || !agent._id) {
      toast.error("Invalid agent data");
      return;
    }

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
      style: {
        background: dark ? "#1a1a1a" : "#fff",
        color: dark ? "#fff" : "#000",
      },
    });

    try {
      const res = await getCustomAgentChatHistory(agent._id, storedConvId);

      if (
        res?.success &&
        Array.isArray(res.messages) &&
        res.messages.length > 0
      ) {
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

  const sendMessage = async (forceTool = null, attachedFile = null) => {
    if ((!chatInput.trim() && !attachedFile) || chatLoading || !chatAgent)
      return;

    const userText =
      chatInput.trim() || `Analyze this file: ${attachedFile?.fileName || ""}`;

    console.log("sendMessage:", {
      userText,
      forceTool,
      hasFile: !!attachedFile,
      fileName: attachedFile?.fileName,
      fileId: attachedFile?.fileId,
      fileContextLen:
        attachedFile?.fullText?.length ||
        attachedFile?.textPreview?.length ||
        0,
    });

    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const hasFile = !!(attachedFile?.fileId || attachedFile?.fullText);
      const history = hasFile
        ? []
        : messages
            .slice(1)
            .filter((m) => m.role === "user" || m.role === "assistant")
            .map((m) => ({ role: m.role, content: String(m.content || "") }));

      const res = await chatWithCustomAgent(
        chatAgent._id,
        userText,
        conversationId,
        history,
        forceTool,
        attachedFile,
      );

      console.log(" BACKEND RESPONSE:", res);

      if (res?.success && res.response) {
        const assistantMsg = {
          role: "assistant",
          content: res.response || "",
          pdfGenerated: res.pdfGenerated === true,
          pdfUrl: res.pdfUrl || null,
          pdfBase64: res.pdfBase64 || null,
          pdf: res.pdf || null,
          pptGenerated: res.pptGenerated === true,
          pptUrl: res.pptUrl || null,
          pptBase64: res.pptBase64 || null,
          ppt: res.ppt || null,
          pptFileName: res.pptFileName || "solvix-presentation.pptx",
          pptData: res.pptData || null,
          images: Array.isArray(res.images) ? res.images : [],
          toolExecuted: res.toolExecuted || null,
          ragUsed: res.ragUsed || false,
          ragSources: res.ragSources || [],
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: res?.message || "Sorry, couldn't process.",
          },
        ]);
        toast.error("Failed to get response", {
          style: {
            background: dark ? "#1a1a1a" : "#fff",
            color: dark ? "#fff" : "#000",
          },
        });
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `**Error:** ${
            err?.response?.data?.message || "Something went wrong."
          }`,
        },
      ]);
      toast.error("Chat failed", {
        style: {
          background: dark ? "#1a1a1a" : "#fff",
          color: dark ? "#fff" : "#000",
        },
      });
    } finally {
      setChatLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const userRes = await api.post("/agent/file/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-user-id": userdata?._id || "test-user",
        },
        timeout: 120000,
      });

      console.log("📎 File upload response:", {
        success: userRes.data?.success,
        fileId: userRes.data?.file?.fileId,
        fileName: userRes.data?.file?.fileName,
        fileType: userRes.data?.file?.fileType,
        fullTextLen: userRes.data?.file?.fullText?.length || 0,
        chunksStored: userRes.data?.file?.chunksStored,
        ragStored: userRes.data?.file?.ragStored,
      });

      return userRes.data;
    } catch (err) {
      console.error("File upload error:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || "File upload failed");
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

      <AgentHeader dark={dark} />

      <div className="relative mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-3 py-6 sm:px-6 sm:py-8 lg:flex-row lg:gap-6 lg:px-10 lg:py-8">
        <AgentMainContent
          dark={dark}
          loadingAgents={loadingAgents}
          agents={agents}
          filteredAgents={filteredAgents}
          visibleAgents={visibleAgents}
          hasMore={hasMore}
          showAll={showAll}
          setShowAll={setShowAll}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          search={search}
          setSearch={setSearch}
          openCreate={openCreate}
          openChat={openChat}
          openEdit={openEdit}
          handleDelete={handleDelete}
          inputClass={inputClass}
          VISIBLE_COUNT={VISIBLE_COUNT}
        />

        <AgentSidebar dark={dark} />
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
          onFileUpload={handleFileUpload}
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
