// components/Resume/CV-Generate/components/ResumeContent.jsx
import React from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaBriefcase,
  FaGraduationCap,
  FaProjectDiagram,
  FaCode,
  FaCertificate,
  FaLanguage,
  FaHeart,
  FaCog,
  FaAward,
  FaHands,
  FaUsers,
  FaNewspaper,
  FaLayerGroup,
} from "react-icons/fa";

export default function ResumeContent({ resume }) {
  // Data Extraction
  const personal = resume.personal || {};
  const social = resume.social || {};
  const aiData = resume.ai || {};
  const summary = aiData.generatedSummary || resume.summary || "";

  let skills = [];
  if (resume.skills) {
    if (Array.isArray(resume.skills)) {
      skills = resume.skills;
    } else if (typeof resume.skills === "object") {
      const allSkills = [];
      Object.values(resume.skills).forEach((value) => {
        if (Array.isArray(value)) {
          allSkills.push(...value);
        }
      });
      skills = allSkills;
    }
  }

  const experience = Array.isArray(resume.workExperience)
    ? resume.workExperience
    : [];
  const education = Array.isArray(resume.education) ? resume.education : [];
  const projects = Array.isArray(resume.projects) ? resume.projects : [];
  const certifications = Array.isArray(resume.certifications)
    ? resume.certifications
    : [];
  const languages = Array.isArray(resume.languages) ? resume.languages : [];
  const interests = Array.isArray(resume.interests) ? resume.interests : [];
  const hobbies = Array.isArray(resume.hobbies) ? resume.hobbies : [];
  const awards = Array.isArray(resume.awards) ? resume.awards : [];
  const volunteering = Array.isArray(resume.volunteering)
    ? resume.volunteering
    : [];
  const references = Array.isArray(resume.references) ? resume.references : [];
  const publications = Array.isArray(resume.publications)
    ? resume.publications
    : [];
  const customSections = Array.isArray(resume.customSections)
    ? resume.customSections
    : [];

  const formatDate = (date) => {
    if (!date) return "";
    try {
      const d = new Date(date);
      return d.getFullYear();
    } catch (e) {
      return date;
    }
  };

  const cleanDescription = (text) => {
    if (!text) return "";
    let cleaned = text.replace(/\*\*/g, "").replace(/##/g, "").trim();
    cleaned = cleaned.replace(/^[•●○\-*]\s*/gm, "");
    cleaned = cleaned.replace(/\s+/g, " ");
    return cleaned;
  };

  const formatTechnologies = (tech) => {
    if (!tech) return [];
    if (Array.isArray(tech)) {
      return tech;
    }
    if (typeof tech === "string") {
      return tech
        .replace(/[•●○\-*]\s*/g, ",")
        .split(",")
        .filter((t) => t.trim());
    }
    return [];
  };

  const fullName = personal.fullName || resume.title || "Full Name";
  const jobTitle = personal.jobTitle || "";
  const email = personal.email || "";
  const phone = personal.phone || "";
  const city = personal.city || "";
  const country = personal.country || "";
  const profileImage = resume.profileImage || null;
  const hasProfileImage =
    profileImage && profileImage.url && profileImage.url.trim() !== "";

  return (
    <div style={{ backgroundColor: "#ffffff", color: "#111827" }}>
      {/* Header Section */}
      <div className="mb-8 flex flex-col items-start gap-6 border-b-2 border-gray-200 pb-8 md:flex-row md:items-center">
        {hasProfileImage ? (
          <img
            src={profileImage.url}
            alt={profileImage.alt || "Profile"}
            className="h-28 w-28 md:h-36 md:w-36 rounded-full object-cover border-4 border-gray-200 shadow-sm flex-shrink-0"
            crossOrigin="anonymous"
          />
        ) : ""}
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight break-words">
            {fullName}
          </h1>
          {jobTitle && (
            <p className="text-xl md:text-2xl text-gray-600 font-medium mt-1 break-words">
              {jobTitle}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
            {email && (
              <span className="flex items-center gap-2 break-all">
                <FaEnvelope className="h-4 w-4 text-gray-400 flex-shrink-0" />{" "}
                {email}
              </span>
            )}
            {phone && (
              <span className="flex items-center gap-2">
                <FaPhone className="h-4 w-4 text-gray-400 flex-shrink-0" />{" "}
                {phone}
              </span>
            )}
            {(city || country) && (
              <span className="flex items-center gap-2">
                <FaMapMarkerAlt className="h-4 w-4 text-gray-400 flex-shrink-0" />
                {[city, country].filter(Boolean).join(", ")}
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-4">
            {social.linkedin && (
              <a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors break-all"
              >
                <FaLinkedin className="h-4 w-4 flex-shrink-0" /> LinkedIn
              </a>
            )}
            {social.github && (
              <a
                href={social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors break-all"
              >
                <FaGithub className="h-4 w-4 flex-shrink-0" /> GitHub
              </a>
            )}
            {social.portfolio && (
              <a
                href={social.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors break-all"
              >
                <FaGlobe className="h-4 w-4 flex-shrink-0" /> Portfolio
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      {summary && (
        <div className="section-card mb-8">
          <h2 className="section-heading text-2xl font-bold text-gray-900 border-b-2 border-gray-200 pb-2 mb-4 uppercase tracking-wide flex items-center gap-3">
            <FaUser className="h-5 w-5 text-blue-600 flex-shrink-0" />
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed text-base break-words">
            {cleanDescription(summary)}
          </p>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="section-card mb-8">
          <h2 className="section-heading text-2xl font-bold text-gray-900 border-b-2 border-gray-200 pb-2 mb-4 uppercase tracking-wide flex items-center gap-3">
            <FaGraduationCap className="h-5 w-5 text-blue-600 flex-shrink-0" />
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="education-item">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 break-words">
                      {edu.degree || "Degree"}
                    </h3>
                    <p className="text-gray-600 font-medium break-words">
                      {edu.institution || "Institution"}
                    </p>
                    {edu.field && (
                      <p className="text-gray-500 text-sm break-words">
                        {edu.field}
                      </p>
                    )}
                  </div>
                  {(edu.year || (edu.startDate && edu.endDate)) && (
                    <p className="text-sm text-gray-500 font-medium mt-1 md:mt-0 flex-shrink-0">
                      {edu.year ||
                        `${formatDate(edu.startDate)} — ${formatDate(edu.endDate)}`}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="section-card mb-8">
          <h2 className="section-heading text-2xl font-bold text-gray-900 border-b-2 border-gray-200 pb-2 mb-4 uppercase tracking-wide flex items-center gap-3">
            <FaBriefcase className="h-5 w-5 text-blue-600 flex-shrink-0" />
            Experience
          </h2>
          <div className="space-y-5">
            {experience.map((exp, index) => (
              <div key={index} className="experience-item">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 break-words">
                      {exp.position || exp.title || "Position"}
                    </h3>
                    <p className="text-gray-600 font-medium break-words">
                      {exp.company || "Company"}
                    </p>
                  </div>
                  {(exp.duration || (exp.startDate && exp.endDate)) && (
                    <p className="text-sm text-gray-500 font-medium mt-1 md:mt-0 flex-shrink-0">
                      {exp.duration ||
                        `${formatDate(exp.startDate)} — ${formatDate(exp.endDate)}`}
                    </p>
                  )}
                </div>
                {(exp.description || exp.responsibilities) && (
                  <div className="mt-2">
                    <p className="text-gray-700 text-sm leading-relaxed break-words">
                      {cleanDescription(
                        exp.description ||
                          (Array.isArray(exp.responsibilities) &&
                            exp.responsibilities.join(" ")),
                      )}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="section-card mb-8">
          <h2 className="section-heading text-2xl font-bold text-gray-900 border-b-2 border-gray-200 pb-2 mb-4 uppercase tracking-wide flex items-center gap-3">
            <FaCode className="h-5 w-5 text-blue-600 flex-shrink-0" />
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="skill-chip px-4 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                {typeof skill === "object"
                  ? skill.name || skill.language || JSON.stringify(skill)
                  : skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="section-card mb-8">
          <h2 className="section-heading text-2xl font-bold text-gray-900 border-b-2 border-gray-200 pb-2 mb-5 uppercase tracking-wide flex items-center gap-3">
            <FaProjectDiagram className="h-5 w-5 text-blue-600 flex-shrink-0" />
            Projects
          </h2>
          <div className="space-y-5">
            {projects.map((project, index) => (
              <div
                key={index}
                className="group rounded-xl border border-gray-200 bg-white p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 break-words">
                    {project.title || project.name || "Project"}
                  </h3>
                </div>

                {project.technologies && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {formatTechnologies(project.technologies).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {project.description && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 leading-relaxed break-words">
                      {cleanDescription(project.description)}
                    </p>
                  </div>
                )}

                {(project.github || project.live) && (
                  <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-4">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors break-all"
                      >
                        <FaGithub className="h-4 w-4 flex-shrink-0" /> GitHub
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors break-all"
                      >
                        <FaGlobe className="h-4 w-4 flex-shrink-0" /> Live Demo
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="section-card mb-8">
          <h2 className="section-heading text-2xl font-bold text-gray-900 border-b-2 border-gray-200 pb-2 mb-4 uppercase tracking-wide flex items-center gap-3">
            <FaCertificate className="h-5 w-5 text-blue-600 flex-shrink-0" />
            Certifications
          </h2>
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert, index) => {
              const certTitle =
                typeof cert === "object"
                  ? cert.title || cert.name || "Certification"
                  : cert;
              return (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  {cleanDescription(certTitle)}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div className="section-card mb-8">
          <h2 className="section-heading text-2xl font-bold text-gray-900 border-b-2 border-gray-200 pb-2 mb-4 uppercase tracking-wide flex items-center gap-3">
            <FaLanguage className="h-5 w-5 text-blue-600 flex-shrink-0" />
            Languages
          </h2>
          <div className="flex flex-wrap gap-3">
            {languages.map((lang, index) => {
              const langName =
                typeof lang === "object"
                  ? lang.language || lang.name || "Language"
                  : lang;
              const langLevel = typeof lang === "object" ? lang.level : "";
              return (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center gap-2"
                >
                  <span>{cleanDescription(langName)}</span>
                  {langLevel && (
                    <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full">
                      {cleanDescription(langLevel)}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Interests */}
      {interests.length > 0 && (
        <div className="section-card mb-8">
          <h2 className="section-heading text-2xl font-bold text-gray-900 border-b-2 border-gray-200 pb-2 mb-4 uppercase tracking-wide flex items-center gap-3">
            <FaHeart className="h-5 w-5 text-blue-600 flex-shrink-0" />
            Interests
          </h2>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                {cleanDescription(interest)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Hobbies */}
      {hobbies.length > 0 && (
        <div className="section-card mb-8">
          <h2 className="section-heading text-2xl font-bold text-gray-900 border-b-2 border-gray-200 pb-2 mb-4 uppercase tracking-wide flex items-center gap-3">
            <FaCog className="h-5 w-5 text-blue-600 flex-shrink-0" />
            Hobbies
          </h2>
          <div className="flex flex-wrap gap-2">
            {hobbies.map((hobby, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                {cleanDescription(hobby)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Awards */}
          {awards.length > 0 && (
            <div className="section-card">
              <h2 className="section-heading text-xl font-bold text-gray-900 border-b-2 border-gray-200 pb-2 mb-4 uppercase tracking-wide flex items-center gap-3">
                <FaAward className="h-5 w-5 text-blue-600 flex-shrink-0" />
                Awards
              </h2>
              <div className="space-y-3">
                {awards.map((award, index) => (
                  <div key={index} className="award-item">
                    <h4 className="font-bold text-gray-900 text-sm break-words">
                      {cleanDescription(award.title || "Award")}
                    </h4>
                    <p className="text-gray-600 text-xs break-words">
                      {cleanDescription(award.organization || "Organization")}
                      {award.year && ` • ${award.year}`}
                    </p>
                    {award.description && (
                      <p className="text-gray-700 text-sm mt-1 break-words">
                        {cleanDescription(award.description)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Volunteering */}
          {volunteering.length > 0 && (
            <div className="section-card">
              <h2 className="section-heading text-xl font-bold text-gray-900 border-b-2 border-gray-200 pb-2 mb-4 uppercase tracking-wide flex items-center gap-3">
                <FaHands className="h-5 w-5 text-blue-600 flex-shrink-0" />
                Volunteering
              </h2>
              <div className="space-y-3">
                {volunteering.map((vol, index) => (
                  <div key={index} className="volunteer-item">
                    <h4 className="font-bold text-gray-900 text-sm break-words">
                      {cleanDescription(vol.role || "Role")}
                    </h4>
                    <p className="text-gray-600 text-xs break-words">
                      {cleanDescription(vol.organization || "Organization")}
                      {vol.duration && ` • ${cleanDescription(vol.duration)}`}
                    </p>
                    {vol.description && (
                      <p className="text-gray-700 text-sm mt-1 break-words">
                        {cleanDescription(vol.description)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* References */}
          {references.length > 0 && (
            <div className="section-card">
              <h2 className="section-heading text-xl font-bold text-gray-900 border-b-2 border-gray-200 pb-2 mb-4 uppercase tracking-wide flex items-center gap-3">
                <FaUsers className="h-5 w-5 text-blue-600 flex-shrink-0" />
                References
              </h2>
              <div className="space-y-3">
                {references.map((ref, index) => (
                  <div key={index} className="reference-item">
                    <h4 className="font-bold text-gray-900 text-sm break-words">
                      {cleanDescription(ref.name || "Name")}
                    </h4>
                    <p className="text-gray-600 text-xs break-words">
                      {cleanDescription(ref.designation || "Designation")}
                      {ref.company && ` • ${cleanDescription(ref.company)}`}
                    </p>
                    {ref.email && (
                      <p className="text-gray-500 text-xs break-all">
                        Email: {ref.email}
                      </p>
                    )}
                    {ref.phone && (
                      <p className="text-gray-500 text-xs break-all">
                        Phone: {ref.phone}
                      </p>
                    )}
                    {ref.relationship && (
                      <p className="text-gray-500 text-xs break-words">
                        Relationship: {cleanDescription(ref.relationship)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Publications */}
      {publications.length > 0 && (
        <div className="section-card mt-8">
          <h2 className="section-heading text-2xl font-bold text-gray-900 border-b-2 border-gray-200 pb-2 mb-4 uppercase tracking-wide flex items-center gap-3">
            <FaNewspaper className="h-5 w-5 text-blue-600 flex-shrink-0" />
            Publications
          </h2>
          <div className="space-y-4">
            {publications.map((pub, index) => (
              <div
                key={index}
                className="publication-item rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <h4 className="font-bold text-gray-900 text-base break-words">
                  {cleanDescription(pub.title || "Publication")}
                </h4>
                <p className="text-gray-600 text-sm break-words">
                  {cleanDescription(pub.publisher || "Publisher")}
                  {pub.date && ` • ${formatDate(pub.date)}`}
                </p>
                {pub.authors && (
                  <p className="text-gray-500 text-xs mt-1 break-words">
                    Authors:{" "}
                    {Array.isArray(pub.authors)
                      ? pub.authors.join(", ")
                      : cleanDescription(pub.authors)}
                  </p>
                )}
                {pub.url && (
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 break-all"
                  >
                    <FaGlobe className="h-4 w-4 flex-shrink-0" /> View
                    Publication
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Sections */}
      {customSections.length > 0 && (
        <div className="section-card mt-8">
          {customSections.map((section, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <h2 className="section-heading text-2xl font-bold text-gray-900 border-b-2 border-gray-200 pb-2 mb-4 uppercase tracking-wide flex items-center gap-3">
                <FaLayerGroup className="h-5 w-5 text-blue-600 flex-shrink-0" />
                {cleanDescription(section.title || "Custom Section")}
              </h2>
              {section.content && (
                <div className="text-gray-700 text-base whitespace-pre-wrap mb-3 break-words">
                  {cleanDescription(section.content)}
                </div>
              )}
              {section.items &&
                Array.isArray(section.items) &&
                section.items.length > 0 && (
                  <ul className="space-y-1">
                    {section.items.map((item, i) => (
                      <li
                        key={i}
                        className="text-gray-700 text-sm flex items-start gap-2 break-words"
                      >
                        <span className="text-blue-600 mt-1 flex-shrink-0">
                          •
                        </span>
                        {cleanDescription(item)}
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
