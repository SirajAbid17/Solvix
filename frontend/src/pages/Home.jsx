import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import ChatArea from "../components/ChatArea/ChatArea";
import Coding from "../components/coding/Coding";
import { useTheme } from "../BgContext/ThemeContext";
import { FiMenu, FiCode, FiX } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

export default function Home() {
  const { dark } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [codingOpen, setCodingOpen] = useState(false);

  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize.isDesktop || screenSize.isTablet) {
      setSidebarOpen(false);
      setCodingOpen(false);
    }
  }, [screenSize.isDesktop, screenSize.isTablet]);

  useEffect(() => {
    if (screenSize.isMobile && (sidebarOpen || codingOpen)) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen, codingOpen, screenSize.isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
    if (codingOpen) setCodingOpen(false);
  };

  const toggleCoding = () => {
    setCodingOpen((prev) => !prev);
    if (sidebarOpen) setSidebarOpen(false);
  };

  const closeAllDrawers = () => {
    setSidebarOpen(false);
    setCodingOpen(false);
  };

  return (
    <div
      className={`
        relative
        flex
        h-screen
        w-full
        min-w-0
        overflow-hidden
        transition-colors
        duration-300
        ${dark ? "bg-black text-white" : "bg-white text-black"}
      `}
    >
   
      {screenSize.isMobile && (
        <header
          className={`
            fixed
            left-0
            right-0
            top-0
            z-40
            flex
            h-14
            items-center
            justify-between
            border-b
            px-3
            backdrop-blur-xl
            transition-all
            duration-300
            ${
              dark
                ? "border-white/[0.08] bg-black/80"
                : "border-gray-200 bg-white/80"
            }
          `}
        >
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className={`
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              transition-all
              duration-200
              active:scale-95
              ${
                dark
                  ? "text-gray-300 hover:bg-white/[0.08] hover:text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-black"
              }
            `}
          >
            {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

          <div className="flex items-center gap-2">
            <div
              className={`
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                shadow-lg
                shadow-purple-500/20
                ${
                  dark
                    ? "from-purple-500 to-pink-500"
                    : "from-purple-600 to-pink-600"
                }
              `}
            >
              <HiSparkles size={16} className="text-white" />
            </div>
            <h1
              className={`
                text-base
                font-bold
                tracking-tight
                ${dark ? "text-white" : "text-black"}
              `}
            >
              Solvix AI
            </h1>
          </div>

          <button
            type="button"
            onClick={toggleCoding}
            aria-label="Toggle code preview"
            className={`
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              transition-all
              duration-200
              active:scale-95
              ${
                codingOpen
                  ? dark
                    ? "bg-purple-500/20 text-purple-300"
                    : "bg-purple-100 text-purple-600"
                  : dark
                    ? "text-gray-300 hover:bg-white/[0.08] hover:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
              }
            `}
          >
            <FiCode size={22} />
            <span
              className={`
                absolute
                -right-0.5
                -top-0.5
                h-3
                w-3
                animate-pulse
                rounded-full
                ${dark ? "bg-purple-400 ring-2 ring-black" : "bg-purple-500 ring-2 ring-white"}
              `}
            />
          </button>
        </header>
      )}

     
      {(sidebarOpen || codingOpen) && screenSize.isMobile && (
        <div
          onClick={closeAllDrawers}
          className={`
            fixed
            inset-0
            z-40
            backdrop-blur-sm
            transition-opacity
            duration-300
            ${dark ? "bg-black/60" : "bg-black/30"}
          `}
          style={{ top: "56px" }}
        />
      )}

     
      {(screenSize.isTablet || screenSize.isDesktop) && (
        <div className="h-screen shrink-0">
          <Sidebar />
        </div>
      )}

     
      {screenSize.isMobile && (
        <div
          className={`
            fixed
            bottom-0
            left-0
            top-14
            z-50
            w-[85vw]
            max-w-[320px]
            transform
            transition-transform
            duration-300
            ease-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div
            className={`
              h-full
              overflow-hidden
              shadow-2xl
              ${dark ? "bg-black" : "bg-white"}
            `}
          >
            <Sidebar />
          </div>
        </div>
      )}

   
      <div
        className={`
          flex
          h-screen
          min-w-0
          flex-1
          flex-col
          overflow-hidden
          transition-all
          duration-300
          ${screenSize.isMobile ? "pt-14" : ""}
          ${screenSize.isTablet ? "border-r" : ""}
          ${screenSize.isDesktop ? "border-r" : ""}
          ${dark ? "border-white/[0.08]" : "border-gray-200"}
        `}
      >
        <ChatArea />
      </div>

     
      {screenSize.isDesktop && (
        <div
          className={`
            h-screen
            w-[270px]
            xl:w-[300px]
            2xl:w-[340px]
            shrink-0
            overflow-hidden
            transition-all
            duration-300
            ${dark ? "bg-black" : "bg-white"}
          `}
        >
          <Coding />
        </div>
      )}

     
      {screenSize.isMobile && (
        <div
          className={`
            fixed
            bottom-0
            right-0
            top-14
            z-50
            w-[82vw]
            max-w-[380px]
            transform
            transition-transform
            duration-300
            ease-out
            ${codingOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          <div
            className={`
              h-full
              overflow-hidden
              shadow-2xl
              ${dark ? "bg-black" : "bg-white"}
            `}
          >
            <Coding />
          </div>
        </div>
      )}
    </div>
  );
}