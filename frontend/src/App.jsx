import React, { useEffect, useState } from "react";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Page_not_Found from "./pages/Page_not_Found";
import GetcurrentUser from "./Features/GetcurrentUser";
import { useDispatch } from "react-redux";
import { setuserData } from "./redux/userSlice";
import UserDashboard from "./pages/UserDashboard";
import Resume from "./pages/Resume";
import CVGenerate from "./pages/CVGenerate";
import Portfolio from "./pages/Portfolio";
import Interview from "./pages/Interview";
import ResumeAnalysis from "./components/Resume/ResumeAnalyse/ResumeAnalysis";
import ShowResume from "./components/Resume/CV-Generate/ShowResume";

export default function App() {
  const dispatch = useDispatch();
 

  useEffect(() => {
    const getuser = async () => {
      try {
       
        const data = await GetcurrentUser();
        
        if (data && data._id) {
         
          dispatch(setuserData(data));
        } else {
          console.log("No valid user data received");
        }
      } catch (error) {
        console.error("Error in getuser:", error);
      } 
    };

    getuser();
  }, [dispatch]);

  
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
           <Route path="/resume" element={<Resume />} />
           <Route path="/cv-generator" element={<CVGenerate />} />
            <Route path="/portfolio" element={<Portfolio />} />
             <Route path="/mock-interview" element={<Interview />} />
               <Route path="/cv/:id" element={<ShowResume />} />
             <Route path="/resume-analysis" element={   <ResumeAnalysis/>}/>
        <Route path="*" element={<Page_not_Found />} />

      </Routes>
    </div>
  );
}