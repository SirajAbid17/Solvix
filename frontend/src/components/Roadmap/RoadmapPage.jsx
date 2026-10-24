import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiZap, FiRotateCcw, FiList, FiLayers, FiArrowLeft,
} from "react-icons/fi";

import {
  genAPI, getAPI, toggleAPI, filterPhases, computeStats,
} from "./roadmapHelpers";

import {
  LoadingScreen, TopBar, Hero, GeneratorForm, StatsRow, ProgressCard,
  Controls, PhaseCard, EmptyState, NoResults, CommandPalette,
  ResourceModal, Footer, SuccessModal,
} from "./RoadmapUI";


const STORAGE_KEYS = {
  topic: "roadmap:lastTopic",
  level: "roadmap:lastLevel",
};

const loadFromStorage = (key, fallback) => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {}
};


export default function RoadmapPage() {
  const navigate = useNavigate();

  const [topic, setTopic] = useState(() =>
    loadFromStorage(STORAGE_KEYS.topic, "Advanced Multi-Agent AI Systems")
  );
  const [level, setLevel] = useState(() =>
    loadFromStorage(STORAGE_KEYS.level, "Intermediate")
  );

  const [roadmap, setRoadmap] = useState(null);
  const [completedTasks, setCompletedTasks] = useState({});
  const [expanded, setExpanded] = useState(new Set([1]));

  const [loading, setLoading] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [error, setError] = useState("");
  const [selectedResource, setSelectedResource] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [viewMode, setViewMode] = useState("timeline");
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);  

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.topic, topic);
  }, [topic]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.level, level);
  }, [level]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAPI();
        if (res?.roadmap) {
          setRoadmap(res.roadmap);
          setCompletedTasks(res.completedTasks || {});
        }
      } catch (e) {
        console.warn("Load failed:", e.message);
      } finally {
        setLoadingSaved(false);
      }
    })();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowCommandPalette((s) => !s);
      }
      if (e.key === "Escape") {
        setSelectedResource(null);
        setShowCommandPalette(false);
        setShowSuccess(false);   
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "e") {
        e.preventDefault();
        if (roadmap) {
          setExpanded(new Set(roadmap.phases?.map((p) => p.id) || []));
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [roadmap]);

  const handleGenerate = async (e) => {
    e?.preventDefault?.();
    if (!topic.trim() || loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await genAPI({ topic: topic.trim(), level });
      if (!res?.success || !res.roadmap) throw new Error(res?.message || "Failed");
      setRoadmap(res.roadmap);
      setCompletedTasks({});
      setExpanded(new Set([res.roadmap.phases?.[0]?.id || 1]));
      setShowSuccess(true);  
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = useCallback(
    async (phaseId, taskIndex, currentVal) => {
      const key = `${phaseId}-${taskIndex}`;
      const newVal = !currentVal;

      setCompletedTasks((p) => ({ ...p, [key]: newVal }));

      try {
        await toggleAPI({
          roadmapId: roadmap?.id,
          taskKey: key,
          completed: newVal,
        });
      } catch {
        setCompletedTasks((p) => ({ ...p, [key]: currentVal }));
      }
    },
    [roadmap?.id]
  );

  const handleReset = async () => {
    if (!roadmap?.id) return setCompletedTasks({});
    const keys = Object.keys(completedTasks);
    setCompletedTasks({});
    await Promise.all(
      keys.map((k) =>
        toggleAPI({ roadmapId: roadmap.id, taskKey: k, completed: false }).catch(() => {})
      )
    );
  };

  const toggleExpandAll = () => {
    if (!roadmap) return;
    const allIds = roadmap.phases?.map((p) => p.id) || [];
    if (expanded.size === allIds.length) setExpanded(new Set());
    else setExpanded(new Set(allIds));
  };

  const phases = roadmap?.phases || [];
  const stats = useMemo(
    () => computeStats(phases, completedTasks),
    [phases, completedTasks]
  );
  const filtered = useMemo(
    () => filterPhases(phases, searchQuery, typeFilter),
    [phases, searchQuery, typeFilter]
  );
  const allExpanded = expanded.size === phases.length;

  const commands = [
    { icon: FiZap, label: "Generate Roadmap", action: () => { setShowCommandPalette(false); handleGenerate(); } },
    { icon: FiRotateCcw, label: "Reset Progress", action: () => { setShowCommandPalette(false); handleReset(); } },
    { icon: FiList, label: "Toggle Timeline / Compact", action: () => { setViewMode((v) => v === "timeline" ? "compact" : "timeline"); setShowCommandPalette(false); } },
    { icon: FiLayers, label: "Expand / Collapse All", action: () => { toggleExpandAll(); setShowCommandPalette(false); } },
    { icon: FiArrowLeft, label: "Go Home", action: () => navigate("/") },
  ];

  if (loadingSaved) return <LoadingScreen />;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060912] text-slate-100">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.35]" style={{ backgroundImage: "linear-gradient(rgba(52,211,153,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.04) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      <div className="pointer-events-none absolute -left-40 -top-20 h-[40rem] w-[40rem] rounded-full bg-emerald-500/[0.06] blur-[160px]" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[36rem] w-[36rem] rounded-full bg-cyan-500/[0.05] blur-[160px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-violet-500/[0.04] blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <TopBar onHome={() => navigate("/")} onOpenPalette={() => setShowCommandPalette(true)} />

        <Hero />

        <GeneratorForm
          topic={topic}
          setTopic={setTopic}
          level={level}
          setLevel={setLevel}
          loading={loading}
          error={error}
          onSubmit={handleGenerate}
        />

        {roadmap ? (
          <>
            <StatsRow stats={stats} />
            <ProgressCard
              title={roadmap.title || roadmap.topic || topic}
              stats={stats}
              onReset={handleReset}
            />
            <Controls
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onToggleExpandAll={toggleExpandAll}
              allExpanded={allExpanded}
            />

            {filtered.length === 0 && <NoResults />}

            <div className={viewMode === "timeline" ? "space-y-4" : "grid gap-3 md:grid-cols-2"}>
              {filtered.map((phase, idx) => {
                const originalIdx = phases.findIndex((p) => p.id === phase.id);
                const isOpen = viewMode === "compact" || expanded.has(phase.id);
                return (
                  <PhaseCard
                    key={phase.id || idx}
                    phase={phase}
                    originalIndex={originalIdx}
                    isOpen={isOpen}
                    viewMode={viewMode}
                    completedTasks={completedTasks}
                    onToggle={() => {
                      setExpanded((prev) => {
                        const next = new Set(prev);
                        if (next.has(phase.id)) next.delete(phase.id);
                        else next.add(phase.id);
                        return next;
                      });
                    }}
                    onToggleTask={handleToggleTask}
                    onSelectResource={setSelectedResource}
                  />
                );
              })}
            </div>
          </>
        ) : (
          <EmptyState />
        )}

        <Footer />
      </div>

      {showCommandPalette && (
        <CommandPalette
          commands={commands}
          onClose={() => setShowCommandPalette(false)}
        />
      )}

      {selectedResource && (
        <ResourceModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}

    
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        roadmap={roadmap}
        autoCloseMs={4000}
      />
    </main>
  );
}