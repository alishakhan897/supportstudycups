import React, { useState, useMemo, useEffect } from "react";
import type { View, College } from "../types";
import { useOnScreen } from "../hooks/useOnScreen";
import { useLocation } from "react-router-dom";

import { useNavigate } from "react-router-dom"; 

/* ================= ANIMATION ================= */

const AnimatedContainer: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = "" }) => {
  const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.1 });
  return (
    <div
      ref={ref}
      className={`opacity-0 ${isVisible ? "animate-fadeInUp" : ""} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/* ================= HASH ================= */

const hashIndex = (str: string) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
};

interface CoursesPageProps {
  setView: (view: View) => void;
  colleges: College[];
  initialStream?: string;
}

const CoursesPage: React.FC<CoursesPageProps> = ({
  setView,
  colleges,
  initialStream,
}) => { 
   const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedStream, setSelectedStream] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [showMobileFilters, setShowMobileFilters] = useState(false);


const location = useLocation();

useEffect(() => {
  if (location.state && typeof location.state === "object") {
    const navState = location.state as any;

    if (navState.initialStream) {
      setSelectedStream(navState.initialStream.trim());
    }
  }
}, [location.state]);



  const deriveStream = (courseName: string) => {
  const name = courseName.toLowerCase();

  /* ---------- DOCTORAL ---------- */
  if (
    name.includes("ph.d") ||
    name.includes("phd") ||
    name.includes("post doctoral") ||
    name.includes("doctoral")
  ) {
    return "Doctoral";
  }

  /* ---------- MANAGEMENT ---------- */
  if (
    name.includes("mba") ||
    name.includes("pgdm") ||
    name.includes("management") ||
    name.includes("leadership") ||
    name.includes("strategy") ||
    name.includes("executive")
  ) {
    return "Management";
  }

  /* ---------- ENGINEERING / TECH ---------- */
  if (
    name.includes("b.tech") ||
    name.includes("btech") ||
    name.includes("engineering") ||
    name.includes("technology") ||
    name.includes("data science") ||
    name.includes("artificial intelligence") ||
    name.includes("machine learning") ||
    name.includes("computer") ||
    name.includes("m.sc") ||
    name.includes("msc")
  ) {
    return "Engineering";
  }

  /* ---------- MEDICAL ---------- */
  if (
    name.includes("mbbs") ||
    name.includes("medical") ||
    name.includes("healthcare")
  ) {
    return "Medical";
  }

  /* ---------- COMMERCE ---------- */
  if (
    name.includes("b.com") ||
    name.includes("commerce") ||
    name.includes("account") ||
    name.includes("finance")
  ) {
    return "Commerce";
  }

  /* ---------- ARTS / SOCIAL ---------- */
  if (
    name.includes("arts") ||
    name.includes("humanities") ||
    name.includes("social")
  ) {
    return "Arts";
  }

  return "General";
};

function formatToLakhs(num) {
  if (!num) return "N/A";

  let lakhs = num / 100000;

  // keep 2 decimals max (20.75)
  lakhs = Math.round(lakhs * 100) / 100;

  return "₹" + lakhs + " L";
}



  /* ================= ALL COURSES ================= */

  const allCourses = useMemo(() => {
    const arr: any[] = [];

    colleges.forEach((col) => {
     if (!Array.isArray(col.rawScraped?.courses)) return;

col.rawScraped.courses.forEach((cr) => {

  // ignore subcourses (we only want parent course)
  if (Array.isArray(cr.sub_courses) && cr.sub_courses.length > 0) return;

 arr.push({
  id: cr.id,                         // ✅ REAL COURSE ID
  courseIds: [cr.id],                // ✅ ADD THIS
  name: cr.name,
  fullName: cr.name,

  collegeId: col.id,
  collegeName: col.name,

  stream: deriveStream(cr.name),

  level: cr.mode || "Full Time",
  duration: cr.duration || null,
  fees: cr.fees || "N/A",

  courseKey: cr.name.trim().toLowerCase(),
});


});

    });

    return arr;
  }, [colleges]);

  /* ================= GROUP ================= */

 const groupedCourses = useMemo(() => {
  const map = new Map();

  allCourses.forEach((c) => {
    if (!map.has(c.courseKey)) {
     map.set(c.courseKey, {
  ...c,
  courseIds: [...c.courseIds],   // ✅ FROM allCourses
  colleges: [c.collegeId],
});


    } else {
      const entry = map.get(c.courseKey);

     if (!entry.colleges.includes(c.collegeId)) {
  entry.colleges.push(c.collegeId);
  entry.courseIds.push(...c.courseIds);  // ✅ REAL IDs
}

    }
  });

  return Array.from(map.values());
}, [allCourses]);


  const streams = useMemo(() => {
    const set = new Set<string>();
    allCourses.forEach((c) => set.add(c.stream));
    return ["All", ...Array.from(set)];
  }, [allCourses]);

  const levels = useMemo(() => {
    const set = new Set<string>();
    allCourses.forEach((c) => set.add(c.level));
    return ["All", ...Array.from(set)];
  }, [allCourses]);

  const filteredCourses = useMemo(() => {
    const lower = searchTerm.toLowerCase();

    return groupedCourses.filter((c) => {
      const searchMatch =
        c.name?.toLowerCase().includes(lower) ||
        c.fullName?.toLowerCase().includes(lower);

      const streamMatch =
        selectedStream === "All" || c.stream === selectedStream;

      const levelMatch =
        selectedLevel === "All" || c.level === selectedLevel;

      return searchMatch && streamMatch && levelMatch;
    });
  }, [groupedCourses, searchTerm, selectedStream, selectedLevel]);

  const clearFilters = () => {
    setSelectedStream("All");
    setSelectedLevel("All");
  };

  return (
    <div className="bg-[#f5f7fb] min-h-screen">

{/* HERO */}
<section className="relative overflow-hidden mt-6">
  {/* Background */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#0f2a44] via-[#163b63] to-[#1e4e79] pt-3" />

  {/* Decorative blur (smaller) */}
 <div className="
  absolute -top-24 -left-24
  h-40 w-40
  md:h-64 md:w-64
  bg-blue-500/20 rounded-full blur-3xl
" />

  <div className="absolute top-32 -right-32 h-72 w-72 bg-indigo-500/20 rounded-full blur-3xl" />

  {/* CONTENT */}
  <div className="
  relative container mx-auto text-center text-white
  px-8
  md:px-4
  py-8
  md:px-6 md:py-16">

    {/* Title */}
    <h1 className="text-xl md:text-4xl pt-3xl md:pt-2xl font-extrabold leading-sung">
      Explore Career-Focused Courses
    </h1>

    {/* Subtitle */}
   <p className="mt-2 text-sm md:text-lg text-white/80 max-w-2xl mx-auto">

      Discover the best courses across top colleges and universities in India.
      Compare duration, level and career outcomes.
    </p>

    {/* Search */}
    <div className="mt-7 max-w-xl mx-auto relative flex hidden md:block">
      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
        🔍
      </span>
      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search B.Tech, MBA, MBBS, Design..."
        className="w-full pl-12 pr-4 py-3 rounded-full text-white text-base
                   shadow-lg focus:ring-2 focus:ring-blue-300 outline-none "
      />
    </div>

    {/* STATS (compact) */}
  <div className="mt-5 md:mt-10 grid grid-cols-3 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">

      <div className="bg-white/10 backdrop-blur rounded-xl p-4">
       <p className="text-lg md:text-2xl font-extrabold">
500+</p>
        <p className="text-xs text-white/80">Courses Available</p>
      </div>

      <div className="bg-white/10 backdrop-blur rounded-xl p-4">
      <p className="text-lg md:text-2xl font-extrabold">
50+</p>
        <p className="text-xs text-white/80">Career Streams</p>
      </div>

      <div className="bg-white/10 backdrop-blur rounded-xl p-4">
      <p className="text-lg md:text-2xl font-extrabold">
100K+</p>
        <p className="text-xs text-white/80">Students Guided</p>
      </div>
    </div>

    {/* Trust Line */}
    <p className="mt-6 text-xs text-white/70">
      Trusted by students across India • Verified course data • Career-oriented guidance
    </p>

  </div>
</section> 

{/* MOBILE FILTER BUTTON */}
<div className="md:hidden px-6 mt-4">
  <button
    onClick={() => setShowMobileFilters(true)}
    className=" 
      
      w-full
      py-3
      rounded-xl
      bg-transparent
      text-[#0A225A]
      font-semibold
      shadow-md
    "
  >
    Filters
  </button>
</div>




      <div className="  container mx-auto px-6 py-12"> 
       <div className="flex gap-8 items-start">
        {/* FILTERS */}
       {/* LEFT FILTER SIDEBAR (Desktop) */}
<aside className="hidden md:block w-[260px] sticky top-28 h-[calc(100vh-7rem)]">
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">

    {/* HEADER (Sticky inside sidebar) */}
    <div className="px-5 py-4 border-b bg-slate-50 shrink-0">
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
        Filters
      </h3>
    </div>

    {/* SCROLLABLE FILTER CONTENT */}
    <div className="p-5 space-y-6 overflow-y-auto">

      {/* STREAM */}
      <div>
        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3">
          Stream
        </h4>

        <div className="space-y-2">
          {streams.map((stream) => (
            <label
              key={stream}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
                border transition
                ${
                  selectedStream === stream
                    ? "bg-blue-50 border-blue-500"
                    : "border-slate-200 hover:bg-slate-50"
                }
              `}
            >
              <input
                type="radio"
                name="stream"
                checked={selectedStream === stream}
                onChange={() => setSelectedStream(stream)}
                className="accent-blue-600"
              />
              <span className="text-sm font-medium text-slate-800">
                {stream}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* DIVIDER */}
      <div className="h-px bg-slate-200" />

      {/* LEVEL */}
      <div>
        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3">
          Level
        </h4>

        <div className="space-y-2">
          {levels.map((level) => (
            <label
              key={level}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
                border transition
                ${
                  selectedLevel === level
                    ? "bg-blue-50 border-blue-500"
                    : "border-slate-200 hover:bg-slate-50"
                }
              `}
            >
              <input
                type="radio"
                name="level"
                checked={selectedLevel === level}
                onChange={() => setSelectedLevel(level)}
                className="accent-blue-600"
              />
              <span className="text-sm font-medium text-slate-800">
                {level}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* CLEAR */}
      {(selectedStream !== "All" || selectedLevel !== "All") && (
        <button
          onClick={clearFilters}
          className="
            w-full mt-4 py-2 rounded-lg
            text-sm font-semibold
            text-red-600 border border-red-200
            hover:bg-red-50 transition
          "
        >
          Clear Filters
        </button>
      )}
    </div>
  </div>
</aside>




        {/* COURSES GRID */}
     <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
  {filteredCourses.map((course) => (
    <React.Fragment key={course.courseKey}>
<div
  onClick={() =>
    setView({
      page: "course-detail",
      courseIds: course.courseIds,
      courseKey: course.courseKey,
    })
  }
  className="
    md:hidden
    bg-white
    rounded-xl
    border border-slate-200
    shadow-sm
    p-3
    flex flex-col
  "
>
  {/* META */}
  <div className="flex justify-between text-[10px] text-slate-500 mb-1">
    <span className="font-semibold">{course.level}</span>
    <span>{course.duration}</span>
  </div>

  {/* TITLE */}
  <h3 className="text-[12px] font-semibold line-clamp-2 mb-2">
    {course.fullName}
  </h3>

  {/* INFO */}
  <div className="text-[11px] text-slate-600 space-y-1 mb-3">
    <p><b>Fees:</b> {course.fees || "N/A"}</p>
    <p><b>Colleges:</b> {course.colleges?.length || 0}</p>
  </div>

  {/* CTA */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      navigate(`/course/${course.courseKey}`);
    }}
    className="
      mt-auto
      w-full
      py-2
      rounded-lg
      bg-[#0A225A]
      text-white
      text-[11px]
      font-semibold
    "
  >
    View Details
  </button>
</div>
   <div 
  onClick={() =>
    setView({
      page: "course-detail",
      courseIds: course.courseIds,
      courseKey: course.courseKey,
    })
  }
  className="
    bg-white rounded-2xl border border-slate-200
    shadow-[0_8px_24px_rgba(0,0,0,0.08)]
    hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]
    transition-all duration-300
    p-6 cursor-pointer flex flex-col h-full hidden md:block
  "
>
  {/* TAGS */}
  <div className="flex justify-between mb-4">
    <span className="px-3 py-1 text-xs bg-slate-100 rounded-full font-semibold truncate">
      {course.level || "N/A"}
    </span>
    <span className="px-3 py-1 text-xs bg-slate-100 rounded-full font-semibold truncate">
      {course.duration || "N/A"}
    </span>
  </div>

  {/* COURSE NAME */}
  <h3 className="
    text-[14px]
    mb-3
    leading-tight
    truncate
    whitespace-nowrap
    overflow-hidden
    max-w-full 
  ">
    {course.fullName}
  </h3>

  {/* STATS GRID */}
  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
    <div className="border border-slate-300 rounded-lg p-3">
      <p className="text-xs text-slate-500">Duration</p>
      <p className="font-semibold truncate">
        {course.duration || "N/A"}
      </p>
    </div>

    <div className="border border-slate-300 rounded-lg p-3">
      <p className="text-xs text-slate-500">Avg.Fees</p>
      <p className="font-semibold truncate">
    {course.fees}



      </p>
    </div>

    <div className="border border-slate-300 rounded-lg p-3">
      <p className="text-xs text-slate-500">Colleges</p>
     <p className="font-semibold">
 {course.colleges?.length || 0}

</p>

    </div>

    <div className="border border-slate-300 rounded-lg p-3">
      <p className="text-xs text-slate-500">Level</p>
      <p className="font-semibold truncate">
        {course.level}
      </p>
    </div>
  </div>

  {/* FOOTER */}
  <div className="mt-auto flex justify-between items-center">
    <span className="text-[8px] font-semibold text-blue-700">
      Course Overview →
    </span>
  <button
  onClick={(e) => {
    e.stopPropagation();  // Prevent card click
    navigate(`/course/${course.courseKey}`);
  }}
 className="px-2 py-2 bg-green-500 text-white text-[8px] rounded-full font-semibold hover:bg-green-600 transition-all"
>
  View Details →
</button>

  </div>


           </div>     </React.Fragment>
  ))}

</div>


</div>
        

        
      </div> 

      
   
   
    
{showMobileFilters && (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:hidden">
    <div className="w-full bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-6 animate-slideUp">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Filters</h3>
        <button
          onClick={() => setShowMobileFilters(false)}
          className="text-red-600 font-semibold text-sm"
        >
          Close
        </button>
      </div>

      {/* SAME FILTER CONTENT (reuse) */}
      <div className="space-y-6">

        {/* Filter by Stream */}
        <div>
          <h3 className="font-semibold mb-3">Filter by Stream</h3>
          <div className="flex flex-wrap gap-2">
            {streams.map((stream) => (
              <button
                key={stream}
                onClick={() => setSelectedStream(stream)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                  selectedStream === stream
                    ? "bg-[var(--primary-medium)] text-white border-[var(--primary-medium)]"
                    : "bg-white text-slate-700 border-slate-300"
                }`}
              >
                {stream}
              </button>
            ))}
          </div>
        </div>

        {/* Filter by Level */}
        <div>
          <h3 className="font-semibold mb-3">Filter by Level</h3>
          <div className="flex flex-wrap gap-2">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                  selectedLevel === level
                    ? "bg-[var(--primary-medium)] text-white border-[var(--primary-medium)]"
                    : "bg-white text-slate-700 border-slate-300"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Clear + Apply */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={clearFilters}
            className="flex-1 py-3 rounded-xl border font-semibold"
          >
            Clear
          </button>

          <button
            onClick={() => setShowMobileFilters(false)}
            className="flex-1 py-3 rounded-xl bg-[#0A225A] text-white font-semibold"
          >
            Apply
          </button>
        </div>

      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default CoursesPage;
