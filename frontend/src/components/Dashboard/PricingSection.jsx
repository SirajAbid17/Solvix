
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiCheck, 
  FiZap, 
  FiUsers, 
  FiDollarSign,
  FiStar,
  FiAward,
  FiTrendingUp,  // ✅ REPLACED FiRocket WITH FiTrendingUp
} from "react-icons/fi";
import { Card } from "./shared";

const plans = [
  {
    id: "free",
    name: "Free",
    amount: 0,
    credits: 10,
    speed: "Standard Speed",
    description: "Perfect for getting started with Solvix.",
    gradient: "from-slate-700 via-slate-800 to-black",
    icon: <FiAward className="text-4xl text-gray-400" />,
    features: [
      "All AI Tools",
      "Resume Analyzer",
      "CV Generator",
      "Portfolio Generator",
      "Mock Interview",
      "Community Support",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    amount: 3.99,
    credits: 500,
    speed: "Fast Speed",
    description: "More credits for regular AI usage.",
    gradient: "from-blue-600 via-indigo-600 to-black",
    icon: <FiTrendingUp className="text-4xl text-blue-400" />,  // ✅ REPLACED
    features: [
      "All AI Tools",
      "Resume Analyzer",
      "CV Generator",
      "Portfolio Generator",
      "Mock Interview",
      "Priority Support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    amount: 4.99,
    credits: 1200,
    speed: "Fastest Speed",
    description: "Maximum credits with the fastest AI experience.",
    gradient: "from-indigo-600 via-purple-600 to-black",
    icon: <FiStar className="text-4xl text-yellow-400" />,
    features: [
      "All AI Tools",
      "Resume Analyzer",
      "CV Generator",
      "Portfolio Generator",
      "Mock Interview",
     
      "Advanced Analytics",
      
    ],
  },
];

export default function PricingSection({ full = false }) {
  const navigate = useNavigate();

  // If full view (pricing tab)
  if (full) {
    return (
      <div className="space-y-8">
        {/* Heading */}
        <div className="text-center">
          <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-400">
            <FiDollarSign /> Solvix Pricing
          </div>
          <h2 className="text-3xl font-bold text-white">Choose Your Plan</h2>
          <p className="mt-2 text-sm text-gray-600">
            Select the perfect plan for your AI workflow.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {plans.map((plan) => {
            return (
              <div
                key={plan.id}
                className={`relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-2 ${
                  plan.id === "pro"
                    ? "border-indigo-500/30 bg-gradient-to-b from-indigo-500/[0.08] via-[#050505] to-[#050505] shadow-xl shadow-indigo-600/[0.08]"
                    : "border-white/[0.08] bg-[#050505]"
                }`}
              >
                {plan.id === "pro" && (
                  <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />
                )}
                {plan.id === "pro" && (
                  <div className="absolute left-1/2 top-0 -translate-x-1/2">
                    <span className="rounded-b-xl bg-indigo-600 px-4 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="relative text-center">
                  <div className="mb-3 mt-3 flex justify-center">
                    {plan.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="mt-1 text-xs text-gray-600">{plan.description}</p>
                  <div className="mt-5">
                    <span className="text-4xl font-black text-white">
                      ${plan.amount === 0 ? "0" : plan.amount}
                    </span>
                    <span className="text-sm text-gray-600">/month</span>
                  </div>
                  <div className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-gray-400">
                    <FiZap className="text-amber-400" /> {plan.credits} AI Credits
                  </div>
                  <p className="mt-2 text-[10px] text-gray-600">{plan.speed}</p>
                </div>
                <ul className="relative mt-7 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2.5 text-sm">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
                        <FiCheck className="text-xs" />
                      </span>
                      <span className="text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => {
                    if (plan.id === "free") {
                      navigate("/");
                      return;
                    }
                    navigate("/pricing", { state: { plan } });
                  }}
                  className={`mt-7 w-full rounded-xl py-3 text-sm font-semibold transition-all ${
                    plan.id === "pro"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:shadow-indigo-600/30"
                      : plan.id === "starter"
                      ? "bg-blue-600 text-white hover:bg-blue-500"
                      : "bg-white/[0.06] text-white hover:bg-white/10"
                  }`}
                >
                  {plan.id === "free" ? "Start for Free" : `Choose ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>

       
      </div>
    );
  }

  // Compact view (overview tab)
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-white">Choose Your Power</h2>
          <p className="mt-1 text-xs text-gray-500">Upgrade your plan for more credits</p>
        </div>
        <button
          onClick={() => navigate("/pricing")}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition"
        >
          View All →
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {plans.slice(0, 3).map((plan) => (
          <div
            key={plan.id}
            className={`rounded-xl border p-4 transition-all duration-300 hover:-translate-y-1 ${
              plan.id === "pro"
                ? "border-indigo-500/30 bg-indigo-500/[0.05]"
                : "border-white/[0.08] bg-[#050505]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{plan.icon}</span>
              {plan.id === "pro" && (
                <span className="text-[8px] font-bold uppercase text-indigo-400 bg-indigo-500/20 px-2 py-0.5 rounded-full">
                  Popular
                </span>
              )}
            </div>
            <h3 className="mt-2 font-bold text-white">{plan.name}</h3>
            <p className="text-xl font-black text-white">${plan.amount === 0 ? "0" : plan.amount}</p>
            <p className="text-[10px] text-gray-500">{plan.credits} credits</p>
            <button
              onClick={() => {
                if (plan.id === "free") {
                  navigate("/");
                  return;
                }
                navigate("/billing", { state: { plan } });
              }}
              className={`mt-3 w-full rounded-lg py-2 text-xs font-semibold transition ${
                plan.id === "pro"
                  ? "bg-indigo-600 text-white hover:bg-indigo-500"
                  : plan.id === "starter"
                  ? "bg-blue-600 text-white hover:bg-blue-500"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {plan.id === "free" ? "Start Free" : `Get ${plan.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}