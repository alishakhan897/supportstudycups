import React from "react";
import type { View, College } from "../types";

interface ComparePageProps {
  compareList: number[];
  allColleges: College[];
  setView: (view: View) => void;
}

/* ================= SAFE VALUE READER ================= */
const getValue = (obj: any, path: string[]) => {
  return path.reduce((acc, key) => {
    if (acc && acc[key] !== undefined && acc[key] !== null && acc[key] !== "") {
      return acc[key];
    }
    return null;
  }, obj);
};

/* ================= PLACEMENT % CALCULATOR ================= */
const getPlacementPercentage = (college: any) => {
  // 1️⃣ Direct percentage
  const direct = college.rawScraped?.placement?.placement_percentage;
  if (direct) return direct;

  // 2️⃣ Calculate from yearly students placed
  const yearly = college.rawScraped?.info_yearly_students_placed;

  /*
    Expected structure (varies by college):
    {
      total_students: 240,
      students_placed: 216
    }
  */
  if (
    yearly &&
    yearly.total_students &&
    yearly.students_placed
  ) {
    const pct = (yearly.students_placed / yearly.total_students) * 100;
    return Math.round(pct);
  }

  // 3️⃣ No reliable data
  return null;
};

const ComparePage: React.FC<ComparePageProps> = ({
  compareList,
  allColleges,
  setView,
}) => {
  const selectedColleges = allColleges.filter(c =>
    compareList.includes(c.id)
  );

  const comparisonFields = [
    { label: "Rating", path: ["rating"] },
    { label: "Reviews", path: ["reviewCount"], suffix: " Reviews" },
    { label: "Established", path: ["rawScraped", "estd_year"] },
    { label: "Type", path: ["rawScraped", "college_type"] },
    {
      label: "Highest Package",
      path: ["rawScraped", "placement", "highest_package"],
    },
    {
      label: "Average Package",
      path: ["rawScraped", "placement", "average_package"],
    },
    {
      label: "Placement %",
      calculated: true,
      suffix: "%",
    },
  ];

  if (selectedColleges.length < 2) {
    return (
      <div className="max-w-4xl mx-auto text-center py-40 px-6">
        <h1 className="text-3xl font-bold mb-4">Compare Colleges</h1>
        <p className="text-slate-600 mb-8">
          Please select at least 2 colleges to compare.
        </p>
        <button
          onClick={() => setView({ page: "listing" })}
          className="px-6 py-3 bg-[--primary-medium] text-white font-semibold rounded-lg"
        >
          Add College
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <h1 className="text-3xl font-extrabold mb-10">
        Comparing {selectedColleges.length} Colleges
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] bg-white rounded-xl shadow border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-4 text-left font-bold">Feature</th>

              {selectedColleges.map(college => (
                <th key={college.id} className="p-4 text-center">
                  <div className="flex flex-col items-center">
                    {(college.logoUrl || college.rawScraped?.logo) && (
                      <img
                        src={college.logoUrl || college.rawScraped.logo}
                        alt={college.name}
                        className="h-14 w-14 rounded-full mb-2"
                      />
                    )}
                    <p className="font-bold">{college.name}</p>
                    <p className="text-xs text-slate-500">
                      {college.location}
                    </p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {comparisonFields.map(field => (
              <tr key={field.label} className="border-t">
                <td className="p-4 font-semibold text-slate-600">
                  {field.label}
                </td>

                {selectedColleges.map(college => {
                  let value: any = null;

                  if (field.calculated) {
                    value = getPlacementPercentage(college);
                  } else {
                    value = getValue(college, field.path || []);
                  }

                  return (
                    <td
                      key={`${college.id}-${field.label}`}
                      className="p-4 text-center font-medium"
                    >
                      {value !== null && value !== undefined
                        ? `${value}${field.suffix || ""}`
                        : "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparePage;
