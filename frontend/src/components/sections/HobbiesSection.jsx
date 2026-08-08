import React from "react";
import { FaCog, FaPlus, FaTrash } from "react-icons/fa";
import ResumeSection from "./ResumeSection";

const HobbiesSection = ({
  hobbies = [],
  setHobbies,
  newHobby = "",
  setNewHobby,
  dark = false,
  inputStyle = "",
  cardStyle = "",
}) => {
  const addHobby = () => {
    if (newHobby.trim()) {
      setHobbies([...hobbies, newHobby.trim()]);
      setNewHobby("");
    }
  };

  const removeHobby = (index) => {
    setHobbies(hobbies.filter((_, i) => i !== index));
  };

  const handleHobbyKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addHobby();
    }
  };

  return (
    <ResumeSection
      icon={FaCog}
      title="Hobbies"
      subtitle="Add your personal hobbies."
      dark={dark}
      cardStyle={cardStyle}
    >
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newHobby}
          onChange={(e) => setNewHobby(e.target.value)}
          onKeyPress={handleHobbyKeyPress}
          placeholder="Enter hobby (e.g., Reading, Gaming)"
          className={`flex-1 rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            dark
              ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
              : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
          } ${inputStyle}`}
        />
        <button
          onClick={addHobby}
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
        {hobbies.map((hobby, index) => (
          <span
            key={index}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${
              dark ? "bg-white/10 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            {hobby}
            <button
              onClick={() => removeHobby(index)}
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

export default HobbiesSection;