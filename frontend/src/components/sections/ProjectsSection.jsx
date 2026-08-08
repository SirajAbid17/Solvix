import React from "react";
import {
  FaProjectDiagram,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaGithub,
  FaGlobe,
} from "react-icons/fa";
import ResumeSection from "./ResumeSection";

const ProjectsSection = ({
  projects = [],
  setProjects,
  newProject = { name: "", description: "", technologies: "", github: "", live: "" },
  setNewProject,
  editingProjectIndex = null,
  setEditingProjectIndex,
  dark = false,
  inputStyle = "",
  labelStyle = "",
  cardStyle = "",
}) => {
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
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              Project Name
            </label>
            <input
              type="text"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
              placeholder="E-Commerce App"
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              Technologies
            </label>
            <input
              type="text"
              value={newProject.technologies}
              onChange={(e) =>
                setNewProject({ ...newProject, technologies: e.target.value })
              }
              placeholder="React, Node.js, MongoDB"
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
          <div className="md:col-span-2">
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              Description
            </label>
            <textarea
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              placeholder="Full-stack e-commerce application..."
              rows={3}
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none scrollbar-hide ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              <FaGithub className="inline mr-2" /> GitHub Link
            </label>
            <input
              type="text"
              value={newProject.github}
              onChange={(e) =>
                setNewProject({ ...newProject, github: e.target.value })
              }
              placeholder="https://github.com/..."
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              <FaGlobe className="inline mr-2" /> Live Demo
            </label>
            <input
              type="text"
              value={newProject.live}
              onChange={(e) =>
                setNewProject({ ...newProject, live: e.target.value })
              }
              placeholder="https://demo.com"
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
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
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 ${
              dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
            }`}
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
                className={`p-3 rounded-lg border ${
                  dark ? "border-white/10 bg-black" : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`font-semibold ${dark ? "text-white" : "text-gray-800"}`}>
                      {proj.name || proj.title || "Project"}
                    </h4>
                    {proj.technologies && (
                      <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                        Tech: {proj.technologies}
                      </p>
                    )}
                    {proj.description && (
                      <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-600"} mt-1`}>
                        {proj.description}
                      </p>
                    )}
                    <div className="flex gap-3 mt-1">
                      {proj.github && (
                        <a
                          href={proj.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline"
                        >
                          GitHub
                        </a>
                      )}
                      {proj.live && (
                        <a
                          href={proj.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline"
                        >
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => editProject(index)}
                      className="text-blue-500 hover:text-blue-600 transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => removeProject(index)}
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

export default ProjectsSection;