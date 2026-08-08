import React from "react";
import {
  FaUsers,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import ResumeSection from "./ResumeSection";

const ReferencesSection = ({
  references = [],
  setReferences,
  newReference = { name: "", designation: "", company: "", email: "", phone: "", relationship: "" },
  setNewReference,
  editingRefIndex = null,
  setEditingRefIndex,
  dark = false,
  inputStyle = "",
  labelStyle = "",
  cardStyle = "",
}) => {
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
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              Full Name *
            </label>
            <input
              type="text"
              value={newReference.name}
              onChange={(e) =>
                setNewReference({ ...newReference, name: e.target.value })
              }
              placeholder="John Doe"
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              Designation *
            </label>
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
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              Company
            </label>
            <input
              type="text"
              value={newReference.company}
              onChange={(e) =>
                setNewReference({ ...newReference, company: e.target.value })
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
              Email
            </label>
            <input
              type="email"
              value={newReference.email}
              onChange={(e) =>
                setNewReference({ ...newReference, email: e.target.value })
              }
              placeholder="john@email.com"
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              Phone
            </label>
            <input
              type="text"
              value={newReference.phone}
              onChange={(e) =>
                setNewReference({ ...newReference, phone: e.target.value })
              }
              placeholder="+92 300 1234567"
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              Relationship
            </label>
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
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
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
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 ${
              dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
            }`}
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
                className={`p-3 rounded-lg border ${
                  dark ? "border-white/10 bg-black" : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`font-semibold ${dark ? "text-white" : "text-gray-800"}`}>
                      {ref.name || "Name"}
                    </h4>
                    <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
                      {ref.designation || "Designation"}
                    </p>
                    {ref.company && (
                      <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                        {ref.company}
                      </p>
                    )}
                    {ref.email && (
                      <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-500"}`}>
                        Email: {ref.email}
                      </p>
                    )}
                    {ref.phone && (
                      <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-500"}`}>
                        Phone: {ref.phone}
                      </p>
                    )}
                    {ref.relationship && (
                      <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                        Relationship: {ref.relationship}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => editReference(index)}
                      className="text-blue-500 hover:text-blue-600 transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => removeReference(index)}
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

export default ReferencesSection;