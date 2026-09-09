
import React, { useEffect } from "react";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Page_not_Found from "./pages/Page_not_Found";
import { useDispatch, useSelector } from "react-redux";
import { setuserData, setUserLoading } from "./redux/userSlice";

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
import GetcurrentUser from "./Features/GetCurrentUser";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import Loading from "./components/Loading/Loading";
import AdminDashboard from "./pages/AdminDashboard";
import InterviewPractice from "./pages/InterviewPractice";
export default function App() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.userdata);
  const loading = useSelector((state) => state.user.loading);

  useEffect(() => {
    const getuser = async () => {
      try {
        dispatch(setUserLoading(true));

        const data = await GetcurrentUser();

        console.log("🔥 CURRENT USER FROM APP:", data);

        if (data) {
          dispatch(setuserData(data));
        } else {
          dispatch(setuserData(null));
        }
      } catch (error) {
        console.error("❌ Error in getuser:", error);
        dispatch(setuserData(null));
      }
    };

    getuser();
  }, [dispatch]);

  // VERY IMPORTANT
  // Don't show LoginRequired while /me is still being checked.
  if (loading) {
    return (
     <Loading/>
    );
  }

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
        <Route path="/interview-practice" element={<InterviewPractice />} />
        <Route
          path="/resume-analysis"
          element={<ResumeAnalysis />}
        />

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

        <Route path="/pricing" element={<Pricing />} />

        <Route
          path="/payment/success"
          element={<PaymentSuccess />}
        />
        <Route path="/privacy" element={<Privacy />} />
       <Route path="/contact" element={<Contact />} />
<Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Page_not_Found />} />
      </Routes>
    </div>
  );
}

