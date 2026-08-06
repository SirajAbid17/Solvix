import React from "react";
import PortfolioHero from "../components/Resume/Portfolio/PortfolioHero";
import UploadPortfolioPdf from "../components/Resume/Portfolio/UploadPortfolioPdf";
import ResumeHeader from "../components/Resume/ResumeHeader";
import ResumeFooter from "../components/Resume/ResumeFooter";


export default function Portfolio() {
  return (
    <div className="space-y-8">
        <ResumeHeader/>
      <PortfolioHero />
      <UploadPortfolioPdf />
      <ResumeFooter/>
    </div>
  );
}