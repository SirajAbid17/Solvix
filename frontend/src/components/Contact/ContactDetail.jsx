import React, { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiCheckCircle, FiClock, FiX } from "react-icons/fi";
import gsap from "gsap";

import ContactHeader from "./ContactHeader";
import ContactForm from "./ContactForm";

const ContactDetail = () => {
  const sectionRef = useRef(null);
  const modalRef = useRef(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          [
            ".contact-header",
            ".contact-badge",
            ".contact-title",
            ".contact-description",
            ".contact-form-card",
          ],
          {
            opacity: 1,
            y: 0,
            x: 0,
          },
        );

        return;
      }

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .from(".contact-header", {
          opacity: 0,
          y: -12,
          duration: 0.5,
        })
        .from(
          ".contact-badge",
          {
            opacity: 0,
            y: 10,
            duration: 0.45,
          },
          "-=0.2",
        )
        .from(
          ".contact-title",
          {
            opacity: 0,
            y: 22,
            duration: 0.65,
          },
          "-=0.25",
        )
        .from(
          ".contact-description",
          {
            opacity: 0,
            y: 12,
            duration: 0.5,
          },
          "-=0.35",
        )
        .from(
          ".contact-form-card",
          {
            opacity: 0,
            y: 25,
            duration: 0.65,
          },
          "-=0.2",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!showSuccessModal || !modalRef.current) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      gsap.fromTo(
        modalRef.current,
        {
          opacity: 0,
          scale: 0.94,
          y: 15,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: "power3.out",
        },
      );
    }, modalRef);

    return () => {
      document.body.style.overflow = previousOverflow;
      ctx.revert();
    };
  }, [showSuccessModal]);

  const closeModal = () => {
    if (!modalRef.current) {
      setShowSuccessModal(false);
      return;
    }

    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.96,
      y: 10,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        setShowSuccessModal(false);
      },
    });
  };

  return (
    <div
      ref={sectionRef}
      className="min-h-screen overflow-hidden bg-[#050607] text-white selection:bg-white selection:text-black"
    >
      {}

      <div className="pointer-events-none fixed inset-0 -z-10">
        {}
        <div className="absolute left-1/2 top-[-220px] h-[460px] w-[620px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-[120px]" />

        {}
        <div className="absolute right-[-180px] top-[30%] h-[380px] w-[380px] rounded-full bg-[#c9a468]/[0.025] blur-[120px]" />

        {}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      {}

      <ContactHeader />

      {}

      <main className="mx-auto flex w-full max-w-[1400px] flex-col items-center px-5 pb-0 pt-[96px] sm:px-8 lg:px-12 lg:pt-[108px]">
        {}

        <section className="flex w-full max-w-4xl flex-col items-center text-center">
          {}
          <div className="contact-badge inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c9a468]/60" />

              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#c9a468]" />
            </span>

            <span className="text-[8px] font-medium uppercase tracking-[0.2em] text-white/40">
              We’re available to help
            </span>
          </div>

          {}
          <h1 className="contact-title mt-5 max-w-3xl font-serif text-[clamp(40px,6vw,76px)] font-medium leading-[0.92] tracking-[-0.045em] text-white">
            Let’s start a
            <span className="block text-white/30">conversation.</span>
          </h1>

          {}
          <p className="contact-description mt-5 max-w-2xl text-[13px] leading-6 text-white/35 sm:text-sm">
            Have a question, need help with Solvix, or want to explore what
            intelligent workflows can do for your team? Send us a message and
            we’ll get back to you.
          </p>
        </section>

        {}

        <div className="mt-9 flex w-full justify-center lg:mt-11">
          <ContactForm onSuccess={() => setShowSuccessModal(true)} />
        </div>
      </main>

      {}

      <footer className="mt-12 border-t border-white/[0.07] bg-[#090a0c]">
        <div className="mx-auto max-w-[1400px] px-5 py-6 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[9px] text-white/25">
              © {currentYear} Solvix AI. All rights reserved.
            </p>

            <div className="flex items-center gap-2 text-[9px] text-white/25">
              <span className="h-1 w-1 rounded-full bg-[#c9a468]/60" />

              <span>Built for intelligent work.</span>
            </div>
          </div>
        </div>
      </footer>

      {}

      {showSuccessModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-5 backdrop-blur-md"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-success-title"
            className="relative w-full max-w-sm overflow-hidden rounded-[24px] border border-white/[0.1] bg-[#0c0d10] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.65)]"
          >
            {}
            <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-[#c9a468]/10 blur-[65px]" />

            {}
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close success message"
              className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.025] text-white/30 transition hover:bg-white/[0.06] hover:text-white"
            >
              <FiX size={13} />
            </button>

            {}
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06]">
              <FiCheckCircle size={22} className="text-emerald-400/80" />
            </div>

            {}
            <div className="relative mt-5">
              <p className="text-[8px] font-medium uppercase tracking-[0.2em] text-white/25">
                Message received
              </p>

              <h2
                id="contact-success-title"
                className="mt-1.5 font-serif text-2xl text-white"
              >
                Thank you.
              </h2>

              <p className="mt-3 text-xs leading-5 text-white/35">
                Your message has been sent successfully. Our team will review it
                and get back to you as soon as possible.
              </p>
            </div>

            {}
            <div className="relative mt-5 flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035]">
                <FiClock size={13} className="text-white/40" />
              </div>

              <div>
                <p className="text-[8px] uppercase tracking-[0.18em] text-white/25">
                  Expected response
                </p>

                <p className="mt-0.5 text-[10px] text-white/55">
                  Usually within 24 hours
                </p>
              </div>
            </div>

            {}
            <button
              type="button"
              onClick={closeModal}
              className="relative mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-white text-[10px] font-medium text-black transition hover:bg-white/90"
            >
              Continue
              <FiArrowUpRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactDetail;