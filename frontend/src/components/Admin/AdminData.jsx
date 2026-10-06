import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUsers,
  FiCreditCard,
  FiCpu,
  FiBarChart2,
  FiShield,
  FiLogOut,
  FiSearch,
  FiEye,
  FiX,
  FiRefreshCw,
  FiAlertCircle,
  FiDollarSign,
  FiGift,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiUserCheck,
  FiUserX,
  FiPauseCircle,
  FiTrendingUp,
  FiActivity,
  FiZap,
  FiLayers,
  FiBox,
  FiLock,
  FiUnlock,
} from "react-icons/fi";

import api from "../../utlis/axios";
import { useTheme } from "../../BgContext/ThemeContext";

// ============================================================
// STAT CARD
// ============================================================

const StatCard = ({ icon: Icon, label, value, dark, accent }) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 ${
        dark
          ? "border-white/[0.08] bg-white/[0.025] hover:border-white/[0.15] hover:bg-white/[0.04]"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg"
      }`}
    >
      <div className="relative">
        <div
          className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl border ${
            accent === "amber"
              ? dark
                ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                : "border-amber-200 bg-amber-50 text-amber-600"
              : accent === "emerald"
                ? dark
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                  : "border-emerald-200 bg-emerald-50 text-emerald-600"
                : accent === "purple"
                  ? dark
                    ? "border-purple-500/20 bg-purple-500/10 text-purple-400"
                    : "border-purple-200 bg-purple-50 text-purple-600"
                  : dark
                    ? "border-white/[0.1] bg-white/[0.05] text-white"
                    : "border-gray-200 bg-gray-50 text-gray-700"
          }`}
        >
          <Icon size={18} />
        </div>

        <p
          className={`text-2xl font-semibold tracking-tight ${
            dark ? "text-white" : "text-gray-900"
          }`}
        >
          {value ?? 0}
        </p>

        <p className={`mt-1 text-xs ${dark ? "text-white/40" : "text-gray-500"}`}>
          {label}
        </p>
      </div>
    </div>
  );
};

// ============================================================
// SECTION CARD
// ============================================================

const SectionCard = ({ children, dark, className = "" }) => {
  return (
    <div
      className={`rounded-2xl border ${
        dark ? "border-white/[0.08] bg-white/[0.025]" : "border-gray-200 bg-white"
      } ${className}`}
    >
      {children}
    </div>
  );
};

// ============================================================
// EMPTY STATE
// ============================================================

const EmptyState = ({ message, dark, icon: Icon = FiBarChart2 }) => {
  return (
    <div className="flex min-h-[200px] items-center justify-center px-6">
      <div className="text-center">
        <div
          className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border ${
            dark
              ? "border-white/[0.08] bg-white/[0.03] text-white/30"
              : "border-gray-200 bg-gray-50 text-gray-400"
          }`}
        >
          <Icon size={20} />
        </div>

        <p className={`text-sm ${dark ? "text-white/40" : "text-gray-500"}`}>
          {message}
        </p>
      </div>
    </div>
  );
};

// ============================================================
// ✅ AGENT ICON MAPPER
// ============================================================

const getAgentIcon = (agentName) => {
  const name = String(agentName || "").toLowerCase();

  if (name.includes("chat")) return FiCpu;
  if (name.includes("search")) return FiSearch;
  if (name.includes("coding")) return FiBox;
  if (name.includes("image")) return FiLayers;
  if (name.includes("pdf")) return FiCreditCard;
  if (name.includes("ppt")) return FiBarChart2;
  if (name.includes("resume")) return FiUsers;
  if (name.includes("multiagent")) return FiZap;

  return FiCpu;
};

// ============================================================
// AGENT CARD (With React Icons - No Emojis)
// ============================================================

const AgentCard = ({ agent, dark }) => {
  const isPaid = agent.type === "paid";
  const hasUsage = (agent.count || 0) > 0;
  const usage = Math.min(100, Math.max(0, Number(agent.usage) || 0));
  const isMultiagent = agent.name === "Free Multiagent Models";

  const MainIcon = isMultiagent ? FiZap : isPaid ? FiDollarSign : FiGift;

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 ${
        dark
          ? "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.13]"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              isPaid
                ? dark
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-amber-50 text-amber-600"
                : isMultiagent
                  ? dark
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-emerald-50 text-emerald-600"
                  : dark
                    ? "bg-white/[0.06] text-white/70"
                    : "bg-gray-100 text-gray-600"
            }`}
          >
            <MainIcon size={17} />
          </div>

          <div>
            <p className={`text-sm font-medium ${dark ? "text-white" : "text-gray-900"}`}>
              {agent.name}
            </p>

            {/* ✅ React Icons instead of emojis */}
            <div
              className={`mt-0.5 flex items-center gap-1.5 text-[11px] ${
                isPaid
                  ? dark
                    ? "text-amber-400/70"
                    : "text-amber-600"
                  : dark
                    ? "text-emerald-400/70"
                    : "text-emerald-600"
              }`}
            >
              {isPaid ? (
                <>
                  <FiLock size={10} />
                  <span>Paid Service</span>
                </>
              ) : (
                <>
                  <FiUnlock size={10} />
                  <span>Free Service</span>
                </>
              )}
            </div>
          </div>
        </div>

        <span className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>
          {hasUsage ? `${usage}%` : "—"}
        </span>
      </div>

      <div
        className={`h-2 overflow-hidden rounded-full ${
          dark ? "bg-white/[0.06]" : "bg-gray-100"
        }`}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            isPaid ? "bg-amber-500" : "bg-emerald-500"
          }`}
          style={{ width: `${usage}%` }}
        />
      </div>

      {/* ✅ Multiagent breakdown with icons */}
      {isMultiagent && agent.agents && agent.agents.length > 0 ? (
        <div className="mt-3 space-y-2">
          {agent.agents
            .filter((a) => (a.count || 0) > 0)
            .map((subAgent) => {
              const SubIcon = getAgentIcon(subAgent.name);
              return (
                <div
                  key={subAgent.name}
                  className={`flex items-center justify-between rounded-lg px-2 py-1.5 ${
                    dark ? "hover:bg-white/[0.03]" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <SubIcon
                      size={13}
                      className={dark ? "text-emerald-400/70" : "text-emerald-600"}
                    />
                    <span
                      className={`text-[11px] ${dark ? "text-white/60" : "text-gray-600"}`}
                    >
                      {subAgent.name}
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-medium ${
                      dark ? "text-white/80" : "text-gray-800"
                    }`}
                  >
                    {subAgent.count}
                  </span>
                </div>
              );
            })}

          <div
            className={`mt-2 flex items-center justify-between border-t pt-2 ${
              dark ? "border-white/[0.06]" : "border-gray-100"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <FiTrendingUp
                size={12}
                className={dark ? "text-emerald-400" : "text-emerald-600"}
              />
              <span
                className={`text-[11px] font-semibold ${
                  dark ? "text-white/70" : "text-gray-700"
                }`}
              >
                Total
              </span>
            </div>
            <span
              className={`text-[11px] font-semibold ${
                dark ? "text-emerald-400" : "text-emerald-600"
              }`}
            >
              {agent.count || 0} requests
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-2 flex items-center justify-between">
          <p className={`text-[11px] ${dark ? "text-white/40" : "text-gray-500"}`}>
            {agent.count || 0} requests
          </p>
          {isPaid && hasUsage && (
            <p
              className={`text-[11px] font-medium ${
                dark ? "text-amber-400" : "text-amber-600"
              }`}
            >
              {agent.count * 2} credits used
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================
// MAIN ADMIN DATA COMPONENT
// ============================================================

export default function AdminData() {
  const navigate = useNavigate();
  const { dark } = useTheme();

  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Data states
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCreditsUsed: 0,
    totalRequests: 0,
    totalRevenue: 0,
    activeUsers: 0,
  });
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [agentUsage, setAgentUsage] = useState([]);

  // ============================================================
  // TOAST HELPER
  // ============================================================

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ============================================================
  // API CALLS
  // ============================================================

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/admin/stats");
      if (data?.success) {
        setStats({
          totalUsers: data.data?.totalUsers ?? 0,
          totalCreditsUsed: data.data?.totalCreditsUsed ?? 0,
          totalRequests: data.data?.totalRequests ?? 0,
          totalRevenue: data.data?.totalRevenue ?? 0,
          activeUsers: data.data?.activeUsers ?? 0,
        });
      }
    } catch (err) {
      console.error("Stats error:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data?.success ? data.users || [] : []);
    } catch (err) {
      console.error("Users error:", err);
      setUsers([]);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get("/admin/transactions");
      setTransactions(data?.success ? data.data || [] : []);
    } catch (err) {
      console.error("Transactions error:", err);
      setTransactions([]);
    }
  };

  const fetchAgentUsage = async () => {
    try {
      const { data } = await api.get("/admin/agent-usage");
      setAgentUsage(data?.success ? data.data || [] : []);
    } catch (err) {
      console.error("Agent usage error:", err);
      setAgentUsage([]);
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
        fetchAgentUsage(),
      ]);
    } catch (err) {
      console.error("Admin dashboard error:", err);
      setError("Failed to load admin dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await fetchAllData();
      showToast("Data refreshed successfully");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // ============================================================
  // USER ACTIONS
  // ============================================================

  const handleUpdateCredits = async (userId, newCredits) => {
    try {
      setActionLoading(true);
      const { data } = await api.put(`/admin/user/${userId}/credits`, {
        credits: newCredits,
      });

      if (data?.success) {
        showToast("Credits updated successfully");
        await fetchUsers();
        await fetchStats();
        setShowUserModal(false);
      } else {
        showToast(data?.message || "Failed to update credits", "error");
      }
    } catch (err) {
      console.error("Update credits error:", err);
      showToast(err.response?.data?.message || "Failed to update credits", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdatePlan = async (userId, newPlan) => {
    try {
      setActionLoading(true);
      const { data } = await api.put(`/admin/user/${userId}/plan`, {
        plan: newPlan,
      });

      if (data?.success) {
        showToast("Plan updated successfully");
        await fetchUsers();
        await fetchStats();
        setShowUserModal(false);
      } else {
        showToast(data?.message || "Failed to update plan", "error");
      }
    } catch (err) {
      console.error("Update plan error:", err);
      showToast(err.response?.data?.message || "Failed to update plan", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (userId, newStatus) => {
    try {
      setActionLoading(true);
      const { data } = await api.patch(`/admin/user/${userId}/status`, {
        status: newStatus,
      });

      if (data?.success) {
        showToast(`User ${newStatus} successfully`);
        await fetchUsers();
        await fetchStats();
        setShowUserModal(false);
      } else {
        showToast(data?.message || "Failed to update status", "error");
      }
    } catch (err) {
      console.error("Toggle status error:", err);
      showToast(err.response?.data?.message || "Failed to update status", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      setActionLoading(true);
      const { data } = await api.delete(`/admin/user/${userId}`);

      if (data?.success) {
        showToast("User deleted successfully");
        await fetchUsers();
        await fetchStats();
        setShowUserModal(false);
      } else {
        showToast(data?.message || "Failed to delete user", "error");
      }
    } catch (err) {
      console.error("Delete user error:", err);
      showToast(err.response?.data?.message || "Failed to delete user", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================================
  // HELPERS
  // ============================================================

  const getPlanColor = (plan) => {
    const value = String(plan || "").toLowerCase();
    if (value === "pro" || value === "enterprise") {
      return dark
        ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
        : "border-amber-200 bg-amber-50 text-amber-700";
    }
    if (value === "starter") {
      return dark
        ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
        : "border-blue-200 bg-blue-50 text-blue-700";
    }
    return dark
      ? "border-white/10 bg-white/[0.03] text-white/50"
      : "border-gray-200 bg-gray-50 text-gray-500";
  };

  const getStatusColor = (status) => {
    const value = String(status || "").toLowerCase();
    if (value === "active") {
      return dark
        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
        : "border-emerald-200 bg-emerald-50 text-emerald-700";
    }
    if (value === "admin") {
      return dark
        ? "border-purple-500/20 bg-purple-500/10 text-purple-400"
        : "border-purple-200 bg-purple-50 text-purple-700";
    }
    if (value === "pending") {
      return dark
        ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
        : "border-amber-200 bg-amber-50 text-amber-700";
    }
    if (value === "suspended" || value === "inactive") {
      return dark
        ? "border-red-500/20 bg-red-500/10 text-red-400"
        : "border-red-200 bg-red-50 text-red-700";
    }
    return dark
      ? "border-white/10 bg-white/[0.03] text-white/40"
      : "border-gray-200 bg-gray-50 text-gray-500";
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return true;
    return (
      String(user?.name || "").toLowerCase().includes(search) ||
      String(user?.email || "").toLowerCase().includes(search)
    );
  });

  // ============================================================
  // ✅ PAID AGENTS - Individual
  // ============================================================

  const paidAgents = agentUsage.filter((a) => a.type === "paid");

  // ============================================================
  // ✅ FREE AGENTS - Combined as "Free Multiagent Models"
  // ============================================================

  const freeAgentsRaw = agentUsage.filter((a) => a.type === "free");

  const totalFreeCount = freeAgentsRaw.reduce(
    (sum, a) => sum + (a.count || 0),
    0
  );

  const freeMultiagent = {
    name: "Free Multiagent Models",
    type: "free",
    count: totalFreeCount,
    usage: totalFreeCount > 0 ? 100 : 0,
    agents: freeAgentsRaw,
  };

  const freeAgents = [freeMultiagent];

  // ============================================================
  // ✅ COMBINED LIST - For Overview Tab
  // ============================================================

  const combinedAgentUsage = [...paidAgents, ...freeAgents];

  // ============================================================
  // STAT CARDS
  // ============================================================

  const statCards = [
    {
      icon: FiUsers,
      label: "Total Users",
      value: stats.totalUsers,
      accent: "default",
    },
    {
      icon: FiUserCheck,
      label: "Active Users",
      value: stats.activeUsers,
      accent: "emerald",
    },
    {
      icon: FiCreditCard,
      label: "Credits Used",
      value: stats.totalCreditsUsed,
      accent: "purple",
    },
    {
      icon: FiActivity,
      label: "Total Requests",
      value: stats.totalRequests,
      accent: "default",
    },
    {
      icon: FiTrendingUp,
      label: "Total Revenue",
      value: `$${Number(stats.totalRevenue || 0).toFixed(2)}`,
      accent: "amber",
    },
  ];

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center ${
          dark ? "bg-black" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div
            className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border ${
              dark ? "border-white/10 bg-white/[0.03]" : "border-gray-200 bg-white"
            }`}
          >
            <FiRefreshCw
              size={20}
              className={`animate-spin ${dark ? "text-white/60" : "text-gray-500"}`}
            />
          </div>
          <p className={`mt-4 text-sm ${dark ? "text-white/40" : "text-gray-500"}`}>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center px-4 ${
          dark ? "bg-black" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
            <FiAlertCircle size={22} />
          </div>
          <p className={`mt-4 text-sm ${dark ? "text-white/70" : "text-gray-700"}`}>
            {error}
          </p>
          <button
            onClick={refreshData}
            className="mt-5 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        dark ? "bg-black text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* TOAST */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 rounded-xl border px-5 py-3 shadow-2xl transition-all ${
            toast.type === "error"
              ? "border-red-500/20 bg-red-500/10 text-red-400"
              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
          } backdrop-blur-xl`}
        >
          {toast.type === "error" ? <FiX size={16} /> : <FiCheck size={16} />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* HEADER */}
      <header
        className={`fixed left-0 top-0 z-50 w-full border-b backdrop-blur-2xl ${
          dark ? "border-white/[0.07] bg-black/85" : "border-gray-200 bg-white/85"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                dark
                  ? "border-white/[0.08] bg-white/[0.03] text-white/50 hover:border-white/15 hover:bg-white/[0.06] hover:text-white"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-900"
              }`}
            >
              <FiArrowLeft size={17} />
            </button>

            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                  dark
                    ? "border-white/[0.1] bg-white/[0.05] text-white"
                    : "border-gray-200 bg-gray-100 text-gray-800"
                }`}
              >
                <FiShield size={18} />
              </div>
              <div>
                <h1 className="text-sm font-semibold tracking-wide">Admin Panel</h1>
                <p className={`text-[10px] ${dark ? "text-white/30" : "text-gray-400"}`}>
                  System Management
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshData}
              disabled={refreshing}
              className={`flex h-9 items-center gap-2 rounded-xl border px-3 text-xs font-medium transition disabled:opacity-50 ${
                dark
                  ? "border-white/[0.08] bg-white/[0.03] text-white/60 hover:border-white/15 hover:bg-white/[0.06] hover:text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <FiRefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
              <span className="hidden sm:inline">{refreshing ? "Refreshing" : "Refresh"}</span>
            </button>

            <button
              onClick={() => navigate("/")}
              className={`flex h-9 items-center gap-2 rounded-xl border px-3 text-xs font-medium transition ${
                dark
                  ? "border-white/[0.08] bg-white/[0.03] text-white/60 hover:border-white/15 hover:bg-white/[0.06] hover:text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <FiLogOut size={13} />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-[1400px] px-4 pb-12 pt-[100px] sm:px-6 lg:px-8">
        {/* PAGE TITLE */}
        <div className="mb-7">
          <p
            className={`mb-1 text-xs uppercase tracking-[0.2em] ${
              dark ? "text-white/30" : "text-gray-400"
            }`}
          >
            Dashboard
          </p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Overview</h2>
        </div>

        {/* TABS */}
        <div
          className={`mb-7 flex gap-1 overflow-x-auto rounded-2xl border p-1 ${
            dark ? "border-white/[0.07] bg-white/[0.025]" : "border-gray-200 bg-white"
          }`}
        >
          {[
            { id: "overview", label: "Overview", icon: FiBarChart2 },
            { id: "users", label: "Users", icon: FiUsers },
            { id: "agents", label: "Agents", icon: FiCpu },
            { id: "transactions", label: "Transactions", icon: FiCreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium transition-all ${
                  active
                    ? dark
                      ? "bg-white text-black shadow-lg"
                      : "bg-black text-white shadow-lg"
                    : dark
                      ? "text-white/40 hover:bg-white/[0.04] hover:text-white"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ====================================================
            OVERVIEW TAB
        ==================================================== */}

        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* STATS */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {statCards.map((stat) => (
                <StatCard key={stat.label} {...stat} dark={dark} />
              ))}
            </div>

            {/* AGENT USAGE - Combined (Paid + Free Multiagent) */}
            <SectionCard dark={dark} className="overflow-hidden">
              <div
                className={`border-b px-5 py-4 ${
                  dark ? "border-white/[0.07]" : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold">Agent Usage Overview</h3>
                    <p className={`mt-1 text-xs ${dark ? "text-white/30" : "text-gray-400"}`}>
                      Paid services + Free Multiagent Models
                    </p>
                  </div>
                  <FiCpu size={17} className={dark ? "text-white/30" : "text-gray-400"} />
                </div>
              </div>

              {combinedAgentUsage.length > 0 ? (
                <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
                  {combinedAgentUsage.map((agent) => (
                    <AgentCard key={agent.name} agent={agent} dark={dark} />
                  ))}
                </div>
              ) : (
                <EmptyState message="No agent data available" dark={dark} icon={FiCpu} />
              )}
            </SectionCard>
          </div>
        )}

        {/* ====================================================
            USERS TAB
        ==================================================== */}

        {activeTab === "users" && (
          <div>
            <div className="mb-4 flex gap-3">
              <div className="relative flex-1">
                <FiSearch
                  size={16}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                    dark ? "text-white/30" : "text-gray-400"
                  }`}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className={`h-11 w-full rounded-xl border pl-11 pr-4 text-sm outline-none transition ${
                    dark
                      ? "border-white/[0.08] bg-white/[0.025] text-white placeholder:text-white/25 focus:border-white/20"
                      : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-400"
                  }`}
                />
              </div>

              <button
                onClick={refreshData}
                disabled={refreshing}
                className={`flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-medium disabled:opacity-50 ${
                  dark
                    ? "border-white/[0.08] bg-white/[0.025] text-white/60 hover:bg-white/[0.05] hover:text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FiRefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>

            <SectionCard dark={dark} className="overflow-hidden">
              {filteredUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] text-sm">
                    <thead>
                      <tr
                        className={`border-b text-left text-[11px] uppercase tracking-wider ${
                          dark
                            ? "border-white/[0.07] text-white/30"
                            : "border-gray-200 text-gray-400"
                        }`}
                      >
                        <th className="px-5 py-4 font-medium">User</th>
                        <th className="px-5 py-4 font-medium">Plan</th>
                        <th className="px-5 py-4 font-medium">Credits</th>
                        <th className="px-5 py-4 font-medium">Status</th>
                        <th className="px-5 py-4 font-medium">Requests</th>
                        <th className="px-5 py-4 font-medium">Joined</th>
                        <th className="px-5 py-4 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id || user._id || user.email}
                          className={`border-b transition last:border-0 ${
                            dark
                              ? "border-white/[0.05] hover:bg-white/[0.025]"
                              : "border-gray-100 hover:bg-gray-50"
                          }`}
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                                  dark
                                    ? "bg-white/[0.07] text-white/70"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {String(user.name || "U").charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p
                                  className={`truncate font-medium ${
                                    dark ? "text-white/90" : "text-gray-800"
                                  }`}
                                >
                                  {user.name || "Unknown"}
                                </p>
                                <p
                                  className={`truncate text-xs ${
                                    dark ? "text-white/30" : "text-gray-400"
                                  }`}
                                >
                                  {user.email || "N/A"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${getPlanColor(
                                user.plan
                              )}`}
                            >
                              {user.plan || "Free"}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={dark ? "text-white/80" : "text-gray-700"}>
                              {user.credits ?? 0}
                            </span>
                            <span
                              className={`text-xs ${
                                dark ? "text-white/25" : "text-gray-400"
                              }`}
                            >
                              {" "}
                              / {user.totalCredits ?? 0}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStatusColor(
                                user.status
                              )}`}
                            >
                              {user.status || "Inactive"}
                            </span>
                          </td>
                          <td
                            className={
                              dark ? "px-5 py-4 text-white/70" : "px-5 py-4 text-gray-700"
                            }
                          >
                            {user.requests ?? 0}
                          </td>
                          <td
                            className={`px-5 py-4 text-xs ${
                              dark ? "text-white/35" : "text-gray-400"
                            }`}
                          >
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUserModal(true);
                              }}
                              className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition ${
                                dark
                                  ? "text-white/30 hover:bg-white/[0.06] hover:text-white"
                                  : "text-gray-400 hover:bg-gray-100 hover:text-gray-800"
                              }`}
                            >
                              <FiEye size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState
                  message={
                    searchTerm ? "No users match your search" : "No users available"
                  }
                  dark={dark}
                  icon={FiUsers}
                />
              )}
            </SectionCard>
          </div>
        )}

        {/* ====================================================
            AGENTS TAB
        ==================================================== */}

        {activeTab === "agents" && (
          <div className="space-y-6">
            {/* PAID SERVICES */}
            <SectionCard dark={dark} className="overflow-hidden">
              <div
                className={`border-b px-5 py-4 ${
                  dark ? "border-white/[0.07]" : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        dark
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      <FiLock size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">Paid Services</h3>
                      <p className={`mt-0.5 text-xs ${dark ? "text-white/30" : "text-gray-400"}`}>
                        Services that deduct 2 credits per request
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      dark
                        ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                        : "border-amber-200 bg-amber-50 text-amber-700"
                    }`}
                  >
                    {paidAgents.reduce((sum, a) => sum + (a.count || 0), 0)} total requests
                  </span>
                </div>
              </div>

              {paidAgents.length > 0 ? (
                <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
                  {paidAgents.map((agent) => (
                    <AgentCard key={agent.name} agent={agent} dark={dark} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  message="No paid service usage yet"
                  dark={dark}
                  icon={FiDollarSign}
                />
              )}
            </SectionCard>

            {/* FREE SERVICES - Multiagent Combined */}
            <SectionCard dark={dark} className="overflow-hidden">
              <div
                className={`border-b px-5 py-4 ${
                  dark ? "border-white/[0.07]" : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        dark
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      <FiZap size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">Free Multiagent Models</h3>
                      <p className={`mt-0.5 text-xs ${dark ? "text-white/30" : "text-gray-400"}`}>
                        Free agents — no credits deducted
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      dark
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {totalFreeCount} total requests
                  </span>
                </div>
              </div>

              {freeAgents.length > 0 ? (
                <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
                  {freeAgents.map((agent) => (
                    <AgentCard key={agent.name} agent={agent} dark={dark} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  message="No free service usage yet"
                  dark={dark}
                  icon={FiGift}
                />
              )}
            </SectionCard>
          </div>
        )}

        {/* ====================================================
            TRANSACTIONS TAB
        ==================================================== */}

        {activeTab === "transactions" && (
          <SectionCard dark={dark} className="overflow-hidden">
            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[750px] text-sm">
                  <thead>
                    <tr
                      className={`border-b text-left text-[11px] uppercase tracking-wider ${
                        dark
                          ? "border-white/[0.07] text-white/30"
                          : "border-gray-200 text-gray-400"
                      }`}
                    >
                      <th className="px-5 py-4 font-medium">User</th>
                      <th className="px-5 py-4 font-medium">Plan</th>
                      <th className="px-5 py-4 font-medium">Amount</th>
                      <th className="px-5 py-4 font-medium">Credits</th>
                      <th className="px-5 py-4 font-medium">Date</th>
                      <th className="px-5 py-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr
                        key={
                          transaction.id ||
                          transaction._id ||
                          transaction.createdAt
                        }
                        className={`border-b transition last:border-0 ${
                          dark
                            ? "border-white/[0.05] hover:bg-white/[0.025]"
                            : "border-gray-100 hover:bg-gray-50"
                        }`}
                      >
                        <td
                          className={`px-5 py-4 font-medium ${
                            dark ? "text-white/80" : "text-gray-800"
                          }`}
                        >
                          {transaction.user || "Unknown"}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[11px] ${getPlanColor(
                              transaction.plan
                            )}`}
                          >
                            {transaction.plan || "Free"}
                          </span>
                        </td>
                        <td
                          className={`px-5 py-4 font-medium ${
                            dark ? "text-white/80" : "text-gray-700"
                          }`}
                        >
                          ${Number(transaction.amount || 0).toFixed(2)}
                        </td>
                        <td
                          className={
                            dark ? "px-5 py-4 text-white/60" : "px-5 py-4 text-gray-600"
                          }
                        >
                          {transaction.credits ?? 0}
                        </td>
                        <td
                          className={`px-5 py-4 text-xs ${
                            dark ? "text-white/35" : "text-gray-400"
                          }`}
                        >
                          {formatDate(transaction.createdAt)}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStatusColor(
                              transaction.status
                            )}`}
                          >
                            {transaction.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                message="No transactions available"
                dark={dark}
                icon={FiCreditCard}
              />
            )}
          </SectionCard>
        )}
      </main>

      {/* ======================================================
          USER MODAL - FULL MANAGEMENT
      ====================================================== */}

      {showUserModal && selectedUser && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          onClick={() => !actionLoading && setShowUserModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl ${
              dark ? "border-white/[0.1] bg-[#0a0a0a]" : "border-gray-200 bg-white"
            }`}
          >
            {/* MODAL HEADER */}
            <div
              className={`flex items-center justify-between border-b px-6 py-5 ${
                dark ? "border-white/[0.07]" : "border-gray-200"
              }`}
            >
              <div>
                <h3 className="text-base font-semibold">User Details</h3>
                <p className={`mt-1 text-xs ${dark ? "text-white/30" : "text-gray-400"}`}>
                  Manage user account
                </p>
              </div>
              <button
                onClick={() => !actionLoading && setShowUserModal(false)}
                disabled={actionLoading}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition disabled:opacity-50 ${
                  dark
                    ? "text-white/30 hover:bg-white/[0.06] hover:text-white"
                    : "text-gray-400 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                <FiX size={17} />
              </button>
            </div>

            {/* USER INFO */}
            <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
              <div className="mb-6 flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold ${
                    dark ? "bg-white/[0.08] text-white" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {String(selectedUser.name || "U").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`truncate font-medium ${dark ? "text-white" : "text-gray-900"}`}>
                    {selectedUser.name || "Unknown"}
                  </p>
                  <p
                    className={`truncate text-xs ${
                      dark ? "text-white/35" : "text-gray-400"
                    }`}
                  >
                    {selectedUser.email || "N/A"}
                  </p>
                </div>
              </div>

              {/* DETAILS */}
              <div
                className={`divide-y rounded-xl border ${
                  dark
                    ? "divide-white/[0.06] border-white/[0.07]"
                    : "divide-gray-100 border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between px-4 py-3">
                  <span className={`text-xs ${dark ? "text-white/35" : "text-gray-400"}`}>
                    Plan
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[11px] ${getPlanColor(
                      selectedUser.plan
                    )}`}
                  >
                    {selectedUser.plan || "Free"}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className={`text-xs ${dark ? "text-white/35" : "text-gray-400"}`}>
                    Credits
                  </span>
                  <span className={`text-sm font-medium ${dark ? "text-white" : "text-gray-900"}`}>
                    {selectedUser.credits ?? 0} / {selectedUser.totalCredits ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className={`text-xs ${dark ? "text-white/35" : "text-gray-400"}`}>
                    Status
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[11px] ${getStatusColor(
                      selectedUser.status
                    )}`}
                  >
                    {selectedUser.status || "Inactive"}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className={`text-xs ${dark ? "text-white/35" : "text-gray-400"}`}>
                    Total Requests
                  </span>
                  <span className={`text-sm font-medium ${dark ? "text-white" : "text-gray-900"}`}>
                    {selectedUser.requests ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className={`text-xs ${dark ? "text-white/35" : "text-gray-400"}`}>
                    Joined
                  </span>
                  <span className={`text-sm ${dark ? "text-white/80" : "text-gray-700"}`}>
                    {formatDate(selectedUser.createdAt)}
                  </span>
                </div>
              </div>

              {/* ACTION: UPDATE CREDITS */}
              <div className="mt-5">
                <label
                  className={`mb-2 block text-xs font-medium ${
                    dark ? "text-white/60" : "text-gray-600"
                  }`}
                >
                  Update Credits
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    defaultValue={selectedUser.credits ?? 0}
                    min="0"
                    id="creditInput"
                    className={`h-10 flex-1 rounded-xl border px-3 text-sm outline-none transition ${
                      dark
                        ? "border-white/[0.08] bg-white/[0.025] text-white focus:border-white/20"
                        : "border-gray-200 bg-white text-gray-900 focus:border-gray-400"
                    }`}
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById("creditInput");
                      const val = parseInt(input.value);
                      if (!isNaN(val) && val >= 0) {
                        handleUpdateCredits(selectedUser._id || selectedUser.id, val);
                      }
                    }}
                    disabled={actionLoading}
                    className={`rounded-xl px-4 text-sm font-medium transition disabled:opacity-50 ${
                      dark
                        ? "bg-white text-black hover:bg-white/90"
                        : "bg-black text-white hover:bg-black/90"
                    }`}
                  >
                    {actionLoading ? "..." : "Save"}
                  </button>
                </div>
              </div>

              {/* ACTION: UPDATE PLAN */}
              <div className="mt-4">
                <label
                  className={`mb-2 block text-xs font-medium ${
                    dark ? "text-white/60" : "text-gray-600"
                  }`}
                >
                  Change Plan
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {["free", "starter", "pro", "enterprise"].map((plan) => (
                    <button
                      key={plan}
                      onClick={() =>
                        handleUpdatePlan(selectedUser._id || selectedUser.id, plan)
                      }
                      disabled={actionLoading || selectedUser.plan === plan}
                      className={`h-10 rounded-xl text-xs font-medium capitalize transition disabled:opacity-50 ${
                        selectedUser.plan === plan
                          ? dark
                            ? "bg-white text-black"
                            : "bg-black text-white"
                          : dark
                            ? "border border-white/[0.08] bg-white/[0.03] text-white/60 hover:bg-white/[0.06]"
                            : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {plan}
                    </button>
                  ))}
                </div>
              </div>

              {/* ACTION: STATUS */}
              <div className="mt-4">
                <label
                  className={`mb-2 block text-xs font-medium ${
                    dark ? "text-white/60" : "text-gray-600"
                  }`}
                >
                  Change Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() =>
                      handleToggleStatus(selectedUser._id || selectedUser.id, "active")
                    }
                    disabled={actionLoading || selectedUser.status === "active"}
                    className={`flex h-10 items-center justify-center gap-1.5 rounded-xl text-xs font-medium transition disabled:opacity-50 ${
                      selectedUser.status === "active"
                        ? "bg-emerald-500 text-white"
                        : dark
                          ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                          : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    <FiUserCheck size={13} />
                    Active
                  </button>
                  <button
                    onClick={() =>
                      handleToggleStatus(selectedUser._id || selectedUser.id, "inactive")
                    }
                    disabled={actionLoading || selectedUser.status === "inactive"}
                    className={`flex h-10 items-center justify-center gap-1.5 rounded-xl text-xs font-medium transition disabled:opacity-50 ${
                      selectedUser.status === "inactive"
                        ? "bg-amber-500 text-white"
                        : dark
                          ? "border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                          : "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                    }`}
                  >
                    <FiPauseCircle size={13} />
                    Inactive
                  </button>
                  <button
                    onClick={() =>
                      handleToggleStatus(
                        selectedUser._id || selectedUser.id,
                        "suspended"
                      )
                    }
                    disabled={actionLoading || selectedUser.status === "suspended"}
                    className={`flex h-10 items-center justify-center gap-1.5 rounded-xl text-xs font-medium transition disabled:opacity-50 ${
                      selectedUser.status === "suspended"
                        ? "bg-red-500 text-white"
                        : dark
                          ? "border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                          : "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                    }`}
                  >
                    <FiUserX size={13} />
                    Suspend
                  </button>
                </div>
              </div>

              {/* ACTION: DELETE */}
              {!selectedUser.isAdmin && (
                <div className="mt-5 border-t pt-4" style={{ borderColor: dark ? "rgba(255,255,255,0.06)" : "#f3f4f6" }}>
                  <button
                    onClick={() =>
                      handleDeleteUser(selectedUser._id || selectedUser.id)
                    }
                    disabled={actionLoading}
                    className={`flex h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium transition disabled:opacity-50 ${
                      dark
                        ? "border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        : "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                    }`}
                  >
                    <FiTrash2 size={14} />
                    Delete User Permanently
                  </button>
                </div>
              )}

              {/* CLOSE */}
              <button
                onClick={() => setShowUserModal(false)}
                disabled={actionLoading}
                className={`mt-5 w-full rounded-xl py-2.5 text-sm font-medium transition disabled:opacity-50 ${
                  dark
                    ? "border border-white/[0.08] bg-white/[0.03] text-white/60 hover:bg-white/[0.06]"
                    : "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
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