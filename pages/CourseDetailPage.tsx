import React, { useMemo, useState } from "react";
import type { View, College } from "../types";

interface CourseDetailPageProps {
    courseIds: number[];
    courseKey: string;
    allColleges: College[];
    setView: (view: View) => void;
     onOpenApplyNow: () => void;
}

const formatCourseTitle = (title: string = "") => {
  return title
    .toLowerCase()
    .replace(/\(([^)]+)\)/g, (_, p1) => `(${p1.toUpperCase()})`)
    .replace(/\b\w/g, char => char.toUpperCase());
};


const CourseDetailPage = ({ courseIds, courseKey, allColleges, setView , onOpenApplyNow }: CourseDetailPageProps) => {

    const [activeTab, setActiveTab] = useState("About");
    const [showFullText, setShowFullText] = useState(false);
      const [showFullAdmissionText, setShowFullAdmissionText] = useState(false);
    const [showAllAdmissionBullets, setShowAllAdmissionBullets] = useState(false);
    const sliceForMobile = (arr: string[], count = 5) =>
  arr.slice(0, count);


    const matchedCourses: any[] = useMemo(() => {
        const arr: any[] = [];

        allColleges.forEach((col: any) => {
            col.rawScraped?.courses?.forEach((cr: any) => {
                if (courseIds.includes(cr.id)) {
                   arr.push({
  ...cr,
  collegeName: col.name,
  collegeId: col.id,
  collegeLogo: col.logoUrl,
  collegeRaw: col.rawScraped,   // ✅ THIS WAS MISSING
});

                }
            });
        });

        return arr;
    }, [courseIds, allColleges]);

    const course: any = matchedCourses[0] || {};

    const collegesOfferingCourse: any[] = useMemo(() => {
        const unique = new Map();
        matchedCourses.forEach((c: any) => {
            if (!unique.has(c.collegeId)) {
                unique.set(c.collegeId, {
                    id: c.collegeId,
                    name: c.collegeName,
                    logoUrl: c.collegeLogo,
                });
            }
        });
        return Array.from(unique.values());
    }, [matchedCourses]); 
    const replaceBrand = (text: string = "") =>
  text.replace(/collegedunia/gi, "Studycups");
   


    return (
       <div className="min-h-screen bg-slate-50 overflow-x-hidden">


            {/* HEADER */}
            <div className="relative bg-[--primary-dark] mt-5">
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">

                    <button
                        onClick={() => setView({ page: "courses" })}
                        className="mb-4 mt-12 inline-flex items-center gap-2 text-sm font-semibold hover:opacity-90"
                    >
                        <span className="inline-block rounded bg-white/10 px-2 py-1">
                            ←
                        </span>
                        Back to Courses
                    </button>

                   <h1 className="text-3xl sm:text-4xl lg:text-3xl font-extrabold tracking-tight drop-shadow-sm">
  {formatCourseTitle(courseKey)}
</h1>


                     <div className="flex items-center gap-6">

      {/* Rating number + stars */}
      <div className="flex flex-col text-center">
          <span className="text-3xl font-bold pt-2 text-[orange]">
              {course.rating || "N/A"}
          </span>

          {/* stars */}
          <span className="text-yellow-400 text-sm">
              {Array(5)
                .fill("")
                .map((_, i) => (
                    <span key={i}>
                        {i < (course.rating || 0) ? "★" : "☆"}
                    </span>
                ))}
          </span>
      </div>

      {/* Review count */}
      <button
          className="text-sm font-semibold underline text-white/90 hover:text-white"
          onClick={() => setActiveTab("Statistics")}
      >
          {course.reviews || 0} 
      </button>

  </div>

                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">


                        <div className="rounded-xl bg-white/10 px-4 py-3">
                            <p className="text-xs text-white/80">Duration</p>
                            <p className="text-lg font-bold">
                                {course.duration || "N/A"}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white/10 px-4 py-3">
                            <p className="text-xs text-white/80">Fees</p>
                            <p className="text-lg font-bold">
                                {course.fees || "N/A"}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white/10 px-4 py-3">
                            <p className="text-xs text-white/80">Eligibility</p>
                            <p className="text-[18px] font-bold">
                                {course.eligibility || "N/A"}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white/10 px-4 py-3">
                            <p className="text-xs text-white/80">Mode</p>
                            <p className="text-lg font-bold">
                                {course.mode || "N/A"}
                            </p>
                        </div>

                    </div>
                </div>
            </div>

         
            {/* BODY */}
          <div className="container max-w-7xl md:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">


                <main className="lg:col-span-2 space-y-8">
               <section className="
  bg-white 
  p-4 sm:p-6
  rounded-xl shadow-sm border 
  space-y-4
">


            {course.details ? (

                <div className="space-y-4">

                    {/* Heading */}
                    <h3 className="text-[20px] font-bold text-blue-900">
                        {course.details.heading}
                    </h3>

                    {/* Overview Short / Full Text */}
                    <p className="text-slate-700 text-[15px] leading-relaxed">
                        {showFullText
                            ? replaceBrand(course.details.overview_full_text)
                            : `${replaceBrand(course.details.overview_full_text)?.slice(0, 280)}...`}
                    </p>

                    {/* Overview bullet points */}
                    {course.details.overview_paragraphs?.length > 0 && (
                        <ul className="space-y-2 pl-5 mt-2">
                            {course.details.overview_paragraphs
                                .slice(0, 4)
                                .map((item: string, i: number) => (
                                    <li
                                        key={i}
                                        className="list-disc text-[15px] text-slate-700"
                                    >
                                        {replaceBrand(item)}
                                    </li>
                                ))}
                        </ul>
                    )}

                    {/* Read More Button */}
                    <button
                        onClick={() => setShowFullText(!showFullText)}
                        className="text-blue-700 text-sm font-semibold underline mt-2"
                    >
                        {showFullText ? "Read Less" : "Read More"}
                    </button>

                </div>

            ) : (

                <p className="text-slate-500">
                    No data available.
                </p>

            )} 

            {course.details?.highlights && (
  <section className="bg-white p-6 rounded-2xl border shadow-sm space-y-8">

    {/* ================= COURSE HIGHLIGHTS ================= */}
    <div>
      <h3 className="text-xl font-bold text-blue-900 mb-4">
        Course Highlights
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          ["Duration", course.details.highlights.duration],
          ["Course Level", course.details.highlights["course level"]],
          ["Mode of Study", course.details.highlights["mode of study"]],
          ["Eligibility", course.details.highlights.eligibility],
          ["Total Fees", course.details.highlights["total fees"]],
        ]
          .filter(([, v]) => v)
          .map(([label, value], i) => (
            <div
              key={i}
              className="bg-slate-50 border rounded-xl p-4"
            >
              <p className="text-xs text-slate-500">{label}</p>
              <p className="font-semibold text-slate-900 mt-1">
                {value}
              </p>
            </div>
          ))}
      </div>
    </div>

    {/* ================= FEE BREAKDOWN ================= */}
    <div>
      <h3 className="text-xl font-bold text-blue-900 mb-4">
        Fee Breakdown
      </h3>

      <div className="overflow-hidden border rounded-xl">
        <table className="w-full text-sm border-collapse">
          <tbody>
            {[
              ["Tuition Fee", course.details.highlights["tuition fee"]],
              ["Caution Fee", course.details.highlights["caution fee*"]],
              ["Other Fee", course.details.highlights["other fee"]],
              ["Total Academic Fee", course.details.highlights["total academic fee"]],
              ["Hostel Fee", course.details.highlights["hostel fee"]],
              ["Total Fee", course.details.highlights["total fee"]],
            ]
              .filter(([, v]) => v)
              .map(([label, value], i) => (
                <tr
                  key={i}
                  className={
                    label === "Total Fee"
                      ? "bg-green-50"
                      : "hover:bg-slate-50"
                  }
                >
                  <td className="border p-3 font-medium text-slate-700">
                    {label}
                  </td>
                  <td className="border p-3 text-right font-bold text-slate-900">
                    {value}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div> 

          <div className="bg-white p-6 rounded-xl shadow-sm border flex flex-col block md:hidden">
                        <h3 className="text-xl font-bold">Apply Now</h3>
                        <p className="mt-2 text-sm text-slate-600">
                            Get admission guidance from experts.
                        </p>

                        <div className="mt-4 flex gap-3">
                            <a className="cursor-pointer inline-flex items-center justify-center rounded-md bg-[--primary-medium] p-2 text-white font-semibold text-[10px] "
                             onClick={onOpenApplyNow}>
                                Apply Now
                            </a>
                            <a className="inline-flex items-center justify-center rounded-md border px-4 py-2 font-semibold">
                                Download Brochure
                            </a>
                        </div>
                    </div>

    {/* ================= ADMISSION DATES ================= */}
    <div>
      <h3 className="text-xl font-bold text-blue-900 mb-4">
        Admission & Counselling Dates
      </h3>

      <div className="space-y-3">
        {Object.entries(course.details.highlights)
          .filter(([key]) =>
            key.toLowerCase().includes("counselling") ||
            key.toLowerCase().includes("registration")
          )
          .map(([key, value], i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border rounded-xl p-4 bg-blue-50"
            >
              <p className="text-sm font-medium text-slate-800">
                {key}
              </p>

              <span className="text-sm font-bold text-blue-700">
                {value as string}
              </span>
            </div>
          ))}
      </div>
    </div>

      {course.collegeRaw?.admission?.length > 0 && (
  <div className="bg-white border rounded-2xl p-6 mt-10 space-y-6">

    {course.collegeRaw.admission.map((section: any, idx: number) => (
      <div key={idx} className="space-y-5">

        <h3 className="text-xl font-bold text-blue-900">
          {section.title}
        </h3>

        {/* PARAGRAPHS */}
        {Array.isArray(section.paragraphs) && (
         <div
  className={`
    space-y-3 text-sm text-slate-600 leading-relaxed
    break-words
    overflow-hidden
    ${showFullAdmissionText ? "" : "max-h-[160px] overflow-hidden"}
    md:max-h-none
  `}
  style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
>

            {(showFullAdmissionText
              ? section.paragraphs
              : sliceForMobile(section.paragraphs, 6)
            ).map((p: string, i: number) => (
              <p key={i}>{replaceBrand(p)}</p>
            ))}
          </div>
        )}

        {/* READ MORE (MOBILE) */}
        {section.paragraphs?.length > 6 && (
          <button
            onClick={() => setShowFullAdmissionText(!showFullAdmissionText)}
            className="md:hidden text-blue-600 text-sm font-semibold"
          >
            {showFullAdmissionText ? "Read Less" : "Read More"}
          </button>
        )}

        {/* BULLETS */}
        {Array.isArray(section.bullets) && (
        <ul
  className="
    list-disc pl-4
    text-sm text-slate-700 space-y-2
    break-words
    overflow-hidden
  "
  style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
>

            {(showAllAdmissionBullets
              ? section.bullets
              : section.bullets.slice(0, 6)
            ).map((b: string, i: number) => (
              <li key={i}>{replaceBrand(b)}</li>
            ))}
          </ul>
        )}

        {section.bullets?.length > 6 && (
          <button
            onClick={() => setShowAllAdmissionBullets(!showAllAdmissionBullets)}
            className="text-blue-600 text-sm font-semibold"
          >
            {showAllAdmissionBullets ? "View Less" : "View More"}
          </button>
        )}

        {/* TABLES */}
        {Array.isArray(section.tables) && section.tables.map((table: any[], t) => (
         <div
  key={t}
  className="
    overflow-x-auto
    border rounded-xl
    -mx-4 sm:mx-0
    px-4 sm:px-0
  "
>

        <table className="
  w-full min-w-[650px]
  border-collapse text-xs sm:text-sm
">

              <thead className="bg-slate-100">
                <tr>
                  {table[0].map((h: string, i: number) => (
                    <th key={i} className="border p-3 text-left font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.slice(1).map((row: string[], r: number) => (
                  <tr key={r} className="hover:bg-slate-50">
                    {row.map((cell: string, c: number) => (
                      <td key={c} className="border p-3">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      </div>
    ))}

  </div>
)}

  </section>
)}


        </section>
                </main>

                {/* SIDEBAR */}
           <aside className="space-y-5 w-full block lg:sticky lg:top-[120px]">


                         <div className="bg-white p-6 rounded-xl shadow-sm border flex flex-col hidden md:block">
                        <h3 className="text-xl font-bold">Apply Now</h3>
                        <p className="mt-2 text-sm text-slate-600">
                            Get admission guidance from experts.
                        </p>

                        <div className="mt-4 flex gap-3">
                            <a className="cursor-pointer inline-flex items-center justify-center rounded-md bg-[--primary-medium] p-2 text-white font-semibold text-[10px] " 
                            onClick={onOpenApplyNow}>
                                Apply Now
                            </a>
                            <a className="inline-flex items-center justify-center rounded-md border px-4 py-2 font-semibold">
                                Download Brochure
                            </a>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <h3 className="text-xl font-bold mb-4">Colleges Offering this Course</h3>

                        {collegesOfferingCourse.length > 0 ? (
                          <ul className="space-y-3 sm:space-y-4">

                                {collegesOfferingCourse.map(college => (
                                    <li key={college.id} className="border rounded-lg p-3 hover:bg-slate-50 transition">
                                        <div className="flex items-center gap-3">

                                            <img src={college.logoUrl} className="h-10 w-10 rounded-full border" />

                                            <div className="flex-1">
                                                <p className="font-semibold text-slate-800">{college.name}</p>

                                                <button
                                                    onClick={() => setView({ page: "detail", collegeId: college.id })}
                                                    className="mt-1 text-xs text-[--primary-medium] font-semibold hover:underline"
                                                >
                                                    View Details →
                                                </button>
                                            </div>

                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-slate-500">No colleges found offering this course.</p>
                        )}
                    </div>
                </aside>

            </div>

        </div>
    );
};

export default CourseDetailPage;
