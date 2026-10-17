import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyPayment } from "../../Features/billing";
import gsap from "gsap";


import {
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaRocket,
  FaArrowRight,
  FaHome,
  FaCreditCard,
  FaCoins,
  FaChartLine,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { BiCheckDouble } from "react-icons/bi";
import { BsLightningFill } from "react-icons/bs";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiX,
  FiHome,
  FiLoader,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("loading");
  const [paymentDetails, setPaymentDetails] = useState(null);

  const containerRef = useRef(null);
  const iconRef = useRef(null);
  const titleRef = useRef(null);
  const detailsRef = useRef(null);
  const buttonsRef = useRef(null);
  const creditsRef = useRef(null);

  useEffect(() => {
    if (sessionId) {
      verifyPayment(sessionId)
        .then((response) => {
          if (response.success) {
            setStatus("success");
            setPaymentDetails(response.payment);
          } else {
            setStatus("error");
          }
        })
        .catch((error) => {
          console.error("Payment Verification Error:", error);
          setStatus("error");
        });
    } else {
      setStatus("error");
    }
  }, [sessionId]);

  
  useEffect(() => {
    if (status === "success" && containerRef.current) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        iconRef.current,
        { scale: 0, rotation: -180, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.6 },
      )
        .fromTo(
          titleRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
        )
        .fromTo(
          creditsRef.current,
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4 },
        )
        .fromTo(
          detailsRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
        )
        .fromTo(
          buttonsRef.current.children,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.4 },
        );

      gsap.to(creditsRef.current, {
        scale: 1.1,
        duration: 0.4,
        yoyo: true,
        repeat: 2,
        ease: "power1.inOut",
      });
    } else if (status === "error" && containerRef.current) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        iconRef.current,
        { scale: 0, rotation: 180, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.5 },
      )
        .fromTo(
          titleRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4 },
        )
        .fromTo(
          detailsRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4 },
        );
    }
  }, [status]);

  
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-purple-500/20 border-t-purple-500 mx-auto"></div>
           
            <FiLoader
              size={22}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-400 animate-pulse"
            />
          </div>
          <p className="text-gray-400 mt-4 text-xs tracking-wider">
            Verifying your payment...
          </p>
          <div className="mt-3 flex items-center justify-center gap-1">
            <span
              className="h-1 w-1 rounded-full bg-purple-500 animate-bounce"
              style={{ animationDelay: "0s" }}
            ></span>
            <span
              className="h-1 w-1 rounded-full bg-purple-500 animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></span>
            <span
              className="h-1 w-1 rounded-full bg-purple-500 animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></span>
          </div>
        </div>
      </div>
    );
  }

 
  if (status === "error") {
    return (
      <div
        ref={containerRef}
        className="min-h-screen bg-black flex items-center justify-center px-4"
      >
        <div className="text-center max-w-md">
          <div ref={iconRef} className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full"></div>
              <div className="relative bg-red-500/10 p-3 rounded-full border border-red-500/30">
                
                <FaTimesCircle className="text-red-500 text-5xl" />
              </div>
            </div>
          </div>

          <h1 ref={titleRef} className="text-2xl font-bold text-white mb-2">
            Payment Verification Failed
          </h1>

          <div ref={detailsRef}>
            <p className="text-gray-400 mb-4 text-xs leading-relaxed">
              We couldn't verify your payment. This could be due to a network
              issue or the payment was cancelled.
            </p>

            <div className="bg-white/[0.03] rounded-xl p-3 mb-4 border border-white/[0.06]">
              <p className="text-[10px] text-gray-500">
                <span className="text-gray-400">Session ID:</span>{" "}
                <span className="text-gray-300 font-mono text-[9px] break-all">
                  {sessionId || "N/A"}
                </span>
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate("/pricing")}
                className="bg-purple-600 text-white px-5 py-2.5 rounded-xl hover:bg-purple-500 transition-all duration-300 flex items-center justify-center gap-2 group text-sm"
              >
               
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                Try Again
              </button>

              <button
                onClick={() => navigate("/")}
                className="border border-white/[0.1] text-gray-400 px-5 py-2.5 rounded-xl hover:bg-white/[0.05] transition-all duration-300 flex items-center justify-center gap-2 text-sm"
              >
               
                <FaHome />
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

 
  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-black flex items-center justify-center px-4 overflow-hidden"
    >
      
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px]"></div>
        <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-purple-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-purple-400/5 rounded-full blur-[100px]"></div>
      </div>

      
      <div className="relative text-center max-w-md w-full bg-white/[0.02] rounded-2xl border border-white/[0.06] p-6 backdrop-blur-sm">
        <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent"></div>
        <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-purple-500/20 blur-sm"></div>

      
        <div ref={iconRef} className="flex justify-center mb-5">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-green-500/20 to-purple-500/20 p-4 rounded-full border border-green-500/30">
              <div className="absolute inset-0 rounded-full bg-green-500/10 animate-ping"></div>
              <FaCheckCircle className="text-green-400 text-5xl relative z-10" />
            </div>
          </div>
        </div>

        
        <div ref={titleRef}>
          <h1 className="text-3xl font-bold text-white mb-1.5 tracking-tight">
            Payment Successful!
          </h1>
          <p className="text-gray-400 text-sm">
            Your plan has been activated successfully
          </p>
        </div>

        
        <div
          ref={creditsRef}
          className="mt-5 inline-flex items-center gap-2.5 bg-gradient-to-r from-purple-500/20 to-green-500/20 px-6 py-2.5 rounded-full border border-purple-500/20"
        >
        
          <FaCoins className="text-yellow-400 text-lg" />
          <span className="text-white font-semibold text-lg">
            +{paymentDetails?.credits} Credits
          </span>
          <BsLightningFill className="text-purple-400 text-sm" />
        </div>

      
        <div
          ref={buttonsRef}
          className="mt-6 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <button
            onClick={() => navigate("/")}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-500 transition-all duration-300 flex items-center justify-center gap-2 group flex-1 text-sm"
          >
            <FaHome className="group-hover:scale-110 transition-transform" />
            Dashboard
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => navigate("/pricing")}
            className="border border-white/[0.1] text-gray-300 px-6 py-3 rounded-xl hover:bg-white/[0.05] transition-all duration-300 flex items-center justify-center gap-2 group flex-1 text-sm"
          >
           
            <FaChartLine />
            View Plans
          </button>
        </div>

        
        <div className="mt-5 flex items-center justify-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
          <div className="flex gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse"></span>
            <span
              className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"
              style={{ animationDelay: "0.3s" }}
            ></span>
            <span
              className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse"
              style={{ animationDelay: "0.6s" }}
            ></span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
        </div>

        <p className="mt-4 text-[10px] text-gray-600 tracking-wider">
          Your credits are available instantly
        </p>
      </div>
    </div>
  );
}
