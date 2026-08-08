import React from "react";
import { FaHeart, FaPlus, FaTrash } from "react-icons/fa";
import ResumeSection from "./ResumeSection";

const InterestsSection = ({
  interests = [],
  setInterests,
  newInterest = "",
  setNewInterest,
  dark = false,
  inputStyle = "",
  cardStyle = "",
}) => {
  const addInterest = () => {
    if (newInterest.trim()) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const removeInterest = (index) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

  const handleInterestKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addInterest();
    }
  };

  return (
    <ResumeSection
      icon={FaHeart}
      title="Interests"
      subtitle="Add your professional interests."
      dark={dark}
      cardStyle={cardStyle}
    >
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newInterest}
          onChange={(e) => setNewInterest(e.target.value)}
          onKeyPress={handleInterestKeyPress}
          placeholder="Enter interest (e.g., AI, Web Development)"
          className={`flex-1 rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            dark
              ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
              : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
          } ${inputStyle}`}
        />
        <button
          onClick={addInterest}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 ${
            dark
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          <FaPlus /> Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {interests.map((interest, index) => (
          <span
            key={index}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${
              dark ? "bg-white/10 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            {interest}
            <button
              onClick={() => removeInterest(index)}
              className="hover:text-red-500 transition"
            >
              <FaTrash className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    </ResumeSection>
  );
};

export default InterestsSection;