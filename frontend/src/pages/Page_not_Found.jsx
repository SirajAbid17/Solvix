

import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../BgContext/ThemeContext";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { FiHome } from "react-icons/fi";

import BgContextBtn from "../components/BgContextBtn";

export default function Page_not_Found() {
  const navigate = useNavigate();
  const { dark } = useTheme();

  const container = useRef(null);

  const handleGoHome = () => {
    navigate("/");
  };

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.from(".error-number", {
        scale: 0.4,
        opacity: 0,
        rotationX: 90,
        duration: 1.2,
        ease: "back.out(1.7)",
      })

        .from(
          ".error-description",
          {
            y: 25,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.5",
        )

        .from(
          ".error-buttons",
          {
            y: 25,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.3",
        )

        .from(
          ".error-bottom",
          {
            y: 15,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.2",
        );

      gsap.to(".floating-dot", {
        y: -18,
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,

        stagger: {
          each: 0.35,
          from: "random",
        },
      });

      gsap.to(".floating-circle", {
        y: 15,
        x: 8,
        rotation: 8,

        duration: 3,

        ease: "sine.inOut",

        repeat: -1,
        yoyo: true,

        stagger: 0.5,
      });

      gsap.to(".orbit", {
        rotation: 360,

        duration: 18,

        ease: "none",

        repeat: -1,
      });

      gsap.to(".error-number", {
        textShadow: dark
          ? "0 0 35px rgba(255,255,255,0.12)"
          : "0 0 35px rgba(0,0,0,0.12)",

        duration: 2,

        ease: "sine.inOut",

        repeat: -1,
        yoyo: true,
      });

      const buttons = gsap.utils.toArray(".animated-button");

      buttons.forEach((button) => {
        const icon = button.querySelector(".button-icon");

        const handleMouseEnter = () => {
          gsap.to(button, {
            y: -4,
            scale: 1.02,

            duration: 0.25,

            ease: "power2.out",
          });

          if (icon) {
            gsap.to(icon, {
              x: 4,

              duration: 0.25,

              ease: "power2.out",
            });
          }
        };

        const handleMouseLeave = () => {
          gsap.to(button, {
            y: 0,
            scale: 1,

            duration: 0.25,

            ease: "power2.out",
          });

          if (icon) {
            gsap.to(icon, {
              x: 0,

              duration: 0.25,

              ease: "power2.out",
            });
          }
        };

        button.addEventListener("mouseenter", handleMouseEnter);

        button.addEventListener("mouseleave", handleMouseLeave);

        
        return () => {
          button.removeEventListener("mouseenter", handleMouseEnter);

          button.removeEventListener("mouseleave", handleMouseLeave);
        };
      });
    },
    {
      scope: container,
      dependencies: [dark],
    },
  );

  const handleMouseMove = (e) => {
    const rect = container.current?.getBoundingClientRect();

    if (!rect) return;

    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;

    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(".parallax-content", {
      x: mouseX * 12,
      y: mouseY * 12,

      duration: 0.7,

      ease: "power2.out",

      overwrite: "auto",
    });

    gsap.to(".parallax-bg", {
      x: mouseX * -30,
      y: mouseY * -30,

      duration: 1,

      ease: "power2.out",

      overwrite: "auto",
    });

    gsap.to(".parallax-decoration", {
      x: mouseX * 20,
      y: mouseY * 20,

      duration: 1,

      ease: "power2.out",

      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(".parallax-content", {
      x: 0,
      y: 0,

      duration: 0.7,

      ease: "power3.out",

      overwrite: "auto",
    });

    gsap.to(".parallax-bg", {
      x: 0,
      y: 0,

      duration: 1,

      ease: "power3.out",

      overwrite: "auto",
    });

    gsap.to(".parallax-decoration", {
      x: 0,
      y: 0,

      duration: 1,

      ease: "power3.out",

      overwrite: "auto",
    });
  };

  return (
    <div
      ref={container}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        relative

        min-h-screen
        w-full

        overflow-hidden

        flex
        items-center
        justify-center

        px-5
        py-16
        sm:py-20

        transition-colors
        duration-500

        ${dark ? "bg-black text-white" : "bg-white text-gray-900"}
      `}
    >
      <div
        className="
          absolute
          right-5
          top-5

          z-50
        "
      >
        <BgContextBtn />
      </div>

      <div
        className={`
          pointer-events-none

          absolute
          inset-0

          opacity-[0.035]

          ${
            dark
              ? "bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]"
              : "bg-[linear-gradient(rgba(0,0,0,1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,1)_1px,transparent_1px)]"
          }

          bg-[size:50px_50px]
        `}
      />

      <div
        className={`
          parallax-bg

          pointer-events-none

          absolute
          left-1/2
          top-1/2

          h-[400px]
          w-[400px]

          -translate-x-1/2
          -translate-y-1/2

          rounded-full

          blur-[120px]

          transition-colors
          duration-500

          ${dark ? "bg-white/[0.035]" : "bg-gray-400/[0.08]"}
        `}
      />

      <div
        className={`
          pointer-events-none

          absolute
          left-[5%]
          top-[10%]

          h-48
          w-48

          rounded-full

          blur-[100px]

          ${dark ? "bg-gray-500/[0.04]" : "bg-gray-400/[0.08]"}
        `}
      />

      <div
        className={`
          pointer-events-none

          absolute
          bottom-[5%]
          right-[5%]

          h-56
          w-56

          rounded-full

          blur-[110px]

          ${dark ? "bg-gray-400/[0.035]" : "bg-gray-300/[0.10]"}
        `}
      />

      <div
        className={`
          orbit

          pointer-events-none

          absolute
          left-1/2
          top-1/2

          h-[320px]
          w-[320px]

          -translate-x-1/2
          -translate-y-1/2

          rounded-full

          border

          ${dark ? "border-white/[0.07]" : "border-gray-900/[0.07]"}

          sm:h-[400px]
          sm:w-[400px]

          md:h-[470px]
          md:w-[470px]

          lg:h-[500px]
          lg:w-[500px]
        `}
      >
        <span
          className={`
            absolute

            left-1/2
            -top-1

            h-2
            w-2

            -translate-x-1/2

            rounded-full

            ${dark ? "bg-white" : "bg-gray-900"}

            ${
              dark
                ? "shadow-[0_0_15px_rgba(255,255,255,0.7)]"
                : "shadow-[0_0_15px_rgba(0,0,0,0.25)]"
            }
          `}
        />
      </div>

      <div
        className={`
          error-decoration
          floating-dot
          parallax-decoration

          absolute
          left-[12%]
          top-[25%]

          h-2
          w-2

          rounded-full

          ${dark ? "bg-white" : "bg-gray-800"}

          ${
            dark
              ? "shadow-[0_0_15px_rgba(255,255,255,0.6)]"
              : "shadow-[0_0_12px_rgba(0,0,0,0.25)]"
          }
        `}
      />

      <div
        className={`
          error-decoration
          floating-dot
          parallax-decoration

          absolute
          right-[15%]
          top-[20%]

          h-3
          w-3

          rounded-full

          ${dark ? "bg-gray-400" : "bg-gray-500"}

          ${
            dark
              ? "shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              : "shadow-[0_0_15px_rgba(0,0,0,0.2)]"
          }
        `}
      />

      <div
        className={`
          error-decoration
          floating-dot
          parallax-decoration

          absolute
          bottom-[20%]
          left-[18%]

          h-3
          w-3

          rounded-full

          ${dark ? "bg-gray-500" : "bg-gray-400"}
        `}
      />

      <div
        className={`
          error-decoration
          floating-dot
          parallax-decoration

          absolute
          bottom-[18%]
          right-[20%]

          h-2
          w-2

          rounded-full

          ${dark ? "bg-white" : "bg-gray-700"}
        `}
      />

      <div
        className={`
          error-decoration
          floating-circle
          parallax-decoration

          absolute
          left-[22%]
          top-[16%]

          h-8
          w-8

          rounded-full

          border

          ${dark ? "border-white/[0.08]" : "border-gray-900/[0.08]"}
        `}
      />

      <div
        className={`
          error-decoration
          floating-circle
          parallax-decoration

          absolute
          bottom-[22%]
          right-[15%]

          h-12
          w-12

          rounded-full

          border

          ${dark ? "border-white/[0.06]" : "border-gray-900/[0.06]"}
        `}
      />

      <div
        className="
          parallax-content

          relative
          z-10

          w-full
          max-w-sm

          text-center
        "
      >
        <div
          className="
            relative

            mt-2
          "
        >
          <h1
            className={`
              error-number

              select-none

              text-[105px]

              sm:text-[145px]

              md:text-[180px]

              lg:text-[210px]

              leading-none

              font-black

              tracking-[-0.09em]

              text-transparent

              bg-clip-text

              ${
                dark
                  ? "bg-gradient-to-b from-white via-gray-300 to-gray-700"
                  : "bg-gradient-to-b from-gray-900 via-gray-600 to-gray-300"
              }
            `}
          >
            404
          </h1>

          <div
            className={`
              pointer-events-none

              absolute
              left-1/2
              top-1/2

              -z-10

              h-32
              w-72

              -translate-x-1/2
              -translate-y-1/2

              rounded-full

              blur-[90px]

              ${dark ? "bg-white/[0.05]" : "bg-black/[0.05]"}
            `}
          />
        </div>

        <p
          className={`
            error-description

            mx-auto

            mt-2

            max-w-xl

            text-sm

            sm:text-base

            leading-6

            sm:leading-7

            text-gray-500
          `}
        >
          The page you're looking for doesn't exist, has been moved, or may have
          been removed. Don't worry — let's get you back on track.
        </p>

        <div
          className="
            error-buttons

            mt-4

            flex
            flex-col

            items-center
            justify-center

            gap-3

            sm:flex-row
          "
        >
          <button
            type="button"
            onClick={handleGoHome}
            className={`
              animated-button
              group

              flex
              items-center
              justify-center

              gap-2

              min-w-[155px]

              rounded-lg
cursor-pointer
              border

              px-5
              py-3

              text-sm

              font-semibold

              transition-all

              ${
                dark
                  ? `
                    border-white/10
                    bg-white
                    text-black

                    hover:bg-gray-200
                  `
                  : `
                    border-gray-900
                    bg-gray-900
                    text-white

                    hover:bg-gray-800
                  `
              }
            `}
          >
            <FiHome className="button-icon" size={16} />
            Back to Home
          </button>
        </div>

        <div
          className={`
            error-bottom

            mt-6

            flex
            items-center
            justify-center

            gap-3

            text-[10px]

            sm:text-[11px]

            ${dark ? "text-gray-700" : "text-gray-400"}
          `}
        >
          <span
            className={`
              h-px

              w-8

              sm:w-12

              ${dark ? "bg-white/10" : "bg-gray-900/10"}
            `}
          />

          <span>Something went wrong?</span>

          <span
            className={`
              h-px

              w-8

              sm:w-12

              ${dark ? "bg-white/10" : "bg-gray-900/10"}
            `}
          />
        </div>
      </div>
    </div>
  );
}
