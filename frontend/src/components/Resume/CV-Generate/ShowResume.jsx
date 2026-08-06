// components/Resume/CV-Generate/ShowResume.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../../BgContext/ThemeContext";
import { getCVById, deleteCV, removeProfileImage } from "../../../Features/CVcreate";
import { toast } from "react-hot-toast";
import { 
  FaEdit, 
  FaFilePdf, 
  FaTrash, 
  FaImage, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaUser,
  FaBriefcase,
  FaGraduationCap,
  FaProjectDiagram,
  FaCertificate,
  FaLanguage,
  FaCode,
  FaSpinner
} from "react-icons/fa";
import ResumeFooter from "../ResumeFooter";
import ResumeHeader from "../ResumeHeader";

export default function ShowResume() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dark } = useTheme();
  const resumeRef = useRef(null);

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadResume();
  }, [id]);

  const loadResume = async () => {
    try {
      setLoading(true);
      const response = await getCVById(id);
      setResume(response.data);
    } catch (err) {
      console.error('Error loading resume:', err);
      setError('Failed to load resume');
      toast.error('Failed to load resume');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    
    try {
      await deleteCV(id);
      toast.success('Resume deleted successfully');
      navigate('/resume');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete resume');
    }
  };

  const handleRemoveImage = async () => {
    if (!window.confirm('Remove profile image?')) return;
    
    try {
      await removeProfileImage(id);
      toast.success('Image removed successfully');
      loadResume();
    } catch (error) {
      console.error('Remove image error:', error);
      toast.error('Failed to remove image');
    }
  };

  // Print/Save as PDF
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to print');
      return;
    }

    const content = resumeRef.current;
    const styles = document.querySelector('style')?.innerHTML || '';
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${resume?.fullName || 'Resume'}</title>
          <style>
            ${styles}
            body { 
              padding: 40px; 
              background: white; 
              color: black;
              font-family: Arial, sans-serif;
            }
            * { 
              color: black !important;
              background-color: white !important;
              background-image: none !important;
              box-shadow: none !important;
            }
            .rounded-2xl { 
              background: white !important;
              border: 1px solid #e5e7eb !important;
            }
            .text-gray-600 { color: #4b5563 !important; }
            .text-gray-500 { color: #6b7280 !important; }
            .text-gray-400 { color: #9ca3af !important; }
            .bg-gray-50 { background: #f9fafb !important; }
            .bg-gray-200 { background: #e5e7eb !important; }
            a { color: #2563eb !important; }
            .border-gray-200 { border-color: #e5e7eb !important; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 1000);
            }
          <\/script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <FaSpinner className="mb-4 h-12 w-12 animate-spin text-gray-400 mx-auto" />
          <p className="text-lg font-semibold">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl font-semibold">{error}</p>
          <button 
            onClick={loadResume}
            className="mt-4 rounded-lg bg-black px-6 py-2 text-white hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl">Resume not found</p>
      </div>
    );
  }

  // Parse data
  const aiData = resume.ai || {};

  let skills = [];
  if (aiData.skills && Array.isArray(aiData.skills)) {
    skills = aiData.skills;
  } else if (resume.skills) {
    skills = typeof resume.skills === 'string' 
      ? resume.skills.split(',').map(s => s.trim()).filter(Boolean)
      : [];
  }

  let experience = [];
  if (aiData.workExperience && Array.isArray(aiData.workExperience)) {
    experience = aiData.workExperience;
  } else if (resume.workExperience && typeof resume.workExperience === 'string') {
    const lines = resume.workExperience.split('\n').filter(l => l.trim());
    if (lines.length > 0) {
      experience = [{
        company: lines[0] || 'Not specified',
        position: lines[1] || 'Not specified',
        duration: lines[2] || 'Not specified',
        description: lines.slice(3).join('\n') || 'Not specified'
      }];
    }
  }

  let education = [];
  if (aiData.education && Array.isArray(aiData.education)) {
    education = aiData.education;
  } else if (resume.education && typeof resume.education === 'string') {
    education = [{
      institution: resume.education || 'Not specified',
      degree: 'Not specified',
      field: 'Not specified',
      year: 'Not specified'
    }];
  }

  let projects = [];
  if (aiData.projects && Array.isArray(aiData.projects)) {
    projects = aiData.projects;
  } else if (resume.projects && typeof resume.projects === 'string') {
    projects = [{
      name: 'Project',
      description: resume.projects,
      technologies: '',
      link: ''
    }];
  }

  let certifications = [];
  if (aiData.certifications && Array.isArray(aiData.certifications)) {
    certifications = aiData.certifications;
  } else if (resume.certifications && typeof resume.certifications === 'string') {
    certifications = resume.certifications.split('\n').filter(c => c.trim());
  }

  let languages = [];
  if (aiData.languages && Array.isArray(aiData.languages)) {
    languages = aiData.languages;
  } else if (resume.languages && typeof resume.languages === 'string') {
    languages = resume.languages.split('\n').filter(l => l.trim());
  }

  const summary = aiData.professionalSummary || resume.summary || '';

  return (
    <>
      <ResumeHeader />
      <div className={`min-h-screen p-4 md:p-8 ${dark ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="mx-auto max-w-4xl">
          {/* Action Buttons */}
          <div className="mb-4 flex flex-wrap justify-end gap-2">
            <button
              onClick={() => navigate(`/cv-generator?edit=${id}`)}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 transition flex items-center gap-2"
            >
              <FaEdit className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={handlePrint}
              className="rounded-lg bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600 transition flex items-center gap-2"
            >
              <FaFilePdf className="h-4 w-4" />
              Download PDF
            </button>
            <button
              onClick={handleRemoveImage}
              className="rounded-lg bg-yellow-500 px-4 py-2 text-sm text-white hover:bg-yellow-600 transition flex items-center gap-2"
            >
              <FaImage className="h-4 w-4" />
              Remove Image
            </button>
            <button
              onClick={handleDelete}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 transition flex items-center gap-2"
            >
              <FaTrash className="h-4 w-4" />
              Delete
            </button>
          </div>

          {/* Resume Content */}
          <div 
            ref={resumeRef}
            className="rounded-2xl p-6 md:p-8 bg-white shadow-lg"
            style={{ backgroundColor: '#ffffff', color: '#000000' }}
          >
            {/* Header */}
            <div className="mb-6 flex flex-col items-start gap-4 border-b border-gray-200 pb-6 md:flex-row">
              {resume.profileImage?.url ? (
                <img
                  src={resume.profileImage.url}
                  alt={resume.profileImage.alt || 'Profile'}
                  className="h-24 w-24 md:h-32 md:w-32 rounded-full object-cover border-4 border-gray-200"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200">
                  <FaUser className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-2xl md:text-4xl font-bold text-black">
                  {resume.fullName || 'Full Name'}
                </h1>
                <p className="text-base md:text-xl text-gray-600">{resume.jobTitle || 'Job Title'}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                  {resume.email && (
                    <span className="flex items-center gap-1">
                      <FaEnvelope className="h-3 w-3" /> {resume.email}
                    </span>
                  )}
                  {resume.phone && (
                    <span className="flex items-center gap-1">
                      <FaPhone className="h-3 w-3" /> {resume.phone}
                    </span>
                  )}
                  {resume.city && resume.country && (
                    <span className="flex items-center gap-1">
                      <FaMapMarkerAlt className="h-3 w-3" /> {resume.city}, {resume.country}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-3">
                  {resume.linkedin && (
                    <a href={resume.linkedin} target="_blank" rel="noopener noreferrer" 
                       className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                      <FaLinkedin className="h-3 w-3" /> LinkedIn
                    </a>
                  )}
                  {resume.github && (
                    <a href={resume.github} target="_blank" rel="noopener noreferrer"
                       className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                      <FaGithub className="h-3 w-3" /> GitHub
                    </a>
                  )}
                  {resume.portfolio && (
                    <a href={resume.portfolio} target="_blank" rel="noopener noreferrer"
                       className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                      <FaGlobe className="h-3 w-3" /> Portfolio
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Summary */}
            {summary && (
              <div className="mb-6">
                <h2 className="mb-2 text-xl md:text-2xl font-bold text-black flex items-center gap-2">
                  <FaUser className="h-5 w-5 text-gray-600" />
                  Professional Summary
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">{summary}</p>
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-2 text-xl md:text-2xl font-bold text-black flex items-center gap-2">
                  <FaCode className="h-5 w-5 text-gray-600" />
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-full px-3 py-1.5 text-xs md:text-sm bg-gray-200 text-gray-800"
                    >
                      {typeof skill === 'object' ? skill.language || skill.name || JSON.stringify(skill) : skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-2 text-xl md:text-2xl font-bold text-black flex items-center gap-2">
                  <FaBriefcase className="h-5 w-5 text-gray-600" />
                  Work Experience
                </h2>
                <div className="space-y-3">
                  {experience.map((exp, index) => (
                    <div key={index} className="rounded-lg p-3 md:p-4 bg-gray-50">
                      <h3 className="text-base md:text-lg font-semibold text-black">
                        {exp.position || 'Position'}
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base">{exp.company || 'Company'}</p>
                      {exp.duration && <p className="text-xs md:text-sm text-gray-500">{exp.duration}</p>}
                      {exp.startDate && exp.endDate && (
                        <p className="text-xs md:text-sm text-gray-500">{exp.startDate} - {exp.endDate}</p>
                      )}
                      {exp.description && (
                        <p className="mt-2 text-gray-700 text-sm md:text-base">{exp.description}</p>
                      )}
                      {exp.responsibilities && Array.isArray(exp.responsibilities) && (
                        <ul className="mt-2 list-disc pl-5">
                          {exp.responsibilities.map((resp, i) => (
                            <li key={i} className="text-gray-700 text-sm md:text-base">{resp}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-2 text-xl md:text-2xl font-bold text-black flex items-center gap-2">
                  <FaGraduationCap className="h-5 w-5 text-gray-600" />
                  Education
                </h2>
                <div className="space-y-3">
                  {education.map((edu, index) => (
                    <div key={index} className="rounded-lg p-3 md:p-4 bg-gray-50">
                      <h3 className="text-base md:text-lg font-semibold text-black">
                        {edu.degree || 'Degree'}
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base">{edu.institution || 'Institution'}</p>
                      {edu.field && <p className="text-xs md:text-sm text-gray-500">{edu.field}</p>}
                      {edu.year && <p className="text-xs md:text-sm text-gray-500">{edu.year}</p>}
                      {edu.startDate && edu.endDate && (
                        <p className="text-xs md:text-sm text-gray-500">{edu.startDate} - {edu.endDate}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-2 text-xl md:text-2xl font-bold text-black flex items-center gap-2">
                  <FaProjectDiagram className="h-5 w-5 text-gray-600" />
                  Projects
                </h2>
                <div className="space-y-3">
                  {projects.map((project, index) => (
                    <div key={index} className="rounded-lg p-3 md:p-4 bg-gray-50">
                      <h3 className="text-base md:text-lg font-semibold text-black">
                        {project.title || project.name || 'Project'}
                      </h3>
                      <p className="text-gray-700 text-sm md:text-base">{project.description}</p>
                      {project.technologies && Array.isArray(project.technologies) && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {project.technologies.map((tech, i) => (
                            <span key={i} className="text-xs md:text-sm text-gray-600">#{tech}</span>
                          ))}
                        </div>
                      )}
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer"
                           className="mt-2 inline-block text-xs md:text-sm text-blue-600 hover:underline">
                          GitHub →
                        </a>
                      )}
                      {project.live && (
                        <a href={project.live} target="_blank" rel="noopener noreferrer"
                           className="mt-2 ml-3 inline-block text-xs md:text-sm text-blue-600 hover:underline">
                          Live Demo →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-2 text-xl md:text-2xl font-bold text-black flex items-center gap-2">
                  <FaCertificate className="h-5 w-5 text-gray-600" />
                  Certifications
                </h2>
                <ul className="list-disc pl-6 space-y-1">
                  {certifications.map((cert, index) => (
                    <li key={index} className="text-gray-700 text-sm md:text-base">
                      {typeof cert === 'object' ? cert.title || cert.language || JSON.stringify(cert) : cert}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-2 text-xl md:text-2xl font-bold text-black flex items-center gap-2">
                  <FaLanguage className="h-5 w-5 text-gray-600" />
                  Languages
                </h2>
                <ul className="list-disc pl-6 space-y-1">
                  {languages.map((lang, index) => (
                    <li key={index} className="text-gray-700 text-sm md:text-base">
                      {typeof lang === 'object' ? lang.language || lang.name || JSON.stringify(lang) : lang}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <ResumeFooter />
    </>
  );
}