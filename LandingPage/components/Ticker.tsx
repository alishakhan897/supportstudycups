
import React from 'react';

const Ticker: React.FC = () => {
  const content = "Apply Now for Top-Ranked Institutes • Recruiters: 367+ • 1:1 Mentorship • Highest Package ₹80 LPA • AICTE Approved • 100% Placement Assistance • ";

  return (
    <div className="bg-[#8b24cf] text-white py-2 overflow-hidden sticky top-0 z-50 shadow-md">
      <div className="ticker-content inline-block">
        <span className="text-sm font-semibold uppercase tracking-wider">{content}</span>
        <span className="text-sm font-semibold uppercase tracking-wider">{content}</span>
      </div>
    </div>
  );
};

export default Ticker;
