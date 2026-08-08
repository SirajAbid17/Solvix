import React from "react";
import {
  FaNewspaper,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import ResumeSection from "./ResumeSection";

const PublicationsSection = ({
  publications = [],
  setPublications,
  newPublication = { title: "", publisher: "", url: "", date: "", authors: "" },
  setNewPublication,
  editingPubIndex = null,
  setEditingPubIndex,
  dark = false,
  inputStyle = "",
  labelStyle = "",
  cardStyle = "",
}) => {
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
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              Title
            </label>
            <input
              type="text"
              value={newPublication.title}
              onChange={(e) =>
                setNewPublication({ ...newPublication, title: e.target.value })
              }
              placeholder="Research Paper Title"
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              Publisher
            </label>
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
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              Date
            </label>
            <input
              type="date"
              value={newPublication.date}
              onChange={(e) =>
                setNewPublication({ ...newPublication, date: e.target.value })
              }
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white"
                  : "border-gray-300 bg-white text-gray-800"
              } ${inputStyle}`}
            />
          </div>
          <div className="md:col-span-2">
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              URL
            </label>
            <input
              type="url"
              value={newPublication.url}
              onChange={(e) =>
                setNewPublication({ ...newPublication, url: e.target.value })
              }
              placeholder="https://doi.org/..."
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
          <div className="md:col-span-2">
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"} ${labelStyle}`}>
              Authors
            </label>
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
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
              } ${inputStyle}`}
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
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
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 ${
              dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
            }`}
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
                className={`p-3 rounded-lg border ${
                  dark ? "border-white/10 bg-black" : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`font-semibold ${dark ? "text-white" : "text-gray-800"}`}>
                      {pub.title || "Publication"}
                    </h4>
                    <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
                      {pub.publisher || "Publisher"}
                    </p>
                    {pub.date && (
                      <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                        {pub.date}
                      </p>
                    )}
                    {pub.authors && (
                      <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-500"}`}>
                        Authors: {pub.authors}
                      </p>
                    )}
                    {pub.url && (
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline"
                      >
                        View Publication
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => editPublication(index)}
                      className="text-blue-500 hover:text-blue-600 transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => removePublication(index)}
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

export default PublicationsSection;