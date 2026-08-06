// components/Resume/CV-Generate/ResumeDetailsForm.jsx
import React, { useState } from "react";
import {
  FaFileAlt,
  FaCode,
  FaBriefcase,
  FaGraduationCap,
  FaProjectDiagram,
  FaCertificate,
  FaLanguage,
  FaMagic,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaBuilding,
  FaUserTie,
  FaCalendarAlt,
  FaLink,
  FaGithub,
  FaGlobe,
  FaUniversity,
  FaBook,
  FaAward,
  FaClock
} from "react-icons/fa";
import { useTheme } from "../../../BgContext/ThemeContext";

export default function ResumeDetailsForm({ resumeDetails, handleChange, onGenerate, loading }) {
  const { dark } = useTheme();

  // Local state for dynamic fields
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  
  const [experience, setExperience] = useState([]);
  const [newExperience, setNewExperience] = useState({
    company: "",
    position: "",
    duration: "",
    description: ""
  });
  const [editingExpIndex, setEditingExpIndex] = useState(null);

  const [education, setEducation] = useState([]);
  const [newEducation, setNewEducation] = useState({
    institution: "",
    degree: "",
    field: "",
    year: ""
  });
  const [editingEduIndex, setEditingEduIndex] = useState(null);

  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    technologies: "",
    github: "",
    live: ""
  });
  const [editingProjectIndex, setEditingProjectIndex] = useState(null);

  const [certifications, setCertifications] = useState([]);
  const [newCertification, setNewCertification] = useState("");

  const [languages, setLanguages] = useState([]);
  const [newLanguage, setNewLanguage] = useState("");

  // --- SKILLS ---
  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  // --- EXPERIENCE ---
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
      setNewExperience({ company: "", position: "", duration: "", description: "" });
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
      setNewExperience({ company: "", position: "", duration: "", description: "" });
    }
  };

  const cancelEditExperience = () => {
    setEditingExpIndex(null);
    setNewExperience({ company: "", position: "", duration: "", description: "" });
  };

  // --- EDUCATION ---
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

  // --- PROJECTS ---
  const addProject = () => {
    if (newProject.name) {
      if (editingProjectIndex !== null) {
        const updated = [...projects];
        updated[editingProjectIndex] = newProject;
        setProjects(updated);
        setEditingProjectIndex(null);
      } else {
        setProjects([...projects, newProject]);
      }
      setNewProject({ name: "", description: "", technologies: "", github: "", live: "" });
    }
  };

  const editProject = (index) => {
    setNewProject(projects[index]);
    setEditingProjectIndex(index);
  };

  const removeProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
    if (editingProjectIndex === index) {
      setEditingProjectIndex(null);
      setNewProject({ name: "", description: "", technologies: "", github: "", live: "" });
    }
  };

  const cancelEditProject = () => {
    setEditingProjectIndex(null);
    setNewProject({ name: "", description: "", technologies: "", github: "", live: "" });
  };

  // --- CERTIFICATIONS ---
  const addCertification = () => {
    if (newCertification.trim()) {
      setCertifications([...certifications, newCertification.trim()]);
      setNewCertification("");
    }
  };

  const removeCertification = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleCertificationKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCertification();
    }
  };

  // --- LANGUAGES ---
  const addLanguage = () => {
    if (newLanguage.trim()) {
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage("");
    }
  };

  const removeLanguage = (index) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const handleLanguageKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addLanguage();
    }
  };

  // --- GENERATE RESUME ---
  const handleGenerate = () => {
    const data = {
      summary: document.querySelector('textarea[name="summary"]')?.value || "",
      skills: skills.join(", "),
      workExperience: experience.map(exp => 
        `Company: ${exp.company}\nPosition: ${exp.position}\nDuration: ${exp.duration}\nDescription: ${exp.description}`
      ).join("\n\n"),
      education: education.map(edu =>
        `Institution: ${edu.institution}\nDegree: ${edu.degree}\nField: ${edu.field}\nYear: ${edu.year}`
      ).join("\n\n"),
      projects: projects.map(proj =>
        `Project: ${proj.name}\nTechnologies: ${proj.technologies}\nDescription: ${proj.description}\nGitHub: ${proj.github}\nLive: ${proj.live}`
      ).join("\n\n"),
      certifications: certifications.join(", "),
      languages: languages.join(", ")
    };
    
    // Update parent state
    Object.keys(data).forEach(key => {
      handleChange({ target: { name: key, value: data[key] } });
    });
    
    onGenerate();
  };

  const inputStyle = `
    w-full rounded-xl border px-4 py-3 outline-none transition-all
    ${dark
      ? "border-white/10 bg-black text-white placeholder:text-gray-500 focus:border-white"
      : "border-gray-300 bg-white text-black placeholder:text-gray-400 focus:border-black"
    }
  `;

  const cardStyle = `
    rounded-2xl border p-5 transition-all
    ${dark
      ? "border-white/10 bg-white/[0.03]"
      : "border-gray-200 bg-gray-50"
    }
  `;

  const labelStyle = `block text-sm font-semibold mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <div
      className={`mt-8 p-6 rounded-2xl transition-all ${
        dark
          ? "border border-white/10 bg-white/[0.03] text-white"
          : "border border-gray-200 bg-white text-black shadow-sm"
      }`}
    >
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            dark ? "bg-white text-black" : "bg-black text-white"
          }`}
        >
          <FaFileAlt />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Resume Details</h2>
          <p className={`mt-1 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            Add your details below. Each section supports multiple entries.
          </p>
        </div>
      </div>

      <div className="space-y-6 max-h-[75vh] overflow-y-auto hide-scrollbar pr-2">

        {/* ====== PROFESSIONAL SUMMARY ====== */}
        <div className={cardStyle}>
          <div className="mb-4 flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${dark ? "bg-white text-black" : "bg-black text-white"}`}>
              <FaMagic />
            </div>
            <div>
              <h3 className="font-bold">Professional Summary</h3>
              <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>Write a short summary about yourself.</p>
            </div>
          </div>
          <textarea
            name="summary"
            rows={4}
            placeholder="Write a short professional summary about yourself..."
            className={inputStyle}
            onChange={handleChange}
          />
        </div>

        {/* ====== SKILLS ====== */}
        <div className={cardStyle}>
          <div className="mb-4 flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${dark ? "bg-white text-black" : "bg-black text-white"}`}>
              <FaCode />
            </div>
            <div>
              <h3 className="font-bold">Skills</h3>
              <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>Add your skills one by one.</p>
            </div>
          </div>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleSkillKeyPress}
              placeholder="Enter skill (e.g., React)"
              className={`flex-1 ${inputStyle}`}
            />
            <button
              onClick={addSkill}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
              } transition`}
            >
              <FaPlus /> Add
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${
                  dark ? "bg-white/10 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                {skill}
                <button
                  onClick={() => removeSkill(index)}
                  className="hover:text-red-500 transition"
                >
                  <FaTrash className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* ====== WORK EXPERIENCE ====== */}
        <div className={cardStyle}>
          <div className="mb-4 flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${dark ? "bg-white text-black" : "bg-black text-white"}`}>
              <FaBriefcase />
            </div>
            <div>
              <h3 className="font-bold">Work Experience</h3>
              <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>Add your work experience.</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={labelStyle}>
                  <FaBuilding className="inline mr-2" /> Company Name
                </label>
                <input
                  type="text"
                  value={newExperience.company}
                  onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                  placeholder="Google"
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>
                  <FaUserTie className="inline mr-2" /> Position
                </label>
                <input
                  type="text"
                  value={newExperience.position}
                  onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                  placeholder="Senior Developer"
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>
                  <FaCalendarAlt className="inline mr-2" /> Duration
                </label>
                <input
                  type="text"
                  value={newExperience.duration}
                  onChange={(e) => setNewExperience({ ...newExperience, duration: e.target.value })}
                  placeholder="2020-2023"
                  className={inputStyle}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelStyle}>Description / Responsibilities</label>
                <textarea
                  value={newExperience.description}
                  onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                  placeholder="Led development of..."
                  rows={3}
                  className={inputStyle}
                />
              </div>
            </div>

            <div className="flex gap-2">
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
                className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                  dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
                } transition`}
              >
                {editingExpIndex !== null ? <FaSave /> : <FaPlus />}
                {editingExpIndex !== null ? "Update" : "Add"} Experience
              </button>
            </div>

            {/* Experience List */}
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
                        <h4 className="font-semibold">{exp.position}</h4>
                        <p className="text-sm text-gray-500">{exp.company}</p>
                        {exp.duration && <p className="text-xs text-gray-400">{exp.duration}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editExperience(index)}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => removeExperience(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    {exp.description && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ====== EDUCATION ====== */}
        <div className={cardStyle}>
          <div className="mb-4 flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${dark ? "bg-white text-black" : "bg-black text-white"}`}>
              <FaGraduationCap />
            </div>
            <div>
              <h3 className="font-bold">Education</h3>
              <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>Add your educational background.</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={labelStyle}>
                  <FaUniversity className="inline mr-2" /> Institution
                </label>
                <input
                  type="text"
                  value={newEducation.institution}
                  onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                  placeholder="MIT"
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>
                  <FaBook className="inline mr-2" /> Degree
                </label>
                <input
                  type="text"
                  value={newEducation.degree}
                  onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                  placeholder="Bachelor of Science"
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>Field of Study</label>
                <input
                  type="text"
                  value={newEducation.field}
                  onChange={(e) => setNewEducation({ ...newEducation, field: e.target.value })}
                  placeholder="Computer Science"
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>Graduation Year</label>
                <input
                  type="text"
                  value={newEducation.year}
                  onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                  placeholder="2020"
                  className={inputStyle}
                />
              </div>
            </div>

            <div className="flex gap-2">
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
                className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                  dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
                } transition`}
              >
                {editingEduIndex !== null ? <FaSave /> : <FaPlus />}
                {editingEduIndex !== null ? "Update" : "Add"} Education
              </button>
            </div>

            {/* Education List */}
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
                        <h4 className="font-semibold">{edu.degree}</h4>
                        <p className="text-sm text-gray-500">{edu.institution}</p>
                        {edu.field && <p className="text-xs text-gray-400">{edu.field}</p>}
                        {edu.year && <p className="text-xs text-gray-400">{edu.year}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editEducation(index)}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => removeEducation(index)}
                          className="text-red-500 hover:text-red-600"
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
        </div>

        {/* ====== PROJECTS ====== */}
        <div className={cardStyle}>
          <div className="mb-4 flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${dark ? "bg-white text-black" : "bg-black text-white"}`}>
              <FaProjectDiagram />
            </div>
            <div>
              <h3 className="font-bold">Projects</h3>
              <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>Add your projects.</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={labelStyle}>Project Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="E-Commerce App"
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>Technologies</label>
                <input
                  type="text"
                  value={newProject.technologies}
                  onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                  placeholder="React, Node.js, MongoDB"
                  className={inputStyle}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelStyle}>Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Full-stack e-commerce application..."
                  rows={3}
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>
                  <FaGithub className="inline mr-2" /> GitHub Link
                </label>
                <input
                  type="text"
                  value={newProject.github}
                  onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                  placeholder="https://github.com/..."
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>
                  <FaGlobe className="inline mr-2" /> Live Demo
                </label>
                <input
                  type="text"
                  value={newProject.live}
                  onChange={(e) => setNewProject({ ...newProject, live: e.target.value })}
                  placeholder="https://demo.com"
                  className={inputStyle}
                />
              </div>
            </div>

            <div className="flex gap-2">
              {editingProjectIndex !== null && (
                <button
                  onClick={cancelEditProject}
                  className="px-4 py-2 rounded-xl bg-gray-500 text-white hover:bg-gray-600 transition flex items-center gap-2"
                >
                  <FaTimes /> Cancel
                </button>
              )}
              <button
                onClick={addProject}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                  dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
                } transition`}
              >
                {editingProjectIndex !== null ? <FaSave /> : <FaPlus />}
                {editingProjectIndex !== null ? "Update" : "Add"} Project
              </button>
            </div>

            {/* Projects List */}
            {projects.length > 0 && (
              <div className="mt-4 space-y-2">
                {projects.map((proj, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      dark ? "border-white/10 bg-black" : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{proj.name}</h4>
                        {proj.technologies && (
                          <p className="text-xs text-gray-400">Tech: {proj.technologies}</p>
                        )}
                        {proj.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{proj.description}</p>
                        )}
                        <div className="flex gap-3 mt-1">
                          {proj.github && (
                            <a href={proj.github} target="_blank" rel="noopener" className="text-xs text-blue-500 hover:underline">
                              GitHub
                            </a>
                          )}
                          {proj.live && (
                            <a href={proj.live} target="_blank" rel="noopener" className="text-xs text-blue-500 hover:underline">
                              Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editProject(index)}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => removeProject(index)}
                          className="text-red-500 hover:text-red-600"
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
        </div>

        {/* ====== CERTIFICATIONS ====== */}
        <div className={cardStyle}>
          <div className="mb-4 flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${dark ? "bg-white text-black" : "bg-black text-white"}`}>
              <FaCertificate />
            </div>
            <div>
              <h3 className="font-bold">Certifications</h3>
              <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>Add your certifications.</p>
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              onKeyPress={handleCertificationKeyPress}
              placeholder="Enter certification (e.g., AWS Certified Developer)"
              className={`flex-1 ${inputStyle}`}
            />
            <button
              onClick={addCertification}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
              } transition`}
            >
              <FaPlus /> Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {certifications.map((cert, index) => (
              <span
                key={index}
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${
                  dark ? "bg-white/10 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                {cert}
                <button
                  onClick={() => removeCertification(index)}
                  className="hover:text-red-500 transition"
                >
                  <FaTrash className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* ====== LANGUAGES ====== */}
        <div className={cardStyle}>
          <div className="mb-4 flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${dark ? "bg-white text-black" : "bg-black text-white"}`}>
              <FaLanguage />
            </div>
            <div>
              <h3 className="font-bold">Languages</h3>
              <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>Add languages you speak.</p>
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              onKeyPress={handleLanguageKeyPress}
              placeholder="Enter language (e.g., English, Urdu, Arabic)"
              className={`flex-1 ${inputStyle}`}
            />
            <button
              onClick={addLanguage}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
              } transition`}
            >
              <FaPlus /> Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {languages.map((lang, index) => (
              <span
                key={index}
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${
                  dark ? "bg-white/10 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                {lang}
                <button
                  onClick={() => removeLanguage(index)}
                  className="hover:text-red-500 transition"
                >
                  <FaTrash className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* ====== GENERATE BUTTON ====== */}
        <div className="flex justify-end pb-2">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`rounded-xl px-8 py-3 font-semibold transition-all flex items-center gap-2 ${
              dark
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-black text-white hover:bg-gray-800"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <>
                <FaMagic className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FaMagic />
                Generate Resume
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}