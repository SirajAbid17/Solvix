// models/cv.model.js
import mongoose from "mongoose";

const cvSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  jobTitle: String,
  email: String,
  phone: String,
  country: String,
  city: String,
  address: String,
  dateOfBirth: String,
  nationality: String,
  linkedin: String,
  github: String,
  portfolio: String,
  
  // Change these to strings instead of arrays
  summary: String,
  skills: String,
  workExperience: String,  // Changed from array to string
  education: String,       // Changed from array to string
  projects: String,        // Changed from array to string
  certifications: String,
  languages: String,       // Changed from array to string
  
  profileImage: {
    url: String,
    publicId: String,
    alt: String,
  },
  generatedResume: mongoose.Schema.Types.Mixed,
  aiModel: String,
}, {
  timestamps: true
});

export default mongoose.model("CV", cvSchema);