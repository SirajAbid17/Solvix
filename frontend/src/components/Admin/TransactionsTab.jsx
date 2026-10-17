
import React from "react";
import { FiCreditCard } from "react-icons/fi";

import SectionCard from "./SectionCard";
import EmptyState from "./EmptyState";
import { getPlanColor, getStatusColor, formatDate } from "./utils";

export default function TransactionsTab({ dark, transactions }) {
  return (
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
                        transaction.plan,
                        dark
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
                      dark
                        ? "px-5 py-4 text-white/60"
                        : "px-5 py-4 text-gray-600"
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
                        transaction.status,
                        dark
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
  );
}