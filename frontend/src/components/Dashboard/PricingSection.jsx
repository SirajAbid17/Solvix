import React from "react";
import { useNavigate } from "react-router-dom";
import { FiCheck, FiZap, FiDollarSign, FiArrowRight } from "react-icons/fi";
import { Card } from "./shared";

const plans = [
  {
    id: "free",
    name: "Free",
    amount: 0,
    credits: 10,
    speed: "Standard Speed",
    description: "Perfect for getting started with Solvix.",
    accent: "gray",
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
    credits: 100,
    speed: "Fast Speed",
    description: "More credits for regular AI usage.",
    accent: "blue",
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
    credits: 200,
    speed: "Fastest Speed",
    description: "Maximum credits with the fastest AI experience.",
    accent: "indigo",
    popular: true,
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


const getAccentClasses = (accent, isPopular) => {
  if (isPopular || accent === "indigo") {
    return {
      iconBg: "bg-indigo-500/15 text-indigo-400",
      border: "border-indigo-500/40",
      badge: "bg-indigo-600 text-white",
      button:
        "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20",
    };
  }
  if (accent === "blue") {
    return {
      iconBg: "bg-blue-500/15 text-blue-400",
      border: "border-blue-500/30",
      badge: "bg-blue-600 text-white",
      button:
        "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20",
    };
  }
  return {
    iconBg: "bg-white/[0.06] text-gray-400",
    border: "border-white/[0.08]",
    badge: "bg-white/10 text-gray-300",
    button: "bg-white/[0.08] text-white hover:bg-white/[0.15]",
  };
};

export default function PricingSection({ full = false }) {
  const navigate = useNavigate();

  const handlePlanClick = (plan, fromFull) => {
    if (plan.id === "free") {
      navigate("/");
      return;
    }
    navigate(fromFull ? "/pricing" : "/billing", { state: { plan } });
  };

 
  if (full) {
    return (
      <div className="space-y-8 sm:space-y-10">
       
        <div className="text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
            <FiDollarSign size={11} />
            Solvix Pricing
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
            Choose Your Plan
          </h2>

          <p className="mx-auto mt-3 max-w-md text-xs text-gray-500 sm:text-sm">
            Select the perfect plan for your AI workflow. Upgrade or downgrade
            anytime.
          </p>
        </div>

        
        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const accent = getAccentClasses(plan.accent, plan.popular);

            return (
              <div
                key={plan.id}
                className={`
                  group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300
                  hover:-translate-y-1 sm:p-6
                  ${
                    plan.popular
                      ? `${accent.border} bg-gradient-to-b from-indigo-500/[0.08] via-[#050505] to-[#050505] shadow-xl shadow-indigo-600/[0.08]`
                      : `${accent.border} bg-[#050505] hover:border-white/[0.15]`
                  }
                `}
              >
              
                {plan.popular && (
                  <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />
                )}

              
                {plan.popular && (
                  <div className="absolute left-1/2 top-0 -translate-x-1/2">
                    <span className="rounded-b-xl bg-indigo-600 px-4 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

             
                <div className={`relative ${plan.popular ? "pt-4" : ""}`}>
                 
                  <div className="mb-5 flex items-center gap-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${accent.iconBg}`}
                    >
                      <FiZap size={14} />
                    </div>
                    <h3 className="text-lg font-bold text-white sm:text-xl">
                      {plan.name}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-500">{plan.description}</p>

                  
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white sm:text-4xl">
                      ${plan.amount === 0 ? "0" : plan.amount}
                    </span>
                    <span className="text-xs text-gray-500 sm:text-sm">
                      /month
                    </span>
                  </div>

                
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium text-gray-400">
                    <FiZap size={11} className="text-amber-400" />
                    {plan.credits} AI Credits
                  </div>

                  <p className="mt-2 text-[10px] text-gray-600">{plan.speed}</p>
                </div>

                {/* Features */}
                <ul className="relative mt-6 space-y-2.5">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2.5 text-xs sm:text-sm"
                    >
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                          plan.popular
                            ? "bg-indigo-500/15 text-indigo-400"
                            : "bg-white/[0.06] text-gray-400"
                        }`}
                      >
                        <FiCheck size={10} strokeWidth={3} />
                      </span>
                      <span className="text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>

                
                <button
                  type="button"
                  onClick={() => handlePlanClick(plan, true)}
                  className={`
                    mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold
                    transition-all duration-200 active:scale-[0.98]
                    ${accent.button}
                  `}
                >
                  <span>
                    {plan.id === "free"
                      ? "Start for Free"
                      : `Choose ${plan.name}`}
                  </span>
                  <FiArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>

      
        <p className="text-center text-xs text-gray-600">
          All plans include access to every AI tool. Cancel anytime.
        </p>
      </div>
    );
  }

 
  return (
    <div className="mb-6">
    
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-white sm:text-base">
            Choose Your Power
          </h2>
          <p className="mt-0.5 text-[10px] text-gray-500 sm:mt-1 sm:text-xs">
            Upgrade your plan for more credits
          </p>
        </div>

        <button
          onClick={() => navigate("/pricing")}
          className="group flex shrink-0 items-center gap-1 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1.5 text-[10px] font-medium text-indigo-400 transition-all hover:border-indigo-500/40 hover:bg-indigo-500/15 sm:px-3 sm:py-2 sm:text-xs"
        >
          <span>View All</span>
          <FiArrowRight
            size={11}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>

    
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {plans.map((plan) => {
          const accent = getAccentClasses(plan.accent, plan.popular);

          return (
            <div
              key={plan.id}
              className={`
                group relative overflow-hidden rounded-xl border p-4 transition-all duration-300
                hover:-translate-y-1
                ${
                  plan.popular
                    ? `${accent.border} bg-gradient-to-br from-indigo-500/[0.08] via-[#050505] to-[#050505] shadow-lg shadow-indigo-600/[0.06]`
                    : `${accent.border} bg-[#050505] hover:border-white/[0.15]`
                }
              `}
            >
            
              {plan.popular && (
                <div className="absolute right-3 top-3">
                  <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
                    Popular
                  </span>
                </div>
              )}

           
              <div
                className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg ${accent.iconBg}`}
              >
                <FiZap size={14} />
              </div>

           
              <h3 className="text-sm font-bold text-white sm:text-base">
                {plan.name}
              </h3>

           
              <p className="mt-1 text-xl font-black text-white sm:text-2xl">
                ${plan.amount === 0 ? "0" : plan.amount}
                <span className="ml-1 text-[10px] font-medium text-gray-500">
                  /month
                </span>
              </p>

            
              <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-gray-400">
                <FiZap size={9} className="text-amber-400" />
                {plan.credits} credits
              </div>

            
              <button
                onClick={() => handlePlanClick(plan, false)}
                className={`
                  mt-3 flex w-full items-center justify-center gap-1 rounded-lg py-2 text-xs font-semibold
                  transition-all duration-200 active:scale-[0.98]
                  ${accent.button}
                `}
              >
                {plan.id === "free" ? "Start Free" : `Get ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
