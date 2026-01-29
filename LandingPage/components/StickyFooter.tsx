
import React, { useEffect, useState } from 'react';

const StickyFooter: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(14 * 60 * 60 + 22 * 60 + 34);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  const scrollToForm = () => {
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 glass border-t border-slate-200 z-[100] py-3 sm:py-4 px-4 shadow-2xl animate-slide-up">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-0.5 sm:gap-6 flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-orange-600 animate-ping"></span>
            <span className="text-orange-600 font-black text-xs sm:text-lg tracking-tight uppercase whitespace-nowrap">Scholarship Alert</span>
          </div>
          <div className="text-slate-500 text-[9px] sm:text-sm font-bold uppercase tracking-widest flex items-center min-w-0">
             <span className="hidden sm:inline">Offer Expires In</span> 
             <span className="sm:hidden">Ends In</span>
             <span className="text-slate-900 ml-1.5 sm:ml-2 font-black tabular-nums">{formatTime(timeLeft)}</span>
          </div>
        </div>
        
        <button
          onClick={scrollToForm}
          className="bg-slate-900 text-white px-5 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-lg shadow-xl hover:bg-blue-700 transition-all transform active:scale-95 whitespace-nowrap bg-gradient-to-r from-pink-500 via-orange-500 to-orange-600
shadow-lg shadow-orange-500/30
active:scale-95 transition-all"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default StickyFooter;
