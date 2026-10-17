import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../BgContext/ThemeContext";
import { plans } from "./plans";
import { useDispatch } from "react-redux";
import { createOrder } from "../../Features/billing";
import toast from "react-hot-toast";


import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiZap,
  FiCpu,
  FiShield,
  FiStar,
  FiLoader,
} from "react-icons/fi";
import { HiOutlineSparkles, HiOutlineLightningBolt } from "react-icons/hi";
import { MdOutlineWorkspacePremium } from "react-icons/md";

export default function PricingDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { dark } = useTheme();
  const [loading, setLoadingState] = useState(null);

  const handlePlan = async (plan) => {
    if (loading) return;

    try {
      if (plan.id === "free") {
        console.log("Free plan selected — navigating home");
        navigate("/");
        return;
      }

      setLoadingState(plan.id);

      console.log("Starting payment flow for:", plan.id);

      const response = await createOrder(plan.id);

      console.log("Response:", response);

      let sessionUrl = null;

      if (response?.sessionUrl && typeof response.sessionUrl === "string") {
        sessionUrl = response.sessionUrl;
      } else if (
        response?.data?.sessionUrl &&
        typeof response.data.sessionUrl === "string"
      ) {
        sessionUrl = response.data.sessionUrl;
      } else if (
        response?.payment?.sessionUrl &&
        typeof response.payment.sessionUrl === "string"
      ) {
        sessionUrl = response.payment.sessionUrl;
      } else if (response?.url && typeof response.url === "string") {
        sessionUrl = response.url;
      }

      if (sessionUrl && sessionUrl.startsWith("https://")) {
        console.log("Redirecting to Stripe:", sessionUrl);
        toast.success("Redirecting to payment...");
        setTimeout(() => {
          window.location.assign(sessionUrl);
        }, 300);
        return;
      }

      const errorMsg =
        response?.message ||
        response?.error ||
        "No payment URL returned from server";

      throw new Error(errorMsg);
    } catch (error) {
      console.error(" Payment flow error:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to process payment. Please try again.";
      toast.error(message);
      setLoadingState(null);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      
      <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
        <div className="absolute left-1/2 top-[-180px] h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-purple-600/[0.07] blur-[140px]" />
        <div className="absolute left-[-180px] top-[35%] h-[300px] w-[300px] rounded-full bg-purple-600/[0.035] blur-[120px]" />
        <div className="absolute bottom-[-150px] right-[-150px] h-[300px] w-[300px] rounded-full bg-purple-600/[0.03] blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-5 py-6 sm:px-8">
       
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="group flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-4 py-2 text-xs font-medium text-gray-400 backdrop-blur-md transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.05] hover:text-white"
          >
           
            <FiArrowLeft
              size={14}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Home
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-3xl mt-2 font-black tracking-[0.28em] text-white"
          >
            SOLVIX
          </button>

          <div className="w-[64px]" />
        </header>

        
        <section className="mx-auto mt-14 max-w-2xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/[0.07] px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-purple-400">
          
            <HiOutlineSparkles size={11} />
            Simple & Transparent
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
            Choose your plan
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-500 sm:text-[15px]">
            Get more AI credits, faster processing, and everything you need to
            get the most out of Solvix.
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="mx-auto mt-12 grid max-w-8xl items-stretch gap-5 lg:grid-cols-3">
          {plans.map((plan) => {
            const isPro = plan.id === "pro";
            const isFree = plan.id === "free";
            const isLoading = loading === plan.id;

            return (
              <article
                key={plan.id}
                className={`group relative flex min-h-[430px] flex-col overflow-hidden rounded-[16px] border p-4 transition-all duration-500 ${
                  isPro
                    ? "border-purple-500/35 bg-[#0b0710] shadow-[0_20px_70px_rgba(168,85,247,0.08)]"
                    : "border-white/[0.08] bg-[#080808] hover:-translate-y-1 hover:border-white/[0.14] hover:bg-[#0a0a0a]"
                }`}
              >
                {isPro && (
                  <>
                    <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-purple-600/[0.09] blur-[80px]" />
                    <div className="pointer-events-none absolute bottom-[-100px] left-[-80px] h-52 w-52 rounded-full bg-purple-600/[0.05] blur-[70px]" />
                    <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/70 to-transparent" />
                  </>
                )}

                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <p
                        className={`text-[9px] font-semibold uppercase tracking-[0.2em] ${
                          isPro ? "text-purple-400" : "text-gray-600"
                        }`}
                      >
                        {isPro ? "Most Popular" : "Plan"}
                      </p>

                      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                        {plan.name}
                      </h2>
                    </div>

                    {isPro && (
                      <div className="flex items-center gap-1 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-[8px] font-bold uppercase tracking-wider text-purple-400">
                     
                        <FiStar size={9} />
                        Popular
                      </div>
                    )}
                  </div>

                  <p className="mt-3 min-h-[38px] text-xs leading-5 text-gray-500">
                    {plan.description}
                  </p>
                </div>

                <div className="relative flex items-end">
                  <span className="text-[42px] font-bold leading-none tracking-[-0.05em] text-white">
                    ${plan.amount.toFixed(2)}
                  </span>

                  {plan.amount > 0 && (
                    <span className="mb-1 ml-2 text-[11px] text-gray-600">
                      / month
                    </span>
                  )}
                </div>

                <div className="relative mt-5 grid grid-cols-2 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.025]">
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                    
                      <FiZap
                        size={9}
                        className={isPro ? "text-purple-400" : "text-gray-500"}
                      />
                      <p className="text-[8px] font-medium uppercase tracking-[0.18em] text-gray-600">
                        AI Credits
                      </p>
                    </div>

                    <p className="mt-1 text-sm font-semibold text-white">
                      {plan.credits.toLocaleString()}
                    </p>
                  </div>

                  <div className="border-l border-white/[0.06] px-4 py-3">
                    <div className="flex items-center gap-1.5">
                   
                      <HiOutlineLightningBolt
                        size={10}
                        className={isPro ? "text-purple-400" : "text-gray-500"}
                      />
                      <p className="text-[8px] font-medium uppercase tracking-[0.18em] text-gray-600">
                        Speed
                      </p>
                    </div>

                    <p
                      className={`mt-1 text-sm font-semibold ${
                        isPro ? "text-purple-400" : "text-white"
                      }`}
                    >
                      {plan.speed}
                    </p>
                  </div>
                </div>

                <div className="my-5 h-px bg-white/[0.06]" />

                <div className="flex-1">
                  <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-600">
                    Everything included
                  </p>

                  <div className="space-y-2.5">
                    {plan.features.map((feature, index) => (
                      <div
                        key={`${plan.id}-${index}`}
                        className="flex items-center gap-3"
                      >
                        <span
                          className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${
                            isPro
                              ? "bg-purple-500/10 text-purple-400"
                              : "bg-green-500/10 text-green-500"
                          }`}
                        >
                         
                          <FiCheck size={10} strokeWidth={3} />
                        </span>

                        <span className="text-xs text-gray-400">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handlePlan(plan)}
                  disabled={isLoading || !!loading}
                  className={`relative mt-6 h-11 w-full shrink-0 rounded-xl text-sm font-semibold transition-all duration-300 active:scale-[0.98] ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  } ${
                    isPro
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/10 hover:bg-purple-500 hover:shadow-purple-600/20"
                      : isFree
                        ? "border border-white/[0.1] bg-white/[0.04] text-white hover:border-white/[0.16] hover:bg-white/[0.07]"
                        : "bg-white text-black hover:bg-gray-200"
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                      
                        <FiLoader size={14} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                       
                        {isFree ? (
                          <FiCheck size={14} />
                        ) : isPro ? (
                          <MdOutlineWorkspacePremium size={16} />
                        ) : (
                          <FiZap size={14} />
                        )}

                        {isFree ? "Start for Free" : "Get Started"}

                        {!isFree && (
                         
                          <FiArrowRight
                            size={14}
                            className="transition-transform duration-300 group-hover:translate-x-0.5"
                          />
                        )}
                      </>
                    )}
                  </span>
                </button>
              </article>
            );
          })}
        </section>

        <div className="mx-auto mt-7 max-w-6xl">
          <div className="flex items-center justify-center gap-2 text-center text-[10px] text-gray-600">
          
            <FiShield size={11} className="text-green-500" />
            All plans include access to Solvix AI tools.
            <span className="hidden sm:inline">•</span>
            Upgrade anytime.
            <span className="hidden sm:inline">•</span>
            Secure payment powered by Stripe.
          </div>
        </div>
      </div>
    </main>
  );
}
