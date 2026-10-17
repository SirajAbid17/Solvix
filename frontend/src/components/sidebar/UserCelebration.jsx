import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import gsap from "gsap";

export default function UserCelebration() {
  const { userdata } = useSelector((state) => state.user);

  const [show, setShow] = useState(false);

  const containerRef = useRef(null);
  const messageRef = useRef(null);

  useEffect(() => {
    if (!userdata) {
      setShow(false);
      return;
    }

    setShow(true);

    const timer = setTimeout(() => {
      setShow(false);
    }, 6500);

    return () => clearTimeout(timer);
  }, [userdata]);

  useEffect(() => {
    if (!show || !userdata) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        messageRef.current,
        {
          opacity: 0,
          y: 10,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          delay: 0.2,
          ease: "back.out(1.7)",
        },
      );

      gsap.to(messageRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.5,
        delay: 5.8,
        ease: "power2.in",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [show, userdata]);

  if (!show || !userdata) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="
        pointer-events-none
        absolute
        inset-0
        z-[50]
        overflow-hidden
      "
    >
      <div
        ref={messageRef}
        className="
          absolute
          bottom-[72px]
          left-1/2
          -translate-x-1/2

          opacity-0
        "
      >
        <div
          className="
            flex
            items-center
            justify-center
            gap-1.5

            whitespace-nowrap

            rounded-full

            border
            border-white/[0.10]

            bg-black/[0.35]

            px-3
            py-1.5

            shadow-lg

            backdrop-blur-md
          "
        >
          <span className="text-[9px] font-medium opacity-70">
            Welcome back!
          </span>

          <span className="max-w-[90px] truncate text-[10px] font-bold">
            {userdata.name || "User"}
          </span>
        </div>
      </div>
    </div>
  );
}
