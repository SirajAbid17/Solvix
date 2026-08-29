import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../BgContext/ThemeContext";
import { plans } from "./plans";

import { useDispatch } from "react-redux";
import { createOrder } from "../../Features/billing";


export default function PricingDetail() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { dark } = useTheme();
    const [loading, setLoadingState] = useState(null);

    const handlePlan = async (plan) => {
        try {
            // Free plan - direct access
            if (plan.id === "free") {
                navigate("/");
                return;
            }

            // Set loading for specific plan
            setLoadingState(plan.id);

            // Create Stripe checkout session
            const response = await createOrder(plan.id);
            
            console.log("Stripe Session Response:", response);

            if (response.success && response.sessionUrl) {
                // Redirect to Stripe checkout
                window.location.href = response.sessionUrl;
            } else {
                throw new Error("Failed to create checkout session");
            }
        } catch (error) {
            console.error("Plan Selection Error:", error);
            alert(error.response?.data?.message || "Failed to process payment. Please try again.");
        } finally {
            setLoadingState(null);
        }
    };

    return (
        <main className="min-h-screen bg-black text-white">
            {/* =====================================================
                BACKGROUND
            ====================================================== */}

            <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
                {/* Purple Glow */}
                <div className="absolute left-1/2 top-[-180px] h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-purple-600/[0.07] blur-[140px]" />

                {/* Small side glow */}
                <div className="absolute left-[-180px] top-[35%] h-[300px] w-[300px] rounded-full bg-purple-600/[0.035] blur-[120px]" />

                <div className="absolute bottom-[-150px] right-[-150px] h-[300px] w-[300px] rounded-full bg-purple-600/[0.03] blur-[120px]" />

                {/* Subtle grid */}
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                        backgroundSize: "70px 70px",
                    }}
                />
            </div>

            {/* =====================================================
                PAGE
            ====================================================== */}

            <div className="relative mx-auto w-full max-w-6xl px-5 py-6 sm:px-8">
                {/* ===================================================
                    HEADER
                ==================================================== */}

                <header className="flex items-center justify-between">
                    {/* Home */}
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="group flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-4 py-2 text-xs font-medium text-gray-400 backdrop-blur-md transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.05] hover:text-white"
                    >
                        <span className="text-sm transition-transform duration-300 group-hover:-translate-x-1">
                            ←
                        </span>
                        Home
                    </button>

                    {/* Logo */}
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="text-3xl mt-2 font-black tracking-[0.28em] text-white"
                    >
                        SOLVIX
                    </button>

                    {/* Right spacer */}
                    <div className="w-[64px]" />
                </header>

                {/* ===================================================
                    HERO
                ==================================================== */}

                <section className="mx-auto mt-14 max-w-2xl text-center">
                    {/* Badge */}
                    <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/[0.07] px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-purple-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                        Simple & Transparent
                    </div>

                    {/* Heading */}
                    <h1 className="mt-5 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
                        Choose your plan
                    </h1>

                    {/* Description */}
                    <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-500 sm:text-[15px]">
                        Get more AI credits, faster processing, and
                        everything you need to get the most out of Solvix.
                    </p>
                </section>

                {/* ===================================================
                    PRICING CARDS
                ==================================================== */}

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
                                {/* =========================================
                                    CARD GLOW
                                ========================================== */}

                                {isPro && (
                                    <>
                                        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-purple-600/[0.09] blur-[80px]" />
                                        <div className="pointer-events-none absolute bottom-[-100px] left-[-80px] h-52 w-52 rounded-full bg-purple-600/[0.05] blur-[70px]" />
                                    </>
                                )}

                                {/* =========================================
                                    TOP ACCENT
                                ========================================== */}

                                {isPro && (
                                    <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/70 to-transparent" />
                                )}

                                {/* =========================================
                                    PLAN HEADER
                                ========================================== */}

                                <div className="relative">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p
                                                className={`text-[9px] font-semibold uppercase tracking-[0.2em] ${
                                                    isPro
                                                        ? "text-purple-400"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                {isPro ? "Most Popular" : "Plan"}
                                            </p>

                                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                                                {plan.name}
                                            </h2>
                                        </div>

                                        {/* Popular */}
                                        {isPro && (
                                            <div className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-[8px] font-bold uppercase tracking-wider text-purple-400">
                                                Popular
                                            </div>
                                        )}
                                    </div>

                                    <p className="mt-3 min-h-[38px] text-xs leading-5 text-gray-500">
                                        {plan.description}
                                    </p>
                                </div>

                                {/* =========================================
                                    PRICE
                                ========================================== */}

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

                                {/* =========================================
                                    CREDITS + SPEED
                                ========================================== */}

                                <div className="relative mt-5 grid grid-cols-2 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.025]">
                                    {/* Credits */}
                                    <div className="px-4 py-3">
                                        <p className="text-[8px] font-medium uppercase tracking-[0.18em] text-gray-600">
                                            AI Credits
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-white">
                                            {plan.credits.toLocaleString()}
                                        </p>
                                    </div>

                                    {/* Speed */}
                                    <div className="border-l border-white/[0.06] px-4 py-3">
                                        <p className="text-[8px] font-medium uppercase tracking-[0.18em] text-gray-600">
                                            Speed
                                        </p>

                                        <p
                                            className={`mt-1 text-sm font-semibold ${
                                                isPro
                                                    ? "text-purple-400"
                                                    : "text-white"
                                            }`}
                                        >
                                            {plan.speed}
                                        </p>
                                    </div>
                                </div>

                                {/* =========================================
                                    DIVIDER
                                ========================================== */}

                                <div className="my-5 h-px bg-white/[0.06]" />

                                {/* =========================================
                                    FEATURES
                                ========================================== */}

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
                                                {/* Check */}
                                                <span
                                                    className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${
                                                        isPro
                                                            ? "bg-purple-500/10 text-purple-400"
                                                            : "bg-green-500/10 text-green-500"
                                                    }`}
                                                >
                                                    <svg
                                                        viewBox="0 0 12 12"
                                                        fill="none"
                                                        className="h-2.5 w-2.5"
                                                    >
                                                        <path
                                                            d="M2.5 6.2 5 8.5 9.5 3.8"
                                                            stroke="currentColor"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </span>

                                                {/* Text */}
                                                <span className="text-xs text-gray-400">
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* =========================================
                                    BUTTON
                                ========================================== */}

                                <button
                                    type="button"
                                    onClick={() => handlePlan(plan)}
                                    disabled={isLoading}
                                    className={`relative mt-6 h-11 w-full shrink-0 rounded-xl text-sm font-semibold transition-all duration-300 active:scale-[0.98] ${
                                        isLoading
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
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
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                        fill="none"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    />
                                                </svg>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                {isFree
                                                    ? "Start for Free"
                                                    : "Get Started"}
                                                {!isFree && (
                                                    <span className="text-base transition-transform duration-300 group-hover:translate-x-0.5">
                                                        →
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </span>
                                </button>
                            </article>
                        );
                    })}
                </section>

                {/* ===================================================
                    INFO
                ==================================================== */}

                <div className="mx-auto mt-7 max-w-6xl">
                    <div className="flex items-center justify-center gap-2 text-center text-[10px] text-gray-600">
                        <span className="h-1 w-1 rounded-full bg-green-500" />
                        All plans include access to Solvix AI tools.
                        <span className="hidden sm:inline">
                            •
                        </span>
                        Upgrade anytime.
                        <span className="hidden sm:inline">
                            •
                        </span>
                        Secure payment powered by Stripe.
                    </div>
                </div>
            </div>
        </main>
    );
}