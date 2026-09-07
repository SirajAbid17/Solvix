// src/pages/UserData.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import {
  FiHome,
  FiBarChart2,
  FiCreditCard,
  FiActivity,
  FiDollarSign,
  FiClock,
  FiTrendingUp,
  FiZap,
  FiPieChart,
  FiCalendar,
  FiChevronRight,
} from "react-icons/fi";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// ✅ ALL IMPORTS - CORRECT PATHS
import BgContextBtn from "../BgContextBtn";
import DashboardHeader from "./DashboardHeader";
import DashboardTabs from "./DashboardTabs";
import UserProfileCard from "./UserProfileCard";
import StatsGrid from "./StatsGrid";
import CreditCards from "./CreditCards";
import AgentUsageGrid from "./AgentUsageGrid";
import PricingSection from "./PricingSection";
import { Card, StatCard, SectionHeader, EmptyState } from "./shared";

import { setuserData } from "../../redux/userSlice";
import { clearConversations } from "../../redux/conversationSlice";
import api from "../../utlis/axios";
import { getUserActivity } from "../../Features/activity";

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// HELPERS
// ============================================================

const formatPlan = (plan) => {
  if (!plan) return "Free";
  return String(plan).charAt(0).toUpperCase() + String(plan).slice(1).toLowerCase();
};

const getCredits = (user) => {
  if (!user) return 0;
  return Number(user.credits ?? 0);
};

const getInitials = (name = "User") => {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

const formatDate = (date) => {
  if (!date) return "N/A";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "N/A";
  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (date) => {
  if (!date) return "N/A";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "N/A";
  return parsedDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const COLORS = [
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#3B82F6",
];

// ============================================================
// CHARTS SECTION COMPONENT
// ============================================================

const ChartsSection = ({ chartData, weeklyData, serviceUsage }) => {
  const dailyChartData = chartData?.length
    ? chartData.map((day) => ({
        name: day.day || new Date(day.date).toLocaleDateString("en-US", { weekday: "short" }),
        requests: Number(day.count) || 0,
      }))
    : [
        { name: "Mon", requests: 0 },
        { name: "Tue", requests: 0 },
        { name: "Wed", requests: 0 },
        { name: "Thu", requests: 0 },
        { name: "Fri", requests: 0 },
        { name: "Sat", requests: 0 },
        { name: "Sun", requests: 0 },
      ];

  const weeklyChartData = weeklyData?.length
    ? weeklyData.map((week) => ({
        name: week.label || `Week ${week.week?.split("-W")[1] || ""}`,
        requests: Number(week.count) || 0,
      }))
    : [
        { name: "Week 1", requests: 0 },
        { name: "Week 2", requests: 0 },
        { name: "Week 3", requests: 0 },
        { name: "Week 4", requests: 0 },
      ];

  const pieData = Object.entries(serviceUsage || {}).map(([name, value]) => ({
    name,
    value: Number(value) || 0,
  }));

  const hasData = pieData.length > 0;

  return (
    <div className="space-y-6">
      {/* Daily Chart */}
      <Card className="p-6">
        <SectionHeader
          title="Daily Requests"
          description="Track your daily API usage over the last 7 days"
          icon={<FiCalendar />}
        />
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyChartData}>
              <defs>
                <linearGradient id="requestsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#171717" />
              <XAxis dataKey="name" stroke="#555" tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#555" tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#080808", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "#fff" }} />
              <Area type="monotone" dataKey="requests" stroke="#6366F1" strokeWidth={2} fill="url(#requestsGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

   

      {/* Pie Chart */}
      <Card className="p-6">
        <SectionHeader
          title="Service Distribution"
          description="Breakdown of your API service usage"
          icon={<FiPieChart />}
        />
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={hasData ? pieData : [{ name: "No Data", value: 1 }]}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={105}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                label={({ name, percent }) =>
                  hasData ? `${name} ${(percent * 100).toFixed(0)}%` : "No Data"
                }
              >
                {(hasData ? pieData : [{ name: "No Data", value: 1 }]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#080808", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "#fff" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {hasData && (
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {pieData.map((item, index) => {
              const total = pieData.reduce((sum, current) => sum + current.value, 0);
              const percentage = total > 0 ? ((item.value / total) * 100).toFixed(0) : 0;
              return (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-xs text-gray-500">{item.name}</span>
                  <span className="text-xs font-bold text-gray-400">{percentage}%</span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

// ============================================================
// MAIN DASHBOARD
// ============================================================

export default function UserData() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userdata } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("overview");
  const [loggingOut, setLoggingOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState(null);

  const dashboardRef = useRef(null);

  // ==========================================================
  // USER DATA
  // ==========================================================

  const userName = userdata?.name || "User";
  const userEmail = userdata?.email || "user@email.com";
  const userAvatar = userdata?.avatar || "";
  const userPlan = formatPlan(userdata?.plan);
  const userCredits = getCredits(userdata);
  const initials = useMemo(() => getInitials(userName), [userName]);

  // ==========================================================
  // FETCH ACTIVITY
  // ==========================================================

  const fetchActivity = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getUserActivity();

      if (response?.success && response?.data) {
        setActivityData(response.data);
      } else {
        setActivityData({
          totalRequests: 0,
          totalCreditsUsed: 0,
          dailyData: [],
          weeklyData: [],
          serviceUsage: {},
          creditHistory: [],
        });
      }
    } catch (error) {
      console.error("Error fetching activity:", error);
      setActivityData({
        totalRequests: 0,
        totalCreditsUsed: 0,
        dailyData: [],
        weeklyData: [],
        serviceUsage: {},
        creditHistory: [],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  // ==========================================================
  // GSAP PAGE ANIMATION
  // ==========================================================

  useGSAP(
    () => {
      gsap.fromTo(
        ".dashboard-header",
        { opacity: 0, y: -25 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      );
      gsap.fromTo(
        ".dashboard-tabs",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.15, ease: "power3.out" }
      );
    },
    { scope: dashboardRef }
  );

  // ==========================================================
  // TAB ANIMATION
  // ==========================================================

  useEffect(() => {
    const content = document.querySelector(".tab-content");
    if (!content) return;
    gsap.fromTo(
      content,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );
  }, [activeTab]);

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = async () => {
    if (loggingOut) return;
    try {
      setLoggingOut(true);
      await api.post("/auth/logout");
      dispatch(setuserData(null));
      dispatch(clearConversations());
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  // ==========================================================
  // TABS
  // ==========================================================

  const tabs = [
    { id: "overview", label: "Overview", icon: <FiHome /> },
    { id: "analytics", label: "Analytics", icon: <FiBarChart2 /> },
    { id: "credits", label: "Credits", icon: <FiCreditCard /> },
    { id: "activity", label: "Activity", icon: <FiActivity /> },
    { id: "pricing", label: "Pricing", icon: <FiDollarSign /> },
  ];

  // ==========================================================
  // STATS
  // ==========================================================

  const totalRequests = Number(activityData?.totalRequests) || 0;
  const totalCreditsUsed = Number(activityData?.totalCreditsUsed) || 0;
  const activeAgents = Object.keys(activityData?.serviceUsage || {}).length;
  const creditHistory = activityData?.creditHistory || [];

  const weeklyChartData = activityData?.weeklyData?.length
    ? activityData.weeklyData.map((week) => ({
        name: week.label || `Week ${week.week?.split("-W")[1] || ""}`,
        requests: Number(week.count) || 0,
      }))
    : [];

  const weeklyAvg = weeklyChartData.length
    ? Math.round(
        weeklyChartData.reduce((total, item) => total + Number(item.requests), 0) /
          weeklyChartData.length
      )
    : 0;

  const mostActive =
    Object.entries(activityData?.serviceUsage || {})
      .sort((a, b) => Number(b[1]) - Number(a[1]))
      .map(([name]) => name)
      .at(0) || "N/A";

  const pieData = Object.entries(activityData?.serviceUsage || {}).map(([name, value]) => ({
    name,
    value: Number(value) || 0,
  }));

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        
      </div>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div ref={dashboardRef} className="min-h-screen bg-black text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed left-1/2 top-0 z-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/[0.035] blur-[130px]" />

      <BgContextBtn />

      {/* HEADER */}
      <DashboardHeader
        userCredits={userCredits}
        userPlan={userPlan}
        loggingOut={loggingOut}
        handleLogout={handleLogout}
      />

      {/* MAIN */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-8">
        <div className="h-[62px]" />

        {/* TABS */}
        <DashboardTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* TAB CONTENT */}
        <div className="tab-content">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <>
              <UserProfileCard
                userName={userName}
                userEmail={userEmail}
                userAvatar={userAvatar}
                userPlan={userPlan}
                userCredits={userCredits}
                initials={initials}
              />

              <StatsGrid
                totalRequests={totalRequests}
                totalCreditsUsed={totalCreditsUsed}
                userPlan={userPlan}
                activeAgents={activeAgents}
              />

              <CreditCards
                userCredits={userCredits}
                userPlan={userPlan}
                totalRequests={totalRequests}
              />

              <AgentUsageGrid serviceUsage={activityData?.serviceUsage || {}} />

              {/* Pricing Section */}
              <PricingSection />
            </>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === "analytics" && (
            <ChartsSection
              chartData={activityData?.dailyData || []}
              weeklyData={activityData?.weeklyData || []}
              serviceUsage={activityData?.serviceUsage || {}}
            />
          )}

          {/* CREDITS TAB */}
          {activeTab === "credits" && (
            <div className="space-y-6">
              <Card className="relative overflow-hidden p-8 text-center">
                <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-amber-500/[0.04] blur-3xl" />
                <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-amber-500/20 bg-amber-500/10 text-4xl text-amber-400">
                  <FiCreditCard />
                </div>
                <h2 className="relative mt-5 text-3xl font-extrabold text-white">
                  {userCredits} Credits
                </h2>
                <p className="relative mt-2 text-sm text-gray-500">
                  {userName}, you currently have{" "}
                  <strong className="text-gray-300">{userCredits}</strong>{" "}
                  credits available on your{" "}
                  <strong className="text-gray-300">{userPlan}</strong> plan.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("pricing")}
                  className="relative mt-7 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-500"
                >
                  Buy More Credits
                </button>
              </Card>

              {/* Credit history */}
              <Card className="p-6">
                <SectionHeader
                  title="Credit Usage History"
                  description="Your latest credit transactions"
                  icon={<FiClock />}
                />
                {creditHistory.length > 0 ? (
                  <div className="space-y-2">
                    {creditHistory.slice(0, 10).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.015] p-3 transition hover:border-white/10 hover:bg-white/[0.025]"
                      >
                        <div className="min-w-0">
                          <span className="text-sm font-medium text-white">
                            {item.service || "Unknown Service"}
                          </span>
                          <p className="mt-1 text-xs text-gray-600">
                            {formatDate(item.timestamp)} at{" "}
                            {formatTime(item.timestamp)}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <span className="text-sm font-semibold text-red-400">
                            -{item.credits ?? 0}
                          </span>
                          <p className="mt-1 text-[10px] text-gray-600">
                            Remaining: {item.remaining ?? 0}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<FiClock />}
                    title="No credit usage history yet"
                    description="Start using Solvix AI to see your credit transactions."
                  />
                )}
              </Card>
            </div>
          )}

          {/* ACTIVITY TAB */}
          {activeTab === "activity" && (
            <div className="space-y-6">
              {/* Activity stats */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard
                  icon={<FiActivity />}
                  label="Total Activity"
                  value={totalRequests.toLocaleString()}
                  subtext="all time"
                  delay={0}
                />
                <StatCard
                  icon={<FiTrendingUp />}
                  label="Weekly Average"
                  value={weeklyAvg}
                  subtext="requests per week"
                  delay={1}
                />
                <StatCard
                  icon={<FiZap />}
                  label="Most Active"
                  value={mostActive}
                  subtext="service"
                  delay={2}
                />
              </div>

              <Card className="p-6">
                <SectionHeader
                  title="Service Distribution"
                  description="Breakdown of your service usage"
                  icon={<FiPieChart />}
                />
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={105}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#080808",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Activity log */}
              <Card className="p-6">
                <SectionHeader
                  title="Recent Activity Log"
                  description="Latest actions performed"
                  icon={<FiActivity />}
                />
                {creditHistory.length > 0 ? (
                  <div className="space-y-3">
                    {creditHistory.slice(0, 10).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.015] p-3 transition hover:border-indigo-500/20 hover:bg-indigo-500/[0.02]"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                            <FiChevronRight className="text-xs" />
                          </div>
                          <div className="min-w-0">
                            <span className="block truncate text-sm font-medium text-white">
                              {item.service || "Unknown Service"}
                            </span>
                            <p className="mt-1 text-xs text-gray-600">
                              {formatDate(item.timestamp)} at{" "}
                              {formatTime(item.timestamp)}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <span className="text-sm font-semibold text-red-400">
                            -{item.credits ?? 0}
                          </span>
                          <p className="mt-1 text-[10px] text-gray-600">
                            {item.remaining ?? 0} remaining
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<FiActivity />}
                    title="No activity recorded yet"
                    description="Start using Solvix AI to see your activity."
                  />
                )}
              </Card>
            </div>
          )}

          {/* PRICING TAB */}
          {activeTab === "pricing" && <PricingSection full />}
        </div>
      </main>
    </div>
  );
}