import React from 'react'
import InterviewHero from '../components/Resume/Mock-Interview/InterviewHero'
import UploadInterviewPdf from '../components/Resume/Mock-Interview/UploadInterviewPdf'
import ResumeHeader from '../components/Resume/ResumeHeader'
import ResumeFooter from '../components/Resume/ResumeFooter'

export default function Interview() {
  return (
    <div className="space-y-8">
        <ResumeHeader/>
       <InterviewHero />
      <UploadInterviewPdf />
      <ResumeFooter/>
    </div>
  )
}
