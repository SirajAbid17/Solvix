import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setuserData, setUserLoading } from "./redux/userSlice";
import GetcurrentUser from "./Features/GetCurrentUser";

// Route Guards
import { ProtectedRoute, PublicRoute, AdminRoute } from "./protectedroute/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Page_not_Found from "./pages/Page_not_Found";
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
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import Loading from "./components/Loading/Loading";
import AdminDashboard from "./pages/AdminDashboard";
import InterviewPractice from "./pages/InterviewPractice";

// ============================================================
// MAIN APP
// ============================================================

export default function App() {
  const dispatch = useDispatch();

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

  // Show loading while checking auth
  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <Routes>
        {/* ============================================ */}
        {/* PUBLIC ROUTES - Always accessible */}
        {/* ============================================ */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />

        {/* ============================================ */}
        {/* LOGIN REQUIRED - Only if not logged in */}
        {/* ============================================ */}
        <Route
          path="/login-required"
          element={
            <PublicRoute>
              <LoginRequired />
            </PublicRoute>
          }
        />

        {/* ============================================ */}
        {/* PROTECTED ROUTES - Require login */}
        {/* ============================================ */}

        {/* HOME */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* USER DASHBOARD */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* RESUME */}
        <Route
          path="/resume"
          element={
            <ProtectedRoute>
              <Resume />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resume-analysis"
          element={
            <ProtectedRoute>
              <ResumeAnalysis />
            </ProtectedRoute>
          }
        />

        <Route
          path="/all-resume"
          element={
            <ProtectedRoute>
              <AllResume />
            </ProtectedRoute>
          }
        />

        {/* CV GENERATOR */}
        <Route
          path="/cv-generator"
          element={
            <ProtectedRoute>
              <CVGenerate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cv/:id"
          element={
            <ProtectedRoute>
              <ShowResume />
            </ProtectedRoute>
          }
        />

        {/* PORTFOLIO */}
        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          }
        />

        <Route
          path="/portfolio/preview/:slug"
          element={
            <ProtectedRoute>
              <WebsitePreview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/portfolio/:id"
          element={
            <ProtectedRoute>
              <WebsitePreview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/all-portfolio"
          element={
            <ProtectedRoute>
              <AllPortfolio />
            </ProtectedRoute>
          }
        />

        {/* MOCK INTERVIEW */}
        <Route
          path="/mock-interview"
          element={
            <ProtectedRoute>
              <Interview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview-practice/:id?"
          element={
            <ProtectedRoute>
              <InterviewPractice />
            </ProtectedRoute>
          }
        />

        {/* PRICING */}
        <Route
          path="/pricing"
          element={
            <ProtectedRoute>
              <Pricing />
            </ProtectedRoute>
          }
        />

        {/* PAYMENT */}
        <Route
          path="/payment/success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />

        {/* ============================================ */}
        {/* ADMIN ROUTES - Require admin privileges */}
        {/* ============================================ */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* ============================================ */}
        {/* 404 - PAGE NOT FOUND */}
        {/* ============================================ */}
        <Route path="*" element={<Page_not_Found />} />
      </Routes>
    </div>
  );
}