import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import gsap from "gsap";
import { MdCelebration } from "react-icons/md";

const FLOWERS = ["🌸", "🌺", "🌼", "🌻", "🌷", "🌹"];
const BALLOONS = ["🎈", "🎈", "🎈", "🎈", "🎈", "🎈"];

export default function UserCelebration() {
  const { userdata } = useSelector((state) => state.user);

  const [show, setShow] = useState(false);

  const containerRef = useRef(null);
  const balloonRefs = useRef([]);
  const flowerRefs = useRef([]);
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
        }
      );

      
      
      

      balloonRefs.current.forEach((balloon, index) => {
        if (!balloon) return;

        const delays = [0, 0.25, 0.5, 0.15, 0.4, 0.65];

        gsap.fromTo(
          balloon,
          {
            opacity: 0,
            y: 20,
            x: 0,
            rotation: -8,
            scale: 0.5,
          },
          {
            opacity: 1,
            y: -95,
            x: index % 2 === 0 ? 12 : -12,
            rotation: 8,
            scale: 1,
            duration: 1.8,
            delay: delays[index],
            ease: "power1.out",

            onComplete: () => {
              gsap.to(balloon, {
                opacity: 0,
                y: -210,
                x: index % 2 === 0 ? -10 : 10,
                rotation: -8,
                scale: 0.75,
                duration: 2,
                ease: "power1.out",
              });
            },
          }
        );

        
        gsap.to(balloon, {
          x: index % 2 === 0 ? 10 : -10,
          duration: 0.7,
          delay: delays[index],
          repeat: 4,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      
      
      

      flowerRefs.current.forEach((flower, index) => {
        if (!flower) return;

        const delays = [0.2, 0.45, 0.7, 0.3, 0.55, 0.8];

        gsap.fromTo(
          flower,
          {
            opacity: 0,
            y: 15,
            x: 0,
            rotation: 0,
            scale: 0.4,
          },
          {
            opacity: 1,
            y: -85,
            x: index % 2 === 0 ? 10 : -10,
            rotation: index % 2 === 0 ? 120 : -120,
            scale: 1,
            duration: 1.7,
            delay: delays[index],
            ease: "power1.out",

            onComplete: () => {
              gsap.to(flower, {
                opacity: 0,
                y: -190,
                rotation: index % 2 === 0 ? 240 : -240,
                scale: 0.7,
                duration: 2,
                ease: "power1.out",
              });
            },
          }
        );
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
      {}

      {BALLOONS.map((balloon, index) => {
        const positions = [
          "left-[5%]",
          "left-[22%]",
          "left-[39%]",
          "right-[39%]",
          "right-[22%]",
          "right-[5%]",
        ];

        const sizes = [
          "text-[25px]",
          "text-[22px]",
          "text-[28px]",
          "text-[24px]",
          "text-[22px]",
          "text-[26px]",
        ];

        return (
          <span
            key={`balloon-${index}`}
            ref={(el) => {
              balloonRefs.current[index] = el;
            }}
            className={`
              absolute
              bottom-[42px]
              ${positions[index]}
              ${sizes[index]}

              select-none
              opacity-0
              leading-none

              will-change-transform
            `}
          >
            {balloon}
          </span>
        );
      })}

      {}

      {FLOWERS.map((flower, index) => {
        const positions = [
          "left-[10%]",
          "left-[28%]",
          "left-[43%]",
          "right-[34%]",
          "right-[20%]",
          "right-[9%]",
        ];

        const sizes = [
          "text-[18px]",
          "text-[21px]",
          "text-[18px]",
          "text-[21px]",
          "text-[19px]",
          "text-[21px]",
        ];

        return (
          <span
            key={`flower-${index}`}
            ref={(el) => {
              flowerRefs.current[index] = el;
            }}
            className={`
              absolute
              bottom-[43px]
              ${positions[index]}
              ${sizes[index]}

              select-none
              opacity-0
              leading-none

              will-change-transform
            `}
          >
            {flower}
          </span>
        );
      })}

      {}

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
          <MdCelebration className="text-[15px]" />

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