import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ListingPage from './pages/ListingPage';
import DetailPage from './pages/DetailPage';
import ComparePage from './pages/ComparePage';
import CoursesPage from './pages/CoursesPage';
import ExamsPage from './pages/ExamsPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import ApplyNowModal from './components/ApplyNowModal';
import AIAssistant from './components/AIAssistant';
import CourseDetailPage from './pages/CourseDetailPage';
import ExamDetailPage from './pages/ExamDetailPage';
import EventsPage from './pages/EventsPage';
import SupportFab from "./components/SupportFab";


import EventPass from './components/EventPass';
import RegistrationForm from './components/RegestrationForm';

import type { View, College } from './types';

function App() {
  const [view, setView] = useState<View>({ page: 'home' });
 
  const [isApplyNowOpen, setIsApplyNowOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);



  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exams, setExams] = useState([]);

  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [blogError, setBlogError] = useState("");


  const [isSubmitted, setIsSubmitted] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [selectedEvent, setSelectedEvent] =
    useState<"kanpur" | "lucknow">("kanpur");

  const handleFormSubmit = (name: string, event: string) => {
    setStudentName(name);
    setSelectedEvent(event === "kanpur" ? "kanpur" : "lucknow");
    setIsSubmitted(true);
  };

  const [compareList, setCompareList] = useState<number[]>([]);
 
const [modalMode, setModalMode] = useState<"apply" | "brochure">("apply");

// 🔹 centralized handlers
const openApplyModal = () => {
  setModalMode("apply");
  setIsApplyNowOpen(true);
  
};

const openBrochureModal = () => {
  setModalMode("brochure");
  setIsApplyNowOpen(true);
};

const onCompareToggle = (id: number) => {
  setCompareList(prev => {
    if (prev.includes(id)) {
      return prev.filter(cid => cid !== id);
    }
    if (prev.length >= 3) {
      alert("You can compare up to 3 colleges only");
      return prev;
    }
    return [...prev, id];
  });
};



  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch("https://studycupsbackend.onrender.com/api/colleges");
        const json = await response.json();


        const formatted = Array.isArray(json.data) ? json.data : [json.data];

        setColleges(formatted);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch colleges");
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("https://studycupsbackend.onrender.com/api/blogs");
        const json = await res.json();
        setBlogs(json.data || []);
        setLoadingBlogs(false);
      } catch (err) {
        setBlogError("Failed to fetch blogs");
        setLoadingBlogs(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch("https://studycupsbackend.onrender.com/api/exams");
        const json = await res.json();
        setExams(json.data || []);
      } catch (err) {
        console.error("Exams API Error:", err);
      }
    };

    fetchExams();
  }, []);

  const fetchCourseDetails = async (id: number) => {
    try {
      const response = await fetch(`https://studycupsbackend.onrender.com/api/course/${id}`);
      const json = await response.json();
      setSelectedCourse(json.course);

    } catch (err) {
      console.error("Course API Error:", err);
    }
  };


  const renderContent = () => {
    if (loading) {
      return <p className="text-center p-10">Loading Colleges...</p>;
    }

    if (error) {
      return <p className="text-center p-10 text-red-600">{error}</p>;
    }

    switch (view.page) {
      case 'home':
        return (
          <HomePage
            setView={setView}
            colleges={colleges}
            exams={exams}
           
            onOpenApplyNow={openApplyModal}
  onOpenBrochure={openBrochureModal}
          />
        );

      case 'listing':
        return (
         <ListingPage
  setView={setView}
  colleges={colleges}
  compareList={compareList}
  onCompareToggle={onCompareToggle}
  onOpenApplyNow={openApplyModal}
  onOpenBrochure={openBrochureModal} // ✅ VERY IMPORTANT
  onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
  initialFilters={view.filters}
/>

        );

      case 'detail':
        return (
          <DetailPage
          college={colleges.find(c => c.id === view.collegeId)}

            setView={setView}
            compareList={compareList}
  onCompareToggle={onCompareToggle}
   onOpenApplyNow={openApplyModal}
          
          />
        );

      case 'compare':
        return (
          <ComparePage
            compareList={compareList}     
            allColleges={colleges}
            setView={setView}
          />
        );

      case 'courses':
        return (
          <CoursesPage
            setView={setView}
            colleges={colleges}
            initialStream={view.initialStream}   // FIX
          />
        );



      case 'events':
        return <EventsPage setView={setView} />;

      case 'blog':
        return <BlogPage setView={setView} blogs={blogs} loading={loadingBlogs} error={blogError} />;

      case 'blog-detail': {
        const blog = blogs.find(b => b.id === view.postId);
        return <BlogDetailPage postId={view.postId} blog={blog} setView={setView} />;
      }

      case 'exams':
        return <ExamsPage setView={setView} />;

      case 'exam-detail':
        return <ExamDetailPage examId={view.examId} setView={setView} />;
      case 'course-detail': {
        const { courseKey, courseIds } = view;

        if (!courseKey || !courseIds) {
          return <p className="p-10 text-center text-red-600">Invalid Course Data</p>;
        }

        return (
          <CourseDetailPage
            courseKey={courseKey}
            courseIds={courseIds}
            allColleges={colleges}
            setView={setView} 
            onOpenApplyNow={openApplyModal}
          />
        );
      }



      default:
        return (
          <HomePage
            setView={setView}
            colleges={colleges}
            exams={exams}
            onOpenApplyNow={() => setIsApplyNowOpen(true)}
          />
        );
    }
  };

  return (
    <div className="bg-[--background] text-[--text-primary] min-h-screen flex flex-col font-sans">
      <Header
        setView={setView}
        onOpenApplyNow={openApplyModal}
        colleges={colleges}
        view={view}

      />



      <main className="flex-grow">
        <Routes>
          <Route path="/" element={renderContent()} />

          <Route
            path="/register"
            element={
              <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-4xl">
                  {isSubmitted ? (
                    <EventPass name={studentName} selectedEvent={selectedEvent} />
                  ) : (
                    <RegistrationForm onSubmit={handleFormSubmit} />
                  )}
                </div>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
      <SupportFab onOpenAIBot={() => setIsAIAssistantOpen(true)} />


      <ApplyNowModal
        isOpen={isApplyNowOpen}
         mode={modalMode}  
        onClose={() => setIsApplyNowOpen(false)}
      />

      <AIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        colleges={colleges}
        setView={setView}
      />
    </div>
  );
}

export default App;
