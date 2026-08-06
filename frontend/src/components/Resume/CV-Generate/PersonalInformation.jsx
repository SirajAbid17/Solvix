// components/Resume/CV-Generate/PersonalInformation.jsx
import React from "react";
import { FaUser, FaUpload } from "react-icons/fa";

export default function PersonalInformation({ 
  personalInfo, 
  handleChange, 
  handleFileChange, 
  profileImage,
  dark 
}) {
  const inputStyle = `
    w-full border px-4 py-3 rounded-xl transition-all outline-none
    ${dark
      ? "border-white/10 bg-black text-white placeholder:text-gray-500 focus:border-white"
      : "border-gray-300 bg-white text-black placeholder:text-gray-400 focus:border-black"
    }
  `;

  const labelStyle = `mb-2 block text-sm font-semibold ${dark ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <div
      className={`p-6 rounded-2xl transition-all ${
        dark
          ? "border border-white/10 bg-white/[0.03] text-white"
          : "border border-gray-200 bg-white text-black shadow-sm"
      }`}
    >
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            dark ? "bg-white text-black" : "bg-black text-white"
          }`}
        >
          <FaUser />
        </div>

        <div>
          <h2 className="text-2xl font-bold">Personal Information</h2>
          <p className={`mt-1 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            Fill in your personal details for your resume.
          </p>
        </div>
      </div>

      {/* Profile Image */}
      <div className="mb-8 flex justify-center">
        <label
          className={`relative flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed transition overflow-hidden ${
            dark
              ? "border-white/20 hover:border-white"
              : "border-gray-300 hover:border-black"
          }`}
        >
          {profileImage ? (
            <>
              <img
                src={typeof profileImage === 'string' ? profileImage : URL.createObjectURL(profileImage)}
                alt="Profile"
                className="h-full w-full rounded-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition">
                <FaUpload className="text-white text-xl" />
              </div>
            </>
          ) : (
            <>
              <FaUser className="mb-2 text-3xl text-gray-400" />
              <span className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                Upload Photo
              </span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className={labelStyle}>Full Name *</label>
          <input
            type="text"
            name="fullName"
            placeholder="John Doe"
            className={inputStyle}
            value={personalInfo.fullName || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className={labelStyle}>Job Title</label>
          <input
            type="text"
            name="jobTitle"
            placeholder="Full Stack Developer"
            className={inputStyle}
            value={personalInfo.jobTitle || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className={labelStyle}>Email</label>
          <input
            type="email"
            name="email"
            placeholder="john@gmail.com"
            className={inputStyle}
            value={personalInfo.email || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className={labelStyle}>Phone</label>
          <input
            type="text"
            name="phone"
            placeholder="+92 300 1234567"
            className={inputStyle}
            value={personalInfo.phone || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className={labelStyle}>Country</label>
          <input
            type="text"
            name="country"
            placeholder="Pakistan"
            className={inputStyle}
            value={personalInfo.country || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className={labelStyle}>City</label>
          <input
            type="text"
            name="city"
            placeholder="Lahore"
            className={inputStyle}
            value={personalInfo.city || ''}
            onChange={handleChange}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelStyle}>Address</label>
          <input
            type="text"
            name="address"
            placeholder="Street, Area, City"
            className={inputStyle}
            value={personalInfo.address || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className={labelStyle}>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            className={inputStyle}
            value={personalInfo.dateOfBirth || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className={labelStyle}>Nationality</label>
          <input
            type="text"
            name="nationality"
            placeholder="Pakistani"
            className={inputStyle}
            value={personalInfo.nationality || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className={labelStyle}>LinkedIn</label>
          <input
            type="url"
            name="linkedin"
            placeholder="https://linkedin.com/in/username"
            className={inputStyle}
            value={personalInfo.linkedin || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className={labelStyle}>GitHub</label>
          <input
            type="url"
            name="github"
            placeholder="https://github.com/username"
            className={inputStyle}
            value={personalInfo.github || ''}
            onChange={handleChange}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelStyle}>Portfolio Website</label>
          <input
            type="url"
            name="portfolio"
            placeholder="https://yourportfolio.com"
            className={inputStyle}
            value={personalInfo.portfolio || ''}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}