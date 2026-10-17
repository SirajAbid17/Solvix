// frontend/src/components/Admin/utils.js
import {
  FiCpu,
  FiSearch,
  FiBox,
  FiLayers,
  FiCreditCard,
  FiBarChart2,
  FiUsers,
  FiZap,
} from "react-icons/fi";

/**
 * ✅ Get icon based on agent name
 */
export const getAgentIcon = (agentName) => {
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

/**
 * ✅ Plan badge colors
 */
export const getPlanColor = (plan, dark) => {
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

/**
 * ✅ Status badge colors
 */
export const getStatusColor = (status, dark) => {
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

/**
 * ✅ Format date
 */
export const formatDate = (date) => {
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