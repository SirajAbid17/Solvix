import React from "react";
import {
  FaGraduationCap,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaUniversity,
  FaBook,
} from "react-icons/fa";
import ResumeSection from "./ResumeSection";

const EducationSection = ({
  education = [],
  setEducation,
  newEducation = { institution: "", degree: "", field: "", year: "" },
  setNewEducation,
  editingEduIndex = null,
  setEditingEduIndex,
  dark = false,
  inputStyle = "",
  labelStyle = "",
  cardStyle = "",
}) => {
  const addEducation = () => {
    if (newEducation.institution && newEducation.degree) {
      if (editingEduIndex !== null) {
        const updated = [...education];
        updated[editingEduIndex] = newEducation;
        setEducation(updated);
        setEditingEduIndex(null);
      } else {
        setEducation([...education, newEducation]);
      }
      setNewEducation({ institution: "", degree: "", field: "", year: "" });
    }
  };

  const editEducation = (index) => {
    setNewEducation(education[index]);
    setEditingEduIndex(index);
  };

  const removeEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
    if (editingEduIndex === index) {
      setEditingEduIndex(null);
      setNewEducation({ institution: "", degree: "", field: "", year: "" });
    }
  };

  const cancelEditEducation = () => {
    setEditingEduIndex(null);
    setNewEducation({ institution: "", degree: "", field: "", year: "" });
  };

  return (
    <ResumeSection
      icon={FaGraduationCap}
      title="Education"
      subtitle="Add your educational background."
      dark={dark}
      cardStyle={cardStyle}
    >
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              <FaUniversity className="inline mr-2" /> Institution
            </label>
            <input
              type="text"
              value={newEducation.institution}
              onChange={(e) =>
                setNewEducation({
                  ...newEducation,
                  institution: e.target.value,
                })
              }
              placeholder="MIT"
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              <FaBook className="inline mr-2" /> Degree
            </label>
            <input
              type="text"
              value={newEducation.degree}
              onChange={(e) =>
                setNewEducation({ ...newEducation, degree: e.target.value })
              }
              placeholder="Bachelor of Science"
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              Field of Study
            </label>
            <input
              type="text"
              value={newEducation.field}
              onChange={(e) =>
                setNewEducation({ ...newEducation, field: e.target.value })
              }
              placeholder="Computer Science"
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              Graduation Year
            </label>
            <input
              type="text"
              value={newEducation.year}
              onChange={(e) =>
                setNewEducation({ ...newEducation, year: e.target.value })
              }
              placeholder="2020"
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {editingEduIndex !== null && (
            <button
              onClick={cancelEditEducation}
              className="px-4 py-2 rounded-xl bg-gray-500 text-white hover:bg-gray-600 transition flex items-center gap-2"
            >
              <FaTimes /> Cancel
            </button>
          )}
          <button
            onClick={addEducation}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 ${
              dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {editingEduIndex !== null ? <FaSave /> : <FaPlus />}
            {editingEduIndex !== null ? "Update" : "Add"} Education
          </button>
        </div>

        {education.length > 0 && (
          <div className="mt-4 space-y-2">
            {education.map((edu, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  dark ? "border-white/10 bg-black" : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`font-semibold ${dark ? "text-white" : "text-gray-800"}`}>
                      {edu.degree || "Degree"}
                    </h4>
                    <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
                      {edu.institution || "Institution"}
                    </p>
                    {edu.field && (
                      <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                        {edu.field}
                      </p>
                    )}
                    {edu.year && (
                      <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                        {edu.year}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => editEducation(index)}
                      className="text-blue-500 hover:text-blue-600 transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => removeEducation(index)}
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

export default EducationSection;