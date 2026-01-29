
import React from 'react';
import LeadForm from './LeadForm';

interface PopupFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const PopupForm: React.FC<PopupFormProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-30 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="relative overflow-y-auto max-h-[90vh]">
          <div className="bg-orange-600 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Limited Time Offer</span>
            </div>
            <h2 className="text-3xl font-black leading-tight">Wait! Get Free Counseling & Scholarship</h2>
            <p className="text-orange-100 mt-2 text-sm font-medium">Don't miss out on the 2026-28 admission cycle. Our experts are ready to help you.</p>
          </div>
          
          <div className="p-8 pt-6">
            <LeadForm className="!shadow-none !border-none !p-0" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupForm;
