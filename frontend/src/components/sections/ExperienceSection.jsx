import React, { useState } from "react";
import {
  FaBriefcase,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaBuilding,
  FaUserTie,
  FaCalendarAlt,
} from "react-icons/fa";
import ResumeSection from "./ResumeSection";

const ExperienceSection = ({
  experience = [],
  setExperience,
  newExperience = { company: "", position: "", duration: "", description: "" },
  setNewExperience,
  editingExpIndex = null,
  setEditingExpIndex,
  dark = false,
  inputStyle = "",
  labelStyle = "",
  cardStyle = "",
}) => {
  const addExperience = () => {
    if (newExperience.company && newExperience.position) {
      if (editingExpIndex !== null) {
        const updated = [...experience];
        updated[editingExpIndex] = newExperience;
        setExperience(updated);
        setEditingExpIndex(null);
      } else {
        setExperience([...experience, newExperience]);
      }
      setNewExperience({
        company: "",
        position: "",
        duration: "",
        description: "",
      });
    }
  };

  const editExperience = (index) => {
    setNewExperience(experience[index]);
    setEditingExpIndex(index);
  };

  const removeExperience = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
    if (editingExpIndex === index) {
      setEditingExpIndex(null);
      setNewExperience({
        company: "",
        position: "",
        duration: "",
        description: "",
      });
    }
  };

  const cancelEditExperience = () => {
    setEditingExpIndex(null);
    setNewExperience({
      company: "",
      position: "",
      duration: "",
      description: "",
    });
  };

  const positions = {
    "Development": ["Frontend Developer", "Backend Developer", "Full Stack Developer", "React Developer", "Node.js Developer"],
    "Management": ["Team Lead", "Technical Lead", "Engineering Manager", "Project Manager", "Product Manager", "Program Manager", "Delivery Manager", "Scrum Master", "Agile Coach", "Engineering Director", "VP of Engineering", "CTO"],
    "Data & AI": ["AI Engineer", "Generative AI Engineer", "Machine Learning Engineer", "Deep Learning Engineer", "LLM Engineer", "Prompt Engineer", "Data Scientist", "Data Engineer", "Data Analyst", "Business Intelligence Developer", "MLOps Engineer", "Database Administrator"],
    "Design": ["UI Designer", "UX Designer", "UI/UX Designer", "Product Designer", "Graphic Designer", "Visual Designer", "Interaction Designer", "Motion Designer", "UX Researcher", "Creative Director"],
    "QA & Testing": ["QA Engineer", "QA Analyst", "Software Tester", "Automation Test Engineer", "Manual Tester", "Performance Test Engineer", "SDET"],
    "DevOps & Cloud": ["DevOps Engineer", "Cloud Engineer", "AWS Engineer", "Azure Engineer", "Google Cloud Engineer", "Site Reliability Engineer", "Platform Engineer", "Infrastructure Engineer", "System Administrator", "Network Engineer", "Security Engineer", "Cybersecurity Engineer"],
    "Analysis & Consulting": ["Business Analyst", "Systems Analyst", "Technical Consultant", "IT Consultant", "Solutions Architect", "Technical Architect", "Enterprise Architect", "Solution Consultant"],
    "Entry Level": ["Intern", "Software Engineering Intern", "MERN Stack Intern", "Frontend Intern", "Backend Intern", "AI Intern", "Graduate Trainee", "Associate Software Engineer", "Junior Developer", "Trainee Software Engineer"]
  };

  return (
    <ResumeSection
      icon={FaBriefcase}
      title="Work Experience"
      subtitle="Add your work experience."
      dark={dark}
      cardStyle={cardStyle}
    >
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              <FaBuilding className="inline mr-2" /> Company Name
            </label>
            <input
              type="text"
              value={newExperience.company}
              onChange={(e) =>
                setNewExperience({ ...newExperience, company: e.target.value })
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
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              <FaUserTie className="inline mr-2" /> Position
            </label>
            <select
              value={newExperience.position}
              onChange={(e) =>
                setNewExperience({
                  ...newExperience,
                  position: e.target.value,
                })
              }
              className={`w-full rounded-xl border px-4 py-3 text-sm font-medium appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white"
                  : "border-gray-300 bg-white text-gray-800"
              } ${inputStyle}`}
            >
              <option value="">Select Position</option>
              {Object.entries(positions).map(([group, items]) => (
                <optgroup key={group} label={group}>
                  {items.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              <FaCalendarAlt className="inline mr-2" /> Duration
            </label>
            <input
              type="text"
              value={newExperience.duration}
              onChange={(e) =>
                setNewExperience({ ...newExperience, duration: e.target.value })
              }
              placeholder="2020-2023"
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
          <div className="md:col-span-2">
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              Description / Responsibilities
            </label>
            <textarea
              value={newExperience.description}
              onChange={(e) =>
                setNewExperience({
                  ...newExperience,
                  description: e.target.value,
                })
              }
              placeholder="Led development of..."
              rows={3}
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none scrollbar-hide ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {editingExpIndex !== null && (
            <button
              onClick={cancelEditExperience}
              className="px-4 py-2 rounded-xl bg-gray-500 text-white hover:bg-gray-600 transition flex items-center gap-2"
            >
              <FaTimes /> Cancel
            </button>
          )}
          <button
            onClick={addExperience}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 ${
              dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {editingExpIndex !== null ? <FaSave /> : <FaPlus />}
            {editingExpIndex !== null ? "Update" : "Add"} Experience
          </button>
        </div>

        {experience.length > 0 && (
          <div className="mt-4 space-y-2">
            {experience.map((exp, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  dark ? "border-white/10 bg-black" : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`font-semibold ${dark ? "text-white" : "text-gray-800"}`}>
                      {exp.position || "Position"}
                    </h4>
                    <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
                      {exp.company || "Company"}
                    </p>
                    {exp.duration && (
                      <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                        {exp.duration}
                      </p>
                    )}
                    {exp.description && (
                      <p className={`mt-2 text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>
                        {exp.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => editExperience(index)}
                      className="text-blue-500 hover:text-blue-600 transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => removeExperience(index)}
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

export default ExperienceSection;