import React from "react";
import type { College, View } from "../types";

interface CollegeCardProps {
  college: College;
  setView: (view: View) => void;
  onCompareToggle?: (id: number) => void;
  isCompared?: boolean;
  isListingCard?: boolean;
  onOpenApplyNow?: () => void;
  onOpenBrochure?: () => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center">
      {[...Array(full)].map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const CollegeCard: React.FC<CollegeCardProps> = ({
  college,
  setView,
  onCompareToggle,
  isCompared,
  onOpenBrochure,
}) => {
  const mainImage =
    college.imageUrl ??
    college.heroImages?.[0] ??
    "/no-image.jpg";

  return (
    <div
      className="
        bg-white
        rounded-xl 
        border 
        shadow-[0_6px_20px_rgba(0,0,0,0.10)]
        hover:shadow-[0_10px_30px_rgba(0,0,0,0.18)]
        transition-all duration-300
        overflow-hidden
        w-full
        max-w-[380px] md:max-w-none
      "
    >
      {/* IMAGE + GRADIENT */}
      <div className="relative w-full h-[180px]">
        <img
          src={mainImage}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        

       {(college.logoUrl || college.rawScraped?.logo) && (
  <img
    src={college.logoUrl ?? college.rawScraped?.logo}
    className="absolute bottom-3 left-3 h-10 w-10 bg-white rounded-lg shadow p-1"
  />
)}


        <div className="absolute bottom-3 left-16 text-white text-sm font-semibold leading-tight drop-shadow">
          {college.name}
          <div className="text-[11px] opacity-80">
            {college.location}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="p-4">
        <div className="flex justify-between">
          <p className="font-semibold text-slate-900 text-sm">
          {college.stream ?? college.rawScraped?.stream ?? "Courses Available"}


          </p>

          <div className="flex items-center gap-1">
            <span className="text-yellow-500 font-semibold text-sm">
              {college.rating}
            </span>
            <StarRating rating={college.rating} />
          </div>
        </div>

        {/* FEES */}
        <p className="text-blue-600 font-semibold text-sm mt-1">
          ₹
         {college.rawScraped?.feesRange?.min
  ? Number(college.rawScraped.feesRange.min).toLocaleString("en-IN")
  : "N/A"}

          <span className="text-slate-500 font-normal">
            {" "}
            / year
          </span>
        </p>

        <p className="text-[12px] text-slate-500 mt-2">
          Ranked {college.ranking ?? college.rawScraped?.ranking_data?.[0]?.ranking ?? "N/A"}

        </p>

        <div className="border-t my-3"></div>

        <div className="space-y-2 text-sm">
          <button
            onClick={() =>
              setView({
                page: "detail",
                collegeId: college.id,
              })
            }
            className="
                flex justify-between items-center w-full text-left 
                py-1 px-2
                rounded-md
                transition-all
                hover:bg-slate-100
                hover:rounded-full
                hover:px-3
              "
          >
            View All Courses and Fees <span>›</span>
          </button>

          <button
            onClick={onOpenBrochure}
            className="
                flex justify-between items-center w-full text-left 
                py-1 px-2 rounded-md transition-all
                hover:bg-slate-100 hover:rounded-full hover:px-3
              "
          >
            Download Brochure <span>›</span>
          </button>

          <button
            onClick={() => onCompareToggle?.(college.id)}
            className={`
                flex justify-between items-center w-full text-left
                py-1 px-2 rounded-md transition-all
                ${
                  isCompared
                    ? "bg-green-100"
                    : "hover:bg-slate-100 hover:rounded-full hover:px-3"
                }
              `}
          >
            <span>Compare</span>

            {isCompared && (
              <span className="text-green-700 text-xs font-semibold">
                Applied
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollegeCard;
