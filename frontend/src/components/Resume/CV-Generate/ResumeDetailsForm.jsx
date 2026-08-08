// components/Resume/CV-Generate/ResumeDetailsForm.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaFileAlt, FaMagic } from "react-icons/fa";
import { AwardsSection, CertificationsSection, CustomSectionsSection, EducationSection, ExperienceSection, HobbiesSection, InterestsSection, LanguagesSection, ProjectsSection, PublicationsSection, ReferencesSection, SkillsSection, VolunteeringSection } from "../../sections";


// import {
//   SkillsSection,
//   ExperienceSection,
//   EducationSection,
//   ProjectsSection,
//   CertificationsSection,
//   LanguagesSection,
//   InterestsSection,
//   HobbiesSection,
//   AwardsSection,
//   PublicationsSection,
//   VolunteeringSection,
//   ReferencesSection,
//   CustomSectionsSection,
// } from "./ResumeInputFields";

export default function ResumeDetailsForm({ resumeDetails, handleChange, onGenerate, loading, dark }) {
  // Local state for dynamic fields
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  const [experience, setExperience] = useState([]);
  const [newExperience, setNewExperience] = useState({
    company: "",
    position: "",
    duration: "",
    description: ""
  });
  const [editingExpIndex, setEditingExpIndex] = useState(null);

  const [education, setEducation] = useState([]);
  const [newEducation, setNewEducation] = useState({
    institution: "",
    degree: "",
    field: "",
    year: ""
  });
  const [editingEduIndex, setEditingEduIndex] = useState(null);

  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    technologies: "",
    github: "",
    live: ""
  });
  const [editingProjectIndex, setEditingProjectIndex] = useState(null);

  const [certifications, setCertifications] = useState([]);
  const [newCertification, setNewCertification] = useState("");

  const [languages, setLanguages] = useState([]);
  const [newLanguage, setNewLanguage] = useState("");

  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState("");

  const [hobbies, setHobbies] = useState([]);
  const [newHobby, setNewHobby] = useState("");

  const [awards, setAwards] = useState([]);
  const [newAward, setNewAward] = useState({
    title: "",
    organization: "",
    year: "",
    description: ""
  });
  const [editingAwardIndex, setEditingAwardIndex] = useState(null);

  const [publications, setPublications] = useState([]);
  const [newPublication, setNewPublication] = useState({
    title: "",
    publisher: "",
    url: "",
    date: "",
    authors: ""
  });
  const [editingPubIndex, setEditingPubIndex] = useState(null);

  const [volunteering, setVolunteering] = useState([]);
  const [newVolunteering, setNewVolunteering] = useState({
    organization: "",
    role: "",
    description: "",
    duration: ""
  });
  const [editingVolIndex, setEditingVolIndex] = useState(null);

  const [references, setReferences] = useState([]);
  const [newReference, setNewReference] = useState({
    name: "",
    designation: "",
    company: "",
    email: "",
    phone: "",
    relationship: ""
  });
  const [editingRefIndex, setEditingRefIndex] = useState(null);

  const [customSections, setCustomSections] = useState([]);
  const [newCustomSection, setNewCustomSection] = useState({
    title: "",
    content: "",
    items: ""
  });
  const [editingCustomIndex, setEditingCustomIndex] = useState(null);

  const isInitialized = useRef(false);

  // ============================================
  // HELPER FUNCTIONS (Same as original)
  // ============================================
  const extractSkillsFromObject = (skillsData) => {
    if (!skillsData) return [];
    if (Array.isArray(skillsData)) return skillsData;
    if (typeof skillsData === 'string') {
      return skillsData.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (typeof skillsData === 'object') {
      const allSkills = [];
      Object.values(skillsData).forEach(value => {
        if (Array.isArray(value)) {
          allSkills.push(...value);
        }
      });
      return allSkills;
    }
    return [];
  };

  const parseStructuredData = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        const lines = data.split('\n').filter(l => l.trim());
        const result = [];
        let current = {};
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.includes(':')) {
            const colonIndex = trimmed.indexOf(':');
            const key = trimmed.substring(0, colonIndex).trim();
            const value = trimmed.substring(colonIndex + 1).trim();
            if (value) {
              const keyLower = key.toLowerCase();
              if (['company', 'institution', 'title', 'project', 'name', 'organization', 'publisher', 'role', 'position'].includes(keyLower)) {
                if (Object.keys(current).length > 0) {
                  result.push({ ...current });
                }
                current = { [keyLower]: value };
              } else {
                current[keyLower] = value;
              }
            }
          } else if (Object.keys(current).length > 0 && trimmed) {
            if (current.description) {
              current.description += ' ' + trimmed;
            } else if (current.details) {
              current.details += ' ' + trimmed;
            } else {
              current.description = trimmed;
            }
          }
        }
        if (Object.keys(current).length > 0) {
          result.push({ ...current });
        }
        return result.length > 0 ? result : [];
      }
    }
    return [];
  };

  const parseCustomSections = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        const lines = data.split('\n').filter(l => l.trim());
        const result = [];
        let current = { title: "", content: "", items: [] };
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.includes(':')) {
            const colonIndex = trimmed.indexOf(':');
            const key = trimmed.substring(0, colonIndex).trim().toLowerCase();
            const value = trimmed.substring(colonIndex + 1).trim();
            if (key === 'title' || key === 'section') {
              if (current.title) {
                result.push({ ...current });
              }
              current = { title: value, content: "", items: [] };
            } else if (key === 'content' || key === 'description') {
              current.content = value;
            } else if (key === 'items' || key === 'item') {
              if (value) {
                current.items.push(value);
              }
            }
          } else if (current.title && trimmed) {
            if (current.content) {
              current.content += ' ' + trimmed;
            } else {
              current.content = trimmed;
            }
          }
        }
        if (current.title) {
          result.push({ ...current });
        }
        return result.length > 0 ? result : [];
      }
    }
    return [];
  };

  // ============================================
  // INITIALIZE FROM PROPS (Same as original)
  // ============================================
  useEffect(() => {
    if (resumeDetails && Object.keys(resumeDetails).length > 0 && !isInitialized.current) {
      isInitialized.current = true;
      
      if (resumeDetails.skills) {
        const skillsArray = extractSkillsFromObject(resumeDetails.skills);
        setSkills(skillsArray);
      }
      if (resumeDetails.workExperience) {
        const expArray = parseStructuredData(resumeDetails.workExperience);
        setExperience(expArray);
      }
      if (resumeDetails.education) {
        const eduArray = parseStructuredData(resumeDetails.education);
        setEducation(eduArray);
      }
      if (resumeDetails.projects) {
        const projArray = parseStructuredData(resumeDetails.projects);
        setProjects(projArray);
      }
      if (resumeDetails.certifications) {
        const certArray = typeof resumeDetails.certifications === 'string'
          ? resumeDetails.certifications.split(',').map(s => s.trim()).filter(Boolean)
          : Array.isArray(resumeDetails.certifications) ? resumeDetails.certifications : [];
        setCertifications(certArray);
      }
      if (resumeDetails.languages) {
        const langArray = typeof resumeDetails.languages === 'string'
          ? resumeDetails.languages.split(',').map(s => s.trim()).filter(Boolean)
          : Array.isArray(resumeDetails.languages) ? resumeDetails.languages : [];
        setLanguages(langArray);
      }
      if (resumeDetails.interests) {
        const interestArray = typeof resumeDetails.interests === 'string'
          ? resumeDetails.interests.split(',').map(s => s.trim()).filter(Boolean)
          : Array.isArray(resumeDetails.interests) ? resumeDetails.interests : [];
        setInterests(interestArray);
      }
      if (resumeDetails.hobbies) {
        const hobbyArray = typeof resumeDetails.hobbies === 'string'
          ? resumeDetails.hobbies.split(',').map(s => s.trim()).filter(Boolean)
          : Array.isArray(resumeDetails.hobbies) ? resumeDetails.hobbies : [];
        setHobbies(hobbyArray);
      }
      if (resumeDetails.awards) {
        const awardArray = parseStructuredData(resumeDetails.awards);
        setAwards(awardArray);
      }
      if (resumeDetails.publications) {
        const pubArray = parseStructuredData(resumeDetails.publications);
        setPublications(pubArray);
      }
      if (resumeDetails.volunteering) {
        const volArray = parseStructuredData(resumeDetails.volunteering);
        setVolunteering(volArray);
      }
      if (resumeDetails.references) {
        const refArray = parseStructuredData(resumeDetails.references);
        setReferences(refArray);
      }
      if (resumeDetails.customSections) {
        const customArray = parseCustomSections(resumeDetails.customSections);
        setCustomSections(customArray);
      }
    }
    if (resumeDetails && Object.keys(resumeDetails).length === 0) {
      isInitialized.current = false;
    }
  }, [resumeDetails]);

  // ============================================
  // SYNC ALL DATA TO PARENT (Same as original)
  // ============================================
  useEffect(() => {
    const skillsString = skills.join(', ');
    handleChange({ target: { name: 'skills', value: skillsString } });
  }, [skills]);

  useEffect(() => {
    const expString = experience.map(exp =>
      `Company: ${exp.company || ''}\nPosition: ${exp.position || ''}\nDuration: ${exp.duration || ''}\nDescription: ${exp.description || ''}`
    ).join('\n\n');
    handleChange({ target: { name: 'workExperience', value: expString } });
  }, [experience]);

  useEffect(() => {
    const eduString = education.map(edu =>
      `Institution: ${edu.institution || ''}\nDegree: ${edu.degree || ''}\nField: ${edu.field || ''}\nYear: ${edu.year || ''}`
    ).join('\n\n');
    handleChange({ target: { name: 'education', value: eduString } });
  }, [education]);

  useEffect(() => {
    const projString = projects.map(proj =>
      `Project: ${proj.name || proj.title || ''}\nTechnologies: ${proj.technologies || ''}\nDescription: ${proj.description || ''}\nGitHub: ${proj.github || ''}\nLive: ${proj.live || ''}`
    ).join('\n\n');
    handleChange({ target: { name: 'projects', value: projString } });
  }, [projects]);

  useEffect(() => {
    const certString = certifications.join(', ');
    handleChange({ target: { name: 'certifications', value: certString } });
  }, [certifications]);

  useEffect(() => {
    const langString = languages.join(', ');
    handleChange({ target: { name: 'languages', value: langString } });
  }, [languages]);

  useEffect(() => {
    const interestsString = interests.join(', ');
    handleChange({ target: { name: 'interests', value: interestsString } });
  }, [interests]);

  useEffect(() => {
    const hobbiesString = hobbies.join(', ');
    handleChange({ target: { name: 'hobbies', value: hobbiesString } });
  }, [hobbies]);

  useEffect(() => {
    const awardsString = awards.map(award =>
      `Title: ${award.title || ''}\nOrganization: ${award.organization || ''}\nYear: ${award.year || ''}\nDescription: ${award.description || ''}`
    ).join('\n\n');
    handleChange({ target: { name: 'awards', value: awardsString } });
  }, [awards]);

  useEffect(() => {
    const pubsString = publications.map(pub =>
      `Title: ${pub.title || ''}\nPublisher: ${pub.publisher || ''}\nURL: ${pub.url || ''}\nDate: ${pub.date || ''}\nAuthors: ${pub.authors || ''}`
    ).join('\n\n');
    handleChange({ target: { name: 'publications', value: pubsString } });
  }, [publications]);

  useEffect(() => {
    const volString = volunteering.map(vol =>
      `Organization: ${vol.organization || ''}\nRole: ${vol.role || ''}\nDuration: ${vol.duration || ''}\nDescription: ${vol.description || ''}`
    ).join('\n\n');
    handleChange({ target: { name: 'volunteering', value: volString } });
  }, [volunteering]);

  useEffect(() => {
    const refString = references.map(ref =>
      `Name: ${ref.name || ''}\nDesignation: ${ref.designation || ''}\nCompany: ${ref.company || ''}\nEmail: ${ref.email || ''}\nPhone: ${ref.phone || ''}\nRelationship: ${ref.relationship || ''}`
    ).join('\n\n');
    handleChange({ target: { name: 'references', value: refString } });
  }, [references]);

  useEffect(() => {
    const customString = customSections.map(section =>
      `Title: ${section.title || ''}\nContent: ${section.content || ''}\nItems: ${Array.isArray(section.items) ? section.items.join(', ') : section.items || ''}`
    ).join('\n\n');
    handleChange({ target: { name: 'customSections', value: customString } });
  }, [customSections]);

  // ============================================
  // Generate Handler
  // ============================================
  const handleGenerate = () => {
    const summaryText = document.querySelector('textarea[name="summary"]')?.value || resumeDetails.summary || "";
    if (summaryText !== resumeDetails.summary) {
      handleChange({ target: { name: 'summary', value: summaryText } });
    }

    console.log('📤 Data being sent to backend:', {
      summary: resumeDetails.summary,
      skills: resumeDetails.skills,
      workExperience: resumeDetails.workExperience,
      education: resumeDetails.education,
      projects: resumeDetails.projects,
      certifications: resumeDetails.certifications,
      languages: resumeDetails.languages,
      interests: resumeDetails.interests,
      hobbies: resumeDetails.hobbies,
      awards: resumeDetails.awards,
      publications: resumeDetails.publications,
      volunteering: resumeDetails.volunteering,
      references: resumeDetails.references,
      customSections: resumeDetails.customSections,
    });

    if (onGenerate) {
      onGenerate();
    } else {
      console.warn('⚠️ onGenerate prop is not provided');
    }
  };

  // ============================================
  // STYLES (Same as original)
  // ============================================
  const inputStyle = `w-full rounded-xl border px-4 py-3 outline-none transition-all
    ${dark
      ? "border-white/10 bg-black text-white placeholder:text-gray-500 focus:border-white"
      : "border-gray-300 bg-white text-black placeholder:text-gray-400 focus:border-black"
    }
  `;

  const cardStyle = `rounded-2xl border p-5 transition-all
    ${dark
      ? "border-white/10 bg-white/[0.03]"
      : "border-gray-200 bg-gray-50"
    }
  `;

  const labelStyle = `block text-sm font-semibold mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`;

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="space-y-6 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center gap-3 scrollbar-hide">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${dark ? "bg-white text-black" : "bg-black text-white"}`}>
          <FaFileAlt />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Resume Details</h2>
          <p className={`mt-1 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            Add your details below. Each section supports multiple entries.
          </p>
        </div>
      </div>

      <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
        {/* ====== PROFESSIONAL SUMMARY ====== */}
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

      <SkillsSection 
  skills={skills} setSkills={setSkills}
  newSkill={newSkill} setNewSkill={setNewSkill}
  dark={dark} inputStyle={inputStyle}
  cardStyle={cardStyle}  // ← ADD
/>

        <ExperienceSection 
          experience={experience} setExperience={setExperience}
          newExperience={newExperience} setNewExperience={setNewExperience}
          editingExpIndex={editingExpIndex} setEditingExpIndex={setEditingExpIndex}
          dark={dark} inputStyle={inputStyle} labelStyle={labelStyle} cardStyle={cardStyle}
        />

        <EducationSection 
          education={education} setEducation={setEducation}
          newEducation={newEducation} setNewEducation={setNewEducation}
          editingEduIndex={editingEduIndex} setEditingEduIndex={setEditingEduIndex}
          dark={dark} inputStyle={inputStyle} labelStyle={labelStyle} cardStyle={cardStyle}
        />

        <ProjectsSection 
          projects={projects} setProjects={setProjects}
          newProject={newProject} setNewProject={setNewProject}
          editingProjectIndex={editingProjectIndex} setEditingProjectIndex={setEditingProjectIndex}
          dark={dark} inputStyle={inputStyle} labelStyle={labelStyle} cardStyle={cardStyle}
        />

        <CertificationsSection 
          certifications={certifications} setCertifications={setCertifications}
          newCertification={newCertification} setNewCertification={setNewCertification}
          dark={dark} inputStyle={inputStyle}
        />

        <LanguagesSection 
          languages={languages} setLanguages={setLanguages}
          newLanguage={newLanguage} setNewLanguage={setNewLanguage}
          dark={dark} inputStyle={inputStyle}
        />

        <InterestsSection 
          interests={interests} setInterests={setInterests}
          newInterest={newInterest} setNewInterest={setNewInterest}
          dark={dark} inputStyle={inputStyle}
        />

        <HobbiesSection 
          hobbies={hobbies} setHobbies={setHobbies}
          newHobby={newHobby} setNewHobby={setNewHobby}
          dark={dark} inputStyle={inputStyle}
        />

        <AwardsSection 
          awards={awards} setAwards={setAwards}
          newAward={newAward} setNewAward={setNewAward}
          editingAwardIndex={editingAwardIndex} setEditingAwardIndex={setEditingAwardIndex}
          dark={dark} inputStyle={inputStyle} labelStyle={labelStyle} cardStyle={cardStyle}
        />

        <PublicationsSection 
          publications={publications} setPublications={setPublications}
          newPublication={newPublication} setNewPublication={setNewPublication}
          editingPubIndex={editingPubIndex} setEditingPubIndex={setEditingPubIndex}
          dark={dark} inputStyle={inputStyle} labelStyle={labelStyle} cardStyle={cardStyle}
        />

        <VolunteeringSection 
          volunteering={volunteering} setVolunteering={setVolunteering}
          newVolunteering={newVolunteering} setNewVolunteering={setNewVolunteering}
          editingVolIndex={editingVolIndex} setEditingVolIndex={setEditingVolIndex}
          dark={dark} inputStyle={inputStyle} labelStyle={labelStyle} cardStyle={cardStyle}
        />

        <ReferencesSection 
          references={references} setReferences={setReferences}
          newReference={newReference} setNewReference={setNewReference}
          editingRefIndex={editingRefIndex} setEditingRefIndex={setEditingRefIndex}
          dark={dark} inputStyle={inputStyle} labelStyle={labelStyle} cardStyle={cardStyle}
        />

        <CustomSectionsSection 
          customSections={customSections} setCustomSections={setCustomSections}
          newCustomSection={newCustomSection} setNewCustomSection={setNewCustomSection}
          editingCustomIndex={editingCustomIndex} setEditingCustomIndex={setEditingCustomIndex}
          dark={dark} inputStyle={inputStyle} labelStyle={labelStyle} cardStyle={cardStyle}
        />
      </div>
    </div>
  );
}