import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaEye,
  FaTrash,
  FaEdit,
  FaFileAlt,
  FaCalendarAlt,
  FaSpinner,
  FaPlus,
  FaSearch,
} from "react-icons/fa";

import { useTheme } from "../BgContext/ThemeContext";
import { getMyCVs, deleteCV } from "../Features/CVcreate";
import ResumeHeader from "../components/Resume/ResumeHeader";
import ResumeFooter from "../components/Resume/ResumeFooter";

export default function AllResume() {
  const navigate = useNavigate();
  const { dark } = useTheme();

  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadCVs();
  }, []);

  const loadCVs = async () => {
    try {
      setLoading(true);

      const response = await getMyCVs();

      console.log("CV Response:", response);

      setCvs(response.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    const ok = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (!ok) return;

    try {
      await deleteCV(id);

      setCvs((prev) => prev.filter((cv) => cv._id !== id));

      toast.success("Resume deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  const filteredCVs = useMemo(() => {
    return cvs.filter((cv) => {
      const fullName = cv.personal?.fullName || "";
      const jobTitle = cv.personal?.jobTitle || "";
      const email = cv.personal?.email || "";

      return (
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [cvs, searchTerm]);

  if (loading) {
    return (
      <>
        <ResumeHeader />

        <div
          className={`min-h-screen flex items-center justify-center ${
            dark ? "bg-black text-white" : "bg-gray-50 text-black"
          }`}
        >
          <div className="flex items-center gap-3 text-lg font-semibold">
            <FaSpinner className="animate-spin" />
            Loading your resumes...
          </div>
        </div>

        <ResumeFooter />
      </>
    );
  }

  return (
    <>
      <ResumeHeader />

      <div
        className={`min-h-screen ${
          dark ? "bg-black text-white" : "bg-gray-50 text-black"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 py-8">

          {/* Header */}

          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <h1 className="text-3xl font-bold">
                My Resumes
              </h1>

              <p
                className={`mt-2 ${
                  dark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {cvs.length} {cvs.length === 1 ? "resume" : "resumes"} created
              </p>
            </div>

            <button
              onClick={() => navigate("/cv-generator")}
            className="flex items-center gap-2 rounded-md border border-white bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-900"
            >
              <FaPlus />
              Create New Resume
            </button>

          </div>

          {/* Search */}

          <div className="mb-8">

            <div
              className={`flex items-center gap-3 rounded-md border px-4 py-3 ${
                dark
                  ? "border-white/10 bg-white/5"
                  : "border-gray-200 bg-white"
              }`}
            >
              <FaSearch
                className={
                  dark ? "text-gray-400" : "text-gray-500"
                }
              />

              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, job title or email..."
                className={`w-full bg-transparent outline-none ${
                  dark
                    ? "text-white placeholder:text-gray-500"
                    : "text-black placeholder:text-gray-400"
                }`}
              />
            </div>

          </div>

          {/* Empty State */}

          {filteredCVs.length === 0 ? (
            <div
              className={`rounded-2xl border p-12 text-center ${
                dark
                  ? "border-white/10 bg-white/5"
                  : "border-gray-200 bg-white"
              }`}
            >
              <FaFileAlt className="mx-auto mb-4 text-5xl text-gray-400" />

              <h2 className="text-2xl font-semibold">
                No resumes found
              </h2>

              <p
                className={`mt-2 ${
                  dark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {searchTerm
                  ? "Try another keyword."
                  : "Create your first professional resume."}
              </p>

              {!searchTerm && (
                <button
                  onClick={() => navigate("/cv-generator")}
                  className="mt-6 rounded-md bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Create Resume
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredCVs.map((cv) => {
                const fullName = cv.personal?.fullName || "Unnamed";
                const jobTitle = cv.personal?.jobTitle || "No title";
                const email = cv.personal?.email || "";
                const skills = cv.skills?.technical || [];

                return (
                  <div
                    key={cv._id}
                    className={`rounded-2xl border p-6 transition-all hover:-translate-y-1 hover:shadow-xl ${
                      dark
                        ? "border-white/10 bg-white/5 hover:bg-white/10"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">

                        {cv.profileImage?.url ? (
                          <img
                            src={cv.profileImage.url}
                            alt={fullName}
                            className="h-16 w-16 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className={`flex h-16 w-16 items-center justify-center rounded-full ${
                              dark ? "bg-white/10" : "bg-gray-200"
                            }`}
                          >
                            <FaFileAlt
                              className={
                                dark
                                  ? "text-white/50 text-xl"
                                  : "text-gray-500 text-xl"
                              }
                            />
                          </div>
                        )}

                        <div>
                          <h2 className="text-lg font-bold">
                            {fullName}
                          </h2>

                          <p
                            className={`text-sm ${
                              dark
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {jobTitle}
                          </p>
                        </div>
                      </div>

                      {cv.isPrimary && (
                        <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-500">
                          Primary
                        </span>
                      )}
                    </div>

                    {/* Email */}

                    {email && (
                      <p
                        className={`mt-4 text-sm ${
                          dark
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}
                      >
                        {email}
                      </p>
                    )}

                    {/* Date */}

                    <div
                      className={`mt-3 flex items-center gap-2 text-sm ${
                        dark
                          ? "text-gray-500"
                          : "text-gray-500"
                      }`}
                    >
                      <FaCalendarAlt />

                      <span>
                        Updated{" "}
                        {new Date(
                          cv.updatedAt
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Skills */}

                    {skills.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className={`rounded-full px-3 py-1 text-xs ${
                              dark
                                ? "bg-white/10 text-white"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {skill}
                          </span>
                        ))}

                        {skills.length > 3 && (
                          <span
                            className={`text-xs ${
                              dark
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            +{skills.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Buttons */}

                    <div className="mt-6 flex gap-2 border-t pt-5">

                      <button
                        onClick={() =>
                          navigate(`/cv/${cv._id}`)
                        }
                        className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 transition ${
                          dark
                            ? "bg-white/10 hover:bg-white/20"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        <FaEye />
                        View
                      </button>

                    

                     <button
  onClick={() => handleDelete(cv._id, fullName)}
  className={`
    flex 
    flex-1 
    items-center 
    justify-center 
    gap-2 
    rounded-md 
    py-2 
    px-4
    transition-all 
    duration-200
    ${dark 
      ? "bg-white/10 hover:bg-white/20 text-white" 
      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
    }
    hover:scale-105
    active:scale-95
  `}
>
  <FaTrash className="h-4 w-4" />
  <span>Delete</span>
</button>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ResumeFooter />
    </>
  );
}