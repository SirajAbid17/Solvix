
import React from "react";
import {
  FiX,
  FiUserCheck,
  FiPauseCircle,
  FiUserX,
  FiTrash2,
} from "react-icons/fi";
import { getPlanColor, getStatusColor, formatDate } from "./utils";

export default function UserModal({
  user,
  dark,
  actionLoading,
  onClose,
  onUpdateCredits,
  onUpdatePlan,
  onToggleStatus,
  onDeleteUser,
}) {
  if (!user) return null;

  const userId = user._id || user.id;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
      onClick={() => !actionLoading && onClose()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl ${
          dark ? "border-white/[0.1] bg-[#0a0a0a]" : "border-gray-200 bg-white"
        }`}
      >
      
        <div
          className={`flex items-center justify-between border-b px-6 py-5 ${
            dark ? "border-white/[0.07]" : "border-gray-200"
          }`}
        >
          <div>
            <h3 className="text-base font-semibold">User Details</h3>
            <p
              className={`mt-1 text-xs ${
                dark ? "text-white/30" : "text-gray-400"
              }`}
            >
              Manage user account
            </p>
          </div>

          <button
            onClick={() => !actionLoading && onClose()}
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

     
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
         
          <div className="mb-6 flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold ${
                dark ? "bg-white/[0.08] text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              {String(user.name || "U").charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={`truncate font-medium ${
                  dark ? "text-white" : "text-gray-900"
                }`}
              >
                {user.name || "Unknown"}
              </p>
              <p
                className={`truncate text-xs ${
                  dark ? "text-white/35" : "text-gray-400"
                }`}
              >
                {user.email || "N/A"}
              </p>
            </div>
          </div>

         
          <div
            className={`divide-y rounded-xl border ${
              dark
                ? "divide-white/[0.06] border-white/[0.07]"
                : "divide-gray-100 border-gray-200"
            }`}
          >
            <InfoRow
              label="Plan"
              value={
                <span
                  className={`rounded-full border px-2.5 py-1 text-[11px] ${getPlanColor(
                    user.plan,
                    dark
                  )}`}
                >
                  {user.plan || "Free"}
                </span>
              }
              dark={dark}
            />

            <InfoRow
              label="Credits"
              value={`${user.credits ?? 0} / ${user.totalCredits ?? 0}`}
              dark={dark}
            />

            <InfoRow
              label="Status"
              value={
                <span
                  className={`rounded-full border px-2.5 py-1 text-[11px] ${getStatusColor(
                    user.status,
                    dark
                  )}`}
                >
                  {user.status || "Inactive"}
                </span>
              }
              dark={dark}
            />

            <InfoRow
              label="Total Requests"
              value={user.requests ?? 0}
              dark={dark}
            />

            <InfoRow
              label="Joined"
              value={formatDate(user.createdAt)}
              dark={dark}
            />
          </div>

         
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
                defaultValue={user.credits ?? 0}
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
                    onUpdateCredits(userId, val);
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
                  onClick={() => onUpdatePlan(userId, plan)}
                  disabled={actionLoading || user.plan === plan}
                  className={`h-10 rounded-xl text-xs font-medium capitalize transition disabled:opacity-50 ${
                    user.plan === plan
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

       
          <div className="mt-4">
            <label
              className={`mb-2 block text-xs font-medium ${
                dark ? "text-white/60" : "text-gray-600"
              }`}
            >
              Change Status
            </label>

            <div className="grid grid-cols-3 gap-2">
              <StatusButton
                icon={FiUserCheck}
                label="Active"
                active={user.status === "active"}
                color="emerald"
                dark={dark}
                disabled={actionLoading}
                onClick={() => onToggleStatus(userId, "active")}
              />

              <StatusButton
                icon={FiPauseCircle}
                label="Inactive"
                active={user.status === "inactive"}
                color="amber"
                dark={dark}
                disabled={actionLoading}
                onClick={() => onToggleStatus(userId, "inactive")}
              />

              <StatusButton
                icon={FiUserX}
                label="Suspend"
                active={user.status === "suspended"}
                color="red"
                dark={dark}
                disabled={actionLoading}
                onClick={() => onToggleStatus(userId, "suspended")}
              />
            </div>
          </div>

       
          {!user.isAdmin && (
            <div
              className="mt-5 border-t pt-4"
              style={{
                borderColor: dark ? "rgba(255,255,255,0.06)" : "#f3f4f6",
              }}
            >
              <button
                onClick={() => onDeleteUser(userId)}
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

      
          <button
            onClick={onClose}
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
  );
}


function InfoRow({ label, value, dark }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className={`text-xs ${dark ? "text-white/35" : "text-gray-400"}`}>
        {label}
      </span>
      <span
        className={`text-sm font-medium ${
          dark ? "text-white/80" : "text-gray-700"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function StatusButton({ icon: Icon, label, active, color, dark, disabled, onClick }) {
  const activeColor =
    color === "emerald"
      ? "bg-emerald-500 text-white"
      : color === "amber"
      ? "bg-amber-500 text-white"
      : "bg-red-500 text-white";

  const inactiveClass = dark
    ? `border border-${color}-500/30 bg-${color}-500/10 text-${color}-400 hover:bg-${color}-500/20`
    : `border border-${color}-200 bg-${color}-50 text-${color}-700 hover:bg-${color}-100`;

  return (
    <button
      onClick={onClick}
      disabled={disabled || active}
      className={`flex h-10 items-center justify-center gap-1.5 rounded-xl text-xs font-medium transition disabled:opacity-50 ${
        active ? activeColor : inactiveClass
      }`}
    >
      <Icon size={13} />
      {label}
    </button>
  );
}