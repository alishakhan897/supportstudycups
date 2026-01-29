
import React, { useState } from 'react';
import { College } from '../types';

interface CollegeCardProps {
  college: College;
  onApply?: () => void;
}

const CollegeCard: React.FC<CollegeCardProps> = ({ college, onApply }) => {
  const [imgError, setImgError] = useState(false);
  
  // High-quality generic campus placeholder image
  const placeholderLogo = 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=120&h=120';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group flex flex-col h-full overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3">
        <div className="relative flex-shrink-0">
          <img 
            src={imgError || !college.logo ? placeholderLogo : college.logo} 
            onError={() => setImgError(true)}
            alt={college.name} 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-slate-100 object-contain bg-slate-50 p-1" 
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[11px] sm:text-[13px] font-black text-slate-900 leading-tight group-hover:text-blue-700 transition-colors line-clamp-2">
            {college.name}
          </h4>
          <p className="text-[9px] sm:text-[10px] text-slate-500 flex items-center mt-0.5 font-bold truncate">
            <svg className="w-2.5 h-2.5 mr-1 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {college.location}
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between gap-3">
        <div className="bg-slate-50 rounded-lg p-2 sm:p-2.5 border border-slate-100">
          <p className="text-[7px] sm:text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Top Recruiters</p>
          <div className="flex flex-wrap gap-1">
            {college.recruiters.slice(0, 3).map((recruiter) => (
              <span key={recruiter} className="text-[8px] sm:text-[9px] font-bold text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                {recruiter}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="text-[7px] sm:text-[8px] text-slate-400 font-black uppercase tracking-widest">Highest CTC</p>
            <p className="text-[11px] sm:text-sm font-black text-blue-900">{college.highestPackage}</p>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onApply?.();
            }}
            className="bg-slate-900 hover:bg-[#ff6b00] text-white font-black py-1.5 sm:py-2 px-2.5 sm:px-4 rounded-lg text-[9px] sm:text-[10px] shadow-sm transition-all active:scale-95 uppercase tracking-tighter"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollegeCard;
