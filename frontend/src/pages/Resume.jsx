import React from 'react'
import ResumeHeader from '../components/Resume/ResumeHeader';

import ResumeFooter from '../components/Resume/ResumeFooter';
import ResumeData from '../components/Resume/ResumeAnalyse/ResumeData';
import PdfSender from '../components/Resume/ResumeAnalyse/PdfSender';
import ResumeAnalysis from '../components/Resume/ResumeAnalyse/ResumeAnalysis';


export default function Resume() {
   
  return (
    <div>   
              <ResumeHeader/>
              <ResumeData/>
              <PdfSender/>
           
              <ResumeFooter/>
    </div>
  )
}
