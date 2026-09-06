import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../BgContext/ThemeContext";

export default function WebsiteInformation() {
  const navigate = useNavigate();

  const HendlePricing = () => {
    navigate("/pricing");
  };

  const Privacybtn = () => {
    navigate("/privacy");
  }
  

  const { dark } = useTheme();

  const buttonStyle = `
    flex-1 
    rounded-lg 
    px-4 
    py-2 
    text-center 
    text-xs 
    font-medium 
    transition-all 
    duration-200 
    ${
      dark
        ? "text-gray-400 hover:bg-white/[0.06] hover:text-white"
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
    }
  `;

  return (
    <div
      className={`
        flex 
        w-full 
        shrink-0 
        items-center 
        gap-1 
        border-t 
        px-2 
        py-3 
        ${
          dark
            ? "border-white/[0.08] bg-black"
            : "border-gray-200 bg-white"
        }
      `}
    >
      <button
        onClick={HendlePricing}
        type="button"
        className={buttonStyle}
      >
        Pricing
      </button>

      <button onClick={() => navigate("/contact")} type="button" className={buttonStyle}>
        Contact
      </button>

      <button onClick={Privacybtn} type="button" className={buttonStyle}>
        Privacy
      </button>
    </div>
  );
}