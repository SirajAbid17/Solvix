// pages/CVGenerate.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ResumeHeader from '../components/Resume/ResumeHeader';
import ResumeFooter from '../components/Resume/ResumeFooter';
import PersonalInformation from '../components/Resume/CV-Generate/PersonalInformation';
import ResumeDetailsForm from '../components/Resume/CV-Generate/ResumeDetailsForm';
import { createCV, updateCV } from '../Features/CVcreate';
import { useTheme } from '../BgContext/ThemeContext';

export default function CVGenerate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dark } = useTheme();
  const [loading, setLoading] = useState(false);
  
  // Check if in edit mode
  const editMode = location.state?.editMode || false;
  const existingResume = location.state?.resumeData || null;

  // Form state
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    address: '',
    dateOfBirth: '',
    nationality: '',
    linkedin: '',
    github: '',
    portfolio: ''
  });

  const [resumeDetails, setResumeDetails] = useState({
    summary: '',
    skills: '',
    workExperience: '',
    education: '',
    projects: '',
    certifications: '',
    languages: '',
    interests: '',
    hobbies: '',
    awards: '',
    publications: '',
    volunteering: '',
    references: ''
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  
  useEffect(() => {
    if (editMode && existingResume) {
      const personal = existingResume.personal || {};
      const social = existingResume.social || {};
      
      // Set personal info
      setPersonalInfo({
        fullName: personal.fullName || '',
        jobTitle: personal.jobTitle || '',
        email: personal.email || '',
        phone: personal.phone || '',
        country: personal.country || '',
        city: personal.city || '',
        address: personal.address || '',
        dateOfBirth: personal.dateOfBirth || '',
        nationality: personal.nationality || '',
        linkedin: social.linkedin || '',
        github: social.github || '',
        portfolio: social.portfolio || ''
      });

      // Set profile image preview
      if (existingResume.profileImage?.url) {
        setProfilePreview(existingResume.profileImage.url);
      }

      // Set resume details - extract from the resume data
      const skills = Array.isArray(existingResume.skills) 
        ? existingResume.skills.join(', ') 
        : '';

      const workExperience = Array.isArray(existingResume.workExperience)
        ? existingResume.workExperience.map(exp => 
            `Company: ${exp.company || ''}\nPosition: ${exp.position || ''}\nDuration: ${exp.duration || ''}\nDescription: ${exp.description || ''}`
          ).join('\n\n')
        : '';

      const education = Array.isArray(existingResume.education)
        ? existingResume.education.map(edu =>
            `Institution: ${edu.institution || ''}\nDegree: ${edu.degree || ''}\nField: ${edu.field || ''}\nYear: ${edu.year || ''}`
          ).join('\n\n')
        : '';

      const projects = Array.isArray(existingResume.projects)
        ? existingResume.projects.map(proj =>
            `Project: ${proj.title || proj.name || ''}\nTechnologies: ${proj.technologies || ''}\nDescription: ${proj.description || ''}\nGitHub: ${proj.github || ''}\nLive: ${proj.live || ''}`
          ).join('\n\n')
        : '';

      const certifications = Array.isArray(existingResume.certifications)
        ? existingResume.certifications.map(cert => 
            typeof cert === 'object' ? cert.title || cert.name || '' : cert
          ).join(', ')
        : '';

      const languages = Array.isArray(existingResume.languages)
        ? existingResume.languages.map(lang =>
            typeof lang === 'object' ? lang.language || lang.name || '' : lang
          ).join(', ')
        : '';

      const interests = Array.isArray(existingResume.interests)
        ? existingResume.interests.join(', ')
        : '';

      const hobbies = Array.isArray(existingResume.hobbies)
        ? existingResume.hobbies.join(', ')
        : '';

      const awards = Array.isArray(existingResume.awards)
        ? existingResume.awards.map(award =>
            `Title: ${award.title || ''}\nOrganization: ${award.organization || ''}\nYear: ${award.year || ''}\nDescription: ${award.description || ''}`
          ).join('\n\n')
        : '';

      const publications = Array.isArray(existingResume.publications)
        ? existingResume.publications.map(pub =>
            `Title: ${pub.title || ''}\nPublisher: ${pub.publisher || ''}\nURL: ${pub.url || ''}\nDate: ${pub.date || ''}\nAuthors: ${pub.authors || ''}`
          ).join('\n\n')
        : '';

      const volunteering = Array.isArray(existingResume.volunteering)
        ? existingResume.volunteering.map(vol =>
            `Organization: ${vol.organization || ''}\nRole: ${vol.role || ''}\nDuration: ${vol.duration || ''}\nDescription: ${vol.description || ''}`
          ).join('\n\n')
        : '';

      const references = Array.isArray(existingResume.references)
        ? existingResume.references.map(ref =>
            `Name: ${ref.name || ''}\nDesignation: ${ref.designation || ''}\nCompany: ${ref.company || ''}\nEmail: ${ref.email || ''}\nPhone: ${ref.phone || ''}\nRelationship: ${ref.relationship || ''}`
          ).join('\n\n')
        : '';

      // Get summary from AI or resume
      const summary = existingResume.ai?.generatedSummary || existingResume.summary || '';

      setResumeDetails({
        summary: summary,
        skills: skills,
        workExperience: workExperience,
        education: education,
        projects: projects,
        certifications: certifications,
        languages: languages,
        interests: interests,
        hobbies: hobbies,
        awards: awards,
        publications: publications,
        volunteering: volunteering,
        references: references
      });
    }
  }, [editMode, existingResume]);

  const handleViewAll = () => {
    navigate('/all-resume');
  };

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleResumeChange = (e) => {
    const { name, value } = e.target;
    setResumeDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setProfileImage(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleGenerateCV = async () => {
    if (!personalInfo.fullName) {
      toast.error('Full name is required');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      
      Object.keys(personalInfo).forEach(key => {
        if (personalInfo[key]) {
          formData.append(key, personalInfo[key]);
        }
      });

      Object.keys(resumeDetails).forEach(key => {
        if (resumeDetails[key]) {
          formData.append(key, resumeDetails[key]);
        }
      });

      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      let response;
      
      if (editMode && existingResume) {
        // Update existing CV
        response = await updateCV(existingResume._id, formData);
        if (response.success) {
          toast.success('CV updated successfully!');
          setTimeout(() => {
            navigate(`/cv/${existingResume._id}`);
          }, 1000);
        }
      } else {
        // Create new CV
        response = await createCV(formData);
        if (response.success) {
          toast.success('CV generated successfully!');
          const cvId = response.data?._id || response.cv?._id || response._id;
          if (cvId) {
            setTimeout(() => {
              navigate(`/cv/${cvId}`);
            }, 1000);
          }
        }
      }
      
      if (!response?.success) {
        toast.error(response?.message || 'Failed to process CV');
      }
    } catch (err) {
      console.error('Generation Error:', err);
      toast.error(err.response?.data?.message || 'Failed to process CV');
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const containerClass = dark ? 'bg-black' : 'bg-gray-50';
  const cardClass = dark 
    ? 'bg-white/5 border border-white/10 rounded-md p-6' 
    : 'bg-white border border-gray-200 rounded-2xl p-6 shadow-sm';
  const textClass = dark ? 'text-white' : 'text-gray-900';
  const subTextClass = dark ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`min-h-screen ${containerClass}`}>
      <ResumeHeader />
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header Section */}
        <div className={`${cardClass} mb-8`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold mt-2 ${textClass}`}>
                {editMode ? 'Edit Your CV' : 'Create Your Professional CV'}
              </h1>
              <p className={`mt-2 ${subTextClass}`}>
                {editMode ? 'Update your details and let AI regenerate your professional resume' : 'Fill in your details and let AI generate a professional resume'}
              </p>
            </div>
            <button
              onClick={handleViewAll}
              className={`px-5 py-2.5 rounded-xl font-medium transition ${
                dark 
                  ? 'bg-white/10 text-white hover:bg-white/20' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              View All
            </button>
          </div>
        </div>

        {/* Forms */}
        <div className="space-y-8">
          {/* Personal Information */}
          <div className={cardClass}>
            <PersonalInformation
              personalInfo={personalInfo}
              handleChange={handlePersonalChange}
              handleFileChange={handleFileChange}
              profileImage={profilePreview || profileImage}
              dark={dark}
            />
          </div>

          {/* Resume Details */}
          <div className={cardClass}>
            <ResumeDetailsForm
              resumeDetails={resumeDetails}
              handleChange={handleResumeChange}
              onGenerate={handleGenerateCV}
              loading={loading}
              dark={dark}
            />
          </div>

          {/* Actions */}
          <div className={`${cardClass} flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end bottom-4`}>
            <button
              onClick={() => navigate(editMode ? `/cv/${existingResume?._id}` : '/resume')}
              className={`px-6 py-2.5 rounded-sm font-medium transition ${
                dark 
                  ? 'border border-white/20 text-white hover:bg-white/10' 
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleGenerateCV}
              disabled={loading}
              className={`px-8 py-2.5 rounded-md font-medium transition flex items-center justify-center gap-2 min-w-[200px] ${
                dark 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-black text-white hover:bg-gray-800'
              } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {editMode ? 'Updating...' : 'Generating...'}
                </>
              ) : (
                editMode ? ' Update CV' : ' Generate CV'
              )}
            </button>
          </div>
        </div>
      </div>

      <ResumeFooter />
    </div>
  );
}