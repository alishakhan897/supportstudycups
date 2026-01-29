import React, { useState, useMemo, useEffect } from "react";
import type { College } from "../types";
import CollegeCard from "../components/CollegeCard";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";


/* ================= TYPES ================= */
type Filters = {
  college: string;
  city: string;
  course: string;
  stream: string;
  collegeType: string;
  minRating: number;
  region?: string;
};

interface ListingPageProps {
  colleges: College[];
  compareList: number[];
  onCompareToggle: (id: number) => void;
  onOpenApplyNow: () => void;
  onOpenBrochure: () => void;
  initialFilters?: { college?: string; city?: string; course?: string };
}
const REGION_MAP = {
  "Delhi NCR": {
    cities: [
      "Delhi",
      "New Delhi",
      "Noida",
      "Greater Noida",
      "Alpha Greater Noida",
      "Gurgaon",
      "Faridabad",
      "Ghaziabad",
      "Dwarka",
      "Rohini"
    ]
  }
};

interface FilterSidebarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onClearFilters: () => void;
  forceShow?: boolean;
  colleges: College[];
}

/* ================= UTILS ================= */

const normalize = (s?: string) =>
  typeof s === "string"
    ? s.toLowerCase().replace(/\s+/g, "").replace(/[,.]/g, "")
    : "";

/* ================= ACCORDION ================= */ 


const parseSeoSlug = (slug?: string) => {
  if (!slug) return {};

  if (slug === "top-colleges") return {};

  const match = slug.match(/^top-colleges-in-(.+)$/);
  if (match) {
    return { location: match[1] }; // uttar-pradesh
  }

  return {};
};


const FilterAccordion: React.FC<{
  title: string;
  children: React.ReactNode;
  maxHeight?: string;
}> = ({ title, children, maxHeight = "240px" }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b pb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-sm font-semibold text-slate-800"
      >
        {title}
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {open && (
        <div
          className="
            mt-3 space-y-2
            overflow-y-auto
            pr-2
            scrollbar-thin
            scrollbar-thumb-slate-300
            scrollbar-track-transparent
          "
          style={{ maxHeight }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

const INDIAN_STATES = new Set([
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Jammu and Kashmir",
  "Chandigarh",
  "Puducherry",
  "Ladakh"
]); 
const getStreamSeoSlug = (stream: string): string => {
  const key = normalize(stream); // Your existing normalize fn
  const mappings: Record<string, string> = {
    ...Object.fromEntries(Object.entries(COURSE_SLUG_MAP).map(([k, v]) => [k, k])),
    engineering: 'btech',
    'b tech': 'btech',
    'b.e': 'btech',
    management: 'mba',
    medical: 'mbbs',
    'computer applications': 'bca'
  };
  return mappings[key] || toSeoSlug(stream);
};

const COURSE_SLUG_MAP: Record<string, string[]> = {
  mba: ["MBA", "PGDM", "Management"],
  btech: ["B.Tech", "BTech", "BE", "B.E", "Engineering"],
  bca: ["BCA", "Computer Applications"],
  mbbs: ["MBBS", "Medical"],
  bcom: ["bcom"],
  bsc: ["bsc"],
  ba: ["ba"],
  bba: ["bba"],
};

/* ================= FILTER SIDEBAR ================= */

const toSeoSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[.\s]+/g, "-")   // 🔥 removes dots AND spaces
    .replace(/\//g, "-")
    .replace(/--+/g, "-");

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
  onClearFilters,
  forceShow = false,
  colleges,
}) => {


  const { streams, states, cities, collegeTypes } = useMemo(() => {
    const streamSet = new Set<string>();
    const typeSet = new Set<string>();

    // 📊 location intelligence
    const locationStats = new Map<
      string,
      { first: number; second: number }
    >();

    colleges.forEach(c => {
      // STREAM
      if (Array.isArray(c.stream)) c.stream.forEach(s => streamSet.add(s));
      else if (typeof c.stream === "string") streamSet.add(c.stream);

      // COLLEGE TYPE
      if (c.type) typeSet.add(c.type.trim());

      // LOCATION ANALYSIS
      if (typeof c.location === "string") {
        const parts = c.location.split(",").map(p => p.trim());

        parts.forEach((part, index) => {
          if (!locationStats.has(part)) {
            locationStats.set(part, { first: 0, second: 0 });
          }
          const stat = locationStats.get(part)!;
          if (index === 0) stat.first++;
          if (index === 1) stat.second++;
        });
      }
    });

    // CLASSIFICATION
    const stateSet = new Set<string>();
    const citySet = new Set<string>();

    locationStats.forEach((stat, name) => {
      const normalized = name.trim();

      // ✅ If known state → ALWAYS state
      if (INDIAN_STATES.has(normalized)) {
        stateSet.add(normalized);
        return;
      }

      // ❌ Everything else → City
      citySet.add(normalized);
    }); 






    return {
      streams: Array.from(streamSet).sort(),
      states: Array.from(stateSet).sort(),
      cities: Array.from(citySet).sort(),
      collegeTypes: ["All", ...Array.from(typeSet)],
    };
  }, [colleges]);


  const ratings = [
    { label: "Any", value: 0 },
    { label: "4.5+", value: 4.5 },
    { label: "4.0+", value: 4.0 },
    { label: "3.5+", value: 3.5 },
  ];

  return (
    <aside
      className={`${forceShow ? "block" : "hidden lg:block"} lg:w-1/4 xl:w-1/5 lg:sticky lg:top-28`}
    >
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between px-5 py-4 border-b bg-slate-50">
          <h3 className="font-bold">Filters</h3>
          <button onClick={onClearFilters} className="text-blue-600 text-sm">
            Clear All
          </button>
        </div>

        <div className="p-5 space-y-5">

          {/* STREAM */}
          <FilterAccordion title="Stream">
            <div className="flex flex-wrap gap-2">
              {["All", ...streams].map(s => (
                <button
                  key={s}
                onClick={() =>
  setFilters(p => ({
    ...p,
    stream: s,
    city: "",
    region: undefined, // 🔥 RESET LOCATION
  }))
}

                  className={`px-3 py-1.5 text-xs rounded-full border ${filters.stream === s
                    ? "bg-[var(--primary-medium)] text-white"
                    : "bg-white text-slate-700"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </FilterAccordion>

          {/* STATE */}
          <FilterAccordion title="State">
            {states.map(s => (
              <label key={s} className="flex gap-2 text-sm">
                <input
                  type="radio"
                  checked={filters.region === s}
                  onChange={() =>
                    setFilters(p => ({
                      ...p,
                      region: s,
                      city: "", // 🔥 CLEAR CITY ONLY
                    }))
                  }
                />
                {s}
              </label>
            ))}
          </FilterAccordion>



          {/* CITY */}
          <FilterAccordion title="City">
            {cities.map(c => (
              <label key={c} className="flex gap-2 text-sm">
                <input
                  type="radio"
                  checked={filters.city === c}
                  onChange={() =>
                    setFilters(p => ({
                      ...p,
                      city: c,
                      region: undefined, // 🔥 CLEAR STATE ONLY
                    }))
                  }
                />
                {c}
              </label>
            ))}
          </FilterAccordion>

          {/* COLLEGE TYPE */}
          <FilterAccordion title="College Type">
            {collegeTypes.map(t => (
              <button
                key={t}
                onClick={() => setFilters(p => ({ ...p, collegeType: t }))}
                className={`w-full text-xs px-3 py-2 rounded border ${filters.collegeType === t
                  ? "bg-[var(--primary-medium)] text-white"
                  : "bg-white"
                  }`}
              >
                {t}
              </button>
            ))}
          </FilterAccordion>

          {/* RATING */}
          <FilterAccordion title="Rating">
            <div className="flex flex-wrap gap-2">
              {ratings.map(r => (
                <button
                  key={r.value}
                  onClick={() => setFilters(p => ({ ...p, minRating: r.value }))}
                  className={`px-3 py-1.5 text-xs rounded-full border ${filters.minRating === r.value
                    ? "bg-amber-400 text-black"
                    : "bg-white"
                    }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </FilterAccordion>

        </div>
      </div>
    </aside>
  );
};

/* ================= MAIN PAGE ================= */

const ListingPage: React.FC<ListingPageProps> = ({

  colleges,
  compareList,
  onCompareToggle,
  onOpenApplyNow,
  onOpenBrochure, // ✅ ADD THIS
  initialFilters,
}) => {

const { stream, seoSlug } = useParams();

console.log("🟢 ROUTE PARAMS:", { stream, seoSlug });

const navigate = useNavigate();
const location = useLocation();

const [filters, setFilters] = useState<Filters>({
  college: "",
  city: "",
  course: "",
  stream: stream
    ? stream
        .replace(/-/g, " ")
        .replace(/\b\w/g, l => l.toUpperCase())
    : "All",
  collegeType: "All",
  minRating: 0,
});
const lastUrlRef = React.useRef<string | null>(null);
useEffect(() => {
  if (!hasInitializedRef.current) return;
  if (!filters.stream || filters.stream === "All") return;

  // 🔥 ALWAYS lowercase SEO slug for route matching
  const streamSlug = toSeoSlug(filters.stream).replace(/engineering|b-tech|btech|be/, 'btech') // Normalize common variants
    .replace(/mba|pgdm|management/, 'mba') // Normalize MBA variants
    .replace(/medical|mbbs/, 'mbbs')
    .replace(/bca|computer-applications/, 'bca');

  let nextUrl = `/${streamSlug}/top-colleges`;

  if (filters.city) {
    nextUrl += `-in-${toSeoSlug(filters.city)}`;
  } else if (filters.region) {
    nextUrl += `-in-${toSeoSlug(filters.region)}`;
  }

  // 🛑 Prevent infinite loops
  if (lastUrlRef.current === nextUrl) return;
  lastUrlRef.current = nextUrl;

  navigate(nextUrl, { replace: true });
}, [filters.stream, filters.city, filters.region, navigate]);







 const hasInitializedRef = React.useRef(false);

useEffect(() => {
  if (hasInitializedRef.current) return;

  const nextFilters: Partial<Filters> = {};

  // STREAM
  if (stream) {
    nextFilters.stream = stream
      .replace(/-/g, " ")
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  // LOCATION FROM SEO SLUG
  const parsed = parseSeoSlug(seoSlug);

  if (parsed.location) {
    const raw = parsed.location.replace(/-/g, " ");
    const normalized = raw.toLowerCase();

    const matchedState = Array.from(INDIAN_STATES).find(
      s => s.toLowerCase() === normalized
    );

    if (matchedState) {
      nextFilters.region = matchedState;
      nextFilters.city = "";
    } else {
      nextFilters.city = raw.replace(/\b\w/g, l => l.toUpperCase());
      nextFilters.region = undefined;
    }
  }

  setFilters(p => ({ ...p, ...nextFilters }));
  hasInitializedRef.current = true;

  console.log("✅ INIT FILTERS FROM URL:", nextFilters);
}, [stream, seoSlug]);


  console.log("Applied stream filter:", filters.stream);
  const selectedRegion = location.state?.region || null;

  const normalizeText = (s = "") =>
    s.toLowerCase().replace(/\s+/g, "").replace(/[.,]/g, "");

  const filterByRegion = (college, region) => {
    if (!region) return true;

    const location = normalizeText(college.location || "");

    // 1️⃣ NCR special handling (existing behavior preserved)
    const ncrConfig = REGION_MAP[region];
    if (ncrConfig) {
      return ncrConfig.cities.some(city =>
        location.includes(normalizeText(city))
      );
    }

    // 2️⃣ NORMAL STATE MATCH (NEW, REQUIRED)
    return location.includes(normalizeText(region));
  };



  const [showMobileFilters, setShowMobileFilters] = useState(false);


  useEffect(() => {
    if (initialFilters) {
      setFilters(p => ({ ...p, ...initialFilters }));
    }

    if (location.state && typeof location.state === "object") {
      const navState = location.state as any;

      setFilters(p => ({
        ...p,
        ...navState,      // college, city, course
        region: navState.region ?? undefined, // ✅ REGION SAFE
      }));
    }
  }, [initialFilters, location.state]);

  const HERO_TITLE_MAP: Record<string, string> = {
    mba: "Top MBA Colleges",
    btech: "Top Engineering Colleges",
    bca: "Top BCA Colleges",
    mbbs: "Top Medical Colleges",
  };


  const clearFilters = () =>
    setFilters({
      college: "",
      city: "",
      region: undefined, // 🔥 REQUIRED
      course: "",
      stream: "All",
      collegeType: "All",
      minRating: 0,
    });



  const filteredColleges = useMemo(() => { 
   
    return colleges.filter((c) => {
     
      // 1️⃣ College name
      if (
        filters.college &&
        !c.name?.toLowerCase().includes(filters.college.toLowerCase())
      ) return false;

      // 2️⃣ City
      if (filters.city) {
        const loc = normalize(c.location);
        if (!loc.includes(normalize(filters.city))) return false;
      }

      // 3️⃣ Course
      if (filters.course) {
        const courses = c.rawScraped?.courses;
        if (!Array.isArray(courses)) return true;

        const hasCourse = courses.some(co =>
          co.name?.toLowerCase().includes(filters.course.toLowerCase())
        );
        if (!hasCourse) return false;
      }

    
   // 4️⃣ Stream (FINAL & NULL-SAFE)
if (filters.stream !== "All") {
  const collegeStreamsRaw = Array.isArray(c.stream)
    ? c.stream
    : [c.stream];

  const normalizeStream = (v: unknown) => {
    if (typeof v !== "string") return "";
    return v.toLowerCase().replace(/[^a-z]/g, "");
  };

  const normalizedCollege = collegeStreamsRaw
    .map(normalizeStream)
    .filter(Boolean); // 🔥 removes empty strings

  const key = filters.stream.toLowerCase().replace(/\s+/g, "");
  const allowed = COURSE_SLUG_MAP[key] ?? [filters.stream];

  const normalizedAllowed = allowed
    .map(normalizeStream)
    .filter(Boolean);

  const match = normalizedCollege.some(cs =>
    normalizedAllowed.some(as =>
      cs.includes(as) || as.includes(cs)
    )
  );

  if (!match) return false;
}


      // 5️⃣ College type
      if (
        filters.collegeType !== "All" &&
        c.type &&
        c.type !== filters.collegeType
      ) return false;

      // 6️⃣ Rating
      if (filters.minRating > 0) {
        const rating = Number(c.rating);
        if (!rating || rating < filters.minRating) return false;
      }

   
      // 7️⃣ Region (ONLY when city is NOT selected)
      if (!filters.city && filters.region && !filterByRegion(c, filters.region)) {
        return false;
      }


      return true; // ✅ ONLY BOOLEAN
    });
  }, [colleges, filters]);


 console.log("FILTER COUNT:", filteredColleges.length); 
 const seoTitle = (() => {
  if (filters.stream && filters.stream !== "All") {
    if (filters.region) {
      return `${filters.stream} Colleges in ${filters.region} 2026 – Fees, Ranking, Admission | StudyCups`;
    }
    if (filters.city) {
      return `${filters.stream} Colleges in ${filters.city} 2026 – Fees, Ranking, Admission | StudyCups`;
    }
    return `Top ${filters.stream} Colleges in India 2026 – Fees, Ranking, Admission | StudyCups`;
  }
  return "Top Colleges in India 2026 – Rankings, Fees, Admissions | StudyCups";
})();

const seoDescription = (() => {
  if (filters.region || filters.city) {
    return `Explore top ${filters.stream} colleges in ${filters.city || filters.region}. Compare fees, rankings, placements, cutoffs and admission process for 2026.`;
  }
  return "Compare top colleges in India by fees, rankings, placements, cutoffs and admission process.";
})();


  return ( 
   
    

    <div className="bg-[#f5f7fb] min-h-screen">
 <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link
          rel="canonical"
          href={`https://studycups.in${location.pathname}`}
        />
      </Helmet>
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
  {/* 🟢 NO FILTERS → PILLAR SEO PAGE */}
  {!filters.stream || filters.stream === "All" ? (
    filters.city || filters.region ? (
      <>Top Colleges in {filters.city || filters.region}</>
    ) : (
      <>Top Colleges in India</>  
    )
  ) : (
    <>
      Top {filters.stream} Colleges
      {filters.city && ` in ${filters.city}`}
      {!filters.city && filters.region && ` in ${filters.region}`}
    </>
  )}
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
        <div className="bg-white rounded-xl border-none shadow-none flex items-center gap-3 px-4 py-3">
          <input
            placeholder="Search college, city, course..."
            className="
      flex-1 text-sm
      bg-transparent
      border-0
      outline-none
      ring-0
      focus:ring-0
      focus:outline-none
      shadow-none
    "
            value={filters.college}
            onChange={(e) =>
              setFilters((p) => ({ ...p, college: e.target.value }))
            }
          />
          <button
            onClick={() => setShowMobileFilters(true)}
            className="text-sm font-semibold text-[var(--primary-medium)]"
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

                  isCompared={compareList.includes(String(college.id))}

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
