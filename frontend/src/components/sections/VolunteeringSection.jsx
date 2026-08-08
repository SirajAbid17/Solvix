import React from "react";
import {
  FaHands,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import ResumeSection from "./ResumeSection";

const VolunteeringSection = ({
  volunteering = [],
  setVolunteering,
  newVolunteering = { organization: "", role: "", description: "", duration: "" },
  setNewVolunteering,
  editingVolIndex = null,
  setEditingVolIndex,
  dark = false,
  inputStyle = "",
  labelStyle = "",
  cardStyle = "",
}) => {
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
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              Organization
            </label>
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
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              Role
            </label>
            <input
              type="text"
              value={newVolunteering.role}
              onChange={(e) =>
                setNewVolunteering({ ...newVolunteering, role: e.target.value })
              }
              placeholder="Volunteer"
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              Duration
            </label>
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
              value={newVolunteering.description}
              onChange={(e) =>
                setNewVolunteering({
                  ...newVolunteering,
                  description: e.target.value,
                })
              }
              placeholder="What you did..."
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
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 ${
              dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
            }`}
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
                className={`p-3 rounded-lg border ${
                  dark ? "border-white/10 bg-black" : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`font-semibold ${dark ? "text-white" : "text-gray-800"}`}>
                      {vol.role || "Role"}
                    </h4>
                    <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
                      {vol.organization || "Organization"}
                    </p>
                    {vol.duration && (
                      <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                        {vol.duration}
                      </p>
                    )}
                    {vol.description && (
                      <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-600"} mt-1`}>
                        {vol.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => editVolunteering(index)}
                      className="text-blue-500 hover:text-blue-600 transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => removeVolunteering(index)}
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

export default VolunteeringSection;