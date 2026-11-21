import React from "react";
import {
  FiCpu,
  FiSearch,
  FiZap,
  FiStar,
  FiPlus,
  FiChevronRight,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
} from "react-icons/fi";
import {
  AGENT_CATEGORIES,
  Benefit,
  CategoryChip,
  AgentCard,
  EmptyState,
  LoadingState,
} from "./AgentComponents";

export default function AgentMainContent({
  dark,
  loadingAgents,
  agents,
  filteredAgents,
  visibleAgents,
  hasMore,
  showAll,
  setShowAll,
  activeCategory,
  setActiveCategory,
  search,
  setSearch,
  openCreate,
  openChat,
  openEdit,
  handleDelete,
  inputClass,
  VISIBLE_COUNT,
}) {
  const textPrimary = dark ? "text-white" : "text-gray-900";
  const textSecondary = dark ? "text-gray-400" : "text-gray-500";

  return (
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

        <p
          className={`sa-desc mt-4 max-w-2xl text-[13px] leading-6 sm:mt-6 sm:text-sm sm:leading-7 lg:text-base ${textSecondary}`}
        >
          Design a custom AI agent in seconds — give it a name, a personality,
          a system prompt, the model of your choice, and pick exactly which
          tools it can use: web search, coding, PDF, PPT, images, and more.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-2.5 sm:mt-8 sm:grid-cols-2 sm:gap-3">
          <Benefit
            dark={dark}
            Icon={FiCpu}
            title="Fully Custom"
            text="Name, prompt, model, tools & temperature — all in your control."
          />
          <Benefit
            dark={dark}
            Icon={FiZap}
            title="Instant Setup"
            text="Create & chat with your agent in under 30 seconds."
          />
          <Benefit
            dark={dark}
            Icon={FiStar}
            title="Prompt Templates"
            text="Start from ready-made prompts or write your own."
          />
          <Benefit
            dark={dark}
            Icon={FiCheckCircle}
            title="Free Forever"
            text="Unlimited custom agents with no hidden paywall."
          />
        </div>

        <div className="sa-cta mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
          <button
            onClick={() =>
              document
                .querySelector("#agent-builder")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className={`group inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 active:scale-95 sm:px-5 ${
              dark
                ? "bg-white text-black hover:bg-gray-200 hover:shadow-[0_10px_30px_rgba(255,255,255,0.15)]"
                : "bg-black text-white hover:bg-gray-800 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
            }`}
          >
            Explore Agents
            <FiChevronRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <span className={`text-[11px] sm:text-xs ${textSecondary}`}>
            No credit card required
          </span>
        </div>

        <div id="agent-builder" className="sa-builder mt-10 sm:mt-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                className={`text-lg font-bold tracking-tight sm:text-xl lg:text-2xl ${textPrimary}`}
              >
                Your Agents
              </h2>
              <p className={`mt-0.5 text-[11px] sm:text-xs ${textSecondary}`}>
                {loadingAgents
                  ? "Loading..."
                  : `${agents.length} agent${
                      agents.length !== 1 ? "s" : ""
                    } created · click to chat, edit, or delete`}
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
  );
}