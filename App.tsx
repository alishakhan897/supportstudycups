import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

/* ===== COMMON COMPONENTS ===== */
import Header from "./components/Header";
import Footer from "./components/Footer";
import ApplyNowModal from "./components/ApplyNowModal";


/* ===== PAGES ===== */
import HomePage from "./pages/HomePage";
import ListingPage from "./pages/ListingPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import ExamsPage from "./pages/ExamsPage";
import ExamDetailPage from "./pages/ExamDetailPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import ComparePage from "./pages/ComparePage";
import DetailPage from "./pages/DetailPage";
import ErrorBoundary from "./pages/ErrorBoundary";

/* ===== TYPES ===== */
import type { College } from "./types";

/* ===== API ===== */
const API_BASE = "https://studycupsbackend-production.up.railway.app/api";

const App: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyMode, setApplyMode] = useState<"apply" | "brochure">("apply");



  const handleCompareToggle = (id: string) => {
    setCompareList((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const handleApplyNow = () => {
    setApplyMode("apply");
    setApplyModalOpen(true);
  };

  const handleBrochure = () => {
  setApplyMode("brochure");
  setApplyModalOpen(true);
};





  /* 🔥 GLOBAL DATA – FAST (ONLY ONCE) */
  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/colleges`).then(r => r.json()),
      fetch(`${API_BASE}/exams`).then(r => r.json()),
      fetch(`${API_BASE}/blogs`).then(r => r.json()),
    ])
      .then(([c, e, b]) => {
        console.log("APP.TSX → colleges API:", c);
        console.log("APP.TSX → exams API:", e);

        // 🔥 DIRECT SET — NO GUARDS
        setColleges(c.data);
        setExams(e.data);
        setBlogs(b.data);
      })
      .catch(err => {
        console.error("API ERROR", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
  <>
    {/* ================= HEADER (ALWAYS INSTANT) ================= */} 

    <Header
      onOpenApplyNow={() => {
        setApplyMode("apply");
        setApplyModalOpen(true);
      }}
    />

    {/* ================= ROUTES (NEVER BLOCKED BY LOADING) ================= */} 
    
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            colleges={colleges}
            exams={exams}
            loading={loading}   // 👈 pass loading instead of blocking
          />
        }
      />

      <Route
        path="/colleges"
        element={
          <ListingPage
            colleges={colleges}
            compareList={compareList}
            onCompareToggle={handleCompareToggle}
            setView={() => {}}
            onOpenApplyNow={handleApplyNow}
            onOpenBrochure={handleBrochure}
          />
        }
      />

      <Route
        path="/college/:slugId"
        element={ 
        
          <DetailPage
            colleges={colleges}
            compareList={compareList}
            onCompareToggle={handleCompareToggle}
            onOpenApplyNow={handleApplyNow}
             onOpenBrochure={handleBrochure}
          /> 
       
        }
      />

      <Route
        path="/courses"
        element={<CoursesPage colleges={colleges} />}
      />

      <Route
        path="/course/:courseSlug"
        element={
          <CourseDetailPage
            colleges={colleges}
            onOpenApplyNow={handleApplyNow}
          />
        }
      />

      <Route
        path="/exams"
        element={<ExamsPage exams={exams} />}
      />

      <Route
        path="/exam/:id"
        element={<ExamDetailPage />}
      />

      <Route
        path="/blog"
        element={<BlogPage blogs={blogs} />}
      />

      <Route
        path="/blog/:id"
        element={<BlogDetailPage />}
      />

      <Route
        path="/compare"
        element={
          <ComparePage
            colleges={colleges}
            compareList={compareList}
          />
        }
      />
    </Routes>

    {/* ================= APPLY MODAL ================= */}
    <ApplyNowModal
      isOpen={applyModalOpen}
      mode={applyMode}
      onClose={() => setApplyModalOpen(false)}
    />

    {/* ================= FOOTER ================= */}
   <Footer exams={exams} colleges={colleges} />

  </>
);

};

export default App;
