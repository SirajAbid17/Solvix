import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function GetAllWebsite() {
  const navigate = useNavigate();

  const handleViewAllWebsites = () => {
    navigate("/all-portfolio");
  };

  return (
    <div className="flex w-full items-center justify-center py-6">
      <button
        type="button"
        onClick={handleViewAllWebsites}
        className="
          group relative
          flex items-center justify-center
          rounded-md
          border border-gray-700
          bg-black
          px-8 py-3.5
          text-sm font-semibold text-white
          shadow-lg shadow-black/20
          transition-all duration-300
          hover:-translate-y-1
          hover:border-white
          hover:bg-white
          hover:text-black
          hover:shadow-xl
          active:scale-95
        "
      >
        <span>View All Websites</span>

       <FiArrowRight
  size={16}
  className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
/>
      </button>
    </div>
  );
}

