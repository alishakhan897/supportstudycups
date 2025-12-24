import React, { useState, useMemo, useEffect } from "react";
import type { View, College } from "../types";
import { useOnScreen } from "../hooks/useOnScreen";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStream, setSelectedStream] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

  useEffect(() => {
    if (initialStream) setSelectedStream(initialStream.trim());
  }, [initialStream]); 


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
  <div className="absolute inset-0 bg-gradient-to-br from-[#0f2a44] via-[#163b63] to-[#1e4e79]" />

  {/* Decorative blur (smaller) */}
  <div className="absolute -top-32 -left-32 h-64 w-64 bg-blue-500/20 rounded-full blur-3xl" />
  <div className="absolute top-32 -right-32 h-72 w-72 bg-indigo-500/20 rounded-full blur-3xl" />

  {/* CONTENT */}
  <div className="relative container mx-auto px-6 py-14 md:py-16 text-center text-white">

    {/* Title */}
    <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
      Explore Career-Focused Courses
    </h1>

    {/* Subtitle */}
    <p className="mt-3 text-base md:text-lg text-white/80 max-w-2xl mx-auto">
      Discover the best courses across top colleges and universities in India.
      Compare duration, level and career outcomes.
    </p>

    {/* Search */}
    <div className="mt-7 max-w-xl mx-auto relative">
      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
        🔍
      </span>
      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search B.Tech, MBA, MBBS, Design..."
        className="w-full pl-12 pr-4 py-3 rounded-full text-slate-900 text-base
                   shadow-lg focus:ring-2 focus:ring-blue-300 outline-none"
      />
    </div>

    {/* STATS (compact) */}
    <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
      <div className="bg-white/10 backdrop-blur rounded-xl p-4">
        <p className="text-2xl font-extrabold">500+</p>
        <p className="text-xs text-white/80">Courses Available</p>
      </div>

      <div className="bg-white/10 backdrop-blur rounded-xl p-4">
        <p className="text-2xl font-extrabold">50+</p>
        <p className="text-xs text-white/80">Career Streams</p>
      </div>

      <div className="bg-white/10 backdrop-blur rounded-xl p-4">
        <p className="text-2xl font-extrabold">100K+</p>
        <p className="text-xs text-white/80">Students Guided</p>
      </div>
    </div>

    {/* Trust Line */}
    <p className="mt-6 text-xs text-white/70">
      Trusted by students across India • Verified course data • Career-oriented guidance
    </p>

  </div>
</section>



      <div className="container mx-auto px-6 py-12">
        {/* FILTERS */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-12 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Filter by Stream</h3>
              <div className="flex flex-wrap gap-2">
                {streams.map((stream) => (
                  <button
                    key={stream}
                    onClick={() => setSelectedStream(stream)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                      selectedStream === stream
                        ? "bg-[--primary-medium] text-white border-[--primary-medium]"
                        : "bg-white border-slate-300"
                    }`}
                  >
                    {stream}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Filter by Level</h3>
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                      selectedLevel === level
                        ? "bg-[--primary-medium] text-white border-[--primary-medium]"
                        : "bg-white border-slate-300"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {(selectedStream !== "All" || selectedLevel !== "All") && (
            <div className="text-center">
              <button
                onClick={clearFilters}
                className="text-red-600 font-semibold"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* COURSES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCourses.map((course, index) => (
            <AnimatedContainer key={course.courseKey} delay={index * 80}>
           <div
  onClick={() =>
    setView({
      page: "course-detail",
      courseIds: course.courseIds,
      courseKey: course.courseKey,
    })
  }
  className="
    bg-white rounded-2xl border
    shadow-[0_8px_24px_rgba(0,0,0,0.08)]
    hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]
    transition-all duration-300
    p-6 cursor-pointer flex flex-col h-full
  "
>
  {/* TAGS */}
  <div className="flex justify-between mb-4">
    <span className="px-3 py-1 text-xs bg-slate-100 rounded-full font-semibold">
      Full Time
    </span>
    <span className="px-3 py-1 text-xs bg-slate-100 rounded-full font-semibold">
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
  <div className="grid grid-cols-2 gap-3 text-sm mb-6">
    <div className="border rounded-lg p-3">
      <p className="text-xs text-slate-500">Duration</p>
      <p className="font-semibold">
        {course.duration || "N/A"}
      </p>
    </div>

    <div className="border rounded-lg p-3">
      <p className="text-xs text-slate-500">Avg. Fees</p>
      <p className="font-semibold">
    {course.fees}



      </p>
    </div>

    <div className="border rounded-lg p-3">
      <p className="text-xs text-slate-500">Colleges</p>
     <p className="font-semibold">
 {course.colleges?.length || 0}

</p>

    </div>

    <div className="border rounded-lg p-3">
      <p className="text-xs text-slate-500">Level</p>
      <p className="font-semibold">
        {course.level}
      </p>
    </div>
  </div>

  {/* FOOTER */}
  <div className="mt-auto flex justify-between items-center">
    <span className="text-[12px] font-semibold text-blue-700">
      Course Overview →
    </span>
    <span className="px-4 py-2 bg-green-500 text-white text-xs rounded-full font-semibold">
      View Details
    </span>
  </div>
</div>

            </AnimatedContainer>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
