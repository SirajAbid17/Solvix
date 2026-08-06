// pages/CVGenerate.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ResumeHeader from '../components/Resume/ResumeHeader';
import ResumeFooter from '../components/Resume/ResumeFooter';
import PersonalInformation from '../components/Resume/CV-Generate/PersonalInformation';
import ResumeDetailsForm from '../components/Resume/CV-Generate/ResumeDetailsForm';
import { createCV } from '../Features/CVcreate';
import { useTheme } from '../BgContext/ThemeContext';

export default function CVGenerate() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const [loading, setLoading] = useState(false);

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
    languages: ''
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

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

  // Generate CV
  const handleGenerateCV = async () => {
    // Validate required fields
    if (!personalInfo.fullName) {
      toast.error('Full name is required');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      
      // Append personal info
      Object.keys(personalInfo).forEach(key => {
        if (personalInfo[key]) {
          formData.append(key, personalInfo[key]);
        }
      });

      // Append resume details
      Object.keys(resumeDetails).forEach(key => {
        if (resumeDetails[key]) {
          formData.append(key, resumeDetails[key]);
        }
      });

      // Append profile image
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const response = await createCV(formData);
      
      console.log('Full Response:', response); // Debug log
      
      // Check response structure
      if (response.success) {
        toast.success('CV generated successfully!');
        
        // Get the CV ID from the response - handle different response structures
        let cvId = null;
        
        // Check different possible response structures
        if (response.data?._id) {
          cvId = response.data._id;
        } else if (response.cv?._id) {
          cvId = response.cv._id;
        } else if (response._id) {
          cvId = response._id;
        } else if (response.data?.data?._id) {
          cvId = response.data.data._id;
        }
        
        console.log('CV ID:', cvId); // Debug log
        
        if (cvId) {
          // Navigate to show resume
          setTimeout(() => {
            navigate(`/cv/${cvId}`);
          }, 1000);
        } else {
          console.error('No CV ID found in response:', response);
          toast.error('CV generated but ID not found');
        }
      } else {
        toast.error(response.message || 'Failed to generate CV');
      }
    } catch (err) {
      console.error('Generation Error:', err);
      console.error('Error details:', err.response?.data);
      toast.error(err.response?.data?.message || 'Failed to generate CV');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${dark ? 'bg-black' : 'bg-gray-50'}`}>
      <ResumeHeader />
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${dark ? 'text-white' : 'text-black'}`}>
            Create Your Professional CV
          </h1>
          <p className={`mt-2 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
            Fill in your details and let AI generate a professional resume for you
          </p>
        </div>

        <div className="space-y-8">
          <PersonalInformation 
            personalInfo={personalInfo}
            handleChange={handlePersonalChange}
            handleFileChange={handleFileChange}
            profileImage={profilePreview || profileImage}
            dark={dark}
          />
          
          <ResumeDetailsForm 
            resumeDetails={resumeDetails}
            handleChange={handleResumeChange}
            dark={dark}
          />

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/resume')}
              className={`px-6 py-3 rounded-xl border transition ${
                dark 
                  ? 'border-white/20 text-white hover:bg-white/10' 
                  : 'border-gray-300 text-black hover:bg-gray-100'
              }`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleGenerateCV}
              disabled={loading}
              className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                dark
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-black text-white hover:bg-gray-800'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating...
                </span>
              ) : (
                'Generate CV'
              )}
            </button>
          </div>
        </div>
      </div>
      
      <ResumeFooter />
    </div>
  );
}