import React, { useState } from "react";
import { useTheme } from "../BgContext/ThemeContext";
import BgContextBtn from "../components/BgContextBtn";
import { FaArrowLeft } from "react-icons/fa";

// ---------- dummy data ----------
const user = {
  name: "Alex Rivera",
  email: "alex@solvix.ai",
  credits: 42,
  plan: "Pro",
};

const usageStats = {
  totalRequests: 1_284,
  activeAgents: ["chat", "search", "coding", "pdf", "ppt", "image", "resume"],
  apiCalls: 9_512,
};

const recentLogs = [
  { id: 1, agent: "chat", action: "answered question", time: "2 min ago" },
  { id: 2, agent: "search", action: "web search: 'langgraph'", time: "14 min ago" },
  { id: 3, agent: "coding", action: "generated python snippet", time: "1h ago" },
  { id: 4, agent: "pdf", action: "extracted text from report.pdf", time: "3h ago" },
  { id: 5, agent: "resume", action: "optimized CV summary", time: "5h ago" },
];

const suggestedPrompts = [
  "Summarize this PDF",
  "Write a python script for data analysis",
  "Search for AI news",
  "Create a presentation outline",
  "Optimize my resume",
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$9",
    period: "/month",
    features: ["100 credits", "Basic agents", "Email support"],
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    features: ["500 credits", "All agents", "Priority support", "Advanced analytics"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    features: ["Unlimited credits", "Custom agents", "24/7 support", "Dedicated infrastructure"],
    popular: false,
  },
];

// ---------- components ----------
const StatCard = ({ icon, label, value, subtext }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-gray-700 p-5 flex items-start gap-4 transition hover:shadow-md">
    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg">
      <i className={`fas fa-${icon}`}></i>
    </div>
    <div>
      <div className="text-xs font-medium text-slate-400 dark:text-gray-500 uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-semibold text-slate-800 dark:text-white">{value}</div>
      {subtext && <div className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">{subtext}</div>}
    </div>
  </div>
);

const AgentPill = ({ name }) => (
  <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100/60 dark:border-indigo-800/30">
    {name}
  </span>
);

const LogItem = ({ log }) => (
  <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-gray-700 last:border-0">
    <div className="flex items-center gap-3">
      <span className="w-6 h-6 rounded-full bg-indigo-100/60 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-[10px] font-bold">
        {log.agent[0].toUpperCase()}
      </span>
      <div>
        <span className="text-sm text-slate-700 dark:text-gray-300">{log.action}</span>
        <span className="text-xs text-slate-400 dark:text-gray-500 ml-2">· {log.agent}</span>
      </div>
    </div>
    <span className="text-xs text-slate-400 dark:text-gray-500">{log.time}</span>
  </div>
);

const PricingCard = ({ plan }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border p-6 transition hover:shadow-md ${
    plan.popular 
      ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/20 dark:ring-indigo-400/20' 
      : 'border-slate-200/60 dark:border-gray-700'
  }`}>
    {plan.popular && (
      <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">Most Popular</div>
    )}
    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{plan.name}</h3>
    <div className="mt-2 flex items-baseline">
      <span className="text-3xl font-bold text-slate-800 dark:text-white">{plan.price}</span>
      <span className="text-sm text-slate-400 dark:text-gray-500 ml-1">{plan.period}</span>
    </div>
    <ul className="mt-4 space-y-2">
      {plan.features.map((feature, idx) => (
        <li key={idx} className="text-sm text-slate-600 dark:text-gray-400 flex items-center gap-2">
          <i className="fas fa-check text-indigo-500 dark:text-indigo-400 text-xs"></i>
          {feature}
        </li>
      ))}
    </ul>
    <button className={`mt-6 w-full py-2.5 rounded-xl text-sm font-medium transition ${
      plan.popular
        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
        : 'bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 text-slate-700 dark:text-gray-300'
    }`}>
      {plan.popular ? 'Get Started' : 'Choose Plan'}
    </button>
  </div>
);

// ---------- main dashboard ----------
export default function UserDashboard() {
  const { dark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");

  // Home redirect function
  const goHome = () => {
    window.location.href = "/";
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      dark ? "bg-black-900 text-white" : "bg-slate-50/80 text-slate-700"
    }`}>
      {/* Theme Button */}
      <div className="fixed right-3 top-3 z-50">
        <BgContextBtn />
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* ----- Header with Home button, Logout & User ----- */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            {/* Home Button with arrow */}
            <button
              onClick={goHome}
              className={`p-2 rounded-xl transition hover:scale-105 ${
                dark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-white hover:bg-slate-50 text-slate-600 shadow-sm border border-slate-200/60"
              }`}
              title="Go to Home"
            >
             <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
                <span className="bg-indigo-600 mt-1 text-white text-sm px-3 py-0.5 rounded-full">Solvix AI</span>
                <span className={`${dark ? "text-gray-500" : "text-slate-400"} font-light`}>/</span>
                <span className={dark ? "text-white" : "text-slate-700"}>Dashboard</span>
              </h1>
             
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-xl shadow-sm border text-sm flex items-center gap-2 ${
              dark ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-white border-slate-200/60"
            }`}>
              <i className="fas fa-coins text-amber-400"></i>
              <span className="font-medium">{user.credits} credits</span>
              <span className={`text-xs ml-1 ${dark ? "text-gray-500" : "text-slate-400"}`}>· {user.plan}</span>
            </div>
            <button className={`px-4 py-2 rounded-xl shadow-sm border text-sm font-medium flex items-center gap-2 transition ${
              dark 
                ? "bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-300" 
                : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200/60"
            }`}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>

        {/* ----- Navigation Tabs ----- */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200/60 dark:border-gray-700 pb-4">
          {["overview", "credits", "pricing", "analytics", "logs", "prompts"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                activeTab === tab
                  ? dark
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-600 text-white"
                  : dark
                    ? "text-gray-400 hover:text-white hover:bg-gray-800"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {tab === "overview" && <i className="fas fa-home mr-2"></i>}
              {tab === "credits" && <i className="fas fa-coins mr-2"></i>}
              {tab === "pricing" && <i className="fas fa-tag mr-2"></i>}
              {tab === "analytics" && <i className="fas fa-chart-line mr-2"></i>}
              {tab === "logs" && <i className="fas fa-list-ul mr-2"></i>}
              {tab === "prompts" && <i className="fas fa-lightbulb mr-2"></i>}
              {tab}
            </button>
          ))}
        </div>
{/* ----- Content based on active tab ----- */}
{activeTab === "overview" && (
  <>
    {/* User Profile Section */}
    <div className={`rounded-2xl shadow-sm border p-6 mb-8 ${
      dark ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200/60"
    }`}>
      <div className="flex items-center gap-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white dark:border-gray-800"></div>
        </div>
        
        {/* User Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{user.name}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-slate-500 dark:text-gray-400 flex items-center gap-1">
              <i className="fas fa-envelope text-xs"></i> {user.email}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-gray-600"></span>
            <span className={`text-sm px-3 py-0.5 rounded-full ${
              user.plan === "Pro" 
                ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" 
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
            }`}>
              {user.plan} Plan
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-sm">
              <i className="fas fa-coins text-amber-400"></i>
              <span className="font-medium text-slate-700 dark:text-gray-300">{user.credits}</span>
              <span className="text-xs text-slate-400 dark:text-gray-500">credits</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <i className="fas fa-calendar-alt text-indigo-400"></i>
              <span className="text-xs text-slate-400 dark:text-gray-500">Member since Jan 2024</span>
            </div>
          </div>
        </div>
        
        {/* Quick Action */}
        <button className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
          dark 
            ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
            : "bg-indigo-600 hover:bg-indigo-700 text-white"
        }`}>
          <i className="fas fa-edit mr-2"></i> Edit Profile
        </button>
      </div>
    </div>

    {/* Stats - Overview of all key metrics */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard icon="chart-simple" label="Total Requests" value={`${usageStats.totalRequests}`} subtext="overall" />
      <StatCard icon="coins" label="Credits" value={user.credits} subtext={`${user.credits} available`} />
      <StatCard icon="tag" label="Current Plan" value={user.plan} subtext="active" />
      <StatCard icon="microchip" label="Active Agents" value={usageStats.activeAgents.length} subtext="ready" />
    </div>

    {/* Conversations & Messages Stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div className={`rounded-2xl shadow-sm border p-6 ${
        dark ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200/60"
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-400 dark:text-gray-500 uppercase tracking-wider">Total Conversations</div>
            <div className="text-3xl font-bold text-slate-800 dark:text-white mt-1">247</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
              <i className="fas fa-arrow-up mr-1"></i> +12% from last month
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl">
            <i className="fas fa-comments"></i>
          </div>
        </div>
      </div>

      <div className={`rounded-2xl shadow-sm border p-6 ${
        dark ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200/60"
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-400 dark:text-gray-500 uppercase tracking-wider">Total Messages</div>
            <div className="text-3xl font-bold text-slate-800 dark:text-white mt-1">3,842</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
              <i className="fas fa-arrow-up mr-1"></i> +8.5% from last month
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl">
            <i className="fas fa-envelope"></i>
          </div>
        </div>
      </div>
    </div>

    

   

    {/* Pricing Plans Overview */}
    <div className={`rounded-2xl shadow-sm border p-6 ${
      dark ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200/60"
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <i className="fas fa-tag text-indigo-500"></i> Pricing Plans
        </h2>
        <button 
          onClick={() => setActiveTab("pricing")}
          className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition"
        >
          View all plans <i className="fas fa-chevron-right ml-1"></i>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pricingPlans.map((plan) => (
          <div key={plan.name} className={`rounded-xl p-4 border ${
            plan.popular
              ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/20 dark:ring-indigo-400/20'
              : 'border-slate-200/60 dark:border-gray-700'
          } ${dark ? "bg-gray-700/30" : "bg-slate-50/30"}`}>
            {plan.popular && (
              <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Popular</div>
            )}
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{plan.name}</h3>
            <div className="mt-1 flex items-baseline">
              <span className="text-2xl font-bold text-slate-800 dark:text-white">{plan.price}</span>
              <span className="text-sm text-slate-400 dark:text-gray-500 ml-1">{plan.period}</span>
            </div>
            <ul className="mt-2 space-y-1">
              {plan.features.slice(0, 2).map((feature, idx) => (
                <li key={idx} className="text-xs text-slate-600 dark:text-gray-400 flex items-center gap-2">
                  <i className="fas fa-check text-indigo-500 dark:text-indigo-400 text-xs"></i>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </>
)}

        {activeTab === "credits" && (
          <div className={`rounded-2xl shadow-sm border p-8 text-center ${
            dark ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200/60"
          }`}>
            <i className="fas fa-coins text-5xl text-amber-400 mb-4"></i>
            <h2 className="text-2xl font-bold mb-2">{user.credits} Credits Available</h2>
            <p className={`${dark ? "text-gray-400" : "text-slate-500"}`}>You have {user.credits} credits remaining in your {user.plan} plan</p>
            <button className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition">
              Buy More Credits
            </button>
          </div>
        )}

        {activeTab === "pricing" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className={`rounded-2xl shadow-sm border p-8 ${
            dark ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200/60"
          }`}>
            <h2 className="text-xl font-bold mb-6">Detailed Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-4 rounded-xl ${dark ? "bg-gray-700/50" : "bg-slate-50/80"}`}>
                <div className={`text-sm ${dark ? "text-gray-400" : "text-slate-500"}`}>Total Requests</div>
                <div className="text-2xl font-bold">{usageStats.totalRequests.toLocaleString()}</div>
              </div>
              <div className={`p-4 rounded-xl ${dark ? "bg-gray-700/50" : "bg-slate-50/80"}`}>
                <div className={`text-sm ${dark ? "text-gray-400" : "text-slate-500"}`}>API Calls</div>
                <div className="text-2xl font-bold">{usageStats.apiCalls.toLocaleString()}</div>
              </div>
              <div className={`p-4 rounded-xl ${dark ? "bg-gray-700/50" : "bg-slate-50/80"}`}>
                <div className={`text-sm ${dark ? "text-gray-400" : "text-slate-500"}`}>Active Agents</div>
                <div className="text-2xl font-bold">{usageStats.activeAgents.length}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "logs" && (
          <div className={`rounded-2xl shadow-sm border p-6 ${
            dark ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200/60"
          }`}>
            <h2 className="text-xl font-bold mb-6">Activity Logs</h2>
            <div className="divide-y divide-slate-100 dark:divide-gray-700">
              {recentLogs.map((log) => (
                <LogItem key={log.id} log={log} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "prompts" && (
          <div className={`rounded-2xl shadow-sm border p-6 ${
            dark ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200/60"
          }`}>
            <h2 className="text-xl font-bold mb-6">Suggested Prompts</h2>
            <ul className="space-y-3">
              {suggestedPrompts.map((prompt, idx) => (
                <li key={idx} className={`p-4 rounded-xl flex items-center gap-4 transition ${
                  dark ? "bg-gray-700/50 hover:bg-gray-700" : "bg-slate-50/80 hover:bg-indigo-50/40"
                }`}>
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    dark ? "bg-indigo-900/40 text-indigo-300" : "bg-indigo-100/70 text-indigo-600"
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="flex-1">{prompt}</span>
                  <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition">
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className={`mt-8 text-center text-xs border-t pt-6 flex flex-wrap items-center justify-center gap-2 ${
          dark ? "text-gray-500 border-gray-700" : "text-slate-400 border-slate-200/60"
        }`}>
          <span className={`px-3 py-1 rounded-full ${dark ? "bg-gray-800" : "bg-slate-100"}`}>
            🔄 router → chat · search · coding · pdf · ppt · image · resume
          </span>
          <span className={dark ? "text-gray-600" : "text-slate-300"}>|</span>
          <span className={`px-3 py-1 rounded-full ${dark ? "bg-gray-800" : "bg-slate-100"}`}>
            ⚡ LangGraph workflow active
          </span>
          <span className={dark ? "text-gray-600" : "text-slate-300"}>|</span>
          <span className={`px-3 py-1 rounded-full ${dark ? "bg-gray-800" : "bg-slate-100"}`}>
            🧠 Solvix AI · v2.0
          </span>
        </div>
      </div>
    </div>
  );
}