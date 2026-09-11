// src/pages/AdminData.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiCreditCard,
  FiActivity,
  FiCpu,
  FiDatabase,
  FiServer,
  FiTrendingUp,
  FiBarChart2,
  FiDollarSign,
  FiCalendar,
  FiClock,
  FiStar,
  FiShield,
  FiSettings,
  FiLogOut,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiEdit,
  FiTrash2,
  FiChevronDown,
  FiChevronRight,
  FiRefreshCw,
  FiAlertCircle,
  FiUser,
  FiMail,
  FiTag,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

import api from "../../utlis/axios";
import { useTheme } from "../../BgContext/ThemeContext";

// ============================================================
// COMPONENTS
// ============================================================

const StatCard = ({ icon: Icon, label, value, subtext, color, dark }) => {
  const colorMap = {
    blue: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    green: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    red: "border-red-500/20 bg-red-500/10 text-red-400",
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    purple: "border-purple-500/20 bg-purple-500/10 text-purple-400",
    indigo: "border-indigo-500/20 bg-indigo-500/10 text-indigo-400",
    pink: "border-pink-500/20 bg-pink-500/10 text-pink-400",
    teal: "border-teal-500/20 bg-teal-500/10 text-teal-400",
  };

  return (
    <div className={`rounded-xl border p-4 transition hover:-translate-y-0.5 hover:border-indigo-500/30 ${
      dark ? "border-white/[0.08] bg-white/[0.02]" : "border-gray-200 bg-white"
    }`}>
      <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border ${colorMap[color]}`}>
        <Icon size={14} />
      </div>
      <p className={`mt-2 text-lg font-bold ${dark ? "text-white" : "text-gray-900"}`}>
        {value !== undefined && value !== null ? value : 0}
      </p>
      <p className={`text-[10px] ${dark ? "text-gray-500" : "text-gray-400"}`}>{label}</p>
      {subtext && <p className={`text-[9px] ${dark ? "text-gray-600" : "text-gray-300"}`}>{subtext}</p>}
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex min-h-[200px] items-center justify-center">
    <div className="text-center">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      <p className="mt-3 text-sm text-gray-500">Loading...</p>
    </div>
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function AdminData() {
  const navigate = useNavigate();
  const { dark } = useTheme();

  // ============================================================
  // STATE - All initialized with proper defaults
  // ============================================================

  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  // All data states initialized with proper defaults
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    inactiveUsers: 0,
    suspendedUsers: 0,
    newUsersThisMonth: 0,
    totalCreditsUsed: 0,
    avgCreditsPerUser: 0,
    totalRevenue: 0,
    totalAgents: 7,
    totalRequests: 0,
  });

  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [agentUsage, setAgentUsage] = useState([]);
  const [planDistribution, setPlanDistribution] = useState([]);
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    newUserRegistration: true,
    freePlanCredits: 10,
    defaultLanguage: "en",
    emailNotifications: true,
    creditAlertThreshold: 5,
    maxFileSize: 10,
  });

  // ============================================================
  // FETCH FUNCTIONS with error handling
  // ============================================================

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/admin/stats");
      if (data?.success) {
        setStats({
          totalUsers: data.data?.totalUsers || 0,
          activeUsers: data.data?.activeUsers || 0,
          adminUsers: data.data?.adminUsers || 0,
          inactiveUsers: data.data?.inactiveUsers || 0,
          suspendedUsers: data.data?.suspendedUsers || 0,
          newUsersThisMonth: data.data?.newUsersThisMonth || 0,
          totalCreditsUsed: data.data?.totalCreditsUsed || 0,
          avgCreditsPerUser: data.data?.avgCreditsPerUser || 0,
          totalRevenue: data.data?.totalRevenue || 0,
          totalAgents: 7,
          totalRequests: data.data?.totalRequests || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/admin/users");
      if (data?.success) {
        setUsers(data.users || []);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get("/admin/transactions");
      if (data?.success) {
        setTransactions(data.data || []);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    }
  };

  const fetchActivities = async () => {
    try {
      const { data } = await api.get("/admin/activities");
      if (data?.success) {
        setRecentActivities(data.data || []);
      } else {
        setRecentActivities([]);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      setRecentActivities([]);
    }
  };

  const fetchAgentUsage = async () => {
    try {
      const { data } = await api.get("/admin/agent-usage");
      if (data?.success) {
        setAgentUsage(data.data || []);
      } else {
        setAgentUsage([]);
      }
    } catch (error) {
      console.error("Error fetching agent usage:", error);
      setAgentUsage([]);
    }
  };

  const fetchPlanDistribution = async () => {
    try {
      const { data } = await api.get("/admin/plan-distribution");
      if (data?.success) {
        setPlanDistribution(data.data || []);
      } else {
        setPlanDistribution([]);
      }
    } catch (error) {
      console.error("Error fetching plan distribution:", error);
      setPlanDistribution([]);
    }
  };

  const fetchSettings = async () => {
    try {
      const { data } = await api.get("/admin/settings");
      if (data?.success) {
        setSettings({
          maintenanceMode: data.data?.maintenanceMode || false,
          newUserRegistration: data.data?.newUserRegistration !== undefined ? data.data.newUserRegistration : true,
          freePlanCredits: data.data?.freePlanCredits || 10,
          defaultLanguage: data.data?.defaultLanguage || "en",
          emailNotifications: data.data?.emailNotifications !== undefined ? data.data.emailNotifications : true,
          creditAlertThreshold: data.data?.creditAlertThreshold || 5,
          maxFileSize: data.data?.maxFileSize || 10,
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await Promise.all([
        fetchStats(),
        fetchUsers(),
        fetchTransactions(),
        fetchActivities(),
        fetchAgentUsage(),
        fetchPlanDistribution(),
        fetchSettings(),
      ]);

    } catch (error) {
      console.error("Error fetching admin data:", error);
      setError("Failed to load admin data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  };

  // ============================================================
  // SAVE SETTINGS
  // ============================================================

  const saveSettings = async () => {
    try {
      setSavingSettings(true);
      const { data } = await api.put("/admin/settings", settings);
      
      if (data.success) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error(data.message || "Failed to save settings");
      }
    } catch (error) {
      console.error("Save settings error:", error);
      toast.error(error.response?.data?.message || "Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

  // ============================================================
  // EFFECTS
  // ============================================================

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // ============================================================
  // HELPER FUNCTIONS
  // ============================================================

  const getPlanColor = (plan) => {
    if (!plan) return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    const p = plan.toLowerCase();
    if (p === "pro") return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    if (p === "starter") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (p === "enterprise") return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    const s = status.toLowerCase();
    if (s === "active") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (s === "inactive") return "bg-red-500/10 text-red-400 border-red-500/20";
    if (s === "pending") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    if (s === "suspended") return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    if (s === "admin") return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      const d = new Date(date);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return "N/A";
    }
  };

  const formatTime = (date) => {
    if (!date) return "N/A";
    try {
      const d = new Date(date);
      return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "N/A";
    }
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return "$0";
    return `$${Number(amount).toFixed(2)}`;
  };

  // ============================================================
  // FILTER USERS - Safe with null check
  // ============================================================

  const filteredUsers = (users || []).filter((user) =>
    (user?.name || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
    (user?.email || "").toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  // ============================================================
  // STATS CARDS
  // ============================================================

  const statCards = [
    { icon: FiUsers, label: "Total Users", value: stats.totalUsers || 0, color: "blue" },
    { icon: FiUserCheck, label: "Active Users", value: stats.activeUsers || 0, color: "green" },
    { icon: FiUserX, label: "Inactive Users", value: (stats.inactiveUsers || 0) + (stats.suspendedUsers || 0), color: "red" },
    { icon: FiCreditCard, label: "Credits Used", value: stats.totalCreditsUsed || 0, color: "amber" },
    { icon: FiDollarSign, label: "Revenue", value: formatCurrency(stats.totalRevenue || 0), color: "emerald" },
    { icon: FiActivity, label: "Total Requests", value: stats.totalRequests || 0, color: "purple" },
  ];

  // ============================================================
  // RENDER
  // ============================================================

  if (loading) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${dark ? "bg-black" : "bg-gray-50"}`}>
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className={`mt-4 text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${dark ? "bg-black" : "bg-gray-50"}`}>
        <div className="text-center">
          <FiAlertCircle className="mx-auto text-4xl text-red-500" />
          <p className={`mt-4 text-sm ${dark ? "text-gray-300" : "text-gray-700"}`}>{error}</p>
          <button
            onClick={refreshData}
            className="mt-4 rounded-xl bg-indigo-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${dark ? "bg-black" : "bg-gray-50"}`}>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className={`fixed left-0 top-0 z-50 w-full border-b transition-colors ${
        dark ? "border-white/[0.08] bg-black/90" : "border-gray-200 bg-white/90"
      } backdrop-blur-2xl`}>
        <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                dark
                  ? "border-white/10 bg-white/[0.05] text-white/60 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <FiArrowLeft size={17} />
            </button>

            <div className="flex items-center gap-2.5">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                dark ? "border-indigo-500/20 bg-indigo-500/10" : "border-indigo-200 bg-indigo-50"
              }`}>
                <FiShield size={17} className={dark ? "text-indigo-400" : "text-indigo-600"} />
              </div>
              <div>
                <div className={`text-[14px] font-semibold ${dark ? "text-white" : "text-gray-900"}`}>
                  Admin Panel
                </div>
                <div className={`text-[9px] font-medium ${dark ? "text-white/40" : "text-gray-400"}`}>
                  System Management
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshData}
              disabled={refreshing}
              className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition ${
                dark
                  ? "border-white/10 bg-white/[0.04] text-white/70 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900"
              } ${refreshing ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <FiRefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
              <span className="hidden sm:inline">{refreshing ? "Refreshing..." : "Refresh"}</span>
            </button>

            <button
              onClick={() => navigate("/")}
              className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition ${
                dark
                  ? "border-white/10 bg-white/[0.04] text-white/70 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <FiLogOut size={13} />
              <span className="hidden sm:inline">Exit Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="relative mx-auto max-w-[1400px] px-4 pt-[84px] pb-12 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className={`mb-6 flex gap-2 overflow-x-auto border-b pb-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 ${
          dark ? "border-white/[0.08]" : "border-gray-200"
        }`}>
          {[
            { id: "overview", label: "Overview", icon: FiBarChart2 },
            { id: "users", label: "Users", icon: FiUsers },
            { id: "agents", label: "Agents", icon: FiCpu },
            { id: "transactions", label: "Transactions", icon: FiCreditCard },
            { id: "settings", label: "Settings", icon: FiSettings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : dark
                    ? "text-gray-500 hover:bg-white/[0.04] hover:text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* ===================================================
              OVERVIEW TAB
          =================================================== */}

          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {statCards.map((stat, index) => (
                  <StatCard
                    key={index}
                    icon={stat.icon}
                    label={stat.label}
                    value={stat.value}
                    color={stat.color}
                    dark={dark}
                  />
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Agent Usage */}
                <div className={`rounded-xl border p-5 ${
                  dark ? "border-white/[0.08] bg-white/[0.02]" : "border-gray-200 bg-white"
                }`}>
                  <h3 className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"} mb-4`}>
                    Agent Usage
                  </h3>
                  {(agentUsage || []).length > 0 ? (
                    <div className="space-y-2.5">
                      {(agentUsage || []).map((agent) => {
                        const colorMap = {
                          blue: "bg-blue-500",
                          green: "bg-emerald-500",
                          purple: "bg-purple-500",
                          orange: "bg-orange-500",
                          red: "bg-red-500",
                          pink: "bg-pink-500",
                          teal: "bg-teal-500",
                          indigo: "bg-indigo-500",
                        };
                        return (
                          <div key={agent.name} className="space-y-0.5">
                            <div className="flex justify-between text-xs">
                              <span className={dark ? "text-gray-400" : "text-gray-600"}>{agent.name}</span>
                              <span className={dark ? "text-white/60" : "text-gray-500"}>{agent.usage}%</span>
                            </div>
                            <div className={`h-1.5 w-full overflow-hidden rounded-full ${
                              dark ? "bg-white/[0.06]" : "bg-gray-200"
                            }`}>
                              <div
                                className={`h-full rounded-full ${colorMap[agent.color] || "bg-indigo-500"}`}
                                style={{ width: `${agent.usage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className={dark ? "text-gray-500" : "text-gray-400"}>No agent data available</p>
                  )}
                </div>

                {/* Recent Activity */}
                <div className={`rounded-xl border p-5 ${
                  dark ? "border-white/[0.08] bg-white/[0.02]" : "border-gray-200 bg-white"
                }`}>
                  <h3 className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"} mb-4`}>
                    Recent Activity
                  </h3>
                  {(recentActivities || []).length > 0 ? (
                    <div className="space-y-3">
                      {(recentActivities || []).slice(0, 8).map((activity) => (
                        <div
                          key={activity.id}
                          className={`flex items-center justify-between border-b pb-3 last:border-0 last:pb-0 ${
                            dark ? "border-white/[0.06]" : "border-gray-100"
                          }`}
                        >
                          <div>
                            <p className={`text-sm ${dark ? "text-white/80" : "text-gray-800"}`}>
                              {activity.user || "Unknown User"}
                            </p>
                            <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                              {activity.action || "No action"}
                            </p>
                          </div>
                          <span className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                            {activity.time || "Just now"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={dark ? "text-gray-500" : "text-gray-400"}>No recent activity</p>
                  )}
                </div>
              </div>

              {/* Plan Distribution */}
              <div className={`rounded-xl border p-5 ${
                dark ? "border-white/[0.08] bg-white/[0.02]" : "border-gray-200 bg-white"
              }`}>
                <h3 className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"} mb-4`}>
                  Plan Distribution
                </h3>
                {(planDistribution || []).length > 0 ? (
                  <div className="flex flex-wrap gap-4">
                    {(planDistribution || []).map((plan) => (
                      <div key={plan.name} className="flex items-center gap-2">
                        <span className={`rounded-full border px-2.5 py-0.5 text-xs ${getPlanColor(plan.name)}`}>
                          {plan.name}
                        </span>
                        <span className={`text-sm font-medium ${dark ? "text-white" : "text-gray-700"}`}>
                          {plan.count}
                        </span>
                        <span className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                          ({plan.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={dark ? "text-gray-500" : "text-gray-400"}>No plan data available</p>
                )}
              </div>
            </div>
          )}

          {/* ===================================================
              USERS TAB
          =================================================== */}

          {activeTab === "users" && (
            <div className="space-y-4">
              {/* Search & Filter */}
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      dark ? "text-gray-500" : "text-gray-400"
                    }`} size={14} />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full rounded-xl border py-2 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none ${
                        dark
                          ? "border-white/[0.08] bg-white/[0.02] text-white placeholder:text-gray-500"
                          : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
                      }`}
                    />
                  </div>
                </div>
                <button
                  onClick={refreshData}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition ${
                    dark
                      ? "border-white/[0.08] bg-white/[0.02] text-gray-400 hover:border-white/20 hover:text-white"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  <FiRefreshCw size={14} />
                  Refresh
                </button>
              </div>

              {/* Users Table */}
              <div className={`overflow-x-auto rounded-xl border ${
                dark ? "border-white/[0.08] bg-white/[0.02]" : "border-gray-200 bg-white"
              }`}>
                {(users || []).length > 0 ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className={`border-b text-left text-xs ${
                        dark ? "border-white/[0.06] text-gray-500" : "border-gray-200 text-gray-500"
                      }`}>
                        <th className="px-4 py-3 font-medium">User</th>
                        <th className="px-4 py-3 font-medium">Plan</th>
                        <th className="px-4 py-3 font-medium">Credits</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Requests</th>
                        <th className="px-4 py-3 font-medium">Joined</th>
                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className={`border-b last:border-0 hover:bg-white/[0.02] ${
                          dark ? "border-white/[0.06]" : "border-gray-100"
                        }`}>
                          <td className="px-4 py-3">
                            <div>
                              <p className={dark ? "text-white/90" : "text-gray-800"}>{user.name || "Unknown"}</p>
                              <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>{user.email || ""}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full border px-2.5 py-0.5 text-xs ${getPlanColor(user.plan)}`}>
                              {user.plan || "Free"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={dark ? "text-white/80" : "text-gray-700"}>{user.credits || 0}</span>
                            <span className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                              / {user.totalCredits || 0}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full border px-2.5 py-0.5 text-xs ${getStatusColor(user.status)}`}>
                              {user.status || "Inactive"}
                            </span>
                          </td>
                          <td className={dark ? "text-white/80" : "text-gray-700"}>{user.requests || 0}</td>
                          <td className={dark ? "text-gray-500" : "text-gray-400"}>{formatDate(user.createdAt)}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUserModal(true);
                              }}
                              className={dark ? "text-gray-500 transition hover:text-white" : "text-gray-400 transition hover:text-gray-700"}
                            >
                              <FiEye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-8 text-center">
                    <p className={dark ? "text-gray-500" : "text-gray-400"}>No users found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================================================
              AGENTS TAB
          =================================================== */}

          {activeTab === "agents" && (
            <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4`}>
              {(agentUsage || []).length > 0 ? (
                (agentUsage || []).map((agent) => {
                  const colorMap = {
                    blue: "border-blue-500/20 bg-blue-500/10 text-blue-400",
                    green: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
                    purple: "border-purple-500/20 bg-purple-500/10 text-purple-400",
                    orange: "border-orange-500/20 bg-orange-500/10 text-orange-400",
                    red: "border-red-500/20 bg-red-500/10 text-red-400",
                    pink: "border-pink-500/20 bg-pink-500/10 text-pink-400",
                    teal: "border-teal-500/20 bg-teal-500/10 text-teal-400",
                    indigo: "border-indigo-500/20 bg-indigo-500/10 text-indigo-400",
                  };
                  return (
                    <div
                      key={agent.name}
                      className={`rounded-xl border p-5 transition hover:-translate-y-0.5 hover:border-indigo-500/30 ${
                        dark ? "border-white/[0.08] bg-white/[0.02]" : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${colorMap[agent.color] || colorMap.indigo}`}>
                          <FiCpu size={18} />
                        </div>
                        <div>
                          <p className={`font-medium ${dark ? "text-white" : "text-gray-800"}`}>{agent.name}</p>
                          <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            <span className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                              {agent.usage}% usage
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`mt-3 h-1.5 w-full overflow-hidden rounded-full ${
                        dark ? "bg-white/[0.06]" : "bg-gray-200"
                      }`}>
                        <div
                          className={`h-full rounded-full ${colorMap[agent.color]?.split(" ")[0] || "bg-indigo-500"}`}
                          style={{ width: `${agent.usage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-8 text-center">
                  <p className={dark ? "text-gray-500" : "text-gray-400"}>No agent data available</p>
                </div>
              )}
            </div>
          )}

          {/* ===================================================
              TRANSACTIONS TAB
          =================================================== */}

          {activeTab === "transactions" && (
            <div className="space-y-4">
              <div className={`overflow-x-auto rounded-xl border ${
                dark ? "border-white/[0.08] bg-white/[0.02]" : "border-gray-200 bg-white"
              }`}>
                {(transactions || []).length > 0 ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className={`border-b text-left text-xs ${
                        dark ? "border-white/[0.06] text-gray-500" : "border-gray-200 text-gray-500"
                      }`}>
                        <th className="px-4 py-3 font-medium">User</th>
                        <th className="px-4 py-3 font-medium">Plan</th>
                        <th className="px-4 py-3 font-medium">Amount</th>
                        <th className="px-4 py-3 font-medium">Credits</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(transactions || []).map((transaction) => (
                        <tr key={transaction.id} className={`border-b last:border-0 hover:bg-white/[0.02] ${
                          dark ? "border-white/[0.06]" : "border-gray-100"
                        }`}>
                          <td className={`px-4 py-3 ${dark ? "text-white/90" : "text-gray-800"}`}>
                            {transaction.user || "Unknown"}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full border px-2.5 py-0.5 text-xs ${getPlanColor(transaction.plan)}`}>
                              {transaction.plan || "Free"}
                            </span>
                          </td>
                          <td className={dark ? "text-white/80" : "text-gray-700"}>
                            ${Number(transaction.amount || 0).toFixed(2)}
                          </td>
                          <td className={dark ? "text-white/80" : "text-gray-700"}>
                            {transaction.credits || 0}
                          </td>
                          <td className={dark ? "text-gray-500" : "text-gray-400"}>
                            {formatDate(transaction.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full border px-2.5 py-0.5 text-xs ${getStatusColor(transaction.status)}`}>
                              {transaction.status || "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-8 text-center">
                    <p className={dark ? "text-gray-500" : "text-gray-400"}>No transactions found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================================================
              SETTINGS TAB
          =================================================== */}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className={`rounded-xl border p-6 ${
                dark ? "border-white/[0.08] bg-white/[0.02]" : "border-gray-200 bg-white"
              }`}>
                <h3 className={`text-base font-semibold ${dark ? "text-white" : "text-gray-900"} mb-4`}>
                  System Settings
                </h3>
                <div className="space-y-4">
                  {/* Maintenance Mode */}
                  <div className={`flex items-center justify-between border-b pb-4 ${
                    dark ? "border-white/[0.06]" : "border-gray-200"
                  }`}>
                    <div>
                      <p className={`text-sm ${dark ? "text-white/80" : "text-gray-700"}`}>Maintenance Mode</p>
                      <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                        Enable maintenance mode for system updates
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input 
                        type="checkbox" 
                        checked={settings.maintenanceMode}
                        onChange={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                        className="peer sr-only" 
                      />
                      <div className={`h-6 w-11 rounded-full ${
                        dark ? "bg-white/[0.08] peer-checked:bg-indigo-600" : "bg-gray-200 peer-checked:bg-indigo-600"
                      } after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-white/10 after:bg-white after:transition-all peer-checked:after:translate-x-full`} />
                    </label>
                  </div>

                  {/* New User Registration */}
                  <div className={`flex items-center justify-between border-b pb-4 ${
                    dark ? "border-white/[0.06]" : "border-gray-200"
                  }`}>
                    <div>
                      <p className={`text-sm ${dark ? "text-white/80" : "text-gray-700"}`}>New User Registration</p>
                      <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                        Allow new users to register
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input 
                        type="checkbox" 
                        checked={settings.newUserRegistration}
                        onChange={() => setSettings({...settings, newUserRegistration: !settings.newUserRegistration})}
                        className="peer sr-only" 
                      />
                      <div className={`h-6 w-11 rounded-full ${
                        dark ? "bg-white/[0.08] peer-checked:bg-indigo-600" : "bg-gray-200 peer-checked:bg-indigo-600"
                      } after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-white/10 after:bg-white after:transition-all peer-checked:after:translate-x-full`} />
                    </label>
                  </div>

                  {/* Free Plan Credits */}
                  <div className={`flex items-center justify-between border-b pb-4 ${
                    dark ? "border-white/[0.06]" : "border-gray-200"
                  }`}>
                    <div>
                      <p className={`text-sm ${dark ? "text-white/80" : "text-gray-700"}`}>Free Plan Credits</p>
                      <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                        Default credits for free plan users
                      </p>
                    </div>
                    <input
                      type="number"
                      value={settings.freePlanCredits}
                      onChange={(e) => setSettings({...settings, freePlanCredits: parseInt(e.target.value) || 0})}
                      className={`w-20 rounded-xl border px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none ${
                        dark
                          ? "border-white/[0.08] bg-white/[0.02] text-white"
                          : "border-gray-200 bg-white text-gray-900"
                      }`}
                    />
                  </div>

                  {/* Max File Size */}
                  <div className={`flex items-center justify-between border-b pb-4 ${
                    dark ? "border-white/[0.06]" : "border-gray-200"
                  }`}>
                    <div>
                      <p className={`text-sm ${dark ? "text-white/80" : "text-gray-700"}`}>Max File Size (MB)</p>
                      <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                        Maximum file upload size in MB
                      </p>
                    </div>
                    <input
                      type="number"
                      value={settings.maxFileSize}
                      onChange={(e) => setSettings({...settings, maxFileSize: parseInt(e.target.value) || 10})}
                      className={`w-20 rounded-xl border px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none ${
                        dark
                          ? "border-white/[0.08] bg-white/[0.02] text-white"
                          : "border-gray-200 bg-white text-gray-900"
                      }`}
                    />
                  </div>

                  {/* Default Language */}
                  <div className={`flex items-center justify-between ${
                    dark ? "border-white/[0.06]" : "border-gray-200"
                  }`}>
                    <div>
                      <p className={`text-sm ${dark ? "text-white/80" : "text-gray-700"}`}>Default Language</p>
                      <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                        Default language for new users
                      </p>
                    </div>
                    <select
                      value={settings.defaultLanguage}
                      onChange={(e) => setSettings({...settings, defaultLanguage: e.target.value})}
                      className={`rounded-xl border px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none ${
                        dark
                          ? "border-white/[0.08] bg-white/[0.02] text-white"
                          : "border-gray-200 bg-white text-gray-900"
                      }`}
                    >
                      <option value="en">English</option>
                      <option value="ur">Urdu</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>

                  {/* Save Settings Button */}
                  <div className="pt-4">
                    <button
                      onClick={saveSettings}
                      disabled={savingSettings}
                      className={`rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition ${
                        savingSettings
                          ? "bg-indigo-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-500"
                      }`}
                    >
                      {savingSettings ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Saving...
                        </span>
                      ) : (
                        "Save Settings"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* =====================================================
          USER DETAIL MODAL
      ===================================================== */}

      {showUserModal && selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setShowUserModal(false)}
        >
          <div
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
              dark ? "border-white/[0.08] bg-[#0a0a0a]" : "border-gray-200 bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${dark ? "text-white" : "text-gray-900"}`}>
                User Details
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                className={dark ? "text-gray-500 transition hover:text-white" : "text-gray-400 transition hover:text-gray-700"}
              >
                <FiTrash2 size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div className={`flex justify-between border-b pb-2 ${
                dark ? "border-white/[0.06]" : "border-gray-200"
              }`}>
                <span className={dark ? "text-gray-500" : "text-gray-400"}>Name</span>
                <span className={dark ? "text-white/90" : "text-gray-800"}>{selectedUser.name || "Unknown"}</span>
              </div>
              <div className={`flex justify-between border-b pb-2 ${
                dark ? "border-white/[0.06]" : "border-gray-200"
              }`}>
                <span className={dark ? "text-gray-500" : "text-gray-400"}>Email</span>
                <span className={dark ? "text-white/90" : "text-gray-800"}>{selectedUser.email || "N/A"}</span>
              </div>
              <div className={`flex justify-between border-b pb-2 ${
                dark ? "border-white/[0.06]" : "border-gray-200"
              }`}>
                <span className={dark ? "text-gray-500" : "text-gray-400"}>Plan</span>
                <span className={`rounded-full border px-2.5 py-0.5 text-xs ${getPlanColor(selectedUser.plan)}`}>
                  {selectedUser.plan || "Free"}
                </span>
              </div>
              <div className={`flex justify-between border-b pb-2 ${
                dark ? "border-white/[0.06]" : "border-gray-200"
              }`}>
                <span className={dark ? "text-gray-500" : "text-gray-400"}>Credits</span>
                <span className={dark ? "text-white/90" : "text-gray-800"}>
                  {selectedUser.credits || 0} / {selectedUser.totalCredits || 0}
                </span>
              </div>
              <div className={`flex justify-between border-b pb-2 ${
                dark ? "border-white/[0.06]" : "border-gray-200"
              }`}>
                <span className={dark ? "text-gray-500" : "text-gray-400"}>Status</span>
                <span className={`rounded-full border px-2.5 py-0.5 text-xs ${getStatusColor(selectedUser.status)}`}>
                  {selectedUser.status || "Inactive"}
                </span>
              </div>
              <div className={`flex justify-between border-b pb-2 ${
                dark ? "border-white/[0.06]" : "border-gray-200"
              }`}>
                <span className={dark ? "text-gray-500" : "text-gray-400"}>Requests</span>
                <span className={dark ? "text-white/90" : "text-gray-800"}>{selectedUser.requests || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className={dark ? "text-gray-500" : "text-gray-400"}>Joined</span>
                <span className={dark ? "text-white/90" : "text-gray-800"}>
                  {formatDate(selectedUser.createdAt)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500">
                Edit User
              </button>
              <button
                onClick={() => setShowUserModal(false)}
                className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition ${
                  dark
                    ? "border-white/[0.08] text-white/60 hover:border-white/20 hover:text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900"
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}