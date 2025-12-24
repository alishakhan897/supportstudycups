import React, { useState, useMemo, useEffect } from "react";
import type { View, College } from "../types";
import CollegeCard from "../components/CollegeCard";
import { COURSE_STREAMS } from "../constants";

/* ================= TYPES ================= */

type Filters = {
  college: string;
  city: string;
  course: string;
  stream: string;
  collegeType: string;

  minRating: number;
};

interface ListingPageProps {
  setView: (view: View) => void;
  colleges: College[];
  compareList: number[];
  onCompareToggle: (id: number) => void;
  onOpenApplyNow: () => void;
  onOpenBrochure: () => void;   // ✅ ADD THIS
  onOpenAIAssistant: () => void;
  initialFilters?: { college?: string; city?: string; course?: string };
}


interface FilterSidebarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onClearFilters: () => void;
  forceShow?: boolean;
  colleges: College[];

}

/* ================= FILTER SIDEBAR (UNCHANGED) ================= */

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
  onClearFilters,
  forceShow = false,
  colleges,
}) => {
  const streams = useMemo(() => {
  const set = new Set<string>();

  colleges.forEach((c) => {
    const s = c.rawScraped?.stream;
    if (Array.isArray(s)) s.forEach(v => set.add(v));
    else if (typeof s === "string") set.add(s);
  });

  return Array.from(set);
}, [colleges]);

  const collegeTypes = useMemo(() => {
  const set = new Set<string>();
  colleges.forEach((c) => {
    if (c.type) set.add(c.type.trim());
  });
  return ["All", ...Array.from(set)];
}, [colleges]);

  const ratings = [
    { label: "Any", value: 0 },
    { label: "4.5+", value: 4.5 },
    { label: "4.0+", value: 4.0 },
    { label: "3.5+", value: 3.5 },
  ];

  return (
    <aside
      className={`
        ${forceShow ? "block" : "hidden lg:block"}
        lg:w-1/4 xl:w-1/5
        lg:sticky lg:top-28
      `}
    >
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b bg-slate-50">
          <h3 className="text-base font-bold text-slate-800">Filters</h3>
          <button
            onClick={onClearFilters}
            className="text-sm font-semibold text-[--primary-medium] hover:underline"
          >
            Clear All
          </button>
        </div>

        <div className="p-5 space-y-6">

          {/* BASIC SEARCH */}
          <div className="space-y-3">
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[--primary-medium] focus:border-[--primary-medium]"
              placeholder="College name"
              value={filters.college}
              onChange={(e) =>
                setFilters((p) => ({ ...p, college: e.target.value }))
              }
            />
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[--primary-medium]"
              placeholder="City"
              value={filters.city}
              onChange={(e) =>
                setFilters((p) => ({ ...p, city: e.target.value }))
              }
            />
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[--primary-medium]"
              placeholder="Course"
              value={filters.course}
              onChange={(e) =>
                setFilters((p) => ({ ...p, course: e.target.value }))
              }
            />
          </div>

          {/* STREAM */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">
              Stream
            </h4>
            <div className="flex flex-wrap gap-2">
              {["All", ...streams].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilters((p) => ({ ...p, stream: s }))}
                  className={`
                    px-3 py-1.5 text-xs font-medium rounded-full border
                    ${filters.stream === s
                      ? "bg-[--primary-medium] text-white border-[--primary-medium]"
                      : "bg-white text-slate-700 hover:bg-slate-100"
                    }
                  `}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* COLLEGE TYPE */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">
              College Type
            </h4>
            <div className="flex gap-1">
              {collegeTypes.map((t) => (
                <button
                  key={t}
                  onClick={() =>
                    setFilters((p) => ({ ...p, collegeType: t }))
                  }
                  className={`
                    px-2 py-2 text-[9px] font-medium rounded-lg border
                    ${filters.collegeType === t
                      ? "bg-[--primary-medium] text-white border-[--primary-medium]"
                      : "bg-white text-slate-700 hover:bg-slate-100"
                    }
                  `}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* RATING */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">
              Minimum Rating
            </h4>
            <div className="flex flex-wrap gap-2">
              {ratings.map((r) => (
                <button
                  key={r.value}
                  onClick={() =>
                    setFilters((p) => ({ ...p, minRating: r.value }))
                  }
                  className={`
                    px-3 py-1.5 text-xs font-medium rounded-full border
                    ${filters.minRating === r.value
                      ? "bg-amber-400 text-black border-amber-400"
                      : "bg-white text-slate-700 hover:bg-slate-100"
                    }
                  `}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </aside>
  );
};


/* ================= MAIN PAGE ================= */

const ListingPage: React.FC<ListingPageProps> = ({
  setView,
  colleges,
  compareList,
  onCompareToggle,
  onOpenApplyNow,
  onOpenBrochure, // ✅ ADD THIS
  initialFilters,
}) => {
  const [filters, setFilters] = useState<Filters>({
    college: "",
    city: "",
    course: "",
    stream: "All",
    collegeType: "All",
    minRating: 0,
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    if (initialFilters) {
      setFilters((p) => ({ ...p, ...initialFilters }));
    }
  }, [initialFilters]);

 const normalize = (s = "") =>
  s.toLowerCase().replace(/\s+/g, "");


const filteredColleges = useMemo(() => {
  return colleges.filter((c) => {

    // 1️⃣ College name
    if (
      filters.college &&
      !c.name?.toLowerCase().includes(filters.college.toLowerCase())
    ) return false;

    // 2️⃣ City
    if (
      filters.city &&
      !normalize(c.location).includes(normalize(filters.city))
    ) return false;

    // 3️⃣ Course (SAFE)
    if (filters.course) {
      const courses = c.rawScraped?.courses;
      if (!Array.isArray(courses)) return true; // allow if missing
      const hasCourse = courses.some(co =>
        co.name?.toLowerCase().includes(filters.course.toLowerCase())
      );
      if (!hasCourse) return false;
    }

    // 4️⃣ Stream (SAFE + normalized)
    if (filters.stream !== "All") {
      const s = c.rawScraped?.stream;
      if (!s) return true; // allow missing stream

      const match = Array.isArray(s)
        ? s.map(v => v.toLowerCase()).includes(filters.stream.toLowerCase())
        : s.toLowerCase() === filters.stream.toLowerCase();

      if (!match) return false;
    }

    // 5️⃣ College type (SAFE)
    if (
      filters.collegeType !== "All" &&
      c.type &&
      c.type !== filters.collegeType
    ) return false;

    // 6️⃣ Rating (SAFE)
    if (filters.minRating > 0) {
      const rating = Number(c.rating);
      if (!rating || rating < filters.minRating) return false;
    }

    return true;
  });
}, [colleges, filters]);



  const clearFilters = () =>
    setFilters({
      college: "",
      city: "",
      course: "",
      stream: "All",
      collegeType: "All",
      minRating: 0,
    });

  return (
    <div className="bg-[#f5f7fb] min-h-screen">

      {/* HERO */}
      <section className="md:mt-24 mt-10 mb-6">

        {/* MOBILE: full width | DESKTOP: centered */}
        <div className="md:max-w-7xl md:mx-auto md:px-6">

          <div
            className="
        bg-gradient-to-b from-[#0f2a44] to-[#1e4e79] text-white
        rounded-none md:rounded-3xl rounded-b-3xl
        px-4 md:px-6
        py-8
      "
          >
            <h1 className="text-xl md:text-3xl font-extrabold">
              Explore Top Colleges in India
            </h1>

            <p className="text-sm md:text-base text-slate-200 mt-1">
              Compare colleges by fees, placements, ratings and courses.
            </p>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-emerald-400">500+</p>
                <p className="text-[11px] text-white/80">Colleges Listed</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-lg font-bold">50</p>
                <p className="text-[11px] text-white/80">States Covered</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-sky-300">100K+</p>
                <p className="text-[11px] text-white/80">Students Enrolled</p>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ✅ ONLY MOBILE SEARCH + FILTER (UPPER ONE) */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 -mt-3 mb-4">
        <div className="bg-white rounded-xl border shadow flex items-center gap-3 px-4 py-3">
          <input
            placeholder="Search college, city, course..."
            className="flex-1 text-sm outline-none"
            value={filters.college}
            onChange={(e) =>
              setFilters((p) => ({ ...p, college: e.target.value }))
            }
          />
          <button
            onClick={() => setShowMobileFilters(true)}
            className="text-sm font-semibold text-[--primary-medium]"
          >
            Filters
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* DESKTOP FILTER */}
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            onClearFilters={clearFilters}
            colleges={colleges}
          />


          <main className="flex-1">

            {/* DESKTOP RESULT HEADER */}
            <div className="hidden lg:block mb-6">
              <h2 className="text-2xl font-bold">
                Showing {filteredColleges.length} of {colleges.length} Colleges
              </h2>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 
                justify-items-center md:justify-items-stretch ">


              {filteredColleges.map((college) => (
                <CollegeCard
                  key={college.id}
                  college={college}
                  setView={setView}
                  isCompared={compareList.includes(college.id)}
                  onCompareToggle={onCompareToggle}
                  isListingCard
                  onOpenApplyNow={onOpenApplyNow}
                  onOpenBrochure={onOpenBrochure} // ✅ NOW IT WORKS
                />

              ))}
            </div>
          </main>
        </div>
      </div>

      {/* MOBILE FILTER BOTTOM SHEET */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end lg:hidden">
          <div className="bg-white w-full rounded-t-3xl max-h-[90vh] overflow-y-auto p-6 animate-slideUp">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Filters</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-red-600 font-semibold text-sm"
              >
                Close
              </button>
            </div>

            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              onClearFilters={clearFilters}
               colleges={colleges} 
              forceShow
            />

            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full mt-6 bg-[--primary-medium] text-white py-3 rounded-xl font-semibold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.25s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ListingPage;
