import React from "react";
import { FiSearch, FiRefreshCw, FiEye, FiUsers } from "react-icons/fi";

import SectionCard from "./SectionCard";
import EmptyState from "./EmptyState";
import { getPlanColor, getStatusColor, formatDate } from "./utils";

export default function UsersTab({
  dark,
  users,
  searchTerm,
  onSearchChange,
  refreshing,
  onRefresh,
  onViewUser,
}) {
  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return true;

    return (
      String(user?.name || "").toLowerCase().includes(search) ||
      String(user?.email || "").toLowerCase().includes(search)
    );
  });

  return (
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
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or email..."
            className={`h-11 w-full rounded-xl border pl-11 pr-4 text-sm outline-none transition ${
              dark
                ? "border-white/[0.08] bg-white/[0.025] text-white placeholder:text-white/25 focus:border-white/20"
                : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-400"
            }`}
          />
        </div>

        <button
          onClick={onRefresh}
          disabled={refreshing}
          className={`flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-medium disabled:opacity-50 ${
            dark
              ? "border-white/[0.08] bg-white/[0.025] text-white/60 hover:bg-white/[0.05] hover:text-white"
              : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          <FiRefreshCw
            size={14}
            className={refreshing ? "animate-spin" : ""}
          />
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
                          user.plan,
                          dark
                        )}`}
                      >
                        {user.plan || "Free"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={dark ? "text-white/80" : "text-gray-700"}
                      >
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
                          user.status,
                          dark
                        )}`}
                      >
                        {user.status || "Inactive"}
                      </span>
                    </td>

                    <td
                      className={
                        dark
                          ? "px-5 py-4 text-white/70"
                          : "px-5 py-4 text-gray-700"
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
                        onClick={() => onViewUser(user)}
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
  );
}