import React from "react";
import {
  FaAward,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import ResumeSection from "./ResumeSection";

const AwardsSection = ({
  awards = [],
  setAwards,
  newAward = { title: "", organization: "", year: "", description: "" },
  setNewAward,
  editingAwardIndex = null,
  setEditingAwardIndex,
  dark = false,
  inputStyle = "",
  labelStyle = "",
  cardStyle = "",
}) => {
  const addAward = () => {
    if (newAward.title) {
      if (editingAwardIndex !== null) {
        const updated = [...awards];
        updated[editingAwardIndex] = newAward;
        setAwards(updated);
        setEditingAwardIndex(null);
      } else {
        setAwards([...awards, newAward]);
      }
      setNewAward({ title: "", organization: "", year: "", description: "" });
    }
  };

  const editAward = (index) => {
    setNewAward(awards[index]);
    setEditingAwardIndex(index);
  };

  const removeAward = (index) => {
    setAwards(awards.filter((_, i) => i !== index));
    if (editingAwardIndex === index) {
      setEditingAwardIndex(null);
      setNewAward({ title: "", organization: "", year: "", description: "" });
    }
  };

  const cancelEditAward = () => {
    setEditingAwardIndex(null);
    setNewAward({ title: "", organization: "", year: "", description: "" });
  };

  return (
    <ResumeSection
      icon={FaAward}
      title="Awards & Honors"
      subtitle="Add your awards and achievements."
      dark={dark}
      cardStyle={cardStyle}
    >
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label
              className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}
            >
              Award Title
            </label>
            <input
              type="text"
              value={newAward.title}
              onChange={(e) =>
                setNewAward({ ...newAward, title: e.target.value })
              }
              placeholder="Best Developer Award"
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}
            >
              Organization
            </label>
            <input
              type="text"
              value={newAward.organization}
              onChange={(e) =>
                setNewAward({ ...newAward, organization: e.target.value })
              }
              placeholder="Google"
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}
            >
              Year
            </label>
            <input
              type="text"
              value={newAward.year}
              onChange={(e) =>
                setNewAward({ ...newAward, year: e.target.value })
              }
              placeholder="2023"
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
          <div className="md:col-span-2">
            <label
              className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}
            >
              Description
            </label>
            <textarea
              value={newAward.description}
              onChange={(e) =>
                setNewAward({ ...newAward, description: e.target.value })
              }
              placeholder="Award description..."
              rows={2}
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {editingAwardIndex !== null && (
            <button
              onClick={cancelEditAward}
              className="px-4 py-2 rounded-xl bg-gray-500 text-white hover:bg-gray-600 transition flex items-center gap-2"
            >
              <FaTimes /> Cancel
            </button>
          )}
          <button
            onClick={addAward}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 ${
              dark
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {editingAwardIndex !== null ? <FaSave /> : <FaPlus />}
            {editingAwardIndex !== null ? "Update" : "Add"} Award
          </button>
        </div>

        {awards.length > 0 && (
          <div className="mt-4 space-y-2">
            {awards.map((award, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  dark ? "border-white/10 bg-black" : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4
                      className={`font-semibold ${dark ? "text-white" : "text-gray-800"}`}
                    >
                      {award.title || "Award"}
                    </h4>
                    <p
                      className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {award.organization || "Organization"}
                    </p>
                    {award.year && (
                      <p
                        className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        {award.year}
                      </p>
                    )}
                    {award.description && (
                      <p
                        className={`text-sm ${dark ? "text-gray-300" : "text-gray-600"} mt-1`}
                      >
                        {award.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => editAward(index)}
                      className="text-blue-500 hover:text-blue-600 transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => removeAward(index)}
                      className="text-red-500 hover:text-red-600 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ResumeSection>
  );
};

export default AwardsSection;
