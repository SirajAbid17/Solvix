
import React from "react";
import {
  FaMagic,
  FaCode,
  FaCertificate,
  FaLanguage,
} from "react-icons/fa";

export default function BasicInfoSection({
  dark,
  inputStyle,
  cardStyle,
  labelStyle,
  resumeDetails,
  handleChange,
  skills,
  setSkills,
  newSkill,
  setNewSkill,
  addSkill,
  removeSkill,
  handleSkillKeyPress,
  certifications,
  setCertifications,
  newCertification,
  setNewCertification,
  addCertification,
  removeCertification,
  handleCertificationKeyPress,
  languages,
  setLanguages,
  newLanguage,
  setNewLanguage,
  addLanguage,
  removeLanguage,
  handleLanguageKeyPress,
}) {
  return (
    <>
      {}
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
          className={`${inputStyle} scrollbar-hide resize-none`}
          value={resumeDetails.summary || ""}
          onChange={handleChange}
        />
      </div>

      
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
            <span className="text-sm">+</span> Add
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
                <span className="text-xs">✕</span>
              </button>
            </span>
          ))}
        </div>
      </div>

      {}
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
            <span className="text-sm">+</span> Add
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
                <span className="text-xs">✕</span>
              </button>
            </span>
          ))}
        </div>
      </div>

      {}
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
            <span className="text-sm">+</span> Add
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
                <span className="text-xs">✕</span>
              </button>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}