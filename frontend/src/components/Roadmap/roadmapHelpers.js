import api from "../../utlis/axios";

export const genAPI = ({ topic, level }) =>
  api
    .post("/agent/roadmap/generate", { topic, level }, { timeout: 180000 })
    .then((r) => r.data);

export const getAPI = () =>
  api
    .get("/agent/roadmap")
    .then((r) => r.data)
    .catch(() => ({ roadmap: null, completedTasks: {} }));

export const toggleAPI = ({ roadmapId, taskKey, completed }) =>
  api
    .post("/agent/roadmap/toggle-task", { roadmapId, taskKey, completed })
    .then((r) => r.data);


export const SUGGESTIONS = [
  "Advanced Multi-Agent AI",
  "Full-Stack MERN",
  "System Design",
  "LangGraph & RAG",
  "DevOps & Cloud",
  "Data Science & ML",
  "Blockchain Dev",
  "Mobile (React Native)",
];

export const LEVELS = [
  { id: "Beginner", color: "emerald" },
  { id: "Intermediate", color: "amber" },
  { id: "Advanced", color: "rose" },
];

export const RESOURCE_TYPES = [
  "All",
  "YouTube",
  "GitHub",
  "Documentation",
  "Course",
];

export const RESOURCE_COLORS = {
  YouTube: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
  },
  GitHub: {
    bg: "bg-white/5",
    text: "text-white",
    border: "border-white/20",
  },
  Documentation: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  Course: {
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    border: "border-violet-500/20",
  },
};


export const filterPhases = (phases, searchQuery, typeFilter) => {
  if (!searchQuery && typeFilter === "All") return phases;
  const q = searchQuery.toLowerCase();

  return phases
    .map((phase) => {
      const tasks = (phase.tasks || []).filter(
        (t) => !searchQuery || t.toLowerCase().includes(q)
      );
      const resources = (phase.resources || []).filter((r) => {
        const matchType = typeFilter === "All" || r.type === typeFilter;
        const matchSearch =
          !searchQuery ||
          r.title?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q);
        return matchType && matchSearch;
      });
      return { ...phase, tasks, resources };
    })
    .filter((p) => p.tasks.length > 0 || p.resources.length > 0);
};


export const computeStats = (phases, completedTasks) => {
  const allTasks = phases.reduce((s, p) => s + (p.tasks?.length || 0), 0);
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progress = allTasks
    ? Math.round((completedCount / allTasks) * 100)
    : 0;
  const resourceCount = phases.reduce(
    (s, p) => s + (p.resources?.length || 0),
    0
  );
  const estimatedHours = Math.round(allTasks * 3 + resourceCount * 0.5);

  return {
    allTasks,
    completedCount,
    progress,
    resourceCount,
    estimatedHours,
    phaseCount: phases.length,
  };
};


export const getPhaseProgress = (phase, completedTasks) => {
  const tasks = phase.tasks || [];
  const done = tasks.filter(
    (_, i) => completedTasks[`${phase.id}-${i}`]
  ).length;
  const total = tasks.length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  return { done, total, percent, isDone: total > 0 && done === total };
};