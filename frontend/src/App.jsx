import React, { useEffect, useState } from "react";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Page_not_Found from "./pages/Page_not_Found";
import GetcurrentUser from "./Features/GetcurrentUser";
import { useDispatch, useSelector } from "react-redux";
import { setuserData } from "./redux/userSlice";
import UserDashboard from "./pages/UserDashboard";
import Resume from "./pages/Resume";
import CVGenerate from "./pages/CVGenerate";
import Portfolio from "./pages/Portfolio";
import Interview from "./pages/Interview";
import ResumeAnalysis from "./components/Resume/ResumeAnalyse/ResumeAnalysis";
import ShowResume from "./components/Resume/CV-Generate/ShowResume";
import AllResume from "./pages/AllResume";
import WebsitePreview from "./pages/WebsitePreview";
import AllPortfolio from "./pages/AllPortfolio";
import LoginRequired from "./pages/LoginRequired";
import Pricing from "./pages/Pricing";
import PaymentSuccess from "./components/pricing/PaymentSuccess";

export default function App() {
  const dispatch = useDispatch();
 
  const user = useSelector((state) => state.user.userdata);
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
        <Route
          path="/"
          element={user ? <Home /> : <LoginRequired />}
        />
        <Route path="/user-dashboard" element={<UserDashboard />} />
           <Route path="/resume" element={<Resume />} />
           <Route path="/cv-generator" element={<CVGenerate />} />
            <Route path="/portfolio" element={<Portfolio />} />
             <Route path="/mock-interview" element={<Interview />} />
               <Route path="/cv/:id" element={<ShowResume />} />
<Route path="/all-resume" element={<AllResume />} />
             <Route path="/resume-analysis" element={   <ResumeAnalysis/>}/>
             <Route
  path="/portfolio/preview/:slug"
  element={<WebsitePreview />}
/>
<Route
  path="/all-portfolio"
  element={<AllPortfolio />}
/>


<Route
  path="/portfolio/:id"
  element={<WebsitePreview />}
/>
<Route path="/pricing" element={<Pricing/>}/>
<Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="*" element={<Page_not_Found />} />

      </Routes>
    </div>
  );
}