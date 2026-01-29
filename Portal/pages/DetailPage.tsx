import React, { useEffect, useMemo, useState } from "react";
import type { View, College } from "../types";
import { getCollegeImages } from "../collegeImages";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import FlexibleBlockRenderer from './FlexibleBlockRenderer'
import {  toCourseSlug } from "./Seo"

import {
  Monitor,
  Dumbbell,
  Stethoscope,
  Coffee,
  BookOpen,
  Building2,
  BedDouble,
  Trophy,
  Wifi,
  Car,
  FlaskConical,
  Users
} from "lucide-react";

// FACILITY ICON MAP (Homepage only)
const FACILITY_ICON_MAP: Record<string, React.ReactNode> = {
  comp_labs: <Monitor size={16} />,
  sports: <Trophy size={16} />,
  gym: <Dumbbell size={16} />,
  medical: <Stethoscope size={16} />,
  cafeteria: <Coffee size={16} />,
  library: <BookOpen size={16} />,
  auditorium: <Building2 size={16} />,
  hostel: <BedDouble size={16} />,

  // future (safe)
  wifi: <Wifi size={16} />,
  parking: <Car size={16} />,
  labs: <FlaskConical size={16} />,
  classrooms: <Users size={16} />
};


interface DetailPageProps {
  colleges: College[];
  compareList: string[];
  onCompareToggle: (id: string) => void;
  onOpenApplyNow: () => void;
  onOpenBrochure: () => void;
}


type CollegeDetail = {
  overview?: string;
  courses?: any[];
  fees?: any;
  placements?: any;
  reviews?: any[];
  gallery?: string[];

  ranking_data?: any[];
  rawScraped?: any;
  type?: string;
};

const Stat = ({ label, value }: { label: string; value: any }) => (
  <div className="rounded-xl bg-slate-50 border p-3 text-center">
    <p className="text-lg font-bold text-slate-900">{value}</p>
    <p className="text-xs text-slate-500">{label}</p>
  </div>
);

const InfoRow = ({ label, value }: any) => (
  <div className="flex justify-between text-sm">
    <span className="text-slate-500">{label}</span>
    <span className="font-semibold text-slate-900">{value}</span>
  </div>
);

const buildRankingTable = (rawData: any[]) => {
  const table: Record<string, Record<string, any>> = {};
  const yearsSet = new Set<string>();

  rawData.forEach(entry => {
    const stream = entry.stream || "Overall";
    const lines = normalizeRankingText(entry.ranking);

    lines.forEach(line => {
      const parsed = parseRankingLine(line);
      if (!parsed.year) return;

      yearsSet.add(parsed.year);

      // Ignore international here (optional: separate table later)
      if (parsed.isInternational) return;

      // Only India rankings participate in main table
      if (!parsed.isIndia) return;

      if (!table[stream]) table[stream] = {};

      const current = table[stream][parsed.year];

      // ✅ BEST ranking per year (lower rank = better)
      if (!current || isBetterRank(parsed.rank!, current.rank)) {
        table[stream][parsed.year] = {
          rank: parsed.rank,
          main: parsed.raw,
          state: current?.state || null
        };
      }

      // ✅ Attach state ranking only ONCE
      if (
        parsed.isState &&
        table[stream][parsed.year] &&
        !table[stream][parsed.year].state
      ) {
        table[stream][parsed.year].state = parsed.raw;
      }
    });
  });

  const years = Array.from(yearsSet).sort((a, b) => b.localeCompare(a));
  return { table, years };
};





const buildCourseSlug = (name: string) => {
  return encodeURIComponent(
    name
      .toLowerCase()
      .trim()
  );
};

type DescriptionBlock =
  | { type: "text"; content: string }
  | { type: "list"; items: string[] }
  | { type: "table"; columns: string[]; rows: string[][] };

const normalizeDescription = (description: any): DescriptionBlock[] => {
  if (!description) return [];

  const blocks: DescriptionBlock[] = [];

  // ✅ CASE 1: description is string
  if (typeof description === "string") {
    return [{ type: "text", content: description }];
  }

  // ✅ CASE 2: description is object
  if (typeof description === "object") {

    // handle numeric / unknown keys → text
    Object.keys(description).forEach((key) => {
      if (key !== "blocks" && typeof description[key] === "string") {
        blocks.push({
          type: "text",
          content: description[key]
        });
      }
    });

    // handle structured blocks safely
    if (Array.isArray(description.blocks)) {
      description.blocks.forEach((block: any) => {

        // TEXT
        if (block.type === "text" && block.content) {
          blocks.push({
            type: "text",
            content: block.content
          });
        }

        // LIST (SAFE)
        if (
          block.type === "list" &&
          Array.isArray(block.data?.items)
        ) {
          blocks.push({
            type: "list",
            items: block.data.items
          });
        }

        // TABLE (SAFE)
        if (
          block.type === "table" &&
          Array.isArray(block.data?.columns) &&
          Array.isArray(block.data?.rows)
        ) {
          blocks.push({
            type: "table",
            columns: block.data.columns,
            rows: block.data.rows
          });
        }
      });
    }
  }

  return blocks;
};

const parseRankingLine = (line: string) => {
  const rankMatch = line.match(/#(\d+|\d+-\d+)/);
  const yearMatch = line.match(/(20\d{2})/);

  return {
    raw: line.trim(),
    rank: rankMatch ? rankMatch[1] : null,
    year: yearMatch ? yearMatch[1] : null,
    isIndia: /india/i.test(line),
    isState: /uttar pradesh/i.test(line),
    isInternational: /international/i.test(line)
  };
};
const isBetterRank = (a?: string, b?: string) => {
  if (!a) return false;
  if (!b) return true;

  const aNum = parseInt(a);
  const bNum = parseInt(b);

  if (isNaN(aNum)) return false;
  if (isNaN(bNum)) return true;

  return aNum < bNum; // smaller = better
};


const normalizeRankingText = (ranking: any): string[] => {
  // case 1: simple string
  if (typeof ranking === "string") {
    return ranking
      .split("#")
      .map(t => t.trim())
      .filter(Boolean);
  }

  // case 2: object {0:"",1:""}
  if (ranking && typeof ranking === "object") {
    return Object.values(ranking)
      .filter(v => typeof v === "string")
      .flatMap(v =>
        v
          .split("#")
          .map(t => t.trim())
          .filter(Boolean)
      );
  }

  return [];
};

const renderFlexibleText = (value: any): React.ReactNode => {
  // Case 1: string
  if (typeof value === "string") {
    return value;
  }

  // Case 2: number
  if (typeof value === "number") {
    return String(value);
  }

  // Case 3: array
  if (Array.isArray(value)) {
    return value.map((v, i) => (
      <div key={i}>{renderFlexibleText(v)}</div>
    ));
  }

  // Case 4: object (THIS IS YOUR CASE)
  if (value && typeof value === "object") {
    return Object.values(value).map((v, i) => (
      <div key={i}>{renderFlexibleText(v)}</div>
    ));
  }

  return "-";
};
const renderRankingCell = (value: any) => {
  // ✅ CASE 1: array of strings (MAIN CASE)
  if (Array.isArray(value)) {
    return value.length > 0 ? (
      <ul className="list-disc pl-4 space-y-1">
        {value.map((v, i) => (
          <li key={i} className="text-sm">
            {v}
          </li>
        ))}
      </ul>
    ) : (
      "-"
    );
  }

  // ✅ CASE 2: single string
  if (typeof value === "string") {
    return <div className="whitespace-pre-line">{value}</div>;
  }

  // ✅ CASE 3: object (safety for bad data)
  if (value && typeof value === "object") {
    return (
      <ul className="list-disc pl-4 space-y-1">
        {Object.values(value).map((v, i) => (
          <li key={i} className="text-sm">
            {String(v)}
          </li>
        ))}
      </ul>
    );
  }

  return "-";
};





const DetailPage: React.FC<DetailPageProps> = ({
  colleges,
  compareList,
  onCompareToggle,
  setView,
  onOpenApplyNow,
  onOpenBrochure
}) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Overview");
  const [detail, setDetail] = useState<CollegeDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestedColleges, setSuggestedColleges] = useState<College[]>([]);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [newsOpen, setNewsOpen] = useState<boolean[]>([]);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showAllExpired, setShowAllExpired] = useState(false);

  const upcoming = detail?.rawScraped?.important_dates?.upcoming_events || [];
  const expired = detail?.rawScraped?.important_dates?.expired_events || [];
  const [showAllHighlights, setShowAllHighlights] = useState(false);
  const [showVisited, setShowVisited] = useState(false);
  const [showAllFeeNotes, setShowAllFeeNotes] = useState(false);
  const [openSubCourseIndex, setOpenSubCourseIndex] = useState<number | null>(null);
  const [showFullAdmissionText, setShowFullAdmissionText] = useState(false);
  const [showAllAdmissionBullets, setShowAllAdmissionBullets] = useState(false);
  const [showAllLikes, setShowAllLikes] = useState(false);
  const [showAllDislikes, setShowAllDislikes] = useState(false);
  const [showAllStudentLikes, setShowAllStudentLikes] = useState(false);
  const [showAllStudentDislikes, setShowAllStudentDislikes] = useState(false); 
  const [lightboxOpen, setLightboxOpen] = useState(false);
const [activeImage, setActiveImage] = useState<string | null>(null);



  const { collegeIdSlug } = useParams<{ collegeIdSlug: string }>();

// URL example:
// /university/25946-iiml-indian-institute-of-management-lucknow
const collegeId = useMemo(() => {
  if (!collegeIdSlug) return null;
  return collegeIdSlug.split("-")[0]; // 🔥 ID always first
}, [collegeIdSlug]);

 
  const id = collegeId;

  const college = useMemo(
    () => colleges.find(c => String(c.id) === String(id)),
    [colleges, id]
  );



  const descriptionBlocks = useMemo(() => {
    return normalizeDescription(
      detail?.description ?? college?.description
    );
  }, [detail?.description, college?.description]);


  const getInitials = (name: string) => {
    if (!name) return "?";
    return name.replace("~", "").trim().charAt(0).toUpperCase();
  };

  type ReviewCardProps = {
    content: string;
    username: string;
    color: "green" | "red";
  };

  const ReviewCard: React.FC<ReviewCardProps> = ({
    content,
    username,
    color
  }) => {
    return (
      <div className="flex gap-4 p-4 border rounded-xl bg-white shadow-sm">
        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center 
        font-bold text-white text-sm
        ${color === "green" ? "bg-green-600" : "bg-red-600"}`}
        >
          {username?.replace("~", "").trim().charAt(0).toUpperCase() || "A"}
        </div>

        <div className="flex-1">
          <p className="text-sm text-slate-800 leading-relaxed">{content}</p>
          <p className="mt-1 text-xs text-slate-500">
            {username || "~ Anonymous"}
          </p>
        </div>
      </div>
    );
  };

  const handleBack = () => {
    navigate(-1); // previous page (college listing)
  };


  const sliceForMobile = (arr: string[], count = 5) =>
    arr.slice(0, count);
  const sliceSix = (arr: string[], showAll: boolean) =>
    showAll ? arr : arr.slice(0, 6);


  const admissionSections = detail?.rawScraped?.admission || [];



const openLightbox = (img: string) => {
  setActiveImage(img);
  setLightboxOpen(true);
};

const closeLightbox = () => {
  setLightboxOpen(false);
  setActiveImage(null);
};



  // QNA STATES FIX (ADDED)
  const [qnaOpen, setQnaOpen] = useState<boolean[]>([]);


  useEffect(() => {
    if (detail?.rawScraped?.qna?.length > 0) {
      setQnaOpen(Array(detail.rawScraped.qna.length).fill(false));
    }
  }, [detail]);

  const getRandomColleges = (list: College[], count = 4) => {
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const cleanedAboutText = useMemo(() => {
    const raw =
      detail?.rawScraped?.about_text ?? college?.description ?? "";

    // 🛡️ SAFETY GUARD
    if (typeof raw !== "string") return "";

    if (raw.includes("Read More")) {
      return raw.split("Read More")[0].trim();
    }

    return raw.trim();
  }, [detail?.rawScraped?.about_text, college?.description]);


  const textBlocks = descriptionBlocks.filter(b => b.type === "text");
  const nonTextBlocks = descriptionBlocks.filter(b => b.type !== "text");

  useEffect(() => {
    if (!college) return;

    const fetchSuggestedColleges = async () => {
      try {
        const res = await fetch(
          "https://studycupsbackend-wb8p.onrender.com/api/colleges"
        );
        const json = await res.json();

        if (json.success) {
          const filtered = json.data.filter(
            (c: College) => c.id !== college.id
          );
          setSuggestedColleges(getRandomColleges(filtered, 4));
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchSuggestedColleges();
  }, [college]);


  const slug = useMemo(() => {
    if (!college?.name) return "";

    return college.name
      .toLowerCase()
      .replace(/\([^)]*\)/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }, [college?.name]);


  const isCompared = college
    ? compareList.includes(college.id)
    : false;


  const placementPercentage = useMemo(() => {
    const highest = Number(college?.placements?.highestPackage);
    const average = Number(college?.placements?.averagePackage);

    if (!highest || !average) return null;

    return Math.round((average / highest) * 100);
  }, [college]);

  const alumni = useMemo(() => {
    const raw =
      detail?.rawScraped?.placement?.alumni ||
      college?.rawScraped?.placement?.alumni ||
      [];

    if (!Array.isArray(raw)) return [];

    return raw
      .map((item: string) => {
        const match = item.match(/(.+?)\s(\d+%)/);
        if (!match) return null;

        return {
          sector: match[1].trim(),
          percentage: match[2]
        };
      })
      .filter(Boolean);
  }, [detail, college]);




  useEffect(() => {
    if (!college?.id) return;

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://studycupsbackend-wb8p.onrender.com/api/colleges/${college.id}`
        );
        const json = await res.json();
        if (json.success) setDetail(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [college]);


  const handleDownloadBrochure = (collegeId: number) => {
    window.open(
      `https://studycupsbackend-production.up.railway.app/api/colleges/${collegeId}/brochure`,
      "_blank"
    );
  };

  const tabs = [
    "Overview",
    "Courses & Fees",
    "Placements",
    "Reviews",
    "Gallery",
  ];

  const ratingDistribution = [
    { stars: 5, percent: 62 },
    { stars: 4, percent: 28 },
    { stars: 3, percent: 4 },
    { stars: 2, percent: 6 },
    { stars: 1, percent: 0 },
  ];
  const rankingDataArray = useMemo(() => {
    const raw = detail?.rawScraped?.ranking_data;

    if (Array.isArray(raw)) return raw;
    if (raw && typeof raw === "object") return Object.values(raw);

    return [];
  }, [detail?.rawScraped?.ranking_data]);

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
const getCategorySlugFromStream = (courseName: string) => {
  return deriveStream(courseName)
    .toLowerCase()
    .replace(/\s+/g, "-");
};



  const renderTabContent = () => {
    switch (activeTab) {
      case "Courses & Fees":
        const courseData = detail?.rawScraped?.courses?.length
          ? detail.rawScraped.courses
          : [];

        return (
          <div className="space-y-6 ">

            {courseData.map((course: any, index: number) => (
              <div
                key={index}
                className="
    bg-white
    border
    rounded-2xl
    p-6
    shadow-sm
    hover:shadow-md
    transition-all
    space-y-4
  "
              >
                {/* Course Name */}
                <h3
                    onClick={(e) => {
                                        e.stopPropagation();
                                        const categorySlug = getCategorySlugFromStream(course.name);
                                        const courseSlug = toCourseSlug(course.name);
                                    
                                        navigate(`/courses/${categorySlug}/${courseSlug}`);
                                      }}
                  className="
    text-lg
    md:text-xl
    font-bold
    text-blue-900
    hover:underline
    cursor-pointer
  "
                >
                  {course.name}
                </h3>


                {/* Top Line */}
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600">

                  {course.rating && (
                    <span className="flex items-center gap-1 font-semibold text-yellow-600">
                      ⭐ {course.rating}
                    </span>
                  )}

                  {course.reviews && (
                    <span>{course.reviews}</span>
                  )}

                  {course.course_count && (
                    <span>{course.course_count}</span>
                  )}

                  {course.duration && (
                    <span>{course.duration}</span>
                  )}

                  {course.mode && (
                    <span>{course.mode}</span>
                  )}
                </div>

                {/* Horizontal divider */}
                <div className="border-t " />

                {/* Fee + Details */}
                <div className="flex flex-col md:flex-row justify-between gap-4">

                  <div className="text-sm text-slate-700 space-y-1">
                    <p>
                      <span className="font-semibold text-slate-900">
                        Eligibility:
                      </span>{" "}
                      {course.eligibility || "N/A"}
                    </p>

                    {course.application_dates && (
                      <p className="mt-1">
                        <span className="font-semibold text-slate-900">
                          Application Dates:
                        </span>{" "}
                        {course.application_dates}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">
                      {course.fees || "N/A"}
                    </p>

                    <p
                      className="text-xs text-blue-600 cursor-pointer hover:underline"
                           onClick={(e) => {
                                        e.stopPropagation();
                                        const categorySlug = getCategorySlugFromStream(course.name);
                                        const courseSlug = toCourseSlug(course.name);
                                    
                                        navigate(`/courses/${categorySlug}/${courseSlug}`);
                                      }}
                    >
                      Check Detailed Fees ›
                    </p>

                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap justify-between md:justify-end gap-3 mt-5">


                  <button
                    onClick={onOpenApplyNow}
                    className="px-5 py-2 bg-orange-500 text-white rounded-full text-xs font-semibold hover:bg-orange-600"
                  >
                    Apply Now
                  </button>

                </div>
                {course.sub_courses?.length > 0 && (
                  <button
                    onClick={() =>
                      setOpenSubCourseIndex(
                        openSubCourseIndex === index ? null : index
                      )
                    }
                    className="mt-3 text-blue-600 text-sm font-semibold flex items-center gap-1"
                  >
                    {openSubCourseIndex === index ? "Hide" : "View"}{" "}
                    {course.sub_courses.length} Courses
                    <span className="text-xs">
                      {openSubCourseIndex === index ? "▲" : "▼"}
                    </span>
                    {openSubCourseIndex === index &&
                      course.sub_courses?.length > 0 && (
                        <div className="mt-4 border rounded-xl overflow-hidden">

                          <table className="w-full border-collapse text-sm">
                            <thead className="bg-slate-100">
                              <tr>
                                <th className="border p-3 text-left font-semibold">
                                  Specialisation
                                </th>
                                <th className="border p-3 text-right font-semibold">
                                  Fees
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {course.sub_courses.map((sc: any, i: number) => (
                                <tr
                                  key={i}
                                  className="hover:bg-slate-50 transition"
                                >
                                  <td className="border p-3 text-slate-800">
                                    {sc.name?.replace(/₹.*$/g, "").trim()}
                                  </td>

                                  <td className="border p-3 text-right font-semibold text-green-700">
                                    {sc.fees || "—"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                        </div>
                      )}

                  </button>

                )}

              </div>
            ))}

            {courseData.length === 0 && (
              <p className="text-center py-10 text-slate-500 text-sm">
                No course data available
              </p>
            )}

            {detail?.rawScraped?.courses_full_time?.length > 0 && (() => {

              const packageRows = detail.rawScraped.courses_full_time.filter(
                (r: any) =>
                  ["Highest Package", "Median Package", "Average Package"].includes(
                    r.course.trim()
                  )
              );

              const courseRows = detail.rawScraped.courses_full_time.filter(
                (r: any) =>
                  !["Highest Package", "Median Package", "Average Package"].includes(
                    r.course.trim()
                  )
              );

              return (
                <>

                  {/* ===================== ALL COURSES TABLE ===================== */}
                  <div className="bg-white border rounded-2xl p-6 shadow-sm">

                    <h3 className="text-xl font-bold mb-5 text-blue-800">
                      ALL Courses
                    </h3>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse min-w-[800px]">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 text-sm">
                            <th className="border p-3 text-left font-semibold">Course</th>
                            <th className="border p-3 text-left font-semibold">Fees</th>
                            <th className="border p-3 text-left font-semibold">Eligibility</th>
                            <th className="border p-3 text-left font-semibold">
                              Application Date
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {courseRows.map((row: any, i: number) => (
                            <tr
                              key={i}
                              className="hover:bg-slate-50 text-sm transition"
                            >
                              <td className="border p-3 font-semibold text-blue-700 min-w-[200px]">
                                {row.course}
                              </td>

                              <td className="border p-3 whitespace-pre-line font-medium text-green-700 min-w-[150px]">
                                {row.fees}
                              </td>

                              <td className="border p-3 text-slate-600 min-w-[200px]">
                                {row.eligibility}
                              </td>

                              <td className="border p-3 text-blue-600 font-semibold min-w-[150px]">
                                {row.date}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </div>

                  {detail?.rawScraped?.info_facilities?.length > 0 && (
                    <div className="bg-white border rounded-2xl p-6">
                      <h3 className="text-xl font-bold mb-4 text-blue-900">
                        Facilities
                      </h3>

                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {detail.rawScraped.info_facilities.map(
                          (f: any, i: number) => (
                            <div
                              key={i}
                              className="
              flex flex-col items-center
              gap-2
              text-center
              text-sm
              text-slate-700
            "
                            >
                              <div
                                className="
                p-3
                border
                rounded-xl
                bg-white
                shadow-sm
                hover:shadow-md
                transition
              "
                              >
                                {FACILITY_ICON_MAP[f.icon_key] ?? null}
                              </div>

                              <span className="text-[12px] leading-tight">
                                {f.name}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}


                  {/* ===================== PACKAGE/FEES TABLE ===================== */}

                  {packageRows.length > 0 && (
                    <div className="bg-white border rounded-2xl p-6 shadow-sm mt-10">

                      <h3 className="text-xl font-bold mb-5 text-blue-800">
                        Placement Package & Fees Overview
                      </h3>

                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse min-w-[600px]">

                          <thead>
                            <tr className="bg-slate-100 text-slate-700 text-sm">
                              <th className="border p-3 text-left font-semibold w-1/3">
                                Package Type
                              </th>
                              <th className="border p-3 text-left font-semibold w-1/3">
                                Package Amount
                              </th>

                            </tr>
                          </thead>

                          <tbody>
                            {packageRows.map((row: any, i: number) => (
                              <tr key={i} className="hover:bg-slate-50 text-sm transition">

                                <td className="border p-3 font-semibold text-blue-700">
                                  {row.course}
                                </td>

                                <td className="border p-3 text-green-700 font-bold">
                                  {row.fees || "-"}
                                </td>



                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {detail?.rawScraped?.info_faculty?.length > 0 && (
                    <div className="bg-white border rounded-2xl p-6 mt-10">
                      <h3 className="text-xl font-bold mb-4 text-blue-900">
                        Faculty
                      </h3>

                      {/* MOBILE: horizontal scroll | DESKTOP: grid */}
                      <div
                        className="
        flex gap-4  overflow-x-auto no-scrollbar pb-2
        md:grid md:grid-cols-4 lg:grid-cols-5
        md:overflow-visible
      "
                      >
                        {detail.rawScraped.info_faculty.map(
                          (f: any, i: number) => (
                            <div
                              key={i}
                              className="
              min-w-[180px]
              md:min-w-0
              border rounded-xl
              p-4
              text-center
              shadow-sm
              hover:shadow-md
              transition
              bg-white
            "
                            >
                              {/* Avatar */}
                              <div
                                className="
                w-16 h-16
                mx-auto
                rounded-full
                bg-slate-200
                flex items-center justify-center
                text-slate-500
                font-bold
                text-lg
              "
                              >
                                {f.name?.charAt(0)}
                              </div>

                              {/* Name */}
                              <p className="mt-3 font-semibold text-sm text-slate-900">
                                {f.name}
                              </p>

                              {/* Designation / Qualification */}
                              <p className="text-xs text-slate-600 mt-1">
                                {f.designation || f.qualification || "Faculty Member"}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                </>
              );
            })()}



          </div>
        );


      case "Placements":

        return (
          <div className="bg-white rounded-2xl overflow-hiddenborder p-6 space-y-6">

            {/* ================= ALUMNI DISTRIBUTION ================= */}
            {alumni.length > 0 && (
              <div className="bg-white rounded-2xl border p-6 mt-4 shadow-sm">

                <h4 className="text-xl font-bold mb-4 text-blue-900">
                  Alumni Distribution by Sector
                </h4>

                {(() => {
                  // Convert percentage strings to numbers
                  const values = alumni.map((a: any) =>
                    parseInt(a.percentage.replace("%", ""))
                  );

                  // find largest percentage
                  const max = Math.max(...values);

                  return (
                    <div className="space-y-4">

                      {alumni.map((item: any, i: number) => {

                        const value = parseInt(item.percentage.replace("%", ""));
                        const barWidth = (value / max) * 100;

                        return (
                          <div key={i}>

                            {/* title + value */}
                            <div className="flex justify-between text-sm font-semibold text-slate-800">
                              <span>{item.sector}</span>
                              <span className="text-blue-700">{item.percentage}</span>
                            </div>

                            {/* bar */}
                            <div className="w-full bg-orange-200 h-2 rounded-full overflow-hidden mt-1">
                              <div
                                className="h-full bg-orange-600 rounded-full transition-all duration-700"
                                style={{ width: `${barWidth}%` }}
                              />
                            </div>

                          </div>
                        );
                      })}

                    </div>
                  );
                })()}

              </div>
            )}


            {/* ================= HIGHLIGHTS SECTION ================= */}
            {college?.highlights?.length > 0 && (
              <div className="bg-white rounded-2xl border p-6 shadow-sm">

                <h4 className="text-xl font-bold mb-4 text-blue-900">
                  Key Highlights
                </h4>

                {/* Highlight Boxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {(showAllHighlights
                    ? college.highlights
                    : college.highlights.slice(0, 6)
                  ).map((item: string, i: number) => (
                    <div
                      key={i}
                      className="
            flex items-start gap-3
            bg-blue-50 border border-blue-200
            rounded-xl
            px-4 py-3
            text-sm font-medium
            text-slate-700
            leading-snug
            hover:shadow transition
          "
                    >
                      <span
                        className="
              mt-1 w-2 h-2 rounded-full
              bg-blue-600 flex-shrink-0
            "
                      />
                      <p>{item.replace(/Read More/gi, "")}</p>
                    </div>
                  ))}
                </div>

                {/* READ MORE / LESS BUTTON */}
                {college.highlights.length > 6 && (
                  <button
                    onClick={() => setShowAllHighlights(!showAllHighlights)}
                    className="mt-4 text-blue-700 font-semibold text-sm underline"
                  >
                    {showAllHighlights ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>
            )}

            {/* ================= Visited Companies ================= */}
            {detail?.rawScraped?.placement?.companies?.length > 0 && (
              <div className="bg-white rounded-2xl border p-6 mt-8 shadow-sm">

                <h4 className="text-xl font-bold mb-4 text-blue-900">
                  Companies That Visited Campus
                </h4>

                <div
                  className="
        grid grid-cols-2
        sm:grid-cols-3
        md:grid-cols-4
        lg:grid-cols-6
        gap-3
      "
                >
                  {(showVisited
                    ? detail.rawScraped.placement.companies
                    : detail.rawScraped.placement.companies.slice(0, 12)
                  ).map((name: string, i: number) => (
                    <div
                      key={i}
                      className="
    flex items-center justify-center
    h-[72px]
    px-3
    text-center
    rounded-xl
    bg-white
    border border-slate-200
    text-[13px]
    font-semibold
    text-slate-800
    shadow-sm
    hover:shadow-md
    hover:border-blue-400
    transition
    leading-snug 
    overflow-y-auto no-scrollbar
  "
                    >
                      {name}
                    </div>
                  ))}
                </div>

                {detail.rawScraped.placement.companies.length > 12 && (
                  <button
                    onClick={() => setShowVisited(!showVisited)}
                    className="mt-4 text-blue-700 font-semibold text-sm underline"
                  >
                    {showVisited ? "View Less" : "View All"}
                  </button>
                )}

              </div>
            )}
            {detail?.rawScraped?.admission?.length > 0 && (
              <div className="bg-white border rounded-2xl p-6 mt-10 space-y-6">

                {detail.rawScraped.admission.map((section: any, idx: number) => (
                  <div key={idx} className="space-y-5">

                    {/* ================= TITLE ================= */}
                    <h3 className="text-xl font-bold text-blue-900">
                      {section.title}
                    </h3>

                    {/* ================= PARAGRAPHS ================= */}
                    {Array.isArray(section.paragraphs) && section.paragraphs.length > 0 && (
                      <div
                        className={`
    space-y-3
    text-sm
    leading-relaxed
    text-slate-600
    break-words
    overflow-hidden
    ${showFullAdmissionText ? "" : "max-h-[160px]"}
    md:max-h-none
  `}
                        style={{
                          wordBreak: "break-word",
                          overflowWrap: "anywhere",
                        }}
                      >

                        {(showFullAdmissionText
                          ? section.paragraphs
                          : sliceForMobile(section.paragraphs, 6)
                        ).map((p: string, i: number) => (
                          <p
                            key={i}
                            className="break-words"
                            style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                          >
                            {p}
                          </p>

                        ))}
                      </div>
                    )}

                    {/* READ MORE – PARAGRAPH (MOBILE ONLY) */}
                    {section.paragraphs?.length > 6 && (
                      <button
                        onClick={() => setShowFullAdmissionText(!showFullAdmissionText)}
                        className="md:hidden text-blue-600 text-sm font-semibold"
                      >
                        {showFullAdmissionText ? "Read Less" : "Read More"}
                      </button>
                    )}

                    {/* ================= BULLETS ================= */}
                    {Array.isArray(section.bullets) && section.bullets.length > 0 && (
                      <div className="space-y-2">

                        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                          {(showAllAdmissionBullets
                            ? section.bullets
                            : section.bullets.slice(0, 6)
                          ).map((b: string, i: number) => (
                            <li
                              key={i}
                              className="break-words"
                              style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                            >
                              {b}
                            </li>

                          ))}
                        </ul>

                        {section.bullets.length > 6 && (
                          <button
                            onClick={() => setShowAllAdmissionBullets(!showAllAdmissionBullets)}
                            className="text-blue-600 text-sm font-semibold"
                          >
                            {showAllAdmissionBullets ? "View Less" : "View More"}
                          </button>
                        )}
                      </div>
                    )}

                    {/* ================= TABLES ================= */}
                    {Array.isArray(section.tables) && section.tables.length > 0 && (
                      <div className="space-y-6">

                        {section.tables.map((table: any[], tIndex: number) => {
                          const headers = table[0];
                          const rows = table.slice(1);

                          return (
                            <div
                              key={tIndex}
                              className="overflow-x-auto border rounded-xl"
                            >
                              <table className="w-full min-w-[700px] border-collapse text-sm">

                                <thead className="bg-slate-100">
                                  <tr>
                                    {headers.map((h: string, i: number) => (
                                      <th
                                        key={i}
                                        className="border p-3 text-left font-semibold text-slate-700"
                                      >
                                        {h}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>

                                <tbody>
                                  {rows.map((row: string[], rIndex: number) => (
                                    <tr
                                      key={rIndex}
                                      className="hover:bg-slate-50 transition"
                                    >
                                      {row.map((cell: string, cIndex: number) => (
                                        <td
                                          key={cIndex}
                                          className="border p-3 text-slate-700"
                                        >
                                          {cell}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>

                              </table>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>
                ))}

              </div>
            )}



          </div>


        );

      case "Reviews":
        return (
          <div className="space-y-4">
            {detail?.rawScraped?.reviews_data?.summary && (
              <div className="bg-white border rounded-2xl p-6 mt-10">

                <h3 className="text-xl font-bold mb-6 text-slate-900">
                  What Students Say
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* ================= LIKES ================= */}
                  {Array.isArray(detail.rawScraped.reviews_data.summary.likes) && (
                    <div className="border border-green-200 bg-green-50 rounded-xl p-5">

                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-green-600 text-lg">👍</span>
                        <h4 className="font-semibold text-green-800">Likes</h4>
                      </div>

                      <ul className="space-y-2 text-sm text-slate-700">
                        {sliceSix(
                          detail.rawScraped.reviews_data.summary.likes,
                          showAllLikes
                        ).map((item: string, i: number) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      {detail.rawScraped.reviews_data.summary.likes.length > 6 && (
                        <button
                          onClick={() => setShowAllLikes(!showAllLikes)}
                          className="mt-3 text-green-700 text-sm font-semibold"
                        >
                          {showAllLikes ? "Show Less" : "+ More"}
                        </button>
                      )}
                    </div>
                  )}

                  {/* ================= DISLIKES ================= */}
                  {Array.isArray(detail.rawScraped.reviews_data.summary.dislikes) && (
                    <div className="border border-red-200 bg-red-50 rounded-xl p-5">

                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-red-600 text-lg">👎</span>
                        <h4 className="font-semibold text-red-800">Dislikes</h4>
                      </div>

                      <ul className="space-y-2 text-sm text-slate-700">
                        {sliceSix(
                          detail.rawScraped.reviews_data.summary.dislikes,
                          showAllDislikes
                        ).map((item: string, i: number) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-red-600 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      {detail.rawScraped.reviews_data.summary.dislikes.length > 6 && (
                        <button
                          onClick={() => setShowAllDislikes(!showAllDislikes)}
                          className="mt-3 text-red-700 text-sm font-semibold"
                        >
                          {showAllDislikes ? "Show Less" : "+ More"}
                        </button>
                      )}
                    </div>
                  )}

                </div>

                {/* FOOT NOTE */}
                <p className="text-xs text-slate-500 mt-4">
                  These insights are automatically extracted from student reviews
                </p>



              </div>
            )}

            <div className="bg-white border rounded-2xl shadow p-6">

              {/* =============== Gallery Carousel =============== */}
              <h3 className="text-xl font-bold mb-4">Campus Gallery</h3>

              <div className="relative flex gap-4 overflow-hidden">

                {detail?.gallery?.slice(0, 4).map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    className="w-1/2 h-44 rounded-xl object-cover border"
                  />
                ))}

              </div>

              {/* =============== Rating Title =============== */}
              <div className="mt-6">
                <p className="text-3xl font-bold text-slate-900">
                  {detail?.rating || college.rating}
                </p>

                <p className="flex items-center gap-1 text-yellow-500 mt-1">
                  {Array(5).fill(null).map((_, i) => (
                    <span key={i}>
                      {i < Math.round(college.rating) ? "★" : "☆"}
                    </span>
                  ))}
                </p>

                <p
                  className="text-blue-600 text-sm font-semibold underline cursor-pointer"
                >
                  ({college.reviewCount} Verified Reviews)
                </p>
              </div>

              {/* =============== Rating Bars =============== */}
              <div className="mt-6 space-y-3">

                {ratingDistribution.map(item => (
                  <div key={item.stars} className="flex items-center gap-3 text-sm text-slate-700">

                    <span className="w-8 font-semibold">{item.stars}★</span>

                    <div className="w-full h-2 bg-slate-200 rounded-full">
                      <div
                        className="h-full bg-yellow-500 rounded-full transition-all"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>

                    <span className="w-16 text-right text-slate-500">
                      ({item.percent}%)
                    </span>

                  </div>
                ))}


              </div>

              {/* =============== Category Ratings =============== */}
              <div className="mt-6 grid grid-cols-3 md:grid-cols-6 gap-4">

                {Array.isArray(detail?.rawScraped?.rating_categories) &&
                  detail.rawScraped.rating_categories.slice(0, 6).map((item: any, i: number) => (
                    <div key={i} className="flex flex-col items-center p-2 text-center">
                      <p className="text-[12px] text-slate-500">{item.label}</p>
                      <p className="text-sm font-bold text-slate-900 mt-1">
                        {item.rating}★
                      </p>
                    </div>
                  ))}


              </div>

            </div>
            {detail?.rawScraped?.info_faculty?.length > 0 && (
              <div className="bg-white border rounded-2xl p-6 mt-10">
                <h3 className="text-xl font-bold mb-4 text-blue-900">
                  Faculty
                </h3>

                {/* MOBILE: horizontal scroll | DESKTOP: grid */}
                <div
                  className="
        flex gap-4  overflow-x-auto no-scrollbar pb-2
        md:grid md:grid-cols-4 lg:grid-cols-5
        md:overflow-visible
      "
                >
                  {detail.rawScraped.info_faculty.map(
                    (f: any, i: number) => (
                      <div
                        key={i}
                        className="
              min-w-[180px]
              md:min-w-0
              border rounded-xl
              p-4
              text-center
              shadow-sm
              hover:shadow-md
              transition
              bg-white
            "
                      >
                        {/* Avatar */}
                        <div
                          className="
                w-16 h-16
                mx-auto
                rounded-full
                bg-slate-200
                flex items-center justify-center
                text-slate-500
                font-bold
                text-lg
              "
                        >
                          {f.name?.charAt(0)}
                        </div>

                        {/* Name */}
                        <p className="mt-3 font-semibold text-sm text-slate-900">
                          {f.name}
                        </p>

                        {/* Designation / Qualification */}
                        <p className="text-xs text-slate-600 mt-1">
                          {f.designation || f.qualification || "Faculty Member"}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
            {detail?.rawScraped?.info_student_review && (
              <div className="bg-white border rounded-2xl p-6 mt-10">

                <h3 className="text-xl font-bold mb-6 text-slate-900">
                  What Students Say
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* ================= LIKES ================= */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-5">

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-green-600 text-lg">👍</span>
                      <h4 className="font-semibold text-green-800">
                        Likes
                      </h4>
                    </div>

                    <div className="space-y-4">
                      {(showAllStudentLikes
                        ? detail.rawScraped.info_student_review.likes
                        : detail.rawScraped.info_student_review.likes.slice(0, 4)
                      ).map((item: any, i: number) => (
                        <ReviewCard
                          key={i}
                          content={item.content}
                          username={item.username}
                          color="green"
                        />
                      ))}
                    </div>

                    {detail.rawScraped.info_student_review.likes.length > 4 && (
                      <button
                        onClick={() => setShowAllStudentLikes(!showAllStudentLikes)}
                        className="mt-4 text-green-700 font-semibold text-sm"
                      >
                        {showAllStudentLikes ? "Show Less" : "View More"}
                      </button>
                    )}
                  </div>

                  {/* ================= DISLIKES ================= */}
                  <div className="bg-red-50 border border-red-200 rounded-xl p-5">

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-red-600 text-lg">👎</span>
                      <h4 className="font-semibold text-red-800">
                        Dislikes
                      </h4>
                    </div>

                    <div className="space-y-4">
                      {(showAllStudentDislikes
                        ? detail.rawScraped.info_student_review.dislikes
                        : detail.rawScraped.info_student_review.dislikes.slice(0, 4)
                      ).map((item: any, i: number) => (
                        <ReviewCard
                          key={i}
                          content={item.content}
                          username={item.username}
                          color="red"
                        />
                      ))}
                    </div>

                    {detail.rawScraped.info_student_review.dislikes.length > 4 && (
                      <button
                        onClick={() => setShowAllStudentDislikes(!showAllStudentDislikes)}
                        className="mt-4 text-red-700 font-semibold text-sm"
                      >
                        {showAllStudentDislikes ? "Show Less" : "View More"}
                      </button>
                    )}
                  </div>

                </div>

                <p className="text-xs text-slate-500 mt-5">
                  Reviews are shared by verified students and alumni
                </p>

              </div>
            )}

          </div>
        );

      case "Gallery":
  const images =
    detail?.gallery?.length ? detail.gallery : getCollegeImages(slug);

  return (
    <>
      <div
        className="
          columns-2
          md:columns-3
          gap-4
          space-y-4
          pb-4
        "
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            onClick={() => openLightbox(src)}
            className="
              w-full
              rounded-xl
              object-cover
              border
              break-inside-avoid
              cursor-pointer
              hover:opacity-90
              transition
            "
          />
        ))}
      </div>

      {/* ===== LIGHTBOX POPUP ===== */}
      {lightboxOpen && activeImage && (
        <div
          onClick={closeLightbox}
          className="
            fixed inset-0 z-[9999]
            bg-black/80
            flex items-center justify-center
            p-4
          "
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="
                absolute -top-10 right-0
                text-white text-3xl
                font-bold
              "
            >
              ×
            </button>

            {/* Image */}
            <img
              src={activeImage}
              className="
                w-full
                max-h-[85vh]
                object-contain
                rounded-xl
                shadow-2xl
                bg-black
              "
            />
          </div>
        </div>
      )}
    </>
  );

      default:
        const feeInfo = detail?.rawScraped?.info_course_fee;
        const feeTable = feeInfo?.course_fee_table || [];
        const feeNotes = Array.isArray(feeInfo?.course_fee_note)
          ? feeInfo.course_fee_note
          : [];
        // Detect fee table type
        const isTermWise =
          feeTable.length > 0 &&
          Object.keys(feeTable[0]).some(k => k.startsWith("col_"));

        const isProgramWise =
          feeTable.length > 0 &&
          !isTermWise;



        const formatAnswer = (text: string, full: boolean) => {
          if (!text) return "";

          let replaced = text.replace(/collegedunia/gi, "Studycups");

          if (full) return replaced;

          if (replaced.length > 350) {
            return replaced.substring(0, 350) + "...";
          }

          return replaced;
        };

        return (
          <div className="space-y-6">


            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">
                About {college.name}
              </h3>

              {/* ================= TEXT (COLLAPSIBLE ONLY) ================= */}
              {textBlocks.length > 0 && (
                <div
                  className={`relative overflow-hidden transition-all duration-300
        ${showFullOverview ? "max-h-none" : "max-h-[7.5rem]"}
      `}
                >
                  <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                    {textBlocks.map((block, i) => (
                      <p key={i}>
                        {block.content.replace(/collegedunia/gi, "Studycups")}
                      </p>
                    ))}
                  </div>

                  {!showFullOverview && (
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
                  )}
                </div>
              )}

              {/* READ MORE / LESS */}
              {textBlocks.length > 0 && (
                <button
                  onClick={() => setShowFullOverview(!showFullOverview)}
                  className="mt-3 text-blue-600 font-semibold text-sm"
                >
                  {showFullOverview ? "Read Less" : "Read More"}
                </button>
              )}

              {/* ================= NON-TEXT BLOCKS (ALWAYS VISIBLE) ================= */}
              <div className="mt-6 space-y-6">

                {nonTextBlocks.map((block, i) => {

                  /* ===== LIST ===== */
                  if (block.type === "list") {
                    return (
                      <ul key={i} className="list-disc pl-6 text-sm text-slate-700 space-y-1">
                        {block.items.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    );
                  }

                  /* ===== TABLE ===== */
                  if (block.type === "table") {
                    return (
                      <div key={i} className="overflow-x-auto border rounded-xl">
                        <table className="w-full border-collapse text-sm">
                          <thead className="bg-slate-100">
                            <tr>
                              {block.columns.map((col, idx) => (
                                <th
                                  key={idx}
                                  className="border p-3 text-left font-semibold"
                                >
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>

                          <tbody>
                            {block.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-50">
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="border p-3">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>

              {/* ================= BASIC INFO ================= */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 text-sm">
                <InfoRow label="Established" value={college.established} />
                <InfoRow label="Type" value={detail?.type || college.type || "N/A"} />
                <InfoRow label="Location" value={college.location} />
                <InfoRow
                  label="Rating"
                  value={`${college.rating}/5 (${college.reviewCount})`}
                />
              </div>
            </div>




            {/* ================= Ranking ================= */}
            {rankingDataArray.length > 0 && (

              <div className="bg-white border rounded-2xl p-6 mt-10 overflow-x-auto">
                <h3 className="text-xl font-bold mb-4">Ranking Overview</h3>

                {(() => {
                  const { years, table } = buildRankingTable(rankingDataArray);




                  return (
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="border p-2 text-left">Stream</th>

                          {years.map((year) => (
                            <th
                              key={year}
                              className="border p-2 text-center"
                            >
                              {year}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {Object.keys(table).map(stream => (
                          <tr key={stream}>
                            <td className="border p-2 font-semibold">
                              {stream}
                            </td>

                            {years.map(year => (
                              <td key={year} className="border p-2 align-top">
                                {table[stream][year] ? (
                                  <>
                                    <div className="font-semibold text-slate-800">
                                      {table[stream][year].main}
                                    </div>

                                    {table[stream][year].state && (
                                      <div className="text-xs text-slate-500 mt-1">
                                        {table[stream][year].state}
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  "-"
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>


                    </table>
                  );
                })()}
              </div>
            )}

            <aside className="space-y-5 lg:sticky lg:top-[120px] w-full block lg:hidden">


              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-5">
                <h3 className="font-bold text-lg">Apply Now</h3>
                <p className="text-sm opacity-90 mt-1">
                  Get expert admission guidance
                </p>
                <button
                  onClick={onOpenApplyNow}
                  className="mt-4 w-full bg-white text-blue-700 py-2.5 rounded-lg font-semibold"
                >
                  Apply Now
                </button>
              </div>

              <div className="bg-white border rounded-2xl p-5 space-y-3">
                <InfoRow
                  label="Highest Package"
                  value={
                    detail?.rawScraped?.placement?.highest ||
                    college?.rawScraped?.placement?.highest_package ||
                    "N/A"
                  }
                />

                <InfoRow
                  label="Placement Rate"
                  value={placementRateValue}
                />



                <InfoRow label="Type" value={detail?.type || college.type || "N/A"} />
              </div>

              <button
                onClick={() => college && onCompareToggle(college.id)}
                className={`w-full py-2.5 rounded-xl font-semibold ${isCompared
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-100"
                  }`}
              >
                {isCompared ? "Added to Compare" : "Compare College"}
              </button>


              {/* ================= Latest News ================= */}
              {activeTab === "Overview" &&
                detail?.rawScraped?.latest_news?.length > 0 && (
                  <div className="bg-white border rounded-2xl p-6 mt-10">

                    <h3 className="text-xl font-bold mb-4">
                      {college.name} Latest News & Updates
                    </h3>

                    {detail.rawScraped.latest_news.map((news: any, index: number) => {

                      const fullContent = news.content || "";
                      const shortText = fullContent.slice(0, 250);
                      const open = newsOpen[index];

                      const toggle = () => {
                        const x = [...newsOpen];
                        x[index] = !x[index];
                        setNewsOpen(x);
                      };

                      return (
                        <div key={index} className="pb-5 border-b">
                          <p className="text-red-500 font-bold text-[14px]">
                            {news.date}
                          </p>

                          <p className="font-semibold text-slate-900 text-[15px] mt-1">
                            {news.headline}
                          </p>

                          <p className="text-[14px] text-slate-600 mt-2 leading-[1.45rem]">
                            {open
                              ? fullContent
                              : shortText + (fullContent.length > 250 ? "..." : "")}

                            {fullContent.length > 250 && (
                              <button
                                onClick={toggle}
                                className="ml-2 text-blue-600 font-semibold text-xs"
                              >
                                {open ? "Read Less" : "Read More"}
                              </button>
                            )}
                          </p>
                        </div>
                      );
                    })}

                  </div>
                )}



              {/* ================= IMPORTANT DATES SECTION ================= */}
              {(upcoming.length > 0 || expired.length > 0) && (
                <div className="bg-white border rounded-2xl p-6 mt-10 overflow-x-auto">

                  <h3 className="text-xl font-bold mb-4">
                    Important Dates & Admission Events
                  </h3>

                  {/* TABS */}
                  <div className="flex gap-3 mb-6">
                    <button
                      onClick={() => {
                        setShowAllUpcoming(false);
                        setShowAllExpired(false);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold"
                    >
                      Upcoming
                    </button>

                    <button
                      onClick={() => {
                        setShowAllUpcoming(false);
                        setShowAllExpired(true);
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full text-sm font-semibold"
                    >
                      Expired
                    </button>
                  </div>

                  {/* UPCOMING ===================== */}
                  {upcoming.length > 0 && !showAllExpired && (
                    <div className="w-full overflow-auto">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="bg-slate-100">
                            <th className="border p-2 text-left w-3/4">Event</th>
                            <th className="border p-2 text-center w-1/4">Date</th>
                          </tr>
                        </thead>

                        <tbody>
                          {(showAllUpcoming ? upcoming : upcoming.slice(0, 3)).map(
                            (ev: any, i: number) => (
                              <tr key={i} className="hover:bg-slate-50">
                                <td className="border p-2 font-medium">{ev.event}</td>
                                <td className="border p-2 text-center text-blue-700 font-semibold">
                                  {ev.date}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>

                      {/* VIEW ALL BTN */}
                      {upcoming.length > 3 && (
                        <button
                          onClick={() => setShowAllUpcoming(!showAllUpcoming)}
                          className="text-blue-600 mt-3 font-semibold text-sm"
                        >
                          {showAllUpcoming ? "View Less" : "View All"}
                        </button>
                      )}
                    </div>
                  )}

                  {/* EXPIRED ===================== */}
                  {expired.length > 0 && showAllExpired && (
                    <div className="w-full overflow-auto">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="bg-slate-100">
                            <th className="border p-2 text-left w-3/4">Event</th>
                            <th className="border p-2 text-center w-1/4">Date</th>
                          </tr>
                        </thead>

                        <tbody>
                          {(showAllExpired ? expired : expired.slice(0, 3)).map(
                            (ev: any, i: number) => (
                              <tr key={i} className="hover:bg-slate-50">
                                <td className="border p-2 font-medium">{ev.event}</td>
                                <td className="border p-2 text-center text-red-500 font-semibold">
                                  {ev.date}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>

                      {expired.length > 3 && (
                        <button
                          onClick={() => setShowAllExpired(!showAllExpired)}
                          className="text-blue-600 mt-3 font-semibold text-sm"
                        >
                          {showAllExpired ? "View Less" : "View All"}
                        </button>
                      )}
                    </div>
                  )}

                </div>
              )}


            </aside>

            {/* ================= Fee ================= */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="font-bold mb-3">Fee Structure</h3>
              <p className="text-lg font-bold text-green-700">
                {college?.feesRange ? (
                  <>
                    ₹{college.feesRange.min.toLocaleString("en-IN")} – ₹
                    {college.feesRange.max.toLocaleString("en-IN")}
                  </>
                ) : (
                  "N/A"
                )}

              </p>
              <p className="text-xs text-slate-500 mt-1">Per year</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow p-6">

              {/* =============== Gallery Carousel =============== */}
              <h3 className="text-xl font-bold mb-4">Campus Gallery</h3>

              <div className="relative flex gap-4 overflow-hidden">

                {detail?.gallery?.slice(0, 4).map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    className="w-1/2 h-44 rounded-xl object-cover border"
                  />
                ))}

              </div>

              {/* =============== Rating Title =============== */}
              <div className="mt-6">
                <p className="text-3xl font-bold text-slate-900">
                  {detail?.rating || college.rating}
                </p>

                <p className="flex items-center gap-1 text-yellow-500 mt-1">
                  {Array(5).fill(null).map((_, i) => (
                    <span key={i}>
                      {i < Math.round(college.rating) ? "★" : "☆"}
                    </span>
                  ))}
                </p>

                <p
                  className="text-blue-600 text-sm font-semibold underline cursor-pointer"
                >
                  ({college.reviewCount} Verified Reviews)
                </p>
              </div>

              {/* =============== Rating Bars =============== */}
              <div className="mt-6 space-y-3">

                {ratingDistribution.map(item => (
                  <div key={item.stars} className="flex items-center gap-3 text-sm text-slate-700">

                    <span className="w-8 font-semibold">{item.stars}★</span>

                    <div className="w-full h-2 bg-slate-200 rounded-full">
                      <div
                        className="h-full bg-yellow-500 rounded-full transition-all"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>

                    <span className="w-16 text-right text-slate-500">
                      ({item.percent}%)
                    </span>

                  </div>
                ))}


              </div>

              {/* =============== Category Ratings =============== */}
              <div className="mt-6 grid grid-cols-3 md:grid-cols-6 gap-4">

                {Array.isArray(detail?.rawScraped?.rating_categories) &&
                  detail.rawScraped.rating_categories.slice(0, 6).map((item: any, i: number) => (
                    <div key={i} className="flex flex-col items-center p-2 text-center">
                      <p className="text-[12px] text-slate-500">{item.label}</p>
                      <p className="text-sm font-bold text-slate-900 mt-1">
                        {item.rating}★
                      </p>
                    </div>
                  ))}



              </div>

            </div>

            {/* ================= Facilities ================= */}
            {detail?.rawScraped?.info_facilities?.length > 0 && (
              <div className="bg-white border rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 text-blue-900">
                  Facilities
                </h3>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {detail.rawScraped.info_facilities.map(
                    (f: any, i: number) => (
                      <div
                        key={i}
                        className="
              flex flex-col items-center
              gap-2
              text-center
              text-sm
              text-slate-700
            "
                      >
                        <div
                          className="
                p-3
                border
                rounded-xl
                bg-white
                shadow-sm
                hover:shadow-md
                transition
              "
                        >
                          {FACILITY_ICON_MAP[f.icon_key] ?? null}
                        </div>

                        <span className="text-[12px] leading-tight">
                          {f.name}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}



            {/* ================= Course & Fee Structure ================= */}
            {feeInfo && feeTable.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 mt-10">

                {/* HEADING */}
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  Courses & Fee Structure
                </h3>

                {feeInfo.course_fee_heading && (
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    {feeInfo.course_fee_heading}
                  </p>
                )}

                {/* =====================================================
        TERM WISE TABLE  (IIM Rohtak type)
       ===================================================== */}
                {isTermWise && (
                  <div className="overflow-x-auto border border-slate-200 rounded-xl ">
                    <table className="w-full min-w-[600px] border-collapse border-slate-200 text-sm">

                      <thead className="bg-slate-100 text-slate-700">
                        <tr>
                          <th className="border p-3 text-left font-semibold">
                            Course / Term
                          </th>
                          <th className="border p-3 text-left font-semibold">
                            Fees
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {feeTable.map((row: any, i: number) => {

                          /* PROGRAM HEADER (PGP I / PGP II) */
                          if (row.col_0 && row.col_2) {
                            return (
                              <tr key={i} className="bg-blue-50">
                                <td
                                  colSpan={2}
                                  className="border p-3 font-bold text-blue-900"
                                >
                                  {row.col_0}
                                </td>
                              </tr>
                            );
                          }

                          /* TOTAL ROW */
                          if (
                            row.col_0 &&
                            row.col_0.toLowerCase().includes("total")
                          ) {
                            return (
                              <tr key={i} className="bg-green-50">
                                <td className="border p-3 font-semibold">
                                  Total Fees
                                </td>
                                <td className="border p-3 font-bold text-green-700">
                                  {row.col_1}
                                </td>
                              </tr>
                            );
                          }

                          /* NORMAL TERM ROW */
                          return (
                            <tr key={i} className="hover:bg-slate-50">
                              <td className="border p-3">
                                {row.col_0 || "-"}
                              </td>
                              <td className="border p-3">
                                {row.col_1 || "-"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {/* ================= FEE NOTES ================= */}
                    {feeNotes.length > 0 && (
                      <div className="mt-6">

                        <h4 className="font-semibold text-slate-900 mb-3">
                          Important Fee Notes
                        </h4>

                        {/* NOTES LIST */}
                        <div
                          className={`
        space-y-2
        text-sm
        md:text-slate-500
        bg-red-50

        ${showAllFeeNotes
                              ? "max-h-none"
                              : "max-h-[140px] overflow-hidden"
                            }

        md:max-h-none
        md:overflow-visible
      `}
                        >
                          {feeNotes.map((note: string, i: number) => (
                            <div
                              key={i}
                              className="
            flex gap-2
            bg-slate-50
            border border-slate-200
            rounded-lg
            px-4 py-2
            leading-relaxed
          "
                            >
                              <span className="text-orange-500 font-bold">•</span>
                              <span>{note}</span>
                            </div>
                          ))}
                        </div>

                        {/* READ MORE / LESS — MOBILE ONLY */}
                        <div className="md:hidden mt-3">
                          <button
                            onClick={() => setShowAllFeeNotes(!showAllFeeNotes)}
                            className="text-blue-600 font-semibold text-sm"
                          >
                            {showAllFeeNotes ? "Read Less" : "Read More"}
                          </button>
                        </div>

                      </div>
                    )}

                  </div>
                )}

                {/* =====================================================
        PROGRAM WISE TABLE  (IIM Lucknow type)
       ===================================================== */}
                {isProgramWise && (
                  <div className="overflow-x-auto border rounded-xl">
                    <table className="w-full min-w-[700px] border-collapse text-sm">

                      <thead className="bg-slate-100 text-slate-700">
                        <tr>
                          {Object.keys(feeTable[0]).map((key, i) => (
                            <th
                              key={i}
                              className="border p-3 text-left font-semibold"
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {feeTable.map((row: any, i: number) => (
                          <tr key={i} className="hover:bg-slate-50">
                            {Object.keys(row).map((key, j) => (
                              <td
                                key={j}
                                className={`border p-3 ${key.toLowerCase().includes("total")
                                  ? "font-bold text-green-700"
                                  : ""
                                  }`}
                              >
                                {String(row[key]).trim() || "-"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>

                    </table>
                    {feeNotes.length > 0 && (
                      <div className="mt-6">

                        <h4 className="font-semibold text-slate-900 mb-3">
                          Important Fee Notes
                        </h4>

                        {/* NOTES LIST */}
                        <div
                          className={`
        space-y-2
        text-sm
        md:text-slate-500

        ${showAllFeeNotes
                              ? "max-h-none"
                              : "max-h-[140px] overflow-hidden"
                            }

        md:max-h-none
        md:overflow-visible
      `}
                        >
                          {feeNotes.map((note: string, i: number) => (
                            <div
                              key={i}
                              className="
            flex gap-2
            bg-slate-50
            border border-slate-200
            rounded-lg
            px-4 py-2
            leading-relaxed
            bg-red-50
          "
                            >
                              <span className="text-orange-500 font-bold">•</span>
                              <span>{note}</span>
                            </div>
                          ))}
                        </div>

                        {/* READ MORE / LESS — MOBILE ONLY */}
                        <div className="md:hidden mt-3">
                          <button
                            onClick={() => setShowAllFeeNotes(!showAllFeeNotes)}
                            className="text-red-600 font-semibold text-sm"
                          >
                            {showAllFeeNotes ? "Read Less" : "Read More"}
                          </button>
                        </div>

                      </div>
                    )}
                  </div>
                )}

              </div>
            )}




            {/* ================= Faculty ================= */}
            {detail?.rawScraped?.info_faculty?.length > 0 && (
              <div className="bg-white border rounded-2xl p-6 mt-10">
                <h3 className="text-xl font-bold mb-4 text-blue-900">
                  Faculty
                </h3>

                {/* MOBILE: horizontal scroll | DESKTOP: grid */}
                <div
                  className="
        flex gap-4  overflow-x-auto no-scrollbar pb-2
        md:grid md:grid-cols-4 lg:grid-cols-5
        md:overflow-visible
      "
                >
                  {detail.rawScraped.info_faculty.map(
                    (f: any, i: number) => (
                      <div
                        key={i}
                        className="
              min-w-[180px]
              md:min-w-0
              border rounded-xl
              p-4
              text-center
              shadow-sm
              hover:shadow-md
              transition
              bg-white
            "
                      >
                        {/* Avatar */}
                        <div
                          className="
                w-16 h-16
                mx-auto
                rounded-full
                bg-slate-200
                flex items-center justify-center
                text-slate-500
                font-bold
                text-lg
              "
                        >
                          {f.name?.charAt(0)}
                        </div>

                        {/* Name */}
                        <p className="mt-3 font-semibold text-sm text-slate-900">
                          {f.name}
                        </p>

                        {/* Designation / Qualification */}
                        <p className="text-xs text-slate-600 mt-1">
                          {f.designation || f.qualification || "Faculty Member"}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}


            {/* ================= QNA ================= */}
            {detail?.rawScraped?.questions_answers?.length > 0 && (

              <div className="bg-white border rounded-2xl p-6 mt-10">
                <h3 className="text-xl font-bold mb-4">
                  Frequently Asked Questions
                </h3>

                <div className="space-y-4">
                  {detail.rawScraped.questions_answers.map((item: any, i: number) => {

                    const open = qnaOpen[i];

                    const toggle = () => {
                      const copy = [...qnaOpen];
                      copy[i] = !copy[i];
                      setQnaOpen(copy);
                    };

                    return (
                      <div
                        key={i}
                        className="border rounded-xl overflow-hidden shadow-sm"
                      >
                        <div
                          onClick={toggle}
                          className="
                cursor-pointer
                px-4 py-3
                text-blue-700
                font-semibold
                bg-blue-50
                hover:bg-blue-100
                transition
                text-sm
              "
                        >
                          {item.question}
                        </div>

                        <div className="px-4 py-3 text-slate-700 bg-white leading-relaxed text-sm">
                          {formatAnswer(item.answer_text, open)}

                          {!open && item.answer_text.length > 350 && (
                            <button
                              onClick={toggle}
                              className="text-blue-600 text-xs font-semibold ml-1"
                            >
                              Read More
                            </button>
                          )}

                          {open && (
                            <button
                              onClick={toggle}
                              className="text-red-600 text-xs font-semibold ml-1"
                            >
                              Read Less
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
    }
  };
  // ✅ SAFE RENDER GUARD — AFTER ALL HOOKS
  if (!college) {
    return (
      <div className="mt-[120px] text-center text-slate-500">
        Loading college details...
      </div>
    );
  } 

  


  /* ===================== PAGE JSX RETURN ===================== */
  const placementRateValue = (() => {
    const highestStr =
      detail?.rawScraped?.placement?.highest ||
      college?.rawScraped?.placement?.highest_package;

    const averageStr =
      detail?.rawScraped?.placement?.average ||
      college?.rawScraped?.placement?.average_package;

    if (!highestStr || !averageStr) return "N/A";

    const highest = parseFloat(highestStr.toString().replace(/[^0-9.]/g, ""));
    const average = parseFloat(averageStr.toString().replace(/[^0-9.]/g, ""));

    if (!highest || !average) return "N/A";

    const rate = Math.round((average / highest) * 100);
    return `${rate}%`;
  })();


  return (
    <div>
      {/* HERO */}
      <div className="relative mt-[90px] w-full max-w-7xl mx-auto px-3 sm:px-4">

        <div className="relative h-[250px] sm:h-[260px] w-full overflow-hidden rounded-[20px]">
          <button
            onClick={() => navigate(-1)}
            className="
    absolute
    top-4
    left-4
    z-40
    flex items-center
    gap-2
    px-2 md:px-3
    py-2
    bg-black/60
    hover:bg-black/80
    text-white
    rounded-full md:rounded-lg
    backdrop-blur
    transition
  "
            aria-label="Back"
          >
            {/* Arrow – always visible */}
            <span className="text-lg leading-none">←</span>

            {/* Text – desktop only */}
            <span className="hidden md:inline text-sm font-semibold">
              Back to Colleges
            </span>
          </button>


          <img
            src={college.imageUrl}
            alt={college.name}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/80 to-transparent" />

          <div className="relative z-20 h-full flex items-center">
            <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 flex justify-between items-start sm:items-center pb-3 gap-3">

              <div className="max-w-4xl text-white">
                <div className="flex items-center gap-4 mb-0">
                  <img
                    src={college.logoUrl}
                    alt={college.name}
                    className="h-14 w-14 rounded-full bg-white p-2 shadow"
                  />

                  <h1 className="text-xl sm:text-1xl md:text-3xl font-extrabold leading-tight">

                    {college.rawScraped.college_name}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base text-white/90">
                  <span className="flex items-center gap-1 text-[14px]">
                    ⭐ {college.rating}
                  </span>

                  <span className="opacity-60">|</span>

                  <span className="flex items-center gap-1 text-[14px]">
                    🏫 {detail?.type || college.type || "N/A"}
                  </span>

                  <span className="opacity-60">|</span>

                  <span className="flex items-center gap-1 text-[14px]">
                    📅 Estd. {college.established}
                  </span>

                  {college.accreditation?.length > 0 && (
                    <>
                      <span className="opacity-60">|</span>
                      <span className="flex items-center gap-1 text-[14px]">
                        🏅 {college.accreditation[0]}
                      </span>
                    </>
                  )}

                  <span className="opacity-60">|</span>

                  <span className="flex items-center gap-1 text-[14px]">
                    📍 {college.location}
                  </span>
                </div>
              </div>

              <div
                className="
    absolute z-30

    /* MOBILE: top right */
    top-0 right-0

    /* DESKTOP: adjust spacing */
    md:top-6 md:right-6

    flex flex-row
    items-center justify-end
    gap-2
  "
              >
                <button
                  onClick={onOpenApplyNow}
                  className="
      px-3 py-1.5 md:px-6 md:py-2.5
      rounded-lg
      bg-blue-600 hover:bg-blue-700
      text-white text-xs md:text-sm font-semibold
      shadow-md
      transition
    "
                >
                  Enquire Now
                </button>

                <button
                  onClick={onOpenBrochure}
                  className="
      px-3 py-1.5 md:px-6 md:py-2.5
      rounded-lg
      bg-green-600 hover:bg-green-700
      text-white text-xs md:text-sm font-semibold
      shadow-md
      transition
    "
                >
                  Brochure
                </button>
              </div>

            </div>
          </div>
        </div>



      </div>

      {/* TABS */}
      <div
        className="
    bg-white  z-30
    
    /* DESKTOP behaviour unchanged */
    md:sticky md:top-[70px]

    /* MOBILE behaviour changed */
    mt-4 md:mt-0
  "
      >

        <div className="max-w-7xl mx-auto px-4 flex gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">

          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 font-semibold text-sm ${activeTab === tab
                ? "text-[--primary-medium] border-b-4 border-[--primary-medium]"
                : "text-slate-500"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* LAYOUT */}
      <div className="container max-w-7xl md:max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">


        <div className="lg:col-span-2">{renderTabContent()}</div>

        <aside className="space-y-5 lg:sticky lg:top-[120px] w-full hidden lg:block">


          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-5">
            <h3 className="font-bold text-lg">Apply Now</h3>
            <p className="text-sm opacity-90 mt-1">
              Get expert admission guidance
            </p>
            <button
              onClick={onOpenApplyNow}
              className="mt-4 w-full bg-white text-blue-700 py-2.5 rounded-lg font-semibold"
            >
              Apply Now
            </button>
          </div>

          <div className="bg-white border rounded-2xl p-5 space-y-3">
            <InfoRow
              label="Highest Package"
              value={
                detail?.rawScraped?.placement?.highest ||
                college?.rawScraped?.placement?.highest_package ||
                "N/A"
              }
            />

            <InfoRow
              label="Placement Rate"
              value={placementRateValue}
            />



            <InfoRow label="Type" value={detail?.type || college.type || "N/A"} />
          </div>

          <button
            onClick={() => onCompareToggle(college.id)}
            className={`w-full py-2.5 rounded-xl font-semibold ${isCompared
              ? "bg-green-100 text-green-700"
              : "bg-slate-100"
              }`}
          >
            {isCompared ? "Added to Compare" : "Compare College"}
          </button>


          {/* ================= Latest News ================= */}
          {activeTab === "Overview" &&
            detail?.rawScraped?.latest_news?.length > 0 && (
              <div className="bg-white border rounded-2xl p-6 mt-10">

                <h3 className="text-xl font-bold mb-4">
                  {college.name} Latest News & Updates
                </h3>

                {detail.rawScraped.latest_news.map((news: any, index: number) => {

                  const fullContent = news.content || "";
                  const shortText = fullContent.slice(0, 250);
                  const open = newsOpen[index];

                  const toggle = () => {
                    const x = [...newsOpen];
                    x[index] = !x[index];
                    setNewsOpen(x);
                  };

                  return (
                    <div key={index} className="pb-5 border-b">
                      <p className="text-red-500 font-bold text-[14px]">
                        {news.date}
                      </p>

                      <p className="font-semibold text-slate-900 text-[15px] mt-1">
                        {news.headline}
                      </p>

                      <p className="text-[14px] text-slate-600 mt-2 leading-[1.45rem]">
                        {open
                          ? fullContent
                          : shortText + (fullContent.length > 250 ? "..." : "")}

                        {fullContent.length > 250 && (
                          <button
                            onClick={toggle}
                            className="ml-2 text-blue-600 font-semibold text-xs"
                          >
                            {open ? "Read Less" : "Read More"}
                          </button>
                        )}
                      </p>
                    </div>
                  );
                })}

              </div>
            )}



          {/* ================= IMPORTANT DATES SECTION ================= */}
          {(upcoming.length > 0 || expired.length > 0) && (
            <div className="bg-white border rounded-2xl p-6 mt-10 overflow-x-auto bg-white p-6 rounded-xl shadow-sm border sticky top-24">

              <h3 className="text-xl font-bold mb-4">
                Important Dates & Admission Events
              </h3>

              {/* TABS */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => {
                    setShowAllUpcoming(false);
                    setShowAllExpired(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold"
                >
                  Upcoming
                </button>

                <button
                  onClick={() => {
                    setShowAllUpcoming(false);
                    setShowAllExpired(true);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full text-sm font-semibold"
                >
                  Expired
                </button>
              </div>

              {/* UPCOMING ===================== */}
              {upcoming.length > 0 && !showAllExpired && (
                <div className="w-full overflow-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border p-2 text-left w-3/4">Event</th>
                        <th className="border p-2 text-center w-1/4">Date</th>
                      </tr>
                    </thead>

                    <tbody>
                      {(showAllUpcoming ? upcoming : upcoming.slice(0, 3)).map(
                        (ev: any, i: number) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="border p-2 font-medium">{ev.event}</td>
                            <td className="border p-2 text-center text-blue-700 font-semibold">
                              {ev.date}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>

                  {/* VIEW ALL BTN */}
                  {upcoming.length > 3 && (
                    <button
                      onClick={() => setShowAllUpcoming(!showAllUpcoming)}
                      className="text-blue-600 mt-3 font-semibold text-sm"
                    >
                      {showAllUpcoming ? "View Less" : "View All"}
                    </button>
                  )}
                </div>
              )}

              {/* EXPIRED ===================== */}
              {expired.length > 0 && showAllExpired && (
                <div className="w-full overflow-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border p-2 text-left w-3/4">Event</th>
                        <th className="border p-2 text-center w-1/4">Date</th>
                      </tr>
                    </thead>

                    <tbody>
                      {(showAllExpired ? expired : expired.slice(0, 3)).map(
                        (ev: any, i: number) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="border p-2 font-medium">{ev.event}</td>
                            <td className="border p-2 text-center text-red-500 font-semibold">
                              {ev.date}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>

                  {expired.length > 3 && (
                    <button
                      onClick={() => setShowAllExpired(!showAllExpired)}
                      className="text-blue-600 mt-3 font-semibold text-sm"
                    >
                      {showAllExpired ? "View Less" : "View All"}
                    </button>
                  )}
                </div>
              )}

            </div>
          )}


        </aside>
      </div>
    </div>
  );
};

export default DetailPage;
