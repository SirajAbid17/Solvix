import React, { useRef, useState } from "react";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utlis/firebase";

import api from "../utlis/axios";

import { useDispatch } from "react-redux";
import { setuserData } from "../redux/userSlice";

import { useNavigate } from "react-router-dom";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import LoginHero from "../components/LoginRequired/LoginHero";
import LoginCard from "../components/LoginRequired/LoginCard";

export default function LoginRequired() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const container = useRef(null);

  const [loading, setLoading] = useState(false);

  // =========================================================
  // GSAP
  // =========================================================

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // =====================================================
      // INITIAL STATES
      // =====================================================

      gsap.set(".stairs", {
        height: "100%",
      });

      gsap.set(".top-google-btn", {
        opacity: 0,
        y: -25,
      });

      gsap.set(".login-content", {
        opacity: 0,
        y: 20,
        scale: 0.97,
      });

      gsap.set(".small-item", {
        opacity: 0,
        y: 2,
      });

      gsap.set(".login-google-btn", {
        opacity: 0,
        y: 10,
      });

      // =====================================================
      // STAIR REVEAL
      // =====================================================

      tl.to(".stairs", {
        height: 0,
        duration: 1.25,
        stagger: 0.1,
        ease: "power4.inOut",
      });

      // =====================================================
      // TOP BUTTON
      // =====================================================

      tl.to(
        ".top-google-btn",
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        "-=0.5"
      );

      // =====================================================
      // MAIN CONTENT
      // =====================================================

      tl.to(
        ".login-content",
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power4.out",
        },
        "-=0.45"
      );

      // =====================================================
      // SMALL ITEMS
      // =====================================================

      tl.to(
        ".small-item",
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: "power3.out",
        },
        "-=0.45"
      );

      // =====================================================
      // LOGIN BUTTON
      // =====================================================

      tl.to(
        ".login-google-btn",
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.25"
      );

      // =====================================================
      // FLOATING ORB 1
      // =====================================================

      gsap.to(".orb-one", {
        x: 100,
        y: 70,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // =====================================================
      // FLOATING ORB 2
      // =====================================================

      gsap.to(".orb-two", {
        x: -90,
        y: -60,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // =====================================================
      // FLOATING ORB 3
      // =====================================================

      gsap.to(".orb-three", {
        x: 60,
        y: -50,
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // =====================================================
      // CARD FLOAT
      // =====================================================

      gsap.to(".login-card", {
        y: -5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    {
      scope: container,
  });

  // =========================================================
  // SEND TOKEN TO BACKEND
  // =========================================================

  const handleData = async (token) => {
    try {
      const { data } = await api.post("/auth/login", {
        token,
      });

      dispatch(setuserData(data));

      navigate("/");
    } catch (error) {
      console.error("Login API Error:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed";

      console.error(message);
    }
  };

  // =========================================================
  // GOOGLE LOGIN
  // =========================================================

  const handleLogin = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const result = await signInWithPopup(
        auth,
        googleProvider
      );

      if (!result?.user) {
        throw new Error(
          "Google authentication failed."
        );
      }

      const token = await result.user.getIdToken();

      if (!token) {
        throw new Error(
          "Firebase token was not generated."
        );
      }

      await handleData(token);
    } catch (error) {
      console.error(
        "Google Login Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={container}
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#030303]
        text-white
        selection:bg-white
        selection:text-black
      "
    >

      {/* =====================================================
          BACKGROUND GRID
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.045]
        "
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "55px 55px",
        }}
      />

      {/* =====================================================
          CENTER RADIAL GLOW
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_55%)]
        "
      />

      {/* =====================================================
          PURPLE ORB
      ===================================================== */}

      <div
        className="
          orb-one
          pointer-events-none
          absolute
          -left-40
          -top-40
          h-[520px]
          w-[520px]
          rounded-full
          bg-purple-600/20
          blur-[130px]
        "
      />

      {/* =====================================================
          BLUE ORB
      ===================================================== */}

      <div
        className="
          orb-two
          pointer-events-none
          absolute
          -right-40
          top-10
          h-[520px]
          w-[520px]
          rounded-full
          bg-blue-600/20
          blur-[130px]
        "
      />

      {/* =====================================================
          PINK ORB
      ===================================================== */}

      <div
        className="
          orb-three
          pointer-events-none
          absolute
          -bottom-[250px]
          left-[40%]
          h-[520px]
          w-[520px]
          rounded-full
          bg-pink-600/10
          blur-[130px]
        "
      />

      {/* =====================================================
          STAIRS
      ===================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          z-[100]
          flex
        "
      >
        <div className="stairs h-full w-1/5 bg-white" />
        <div className="stairs h-full w-1/5 bg-black" />
        <div className="stairs h-full w-1/5 bg-white" />
        <div className="stairs h-full w-1/5 bg-black" />
        <div className="stairs h-full w-1/5 bg-white" />
      </div>

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header
        className="
          absolute
          left-0
          top-0
          z-30
          w-full
          px-5
          py-5
          md:px-10
          md:py-7
        "
      >
        <div className="flex items-center justify-between">

          {/* LOGO */}

          <div className="small-item flex items-center gap-3">

            <div>
              <p
                className="
                  text-base
                  font-bold
                  tracking-tight
                "
              >
                Solvix AI
              </p>

              <p
                className="
                  text-[9px]
                  tracking-[0.25em]
                  text-gray-600
                "
              >
                AI WORKSPACE
              </p>
            </div>

          </div>

          {/* TOP GOOGLE BUTTON */}

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            aria-label="Continue with Google"
            className="
              top-google-btn
              group
              flex
              items-center
              gap-3
              rounded-full
              border
              border-white/10
              bg-white/[0.06]
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              backdrop-blur-xl
              transition-all
              duration-300
              hover:border-white/30
              hover:bg-white
              hover:text-black
              hover:shadow-[0_0_30px_rgba(255,255,255,0.12)]
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-60
              md:px-5
            "
          >
            {/* Google icon */}

            <span
              className="
                flex
                h-5
                w-5
                items-center
                justify-center
                rounded-full
                bg-white
              "
            >
              G
            </span>

            <span className="hidden sm:block">
              {loading
                ? "Signing in..."
                : "Continue with Google"}
            </span>

            <span
              className="
                text-gray-500
                transition-all
                duration-300
                group-hover:translate-x-1
                group-hover:text-black
              "
            >
              →
            </span>
          </button>

        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className="
          relative
          z-10
          flex
          min-h-screen
          items-center
          justify-center
          px-4
          pb-8
          pt-28
          sm:px-6
          md:px-10
        "
      >
        <div
          className="
            login-content
            w-full
            max-w-6xl
          "
        >

          {/* =================================================
              MAIN CARD
          ================================================= */}

          <div
            className="
              login-card
              relative
              overflow-hidden
              rounded-[32px]
              border
              border-white/10
              bg-white/[0.035]
              p-4
              shadow-[0_30px_100px_rgba(0,0,0,0.5)]
              backdrop-blur-2xl
              sm:p-6
              md:rounded-[40px]
              md:p-10
            "
          >

            {/* TOP GLOW */}

            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-0
                h-52
                w-[500px]
                -translate-x-1/2
                rounded-full
                bg-white/[0.055]
                blur-[100px]
              "
            />

            {/* INNER BORDER */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                rounded-[40px]
                ring-1
                ring-inset
                ring-white/[0.035]
              "
            />

            {/* =================================================
                CONTENT GRID
            ================================================= */}

            <div
              className="
                relative
                grid
                items-center
                gap-8
                md:grid-cols-[1.1fr_0.9fr]
                md:gap-14
              "
            >

              {/* LEFT */}

              <LoginHero />

              {/* RIGHT */}

              <LoginCard
                handleLogin={handleLogin}
                loading={loading}
              />

            </div>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div
            className="
              small-item
              mt-6
              flex
              flex-col
              items-center
              justify-center
              gap-2
              text-xs
              text-gray-700
              sm:flex-row
            "
          >
            <span>
              © 2026 Solvix AI
            </span>

            <span className="hidden sm:block">
              •
            </span>

            <span>
              AI powered workspace
            </span>
          </div>

        </div>
      </main>
    </div>
  );
}