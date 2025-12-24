import React, { useEffect, useMemo, useState } from "react";
import type { View, College } from "../types";
import { getCollegeImages } from "../collegeImages";


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
  college: College;
  setView: (view: View) => void;
  compareList: number[];
  onCompareToggle: (id: number) => void;
  onOpenApplyNow: () => void;
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

const buildRankingTable = (rankingData: any[]) => {
  const yearsSet = new Set<string>();
  const rowsMap: any = {};

  rankingData.forEach((entry) => {
    const stream = entry.stream || "Other";

    const text = entry.ranking.replace(/\s+/g, " ").trim();

    const yearMatch = text.match(/(20\d{2})/);
    const year = yearMatch ? yearMatch[1] : "NA";

    yearsSet.add(year);

    if (!rowsMap[stream]) rowsMap[stream] = {};
    rowsMap[stream][year] = text;
  });

  const years = Array.from(yearsSet).sort((a, b) => b.localeCompare(a));

  return { years, rows: rowsMap };
};

const DetailPage: React.FC<DetailPageProps> = ({
  college,
  compareList,
  onCompareToggle,
  setView,
  onOpenApplyNow,
}) => {
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



  const sliceForMobile = (arr: string[], count = 5) =>
    arr.slice(0, count);
  const sliceSix = (arr: string[], showAll: boolean) =>
    showAll ? arr : arr.slice(0, 6);


  const admissionSections = detail?.rawScraped?.admission || [];



  useEffect(() => {
    if (detail?.rawScraped?.questions_answers?.length > 0) {
      setQnaOpen(
        Array(detail.rawScraped.questions_answers.length).fill(false)
      );
    }
  }, [detail]);



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
    const raw = detail?.rawScraped?.about_text || college?.description || "";

    if (raw.includes("Read More")) {
      return raw.split("Read More")[0].trim();
    }

    return raw.trim();
  }, [detail?.rawScraped?.about_text, college?.description]);

  const aboutText =
    detail?.rawScraped?.about_text || college?.description || "";

  const shortOverview = useMemo(() => {
    const text = aboutText || "";
    const sentences = text.split(".");
    return sentences.slice(0, 2).join(".") + ".";
  }, [aboutText]);

  useEffect(() => {
    const fetchSuggestedColleges = async () => {
      try {
        const res = await fetch("https://studycupsbackend.onrender.com/api/colleges?limit=20");
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
  }, [college.id]);

  const slug = useMemo(
    () =>
      college.name
        .toLowerCase()
        .replace(/\([^)]*\)/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-"),
    [college.name]
  );

  const isCompared = compareList.includes(college.id);

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
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://studycupsbackend.onrender.com/api/colleges/${college.id}`
        );
        const json = await res.json();
        if (json.success) setDetail(json.data);
      } catch { }
      setLoading(false);
    };
    load();
  }, [college.id]);

  const handleDownloadBrochure = (collegeId: number) => {
    window.open(
      `http://localhost:5000/api/colleges/${collegeId}/brochure`,
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
                  onClick={() =>
                    setView({
                      page: "course-detail",
                      courseIds: [course.id],
                      courseKey: course.name
                    })
                  }
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

                    <p className="text-xs text-blue-600 cursor-pointer hover:underline"
                      onClick={() =>
                        setView({
                          page: "course-detail",
                          courseIds: [course.id],
                          courseKey: course.name
                        })
                      }
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

                {detail?.rawScraped?.rating_categories?.slice(0, 6).map((item, i) => (

                  <div
                    key={i}
                    className="flex flex-col items-center p-2 text-center"
                  >
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
                className="
        w-full
        rounded-xl 
        object-cover 
        border 
        break-inside-avoid
      "
              />
            ))}
          </div>

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
            {/* ================= About ================= */}
            <div className="bg-white border rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-3">
                About {college.name}
              </h3>

              <p className="text-slate-600 leading-relaxed">
                {loading
                  ? "Loading..."
                  : showFullOverview
                    ? (cleanedAboutText || "No description available.")
                      .replace(/collegedunia/gi, "Studycups")
                    : cleanedAboutText
                      ? (
                        cleanedAboutText.split(".").slice(0, 2).join(".") + "."
                      ).replace(/collegedunia/gi, "Studycups")
                      : "No description available."}
              </p>


              {!showFullOverview && (
                <button
                  onClick={() => setShowFullOverview(true)}
                  className="mt-3 text-blue-600 font-semibold text-sm"
                >
                  Read More
                </button>
              )}

              {showFullOverview && (
                <button
                  onClick={() => setShowFullOverview(false)}
                  className="mt-3 text-blue-600 font-semibold text-sm"
                >
                  Read Less
                </button>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm">

                <InfoRow label="Established" value={college.established} />
                <InfoRow
                  label="Type"
                  value={detail?.type || college.type || "N/A"}
                />

                <InfoRow label="Location" value={college.location} />
                <InfoRow
                  label="Rating"
                  value={`${college.rating}/5 (${college.reviewCount})`}
                />
              </div>
            </div>

            {/* ================= Ranking ================= */}
            {detail?.rawScraped?.ranking_data?.length > 0 && (
              <div className="bg-white border rounded-2xl p-6 mt-10 overflow-x-auto">
                <h3 className="text-xl font-bold mb-4">Ranking Overview</h3>

                {(() => {
                  const { years, rows } = buildRankingTable(
                    detail.rawScraped.ranking_data
                  );

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
                        {Object.keys(rows).map((stream) => (
                          <tr key={stream}>
                            <td className="border p-2 font-semibold">
                              {stream}
                            </td>

                            {years.map((year) => (
                              <td
                                key={year}
                                className="border p-2 text-center"
                              >
                                {rows[stream][year] || "-"}
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
            <div className="bg-white border rounded-2xl p-6">
              <h3 className="font-bold mb-3">Fee Structure</h3>
              <p className="text-lg font-bold text-green-700">
                ₹{college.feesRange.min.toLocaleString("en-IN")} – ₹
                {college.feesRange.max.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-slate-500 mt-1">Per year</p>
            </div>

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

                {detail?.rawScraped?.rating_categories?.slice(0, 6).map((item, i) => (

                  <div
                    key={i}
                    className="flex flex-col items-center p-2 text-center"
                  >
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
              <div className="bg-white border rounded-2xl p-6 mt-10">

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
                  <div className="overflow-x-auto border rounded-xl">
                    <table className="w-full min-w-[600px] border-collapse text-sm">

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
                  onClick={handleDownloadBrochure}
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
    bg-white border-b z-30
    
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
      <div className="container max-w-7xl md:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">


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
