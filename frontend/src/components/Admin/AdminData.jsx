
import React, { useState, useEffect, useCallback } from "react";
import {
  FiRefreshCw,
  FiAlertCircle,
  FiX,
  FiCheck,
} from "react-icons/fi";

import api from "../../utlis/axios";
import { useTheme } from "../../BgContext/ThemeContext";

import AdminHeader from "./AdminHeader";
import AdminTabs from "./AdminTabs";
import OverviewTab from "./OverviewTab";
import UsersTab from "./UsersTab";
import AgentsTab from "./AgentsTab";
import TransactionsTab from "./TransactionsTab";
import UserModal from "./UserModal";

export default function AdminData() {
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


  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  
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
      showToast(
        err.response?.data?.message || "Failed to update credits",
        "error"
      );
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
      showToast(
        err.response?.data?.message || "Failed to update plan",
        "error"
      );
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
      showToast(
        err.response?.data?.message || "Failed to update status",
        "error"
      );
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
      showToast(
        err.response?.data?.message || "Failed to delete user",
        "error"
      );
    } finally {
      setActionLoading(false);
    }
  };


  const paidAgents = agentUsage.filter((a) => a.type === "paid");
  const freeAgentsRaw = agentUsage.filter((a) => a.type === "free");

  const totalFreeCount = freeAgentsRaw.reduce(
    (sum, a) => sum + (a.count || 0),
    0
  );

  const totalPaidCount = paidAgents.reduce(
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

 
  const combinedAgentUsage = paidAgents;

 
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
              dark
                ? "border-white/10 bg-white/[0.03]"
                : "border-gray-200 bg-white"
            }`}
          >
            <FiRefreshCw
              size={20}
              className={`animate-spin ${
                dark ? "text-white/60" : "text-gray-500"
              }`}
            />
          </div>
          <p
            className={`mt-4 text-sm ${
              dark ? "text-white/40" : "text-gray-500"
            }`}
          >
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }


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
          <p
            className={`mt-4 text-sm ${
              dark ? "text-white/70" : "text-gray-700"
            }`}
          >
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

  
  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        dark ? "bg-black text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 rounded-xl border px-5 py-3 shadow-2xl backdrop-blur-xl ${
            toast.type === "error"
              ? "border-red-500/20 bg-red-500/10 text-red-400"
              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
          }`}
        >
          {toast.type === "error" ? <FiX size={16} /> : <FiCheck size={16} />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <AdminHeader
        dark={dark}
        refreshing={refreshing}
        onRefresh={refreshData}
      />

      <main className="mx-auto max-w-[1400px] px-4 pb-12 pt-[100px] sm:px-6 lg:px-8">
        <div className="mb-7">
          <p
            className={`mb-1 text-xs uppercase tracking-[0.2em] ${
              dark ? "text-white/30" : "text-gray-400"
            }`}
          >
            Dashboard
          </p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Overview
          </h2>
        </div>

        <AdminTabs
          dark={dark}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {activeTab === "overview" && (
          <OverviewTab
            dark={dark}
            stats={stats}
            combinedAgentUsage={combinedAgentUsage}
          />
        )}

        {activeTab === "users" && (
          <UsersTab
            dark={dark}
            users={users}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            refreshing={refreshing}
            onRefresh={refreshData}
            onViewUser={(user) => {
              setSelectedUser(user);
              setShowUserModal(true);
            }}
          />
        )}

        {activeTab === "agents" && (
          <AgentsTab
            dark={dark}
            paidAgents={paidAgents}
            freeAgents={freeAgents}
            totalFreeCount={totalFreeCount}
            totalPaidCount={totalPaidCount}
          />
        )}

        {activeTab === "transactions" && (
          <TransactionsTab dark={dark} transactions={transactions} />
        )}
      </main>

      {showUserModal && selectedUser && (
        <UserModal
          user={selectedUser}
          dark={dark}
          actionLoading={actionLoading}
          onClose={() => setShowUserModal(false)}
          onUpdateCredits={handleUpdateCredits}
          onUpdatePlan={handleUpdatePlan}
          onToggleStatus={handleToggleStatus}
          onDeleteUser={handleDeleteUser}
        />
      )}
    </div>
  );
}