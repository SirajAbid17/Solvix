import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  FiChevronLeft,
} from "react-icons/fi";

import {
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


const formatPlan = (plan) => {
  if (!plan) return "Free";
  return (
    String(plan).charAt(0).toUpperCase() + String(plan).slice(1).toLowerCase()
  );
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

const PAID_SERVICES = [
  "Resume Upload",
  "CV Generator",
  "Portfolio Generator",
  "Mock Interview",
];


const PaginatedList = ({
  items = [],
  itemsPerPage = 5,
  renderItem,
  emptyState,
  resetKey,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [resetKey, items.length]);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  if (!items.length) return emptyState || null;

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {paginatedItems.map((item, index) => renderItem(item, index))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-4 sm:flex-row">
          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-300">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            –{" "}
            <span className="font-semibold text-gray-300">
              {Math.min(currentPage * itemsPerPage, items.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-300">{items.length}</span>
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-gray-400 transition hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-400 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <FiChevronLeft className="text-sm" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                if (totalPages <= 7) return true;
                return (
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1
                );
              })
              .map((page, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && page - prev > 1;
                return (
                  <React.Fragment key={page}>
                    {showEllipsis && (
                      <span className="px-1 text-xs text-gray-600">…</span>
                    )}
                    <button
                      type="button"
                      onClick={() => goToPage(page)}
                      className={`h-8 min-w-8 rounded-lg px-2 text-xs font-semibold transition ${
                        currentPage === page
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                          : "border border-white/[0.08] bg-white/[0.02] text-gray-400 hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-400"
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-gray-400 transition hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-400 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <FiChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


const ChartsSection = ({
  chartData,
  weeklyData,
  serviceUsage,
  isPaidOnly = false,
}) => {
  const dailyChartData = chartData?.length
    ? chartData.map((day) => ({
        name:
          day.day ||
          new Date(day.date).toLocaleDateString("en-US", { weekday: "short" }),
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


  const pieData = Object.entries(serviceUsage || {})
    .filter(([name, value]) => {
      
      if (!isPaidOnly) return Number(value) > 0;

     
      return (
        Number(value) > 0 &&
        PAID_SERVICES.some((svc) =>
          name.toLowerCase().includes(svc.toLowerCase()),
        )
      );
    })
    .map(([name, value]) => ({
      name,
      value: Number(value) || 0,
    }));

  const hasData = pieData.length > 0;

  const totalForPie = pieData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
     
      <Card className="p-6">
        <SectionHeader
          title="Daily Paid Requests"
          description="Track your paid API usage over the last 7 days"
          icon={<FiCalendar />}
        />
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyChartData}>
              <defs>
                <linearGradient
                  id="requestsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#171717" />
              <XAxis
                dataKey="name"
                stroke="#555"
                tick={{ fill: "#666", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="#555"
                tick={{ fill: "#666", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#080808",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="requests"
                stroke="#6366F1"
                strokeWidth={2}
                fill="url(#requestsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

     
      <Card className="p-6">
        <SectionHeader
          title="Paid Service Distribution"
          description="Breakdown of your paid service usage"
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
                {(hasData ? pieData : [{ name: "No Data", value: 1 }]).map(
                  (entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ),
                )}
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

        {hasData && (
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {pieData.map((item, index) => {
              const percentage =
                totalForPie > 0
                  ? ((item.value / totalForPie) * 100).toFixed(0)
                  : 0;
              return (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                  <span className="text-xs text-gray-500">{item.name}</span>
                  <span className="text-xs font-bold text-gray-400">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};


export default function UserData() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userdata } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("overview");
  const [loggingOut, setLoggingOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState(null);

  const dashboardRef = useRef(null);

  const userName = userdata?.name || "User";
  const userEmail = userdata?.email || "user@email.com";
  const userAvatar = userdata?.avatar || "";
  const userPlan = formatPlan(userdata?.plan);
  const userCredits = getCredits(userdata);
  const initials = useMemo(() => getInitials(userName), [userName]);

  
  const fetchActivity = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getUserActivity();

      if (response?.success && response?.data) {
        setActivityData(response.data);
      } else {
        setActivityData({
          totalRequests: 0,
          paidRequests: 0,
          totalCreditsUsed: 0,
          dailyData: [],
          weeklyData: [],
          serviceUsage: {},
          paidDailyData: [],
          paidWeeklyData: [],
          paidServiceUsage: {},
          creditHistory: [],
        });
      }
    } catch (error) {
      console.error("Error fetching activity:", error);
      setActivityData({
        totalRequests: 0,
        paidRequests: 0,
        totalCreditsUsed: 0,
        dailyData: [],
        weeklyData: [],
        serviceUsage: {},
        paidDailyData: [],
        paidWeeklyData: [],
        paidServiceUsage: {},
        creditHistory: [],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);


  useGSAP(
    () => {
      gsap.fromTo(
        ".dashboard-header",
        { opacity: 0, y: -25 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
      );
      gsap.fromTo(
        ".dashboard-tabs",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.15, ease: "power3.out" },
      );
    },
    { scope: dashboardRef },
  );

  useEffect(() => {
    const content = document.querySelector(".tab-content");
    if (!content) return;
    gsap.fromTo(
      content,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
    );
  }, [activeTab]);

  
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

  
  const tabs = [
    { id: "overview", label: "Overview", icon: <FiHome /> },
    { id: "analytics", label: "Analytics", icon: <FiBarChart2 /> },
    { id: "credits", label: "Credits", icon: <FiCreditCard /> },
    { id: "activity", label: "Activity", icon: <FiActivity /> },
    { id: "pricing", label: "Pricing", icon: <FiDollarSign /> },
  ];


  const totalRequests = Number(activityData?.paidRequests) || 0;
  const totalCreditsUsed = Number(activityData?.totalCreditsUsed) || 0;

  const activeAgents = Object.keys(activityData?.paidServiceUsage || {}).length;

  const creditHistory = activityData?.creditHistory || [];

  const weeklyChartData = activityData?.paidWeeklyData?.length
    ? activityData.paidWeeklyData.map((week) => ({
        name: week.label || `Week ${week.week?.split("-W")[1] || ""}`,
        requests: Number(week.count) || 0,
      }))
    : [];

  const weeklyAvg = weeklyChartData.length
    ? Math.round(
        weeklyChartData.reduce(
          (total, item) => total + Number(item.requests),
          0,
        ) / weeklyChartData.length,
      )
    : 0;

  const mostActive =
    Object.entries(activityData?.paidServiceUsage || {})
      .sort((a, b) => Number(b[1]) - Number(a[1]))
      .map(([name]) => name)
      .at(0) || "N/A";


  const paidPieData = Object.entries(activityData?.paidServiceUsage || {}).map(
    ([name, value]) => ({
      name,
      value: Number(value) || 0,
    }),
  );


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <p className="text-xs text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }


  return (
    <div
      ref={dashboardRef}
      className="min-h-screen mt-[2px] bg-black text-white"
    >
      <div className="pointer-events-none fixed left-1/2 top-0 z-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/[0.035] blur-[130px]" />

      <DashboardHeader
        userCredits={userCredits}
        userPlan={userPlan}
        loggingOut={loggingOut}
        handleLogout={handleLogout}
      />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-8">
        <div className="h-[62px]" />

        <DashboardTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="tab-content">
         
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

              <AgentUsageGrid
                serviceUsage={activityData?.paidServiceUsage || {}}
              />

              <PricingSection />
            </>
          )}

         
          {activeTab === "analytics" && (
            <ChartsSection
              chartData={activityData?.paidDailyData || []}
              weeklyData={activityData?.paidWeeklyData || []}
              serviceUsage={activityData?.paidServiceUsage || {}}
              isPaidOnly={true}
            />
          )}

         
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

              <Card className="p-6">
                <SectionHeader
                  title="Credit Usage History"
                  description="Your latest credit transactions"
                  icon={<FiClock />}
                />
                <PaginatedList
                  items={creditHistory}
                  itemsPerPage={5}
                  resetKey={activeTab}
                  emptyState={
                    <EmptyState
                      icon={<FiClock />}
                      title="No credit usage history yet"
                      description="Start using Solvix AI to see your credit transactions."
                    />
                  }
                  renderItem={(item, index) => (
                    <div
                      key={`credit-${index}`}
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
                  )}
                />
              </Card>
            </div>
          )}

         
          {activeTab === "activity" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard
                  icon={<FiActivity />}
                  label="Paid Activity"
                  value={totalRequests.toLocaleString()}
                  subtext="paid requests"
                  delay={0}
                />
                <StatCard
                  icon={<FiTrendingUp />}
                  label="Weekly Average"
                  value={weeklyAvg}
                  subtext="paid requests per week"
                  delay={1}
                />
                <StatCard
                  icon={<FiZap />}
                  label="Most Active"
                  value={mostActive}
                  subtext="paid service"
                  delay={2}
                />
              </div>

              <Card className="p-6">
                <SectionHeader
                  title="Paid Service Distribution"
                  description="Breakdown of your paid service usage"
                  icon={<FiPieChart />}
                />
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={
                          paidPieData.length
                            ? paidPieData
                            : [{ name: "No Data", value: 1 }]
                        }
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={105}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {(paidPieData.length
                          ? paidPieData
                          : [{ name: "No Data", value: 1 }]
                        ).map((entry, index) => (
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

              <Card className="p-6">
                <SectionHeader
                  title="Recent Activity Log"
                  description="Latest paid actions performed"
                  icon={<FiActivity />}
                />
                <PaginatedList
                  items={creditHistory}
                  itemsPerPage={5}
                  resetKey={activeTab}
                  emptyState={
                    <EmptyState
                      icon={<FiActivity />}
                      title="No activity recorded yet"
                      description="Start using Solvix AI to see your activity."
                    />
                  }
                  renderItem={(item, index) => (
                    <div
                      key={`activity-${index}`}
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
                  )}
                />
              </Card>
            </div>
          )}

         
          {activeTab === "pricing" && <PricingSection full />}
        </div>
      </main>
    </div>
  );
}
