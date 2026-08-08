// components/Resume/CV-Generate/sections/ProfessionalSections.jsx
import React from "react";
import {
  FaBriefcase,
  FaGraduationCap,
  FaProjectDiagram,
  FaBuilding,
  FaUserTie,
  FaCalendarAlt,
  FaUniversity,
  FaBook,
  FaGithub,
  FaGlobe,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSave,
  FaTimes,
} from "react-icons/fa";

export default function ProfessionalSections({
  dark,
  inputStyle,
  cardStyle,
  labelStyle,
  experience,
  setExperience,
  newExperience,
  setNewExperience,
  editingExpIndex,
  setEditingExpIndex,
  addExperience,
  editExperience,
  removeExperience,
  cancelEditExperience,
  education,
  setEducation,
  newEducation,
  setNewEducation,
  editingEduIndex,
  setEditingEduIndex,
  addEducation,
  editEducation,
  removeEducation,
  cancelEditEducation,
  projects,
  setProjects,
  newProject,
  setNewProject,
  editingProjectIndex,
  setEditingProjectIndex,
  addProject,
  editProject,
  removeProject,
  cancelEditProject,
}) {
  const positionOptions = [
    { label: "Development", options: [
      "Frontend Developer", "Backend Developer", "Full Stack Developer",
      "React Developer", "Node.js Developer"
    ]},
    { label: "Management", options: [
      "Team Lead", "Technical Lead", "Engineering Manager",
      "Project Manager", "Product Manager", "Program Manager",
      "Delivery Manager", "Scrum Master", "Agile Coach",
      "Engineering Director", "VP of Engineering", "CTO"
    ]},
    { label: "Data & AI", options: [
      "AI Engineer", "Generative AI Engineer", "Machine Learning Engineer",
      "Deep Learning Engineer", "LLM Engineer", "Prompt Engineer",
      "Data Scientist", "Data Engineer", "Data Analyst",
      "Business Intelligence Developer", "MLOps Engineer", "Database Administrator"
    ]},
    { label: "Design", options: [
      "UI Designer", "UX Designer", "UI/UX Designer",
      "Product Designer", "Graphic Designer", "Visual Designer",
      "Interaction Designer", "Motion Designer", "UX Researcher",
      "Creative Director"
    ]},
    { label: "QA & Testing", options: [
      "QA Engineer", "QA Analyst", "Software Tester",
      "Automation Test Engineer", "Manual Tester",
      "Performance Test Engineer", "SDET"
    ]},
    { label: "DevOps & Cloud", options: [
      "DevOps Engineer", "Cloud Engineer", "AWS Engineer",
      "Azure Engineer", "Google Cloud Engineer", "Site Reliability Engineer",
      "Platform Engineer", "Infrastructure Engineer",
      "System Administrator", "Network Engineer",
      "Security Engineer", "Cybersecurity Engineer"
    ]},
    { label: "Analysis & Consulting", options: [
      "Business Analyst", "Systems Analyst", "Technical Consultant",
      "IT Consultant", "Solutions Architect", "Technical Architect",
      "Enterprise Architect", "Solution Consultant"
    ]},
    { label: "Entry Level", options: [
      "Intern", "Software Engineering Intern", "MERN Stack Intern",
      "Frontend Intern", "Backend Intern", "AI Intern",
      "Graduate Trainee", "Associate Software Engineer",
      "Junior Developer", "Trainee Software Engineer"
    ]}
  ];

  return (
    <>
      {/* Work Experience */}
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
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    dark:border-white/10
                    bg-white
                    dark:bg-[#0f172a]
                    text-gray-800
                    dark:text-white
                    px-4
                    py-3                    pr-12
                    text-sm
                    font-medium
                    appearance-none
                    cursor-pointer
                    transition-all
                    duration-300
                    outline-none
                    hover:border-blue-500
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-500/20
                  `}
                >
                  <option value="">Select Position</option>
                  {positionOptions.map((group, idx) => (
                    <optgroup key={idx} label={group.label}>
                      {group.options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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
                onChange={(e) => setNewExperience({ ...newExperience, duration: e.target.value })}
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
              className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
              } transition`}
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
                      <h4 className="font-semibold">{exp.position || "Position"}</h4>
                      <p className="text-sm text-gray-500">{exp.company || "Company"}</p>
                      {exp.duration && <p className="text-xs text-gray-400">{exp.duration}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editExperience(index)} className="text-blue-500 hover:text-blue-600">
                        <FaEdit />
                      </button>
                      <button onClick={() => removeExperience(index)} className="text-red-500 hover:text-red-600">
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

      {/* Education */}
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
              <button onClick={cancelEditEducation} className="px-4 py-2 rounded-xl bg-gray-500 text-white hover:bg-gray-600 transition flex items-center gap-2">
                <FaTimes /> Cancel
              </button>
            )}
            <button onClick={addEducation} className={`px-4 py-2 rounded-xl flex items-center gap-2 ${dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"} transition`}>
              {editingEduIndex !== null ? <FaSave /> : <FaPlus />}
              {editingEduIndex !== null ? "Update" : "Add"} Education
            </button>
          </div>

          {education.length > 0 && (
            <div className="mt-4 space-y-2">
              {education.map((edu, index) => (
                <div key={index} className={`p-3 rounded-lg border ${dark ? "border-white/10 bg-black" : "border-gray-200 bg-white"}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{edu.degree || "Degree"}</h4>
                      <p className="text-sm text-gray-500">{edu.institution || "Institution"}</p>
                      {edu.field && <p className="text-xs text-gray-400">{edu.field}</p>}
                      {edu.year && <p className="text-xs text-gray-400">{edu.year}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editEducation(index)} className="text-blue-500 hover:text-blue-600"><FaEdit /></button>
                      <button onClick={() => removeEducation(index)} className="text-red-500 hover:text-red-600"><FaTrash /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Projects */}
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
              <input type="text" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} placeholder="E-Commerce App" className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Technologies</label>
              <input type="text" value={newProject.technologies} onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })} placeholder="React, Node.js, MongoDB" className={inputStyle} />
            </div>
            <div className="md:col-span-2">
              <label className={labelStyle}>Description</label>
              <textarea
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    description: e.target.value,
                  })
                }
                placeholder="Full-stack e-commerce application..."
                rows={3}
                className={`${inputStyle} scrollbar-hide resize-none`}
              />
            </div>
            <div>
              <label className={labelStyle}><FaGithub className="inline mr-2" /> GitHub Link</label>
              <input type="text" value={newProject.github} onChange={(e) => setNewProject({ ...newProject, github: e.target.value })} placeholder="https://github.com/..." className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}><FaGlobe className="inline mr-2" /> Live Demo</label>
              <input type="text" value={newProject.live} onChange={(e) => setNewProject({ ...newProject, live: e.target.value })} placeholder="https://demo.com" className={inputStyle} />
            </div>
          </div>

          <div className="flex gap-2">
            {editingProjectIndex !== null && (
              <button onClick={cancelEditProject} className="px-4 py-2 rounded-xl bg-gray-500 text-white hover:bg-gray-600 transition flex items-center gap-2">
                <FaTimes /> Cancel
              </button>
            )}
            <button onClick={addProject} className={`px-4 py-2 rounded-xl flex items-center gap-2 ${dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"} transition`}>
              {editingProjectIndex !== null ? <FaSave /> : <FaPlus />}
              {editingProjectIndex !== null ? "Update" : "Add"} Project
            </button>
          </div>

          {projects.length > 0 && (
            <div className="mt-4 space-y-2">
              {projects.map((proj, index) => (
                <div key={index} className={`p-3 rounded-lg border ${dark ? "border-white/10 bg-black" : "border-gray-200 bg-white"}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{proj.name || proj.title || "Project"}</h4>
                      {proj.technologies && <p className="text-xs text-gray-400">Tech: {proj.technologies}</p>}
                      {proj.description && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{proj.description}</p>}
                      <div className="flex gap-3 mt-1">
                        {proj.github && <a href={proj.github} target="_blank" rel="noopener" className="text-xs text-blue-500 hover:underline">GitHub</a>}
                        {proj.live && <a href={proj.live} target="_blank" rel="noopener" className="text-xs text-blue-500 hover:underline">Live Demo</a>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editProject(index)} className="text-blue-500 hover:text-blue-600"><FaEdit /></button>
                      <button onClick={() => removeProject(index)} className="text-red-500 hover:text-red-600"><FaTrash /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}