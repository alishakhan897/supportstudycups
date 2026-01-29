import React, { useState , useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { View, College } from "../types";



interface HeaderProps {
  colleges: College[];
  exams: any[];
  onOpenApplyNow: () => void;
}

const toSeoSlug = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\([^)]*\)/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-"); 

const normalize = (text?: string | null) => {
  if (!text) return "";

  return text
    .toLowerCase()
    .trim()
    .replace(/\([^)]*\)/g, "")
    .replace(/[^a-z0-9]/g, "");
};

const Header: React.FC<HeaderProps> = ({ onOpenApplyNow  , colleges}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [showCoursesMenu, setShowCoursesMenu] = useState(false);
  // ===== MEGA MENU STATE =====
const [menuCourses, setMenuCourses] = useState<any[]>([]);
const [menuColleges, setMenuColleges] = useState<any[]>([]);
const [menuExams, setMenuExams] = useState<any[]>([]);
const [loadingMenu, setLoadingMenu] = useState(false);

// simple cache to avoid repeat calls
const hoverCache = React.useRef<Record<string, any>>({});


  const location = useLocation();
 const activePage = location.pathname; 

const COURSE_REGEX_MAP: Record<string, RegExp> = {
  "B.E / B.Tech": /(b\.?\s?tech|bachelor of technology|b\.?\s?e)/i,
  "MBA / PGDM": /(mba|pgdm|post graduate|management)/i,
  "MBBS": /(mbbs|medicine)/i,
  "BCA": /(bca|computer application)/i,
  "B.Com": /(b\.?\s?com|commerce)/i,
  "B.Sc": /(b\.?\s?sc|bs|bachelor of science)/i,
  "BA": /(b\.?\s?a|bachelor of arts)/i,
  "BBA": /(bba|business administration)/i,
  "M.E / M.Tech": /(m\.?\s?tech|master of technology|m\.?\s?e)/i,
  "MCA": /(mca|computer application)/i,
  "B.Ed": /(b\.?\s?ed|education)/i,
};



const [activeCourse, setActiveCourse] = useState<{
  name: string;
  stream: string;
} | null>(null);  
const getMenuCourses = () => {
  return Object.keys(COURSE_REGEX_MAP).map(name => ({
    name,
    stream: "all",
  }));
};
React.useEffect(() => {
  if (!showCoursesMenu) return;

  // frontend se hi courses set karo
  setMenuCourses(getMenuCourses());

  // initial colleges empty rakho
  setMenuColleges([]);
  setMenuExams([]);
}, [showCoursesMenu]);

const getCollegesForCourse = (courseName: string) => {
  const regex = COURSE_REGEX_MAP[courseName];
  if (!regex) return [];

  const resultMap = new Map<number, any>();

  colleges.forEach((college: any) => {
    const courseArr = college.rawScraped?.courses;
    if (!Array.isArray(courseArr)) return;

    const matched = courseArr.some((c: any) =>
      regex.test(c.name?.toLowerCase())
    );

    if (matched && !resultMap.has(college.id)) {
      resultMap.set(college.id, {
        id: college.id,
        name: college.name,
        logoUrl: college.logoUrl,
      });
    }
  });

  return Array.from(resultMap.values()).slice(0, 12);
};


const handleCourseHover = (course: { name: string; stream: string }) => {
  setActiveCourse(course);

  const collegesMatched = getCollegesForCourse(course.name);

  setMenuColleges(collegesMatched);
  setMenuExams([]); // exams optional
};


React.useEffect(() => {
  if (!showCoursesMenu) return;
  if (menuCourses.length === 0) return;
  if (activeCourse) return; // already selected

  const firstCourse = menuCourses[0];

  setActiveCourse(firstCourse);

  const defaultColleges = getCollegesForCourse(firstCourse.name);
  setMenuColleges(defaultColleges);
  setMenuExams([]);
}, [showCoursesMenu, menuCourses]);


 const tabClass = (path: string) =>
  `relative pb-1 transition ${
    activePage === path
      ? "text-[#0F2D52] font-bold after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#0F2D52]"
      : "text-[#0F2D52] hover:text-[#062042]"
  }`;
const streamSlug = normalize(activeCourse?.name); // example: mba

const CoursesMegaMenu = () => {
  return (
    <div
      className="
        absolute left-1/2 top-full mt-4
        -translate-x-1/2
        w-[1000px]
        bg-white
        rounded-2xl
        shadow-[0_25px_60px_rgba(0,0,0,0.18)]
        border border-slate-200
        z-50
        p-6
      "
    >
      <div className="grid grid-cols-4 gap-6">

        {/* COURSES */}
        <div>
          <p className="font-bold text-[#0F2D52] mb-3">Courses</p>

          {menuCourses.map(course => (
            <p
              key={course.name}
              onMouseEnter={() => handleCourseHover(course)} 
              
             onClick={() =>
  navigate(
  `/courses/${streamSlug}/${toSeoSlug(course.name)}`
)
}

              className={`text-sm py-1.5 cursor-pointer ${
                activeCourse?.name === course.name
                  ? "text-[#1E4A7A] font-semibold"
                  : "text-slate-700 hover:text-[#1E4A7A]"
              }`}
            >
              {course.name}
            </p>
          ))}

          <button
            onClick={() => navigate("/courses")}
            className="mt-3 text-sm text-blue-600 font-semibold"
          >
            View All Courses →
          </button>
        </div>

        {/* COLLEGES */}
        <div>
          <p className="font-bold text-[#0F2D52] mb-3">
            {activeCourse ? "Colleges" : "Top Colleges"}
          </p>

          {menuColleges.map(college => (
            <p
              key={college.id}
           onClick={() =>
  navigate(
    `/university/${college.id}-${toSeoSlug(college.name)}`
  )
}

              className="text-sm text-slate-700 py-1.5 cursor-pointer hover:text-[#1E4A7A]"
            >
              {college.name}
            </p>
          ))}
        </div>

        {/* EXAMS */}
        <div>
          <p className="font-bold text-[#0F2D52] mb-3">Exams</p>

          {menuExams.map(exam => (
            <p
              key={exam.id}
              onClick={() => navigate(`/exams/${exam.id}`)}
              className="text-sm text-slate-700 py-1.5 cursor-pointer hover:text-[#1E4A7A]"
            >
              {exam.name}
            </p>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="font-bold text-[#0F2D52] mb-2">
            College Predictor
          </p>
          <p className="text-xs text-slate-600 mb-3">
            Predict colleges based on your rank & score
          </p>
          <button
            onClick={() => navigate("/predictor")}
            className="w-full bg-[#1E4A7A] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#163a63]"
          >
            Try Predictor →
          </button>
        </div>

      </div>
    </div>
  );
};


  return (
  <header 
  className="
    fixed top-0 left-0 right-0 z-50
    bg-white/10 
    backdrop-blur-xl
    border-b border-white/20
    shadow-[0_8px_25px_rgba(0,0,0,0.08)]
    rounded-bl-[18px] rounded-br-[18px]
  "
>


      {/* WRAPPER (fixed for mobile) */}
      <div className="max-w-9xl mx-auto px-3 py-2  ">

        {/* TOP BAR */}
        <div
          className="
    bg-white
    w-full 
    flex items-center justify-between
    
    px-3 py-1         /* Smaller padding on mobile */
    rounded-xl        /* Smaller curve on mobile */

    md:px-6 md:py-2   /* Normal size on desktop */
    md:rounded-10px   /* Fully rounded on desktop */
      bg-white/10 
    backdrop-blur-xl
  "
        >



          {/* LOGO */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img src="/logos/StudyCups.png" className="h-8 w-auto md:h-10" />
          </div>

          {/* DESKTOP MENU */}
          <nav className="hidden lg:flex items-center space-x-6 text-base font-[380] text-[#0F2D52]">

            <button
              onClick={() => navigate("/")} className={tabClass("/") + " cursor-pointer"}
            >
              Home
            </button>

            <button
              onClick={() => navigate("/colleges")}
              className={tabClass("/colleges")+" cursor-pointer"}
            >
              Colleges
            </button>

<div
  className="relative"
  onMouseEnter={() => setShowCoursesMenu(true)}
  onMouseLeave={() => {
    setShowCoursesMenu(false);
    setActiveCourse(null);
  }}
>
  <button
    onClick={() => navigate("/courses")}
    className={tabClass("/courses") + " cursor-pointer"}
  >
    Courses
  </button>

  {showCoursesMenu && <CoursesMegaMenu />}
</div>





            <button
             onClick={() => navigate("/exams")} className={tabClass("/exams") + " cursor-pointer"}
            >
              Exams
            </button>

             <button
             onClick={() => navigate("/blog")} className={tabClass("/blog") + " cursor-pointer"}
            >
              Blog
            </button>

          
            <button
             onClick={() => navigate("/compare")} className={tabClass("/compare") + " cursor-pointer"}
            >
              Compare
            </button>


            <svg className="w-5 h-5 cursor-pointer hover:text-[#062042]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

           <svg
 
  className="w-5 h-5 cursor-pointer hover:text-[#062042]"
  fill="none"
  stroke="currentColor"
  viewBox="0 0 24 24"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-7.879 
    2.067-9 5.385A2.327 2.327 0 005 21h14c1.092 0 
    2.016-.628 2.5-1.615C19.879 16.067 16.418 14 12 14z"
  />
</svg>


            <button
              onClick={onOpenApplyNow}
              className="bg-[#1E4A7A] text-white px-4 py-2 rounded-full font-semibold hover:bg-[orange]"
            >
              Apply Now
            </button>
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-7 h-7 text-[#0F2D52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="lg:hidden bg-[#0F2D52] text-white mt-3 rounded-2xl px-5 py-5 space-y-3 shadow-xl">

            {[
              ["Home", "home"],
              ["Colleges", "colleges"],
              ["Courses", "courses"],
              ["Exams", "exams"],
              ["Blog", "blog"],
              ["Compare", "compare"],
            ].map(([label, page]) => (
              <button
                key={page}
              onClick={() => {
  navigate(
    page === "home" ? "/" : `/${page}`
  );
  setIsMenuOpen(false);
}}

                className="block w-full text-left py-2 text-base font-semibold"
              >
                {label}
              </button>
            ))}

            <button
              onClick={onOpenApplyNow}
              className="w-full mt-3 py-3 bg-[#1E4A7A] rounded-full font-semibold"
            >
              Apply Now
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
