import React from "react";

import { FcGoogle } from "react-icons/fc";

import {
  FiArrowRight,
  FiBriefcase,
  FiCpu,
  FiFileText,
  FiLock,
  FiUserCheck,
} from "react-icons/fi";

export default function LoginCard({
  handleLogin,
  loading,
}) {
  return (
    <section className="small-item relative">

      {}

      <div
        className="
          pointer-events-none
          absolute
          -inset-5
          rounded-[40px]
          bg-white/[0.025]
          blur-2xl
        "
      />

      {}

      <div
        className="
          relative
          overflow-hidden
          rounded-[28px]
          border
          border-white/10
          bg-black/50
          p-6
          shadow-[0_25px_70px_rgba(0,0,0,0.5)]
          backdrop-blur-2xl
          sm:p-8
        "
      >

        {}

        <div
          className="
            absolute
            left-1/2
            top-0
            h-px
            w-2/3
            -translate-x-1/2
            bg-gradient-to-r
            from-transparent
            via-white/30
            to-transparent
          "
        />

        {}

        <div
          className="
            mb-7
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            border
            border-white/10
            bg-gradient-to-br
            from-white/10
            to-white/[0.02]
            shadow-[0_10px_30px_rgba(0,0,0,0.3)]
          "
        >
          <FiUserCheck className="text-2xl text-gray-200" />
        </div>

        {}

        <h2
          className="
            text-3xl
            font-semibold
            tracking-[-0.04em]
            sm:text-4xl
          "
        >
          Welcome back.
        </h2>

        <p
          className="
            mt-3
            max-w-sm
            text-sm
            leading-6
            text-gray-600
          "
        >
          Sign in to continue to your personalized
          AI workspace.
        </p>

        {}

        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          aria-label="Continue with Google"
          className="
            login-google-btn
            group
            mt-8
            flex
            w-full
            items-center
            justify-center
            gap-3
            rounded-2xl
            border
            border-white/15
            bg-white
            px-5
            py-4
            text-sm
            font-semibold
            text-black
            shadow-[0_15px_40px_rgba(255,255,255,0.08)]
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:bg-gray-100
            hover:shadow-[0_20px_50px_rgba(255,255,255,0.12)]
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading ? (
            <>
              <span
                className="
                  h-5
                  w-5
                  animate-spin
                  rounded-full
                  border-2
                  border-black/20
                  border-t-black
                "
              />

              <span>
                Signing in...
              </span>
            </>
          ) : (
            <>
              <FcGoogle
                className="
                  text-xl
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              />

              <span>
                Continue with Google
              </span>

              <FiArrowRight
                className="
                  ml-auto
                  text-gray-500
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </>
          )}
        </button>

        {}

        <div className="my-7 flex items-center gap-3">

          <div className="h-px flex-1 bg-white/10" />

          <span
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.25em]
              text-gray-600
            "
          >
            Secure Login
          </span>

          <div className="h-px flex-1 bg-white/10" />

        </div>

        {}

        <div
          className="
            flex
            items-center
            justify-center
            gap-2
            text-center
            text-xs
            text-gray-600
          "
        >
          <FiLock className="text-green-500/70" />

          <span>
            Secure authentication powered by Google
          </span>
        </div>

        {}

        <div
          className="
            mt-7
            grid
            grid-cols-3
            gap-2
            border-t
            border-white/5
            pt-6
          "
        >

          {}

          <div className="flex flex-col items-center gap-2">
            <FiFileText className="text-gray-600" />

            <span className="text-[10px] text-gray-700">
              Resume
            </span>
          </div>

          {}

          <div className="flex flex-col items-center gap-2">
            <FiBriefcase className="text-gray-600" />

            <span className="text-[10px] text-gray-700">
              Portfolio
            </span>
          </div>

          {}

          <div className="flex flex-col items-center gap-2">
            <FiCpu className="text-gray-600" />

            <span className="text-[10px] text-gray-700">
              AI Agents
            </span>
          </div>

        </div>

      </div>

      {}

      <div
        className="
          pointer-events-none
          absolute
          -right-3
          -top-3
          h-16
          w-16
          rounded-full
          border
          border-white/10
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-4
          -left-4
          h-10
          w-10
          rounded-full
          border
          border-white/10
        "
      />

    </section>
  );
}