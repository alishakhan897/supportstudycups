
import React, { useState } from 'react';
import { FAQItem } from '../types';

interface FAQProps {
  items: FAQItem[];
}

const FAQSection: React.FC<FAQProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {items.map((item, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-bold text-gray-800">{item.question}</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="19 9l-7 7-7-7" />
            </svg>
          </button>
          {openIndex === index && (
            <div className="p-4 pt-0 text-gray-600 text-sm leading-relaxed border-t border-gray-100 bg-blue-50/30">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQSection;
