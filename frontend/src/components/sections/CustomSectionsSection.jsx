import React from "react";
import {
  FaLayerGroup,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import ResumeSection from "./ResumeSection";

const CustomSectionsSection = ({
  customSections = [],
  setCustomSections,
  newCustomSection = { title: "", content: "", items: "" },
  setNewCustomSection,
  editingCustomIndex = null,
  setEditingCustomIndex,
  dark = false,
  inputStyle = "",
  labelStyle = "",
  cardStyle = "",
}) => {
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
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              Section Title *
            </label>
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
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              Content / Description
            </label>
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
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none scrollbar-hide ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              Items (comma separated)
            </label>
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
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
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
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 ${
              dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
            }`}
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
                className={`p-3 rounded-lg border ${
                  dark ? "border-white/10 bg-black" : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`font-semibold ${dark ? "text-white" : "text-gray-800"}`}>
                      {section.title || "Custom Section"}
                    </h4>
                    {section.content && (
                      <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-600"} mt-1`}>
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
                              className={`text-xs px-2 py-0.5 rounded ${
                                dark
                                  ? "bg-white/10 text-white"
                                  : "bg-gray-200 text-gray-800"
                              }`}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      )}
                    {section.items && typeof section.items === "string" && (
                      <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-500"} mt-1`}>
                        {section.items}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => editCustomSection(index)}
                      className="text-blue-500 hover:text-blue-600 transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => removeCustomSection(index)}
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

export default CustomSectionsSection;