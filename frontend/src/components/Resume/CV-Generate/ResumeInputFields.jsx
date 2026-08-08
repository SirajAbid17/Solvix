import React, { useState, useEffect } from "react";
import {
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
  FaGithub,
  FaGlobe,
  FaUniversity,
  FaBook,
  FaAward,
  FaNewspaper,
  FaHands,
  FaHeart,
  FaCog,
  FaUsers,
  FaLayerGroup,
} from "react-icons/fa";
import ResumeSection from "./ResumeSection";

export function SkillsSection({
  skills,
  setSkills,
  newSkill,
  setNewSkill,
  dark,
  inputStyle,
  cardStyle,
}) {
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

  return (
    <ResumeSection
      icon={FaCode}
      title="Skills"
      subtitle="Add your skills one by one."
      dark={dark}
      cardStyle={cardStyle}
    >
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
            dark
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-black text-white hover:bg-gray-800"
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
    </ResumeSection>
  );
}

export function ExperienceSection({
  experience,
  setExperience,
  newExperience,
  setNewExperience,
  editingExpIndex,
  setEditingExpIndex,
  dark,
  inputStyle,
  labelStyle,
  cardStyle,
}) {
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
            <label className={labelStyle}>
              <FaBuilding className="inline mr-2" /> Company Name
            </label>
            <input
              type="text"
              value={newExperience.company}
              onChange={(e) =>
                setNewExperience({ ...newExperience, company: e.target.value })
              }
              placeholder="Google"
              className={inputStyle}
            />
          </div>
          <div className="space-y-2">
            <label className={`${labelStyle} flex items-center gap-2`}>
              <FaUserTie className="text-blue-500 text-lg" />
              <span>Position</span>
            </label>
            <div className="relative">
              <select
                value={newExperience.position}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    position: e.target.value,
                  })
                }
                className={`
                  ${inputStyle}
                  w-full rounded-xl border px-4 py-3 pr-12 text-sm font-medium appearance-none cursor-pointer
                  ${dark ? "border-white/10 bg-[#0f172a] text-white" : "border-gray-300 bg-white text-gray-800"}
                `}
              >
                <option value="">Select Position</option>
                <optgroup label="Development">
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full Stack Developer">
                    Full Stack Developer
                  </option>
                  <option value="React Developer">React Developer</option>
                  <option value="Node.js Developer">Node.js Developer</option>
                </optgroup>
                <optgroup label="Management">
                  <option value="Team Lead">Team Lead</option>
                  <option value="Technical Lead">Technical Lead</option>
                  <option value="Engineering Manager">
                    Engineering Manager
                  </option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Program Manager">Program Manager</option>
                  <option value="Delivery Manager">Delivery Manager</option>
                  <option value="Scrum Master">Scrum Master</option>
                  <option value="Agile Coach">Agile Coach</option>
                  <option value="Engineering Director">
                    Engineering Director
                  </option>
                  <option value="VP of Engineering">VP of Engineering</option>
                  <option value="CTO">Chief Technology Officer (CTO)</option>
                </optgroup>
                <optgroup label="Data & AI">
                  <option value="AI Engineer">AI Engineer</option>
                  <option value="Generative AI Engineer">
                    Generative AI Engineer
                  </option>
                  <option value="Machine Learning Engineer">
                    Machine Learning Engineer
                  </option>
                  <option value="Deep Learning Engineer">
                    Deep Learning Engineer
                  </option>
                  <option value="LLM Engineer">LLM Engineer</option>
                  <option value="Prompt Engineer">Prompt Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Data Engineer">Data Engineer</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Business Intelligence Developer">
                    Business Intelligence Developer
                  </option>
                  <option value="MLOps Engineer">MLOps Engineer</option>
                  <option value="Database Administrator">
                    Database Administrator
                  </option>
                </optgroup>
                <optgroup label="Design">
                  <option value="UI Designer">UI Designer</option>
                  <option value="UX Designer">UX Designer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Product Designer">Product Designer</option>
                  <option value="Graphic Designer">Graphic Designer</option>
                  <option value="Visual Designer">Visual Designer</option>
                  <option value="Interaction Designer">
                    Interaction Designer
                  </option>
                  <option value="Motion Designer">Motion Designer</option>
                  <option value="UX Researcher">UX Researcher</option>
                  <option value="Creative Director">Creative Director</option>
                </optgroup>
                <optgroup label="QA & Testing">
                  <option value="QA Engineer">QA Engineer</option>
                  <option value="QA Analyst">QA Analyst</option>
                  <option value="Software Tester">Software Tester</option>
                  <option value="Automation Test Engineer">
                    Automation Test Engineer
                  </option>
                  <option value="Manual Tester">Manual Tester</option>
                  <option value="Performance Test Engineer">
                    Performance Test Engineer
                  </option>
                  <option value="SDET">SDET</option>
                </optgroup>
                <optgroup label="DevOps & Cloud">
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="Cloud Engineer">Cloud Engineer</option>
                  <option value="AWS Engineer">AWS Engineer</option>
                  <option value="Azure Engineer">Azure Engineer</option>
                  <option value="Google Cloud Engineer">
                    Google Cloud Engineer
                  </option>
                  <option value="Site Reliability Engineer">
                    Site Reliability Engineer
                  </option>
                  <option value="Platform Engineer">Platform Engineer</option>
                  <option value="Infrastructure Engineer">
                    Infrastructure Engineer
                  </option>
                  <option value="System Administrator">
                    System Administrator
                  </option>
                  <option value="Network Engineer">Network Engineer</option>
                  <option value="Security Engineer">Security Engineer</option>
                  <option value="Cybersecurity Engineer">
                    Cybersecurity Engineer
                  </option>
                </optgroup>
                <optgroup label="Analysis & Consulting">
                  <option value="Business Analyst">Business Analyst</option>
                  <option value="Systems Analyst">Systems Analyst</option>
                  <option value="Technical Consultant">
                    Technical Consultant
                  </option>
                  <option value="IT Consultant">IT Consultant</option>
                  <option value="Solutions Architect">
                    Solutions Architect
                  </option>
                  <option value="Technical Architect">
                    Technical Architect
                  </option>
                  <option value="Enterprise Architect">
                    Enterprise Architect
                  </option>
                  <option value="Solution Consultant">
                    Solution Consultant
                  </option>
                </optgroup>
                <optgroup label="Entry Level">
                  <option value="Intern">Intern</option>
                  <option value="Software Engineering Intern">
                    Software Engineering Intern
                  </option>
                  <option value="MERN Stack Intern">MERN Stack Intern</option>
                  <option value="Frontend Intern">Frontend Intern</option>
                  <option value="Backend Intern">Backend Intern</option>
                  <option value="AI Intern">AI Intern</option>
                  <option value="Graduate Trainee">Graduate Trainee</option>
                  <option value="Associate Software Engineer">
                    Associate Software Engineer
                  </option>
                  <option value="Junior Developer">Junior Developer</option>
                  <option value="Trainee Software Engineer">
                    Trainee Software Engineer
                  </option>
                </optgroup>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label className={labelStyle}>
              <FaCalendarAlt className="inline mr-2" /> Duration
            </label>
            <input
              type="text"
              value={newExperience.duration}
              onChange={(e) =>
                setNewExperience({ ...newExperience, duration: e.target.value })
              }
              placeholder="2020-2023"
              className={inputStyle}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelStyle}>Description / Responsibilities</label>
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
              className={`${inputStyle} resize-none scrollbar-hide`}
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
            className={`px-4 py-2 rounded-xl flex items-center gap-2 ${dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"} transition`}
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
                className={`p-3 rounded-lg border ${dark ? "border-white/10 bg-black" : "border-gray-200 bg-white"}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">
                      {exp.position || "Position"}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {exp.company || "Company"}
                    </p>
                    {exp.duration && (
                      <p className="text-xs text-gray-400">{exp.duration}</p>
                    )}
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
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </ResumeSection>
  );
}

export function EducationSection({
  education,
  setEducation,
  newEducation,
  setNewEducation,
  editingEduIndex,
  setEditingEduIndex,
  dark,
  inputStyle,
  labelStyle,
  cardStyle,
}) {
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
            <label className={labelStyle}>
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
              onChange={(e) =>
                setNewEducation({ ...newEducation, degree: e.target.value })
              }
              placeholder="Bachelor of Science"
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Field of Study</label>
            <input
              type="text"
              value={newEducation.field}
              onChange={(e) =>
                setNewEducation({ ...newEducation, field: e.target.value })
              }
              placeholder="Computer Science"
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Graduation Year</label>
            <input
              type="text"
              value={newEducation.year}
              onChange={(e) =>
                setNewEducation({ ...newEducation, year: e.target.value })
              }
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
            className={`px-4 py-2 rounded-xl flex items-center gap-2 ${dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"} transition`}
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
                className={`p-3 rounded-lg border ${dark ? "border-white/10 bg-black" : "border-gray-200 bg-white"}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{edu.degree || "Degree"}</h4>
                    <p className="text-sm text-gray-500">
                      {edu.institution || "Institution"}
                    </p>
                    {edu.field && (
                      <p className="text-xs text-gray-400">{edu.field}</p>
                    )}
                    {edu.year && (
                      <p className="text-xs text-gray-400">{edu.year}</p>
                    )}
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
    </ResumeSection>
  );
}

export function ProjectsSection({
  projects,
  setProjects,
  newProject,
  setNewProject,
  editingProjectIndex,
  setEditingProjectIndex,
  dark,
  inputStyle,
  labelStyle,
  cardStyle,
}) {
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
      setNewProject({
        name: "",
        description: "",
        technologies: "",
        github: "",
        live: "",
      });
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
      setNewProject({
        name: "",
        description: "",
        technologies: "",
        github: "",
        live: "",
      });
    }
  };

  const cancelEditProject = () => {
    setEditingProjectIndex(null);
    setNewProject({
      name: "",
      description: "",
      technologies: "",
      github: "",
      live: "",
    });
  };

  return (
    <ResumeSection
      icon={FaProjectDiagram}
      title="Projects"
      subtitle="Add your projects."
      dark={dark}
      cardStyle={cardStyle}
    >
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className={labelStyle}>Project Name</label>
            <input
              type="text"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
              placeholder="E-Commerce App"
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Technologies</label>
            <input
              type="text"
              value={newProject.technologies}
              onChange={(e) =>
                setNewProject({ ...newProject, technologies: e.target.value })
              }
              placeholder="React, Node.js, MongoDB"
              className={inputStyle}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelStyle}>Description</label>
            <textarea
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              placeholder="Full-stack e-commerce application..."
              rows={3}
              className={`${inputStyle} scrollbar-hide resize-none`}
            />
          </div>
          <div>
            <label className={labelStyle}>
              <FaGithub className="inline mr-2" /> GitHub Link
            </label>
            <input
              type="text"
              value={newProject.github}
              onChange={(e) =>
                setNewProject({ ...newProject, github: e.target.value })
              }
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
              onChange={(e) =>
                setNewProject({ ...newProject, live: e.target.value })
              }
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
            className={`px-4 py-2 rounded-xl flex items-center gap-2 ${dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"} transition`}
          >
            {editingProjectIndex !== null ? <FaSave /> : <FaPlus />}
            {editingProjectIndex !== null ? "Update" : "Add"} Project
          </button>
        </div>

        {projects.length > 0 && (
          <div className="mt-4 space-y-2">
            {projects.map((proj, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${dark ? "border-white/10 bg-black" : "border-gray-200 bg-white"}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">
                      {proj.name || proj.title || "Project"}
                    </h4>
                    {proj.technologies && (
                      <p className="text-xs text-gray-400">
                        Tech: {proj.technologies}
                      </p>
                    )}
                    {proj.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {proj.description}
                      </p>
                    )}
                    <div className="flex gap-3 mt-1">
                      {proj.github && (
                        <a
                          href={proj.github}
                          target="_blank"
                          rel="noopener"
                          className="text-xs text-blue-500 hover:underline"
                        >
                          GitHub
                        </a>
                      )}
                      {proj.live && (
                        <a
                          href={proj.live}
                          target="_blank"
                          rel="noopener"
                          className="text-xs text-blue-500 hover:underline"
                        >
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
    </ResumeSection>
  );
}

export function CertificationsSection({
  certifications,
  setCertifications,
  newCertification,
  setNewCertification,
  dark,
  inputStyle,
  cardStyle, // ← ADD THIS
}) {
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

  return (
    <ResumeSection
      icon={FaCertificate}
      title="Certifications"
      subtitle="Add your certifications."
      dark={dark}
      cardStyle={cardStyle}
    >
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
          className={`px-4 py-2 rounded-xl flex items-center gap-2 ${dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"} transition`}
        >
          <FaPlus /> Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {certifications.map((cert, index) => (
          <span
            key={index}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${dark ? "bg-white/10 text-white" : "bg-gray-200 text-gray-800"}`}
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
    </ResumeSection>
  );
}

export function LanguagesSection({
  languages,
  setLanguages,
  newLanguage,
  setNewLanguage,
  dark,
  inputStyle,
  cardStyle, // ← ADD THIS
}) {
  // Missing cardStyle here!
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

  return (
    <ResumeSection
      icon={FaLanguage}
      title="Languages"
      subtitle="Add languages you speak."
      dark={dark}
      cardStyle={cardStyle}
    >
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
          className={`px-4 py-2 rounded-xl flex items-center gap-2 ${dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"} transition`}
        >
          <FaPlus /> Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {languages.map((lang, index) => (
          <span
            key={index}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${dark ? "bg-white/10 text-white" : "bg-gray-200 text-gray-800"}`}
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
    </ResumeSection>
  );
}

export function InterestsSection({
  interests,
  setInterests,
  newInterest,
  setNewInterest,
  dark,
  inputStyle,
  cardStyle, // ← ADD THIS
}) {
  // Missing cardStyle here!
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
          className={`flex-1 ${inputStyle}`}
        />
        <button
          onClick={addInterest}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 ${dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"} transition`}
        >
          <FaPlus /> Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {interests.map((interest, index) => (
          <span
            key={index}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${dark ? "bg-white/10 text-white" : "bg-gray-200 text-gray-800"}`}
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
}

export function HobbiesSection({
  hobbies,
  setHobbies,
  newHobby,
  setNewHobby,
  dark,
  inputStyle,
  cardStyle,
}) {
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
          className={`flex-1 ${inputStyle}`}
        />
        <button
          onClick={addHobby}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 ${dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"} transition`}
        >
          <FaPlus /> Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {hobbies.map((hobby, index) => (
          <span
            key={index}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${dark ? "bg-white/10 text-white" : "bg-gray-200 text-gray-800"}`}
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
}

export function AwardsSection({
  awards,
  setAwards,
  newAward,
  setNewAward,
  editingAwardIndex,
  setEditingAwardIndex,
  dark,
  inputStyle,
  labelStyle,
  cardStyle,
}) {
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
            <label className={labelStyle}>Award Title</label>
            <input
              type="text"
              value={newAward.title}
              onChange={(e) =>
                setNewAward({ ...newAward, title: e.target.value })
              }
              placeholder="Best Developer Award"
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Organization</label>
            <input
              type="text"
              value={newAward.organization}
              onChange={(e) =>
                setNewAward({ ...newAward, organization: e.target.value })
              }
              placeholder="Google"
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Year</label>
            <input
              type="text"
              value={newAward.year}
              onChange={(e) =>
                setNewAward({ ...newAward, year: e.target.value })
              }
              placeholder="2023"
              className={inputStyle}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelStyle}>Description</label>
            <textarea
              value={newAward.description}
              onChange={(e) =>
                setNewAward({ ...newAward, description: e.target.value })
              }
              placeholder="Award description..."
              rows={2}
              className={inputStyle}
            />
          </div>
        </div>

        <div className="flex gap-2">
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
            className={`px-4 py-2 rounded-xl flex items-center gap-2 ${dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"} transition`}
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
                className={`p-3 rounded-lg border ${dark ? "border-white/10 bg-black" : "border-gray-200 bg-white"}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{award.title || "Award"}</h4>
                    <p className="text-sm text-gray-500">
                      {award.organization || "Organization"}
                    </p>
                    {award.year && (
                      <p className="text-xs text-gray-400">{award.year}</p>
                    )}
                    {award.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {award.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editAward(index)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => removeAward(index)}
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
    </ResumeSection>
  );
}

export function PublicationsSection({
  publications,
  setPublications,
  newPublication,
  setNewPublication,
  editingPubIndex,
  setEditingPubIndex,
  dark,
  inputStyle,
  labelStyle,
  cardStyle,
}) {
  const addPublication = () => {
    if (newPublication.title) {
      if (editingPubIndex !== null) {
        const updated = [...publications];
        updated[editingPubIndex] = newPublication;
        setPublications(updated);
        setEditingPubIndex(null);
      } else {
        setPublications([...publications, newPublication]);
      }
      setNewPublication({
        title: "",
        publisher: "",
        url: "",
        date: "",
        authors: "",
      });
    }
  };

  const editPublication = (index) => {
    setNewPublication(publications[index]);
    setEditingPubIndex(index);
  };

  const removePublication = (index) => {
    setPublications(publications.filter((_, i) => i !== index));
    if (editingPubIndex === index) {
      setEditingPubIndex(null);
      setNewPublication({
        title: "",
        publisher: "",
        url: "",
        date: "",
        authors: "",
      });
    }
  };

  const cancelEditPublication = () => {
    setEditingPubIndex(null);
    setNewPublication({
      title: "",
      publisher: "",
      url: "",
      date: "",
      authors: "",
    });
  };

  return (
    <ResumeSection
      icon={FaNewspaper}
      title="Publications"
      subtitle="Add your publications."
      dark={dark}
      cardStyle={cardStyle}
    >
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <label className={labelStyle}>Title</label>
            <input
              type="text"
              value={newPublication.title}
              onChange={(e) =>
                setNewPublication({ ...newPublication, title: e.target.value })
              }
              placeholder="Research Paper Title"
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Publisher</label>
            <input
              type="text"
              value={newPublication.publisher}
              onChange={(e) =>
                setNewPublication({
                  ...newPublication,
                  publisher: e.target.value,
                })
              }
              placeholder="IEEE"
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Date</label>
            <input
              type="date"
              value={newPublication.date}
              onChange={(e) =>
                setNewPublication({ ...newPublication, date: e.target.value })
              }
              className={inputStyle}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelStyle}>URL</label>
            <input
              type="url"
              value={newPublication.url}
              onChange={(e) =>
                setNewPublication({ ...newPublication, url: e.target.value })
              }
              placeholder="https://doi.org/..."
              className={inputStyle}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelStyle}>Authors</label>
            <input
              type="text"
              value={newPublication.authors}
              onChange={(e) =>
                setNewPublication({
                  ...newPublication,
                  authors: e.target.value,
                })
              }
              placeholder="John Doe, Jane Smith"
              className={inputStyle}
            />
          </div>
        </div>

        <div className="flex gap-2">
          {editingPubIndex !== null && (
            <button
              onClick={cancelEditPublication}
              className="px-4 py-2 rounded-xl bg-gray-500 text-white hover:bg-gray-600 transition flex items-center gap-2"
            >
              <FaTimes /> Cancel
            </button>
          )}
          <button
            onClick={addPublication}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 ${dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"} transition`}
          >
            {editingPubIndex !== null ? <FaSave /> : <FaPlus />}
            {editingPubIndex !== null ? "Update" : "Add"} Publication
          </button>
        </div>

        {publications.length > 0 && (
          <div className="mt-4 space-y-2">
            {publications.map((pub, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${dark ? "border-white/10 bg-black" : "border-gray-200 bg-white"}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">
                      {pub.title || "Publication"}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {pub.publisher || "Publisher"}
                    </p>
                    {pub.date && (
                      <p className="text-xs text-gray-400">{pub.date}</p>
                    )}
                    {pub.authors && (
                      <p className="text-xs text-gray-500">
                        Authors: {pub.authors}
                      </p>
                    )}
                    {pub.url && (
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener"
                        className="text-xs text-blue-500 hover:underline"
                      >
                        View Publication
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editPublication(index)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => removePublication(index)}
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
    </ResumeSection>
  );
}

export function VolunteeringSection({
  volunteering,
  setVolunteering,
  newVolunteering,
  setNewVolunteering,
  editingVolIndex,
  setEditingVolIndex,
  dark,
  inputStyle,
  labelStyle,
  cardStyle,
}) {
  const addVolunteering = () => {
    if (newVolunteering.organization && newVolunteering.role) {
      if (editingVolIndex !== null) {
        const updated = [...volunteering];
        updated[editingVolIndex] = newVolunteering;
        setVolunteering(updated);
        setEditingVolIndex(null);
      } else {
        setVolunteering([...volunteering, newVolunteering]);
      }
      setNewVolunteering({
        organization: "",
        role: "",
        description: "",
        duration: "",
      });
    }
  };

  const editVolunteering = (index) => {
    setNewVolunteering(volunteering[index]);
    setEditingVolIndex(index);
  };

  const removeVolunteering = (index) => {
    setVolunteering(volunteering.filter((_, i) => i !== index));
    if (editingVolIndex === index) {
      setEditingVolIndex(null);
      setNewVolunteering({
        organization: "",
        role: "",
        description: "",
        duration: "",
      });
    }
  };

  const cancelEditVolunteering = () => {
    setEditingVolIndex(null);
    setNewVolunteering({
      organization: "",
      role: "",
      description: "",
      duration: "",
    });
  };

  return (
    <ResumeSection
      icon={FaHands}
      title="Volunteering"
      subtitle="Add your volunteering experience."
      dark={dark}
      cardStyle={cardStyle}
    >
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className={labelStyle}>Organization</label>
            <input
              type="text"
              value={newVolunteering.organization}
              onChange={(e) =>
                setNewVolunteering({
                  ...newVolunteering,
                  organization: e.target.value,
                })
              }
              placeholder="NGO Name"
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Role</label>
            <input
              type="text"
              value={newVolunteering.role}
              onChange={(e) =>
                setNewVolunteering({ ...newVolunteering, role: e.target.value })
              }
              placeholder="Volunteer"
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Duration</label>
            <input
              type="text"
              value={newVolunteering.duration}
              onChange={(e) =>
                setNewVolunteering({
                  ...newVolunteering,
                  duration: e.target.value,
                })
              }
              placeholder="2022-2023"
              className={inputStyle}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelStyle}>Description</label>
            <textarea
              value={newVolunteering.description}
              onChange={(e) =>
                setNewVolunteering({
                  ...newVolunteering,
                  description: e.target.value,
                })
              }
              placeholder="What you did..."
              rows={2}
              className={inputStyle}
            />
          </div>
        </div>

        <div className="flex gap-2">
          {editingVolIndex !== null && (
            <button
              onClick={cancelEditVolunteering}
              className="px-4 py-2 rounded-xl bg-gray-500 text-white hover:bg-gray-600 transition flex items-center gap-2"
            >
              <FaTimes /> Cancel
            </button>
          )}
          <button
            onClick={addVolunteering}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 ${dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"} transition`}
          >
            {editingVolIndex !== null ? <FaSave /> : <FaPlus />}
            {editingVolIndex !== null ? "Update" : "Add"} Volunteering
          </button>
        </div>

        {volunteering.length > 0 && (
          <div className="mt-4 space-y-2">
            {volunteering.map((vol, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${dark ? "border-white/10 bg-black" : "border-gray-200 bg-white"}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{vol.role || "Role"}</h4>
                    <p className="text-sm text-gray-500">
                      {vol.organization || "Organization"}
                    </p>
                    {vol.duration && (
                      <p className="text-xs text-gray-400">{vol.duration}</p>
                    )}
                    {vol.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {vol.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editVolunteering(index)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => removeVolunteering(index)}
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
    </ResumeSection>
  );
}

export function ReferencesSection({
  references,
  setReferences,
  newReference,
  setNewReference,
  editingRefIndex,
  setEditingRefIndex,
  dark,
  inputStyle,
  labelStyle,
  cardStyle,
}) {
  const addReference = () => {
    if (newReference.name && newReference.designation) {
      if (editingRefIndex !== null) {
        const updated = [...references];
        updated[editingRefIndex] = newReference;
        setReferences(updated);
        setEditingRefIndex(null);
      } else {
        setReferences([...references, newReference]);
      }
      setNewReference({
        name: "",
        designation: "",
        company: "",
        email: "",
        phone: "",
        relationship: "",
      });
    }
  };

  const editReference = (index) => {
    setNewReference(references[index]);
    setEditingRefIndex(index);
  };

  const removeReference = (index) => {
    setReferences(references.filter((_, i) => i !== index));
    if (editingRefIndex === index) {
      setEditingRefIndex(null);
      setNewReference({
        name: "",
        designation: "",
        company: "",
        email: "",
        phone: "",
        relationship: "",
      });
    }
  };

  const cancelEditReference = () => {
    setEditingRefIndex(null);
    setNewReference({
      name: "",
      designation: "",
      company: "",
      email: "",
      phone: "",
      relationship: "",
    });
  };

  return (
    <ResumeSection
      icon={FaUsers}
      title="References"
      subtitle="Add your professional references."
      dark={dark}
      cardStyle={cardStyle}
    >
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className={labelStyle}>Full Name *</label>
            <input
              type="text"
              value={newReference.name}
              onChange={(e) =>
                setNewReference({ ...newReference, name: e.target.value })
              }
              placeholder="John Doe"
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Designation *</label>
            <input
              type="text"
              value={newReference.designation}
              onChange={(e) =>
                setNewReference({
                  ...newReference,
                  designation: e.target.value,
                })
              }
              placeholder="Senior Manager"
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Company</label>
            <input
              type="text"
              value={newReference.company}
              onChange={(e) =>
                setNewReference({ ...newReference, company: e.target.value })
              }
              placeholder="Google"
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Email</label>
            <input
              type="email"
              value={newReference.email}
              onChange={(e) =>
                setNewReference({ ...newReference, email: e.target.value })
              }
              placeholder="john@email.com"
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Phone</label>
            <input
              type="text"
              value={newReference.phone}
              onChange={(e) =>
                setNewReference({ ...newReference, phone: e.target.value })
              }
              placeholder="+92 300 1234567"
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Relationship</label>
            <input
              type="text"
              value={newReference.relationship}
              onChange={(e) =>
                setNewReference({
                  ...newReference,
                  relationship: e.target.value,
                })
              }
              placeholder="Manager"
              className={inputStyle}
            />
          </div>
        </div>

        <div className="flex gap-2">
          {editingRefIndex !== null && (
            <button
              onClick={cancelEditReference}
              className="px-4 py-2 rounded-xl bg-gray-500 text-white hover:bg-gray-600 transition flex items-center gap-2"
            >
              <FaTimes /> Cancel
            </button>
          )}
          <button
            onClick={addReference}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 ${dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"} transition`}
          >
            {editingRefIndex !== null ? <FaSave /> : <FaPlus />}
            {editingRefIndex !== null ? "Update" : "Add"} Reference
          </button>
        </div>

        {references.length > 0 && (
          <div className="mt-4 space-y-2">
            {references.map((ref, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${dark ? "border-white/10 bg-black" : "border-gray-200 bg-white"}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{ref.name || "Name"}</h4>
                    <p className="text-sm text-gray-500">
                      {ref.designation || "Designation"}
                    </p>
                    {ref.company && (
                      <p className="text-xs text-gray-400">{ref.company}</p>
                    )}
                    {ref.email && (
                      <p className="text-xs text-gray-500">
                        Email: {ref.email}
                      </p>
                    )}
                    {ref.phone && (
                      <p className="text-xs text-gray-500">
                        Phone: {ref.phone}
                      </p>
                    )}
                    {ref.relationship && (
                      <p className="text-xs text-gray-400">
                        Relationship: {ref.relationship}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editReference(index)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => removeReference(index)}
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
    </ResumeSection>
  );
}

export function CustomSectionsSection({
  customSections,
  setCustomSections,
  newCustomSection,
  setNewCustomSection,
  editingCustomIndex,
  setEditingCustomIndex,
  dark,
  inputStyle,
  labelStyle,
  cardStyle,
}) {
  const addCustomSection = () => {
    if (newCustomSection.title) {
      const sectionData = {
        title: newCustomSection.title,
        content: newCustomSection.content || "",
        items: newCustomSection.items
          ? newCustomSection.items
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
      };

      if (editingCustomIndex !== null) {
        const updated = [...customSections];
        updated[editingCustomIndex] = sectionData;
        setCustomSections(updated);
        setEditingCustomIndex(null);
      } else {
        setCustomSections([...customSections, sectionData]);
      }
      setNewCustomSection({ title: "", content: "", items: "" });
    }
  };

  const editCustomSection = (index) => {
    const section = customSections[index];
    setNewCustomSection({
      title: section.title || "",
      content: section.content || "",
      items: Array.isArray(section.items)
        ? section.items.join(", ")
        : section.items || "",
    });
    setEditingCustomIndex(index);
  };

  const removeCustomSection = (index) => {
    setCustomSections(customSections.filter((_, i) => i !== index));
    if (editingCustomIndex === index) {
      setEditingCustomIndex(null);
      setNewCustomSection({ title: "", content: "", items: "" });
    }
  };

  const cancelEditCustomSection = () => {
    setEditingCustomIndex(null);
    setNewCustomSection({ title: "", content: "", items: "" });
  };

  return (
    <ResumeSection
      icon={FaLayerGroup}
      title="Custom Sections"
      subtitle="Add custom sections to your resume."
      dark={dark}
      cardStyle={cardStyle}
    >
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className={labelStyle}>Section Title *</label>
            <input
              type="text"
              value={newCustomSection.title}
              onChange={(e) =>
                setNewCustomSection({
                  ...newCustomSection,
                  title: e.target.value,
                })
              }
              placeholder="e.g., Certifications, Volunteer Work"
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Content / Description</label>
            <textarea
              value={newCustomSection.content}
              onChange={(e) =>
                setNewCustomSection({
                  ...newCustomSection,
                  content: e.target.value,
                })
              }
              placeholder="Describe the section content..."
              rows={3}
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Items (comma separated)</label>
            <input
              type="text"
              value={newCustomSection.items}
              onChange={(e) =>
                setNewCustomSection({
                  ...newCustomSection,
                  items: e.target.value,
                })
              }
              placeholder="Item 1, Item 2, Item 3"
              className={inputStyle}
            />
          </div>
        </div>

        <div className="flex gap-2">
          {editingCustomIndex !== null && (
            <button
              onClick={cancelEditCustomSection}
              className="px-4 py-2 rounded-xl bg-gray-500 text-white hover:bg-gray-600 transition flex items-center gap-2"
            >
              <FaTimes /> Cancel
            </button>
          )}
          <button
            onClick={addCustomSection}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 ${dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"} transition`}
          >
            {editingCustomIndex !== null ? <FaSave /> : <FaPlus />}
            {editingCustomIndex !== null ? "Update" : "Add"} Custom Section
          </button>
        </div>

        {customSections.length > 0 && (
          <div className="mt-4 space-y-2">
            {customSections.map((section, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${dark ? "border-white/10 bg-black" : "border-gray-200 bg-white"}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">
                      {section.title || "Custom Section"}
                    </h4>
                    {section.content && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {section.content}
                      </p>
                    )}
                    {section.items &&
                      Array.isArray(section.items) &&
                      section.items.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {section.items.map((item, i) => (
                            <span
                              key={i}
                              className="text-xs bg-gray-200 dark:bg-white/10 px-2 py-0.5 rounded"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      )}
                    {section.items && typeof section.items === "string" && (
                      <p className="text-xs text-gray-500 mt-1">
                        {section.items}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editCustomSection(index)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => removeCustomSection(index)}
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
    </ResumeSection>
  );
}
