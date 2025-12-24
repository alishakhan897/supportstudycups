import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { View, College } from "../types";



interface HeaderProps {
  setView: (view: View) => void;
  onOpenApplyNow: () => void;
  colleges: College[];
  view: View;
}

const Header: React.FC<HeaderProps> = ({ setView, onOpenApplyNow, view }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const activePage = location.pathname === "/" ? view?.page : location.pathname;


  const tabClass = (tab: string) =>
    `relative pb-1 transition ${activePage === tab
      ? "text-[#0F2D52] font-bold after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#0F2D52]"
      : "text-[#0F2D52] hover:text-[#062042]"
    }`;


  const handleNavClick = (view: View) => {
    navigate("/");
    setTimeout(() => setView(view), 20);
  };

  return (
  <header 
  className="
    fixed top-0 left-0 right-0 z-50
    bg-white/10 
    backdrop-blur-xl
    border-b border-white/20
    shadow-[0_8px_25px_rgba(0,0,0,0.08)]
    rounded-bl-[18px] rounded-br-[18px]
  "
>


      {/* WRAPPER (fixed for mobile) */}
      <div className="max-w-9xl mx-auto px-3 py-2  ">

        {/* TOP BAR */}
        <div
          className="
    bg-white
    w-full 
    flex items-center justify-between
    
    px-3 py-1         /* Smaller padding on mobile */
    rounded-xl        /* Smaller curve on mobile */

    md:px-6 md:py-2   /* Normal size on desktop */
    md:rounded-10px   /* Fully rounded on desktop */
      bg-white/10 
    backdrop-blur-xl
  "
        >



          {/* LOGO */}
          <div
            onClick={() => handleNavClick({ page: "home" })}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img src="/logos/StudyCups.png" className="h-8 w-auto md:h-10" />
          </div>

          {/* DESKTOP MENU */}
          <nav className="hidden lg:flex items-center space-x-6 text-base font-semibold text-[#0F2D52]">

            <button
              onClick={() => handleNavClick({ page: "home" })}
              className={tabClass("home")}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick({ page: "listing" })}
              className={tabClass("listing")}
            >
              Colleges
            </button>

            <button
              onClick={() => handleNavClick({ page: "courses" })}
              className={tabClass("courses")}
            >
              Courses
            </button>

            <button
              onClick={() => handleNavClick({ page: "exams" })}
              className={tabClass("exams")}
            >
              Exams
            </button>

          
            <button
              onClick={() => handleNavClick({ page: "compare" })}
              className={tabClass("compare")}
            >
              Compare
            </button>


            <svg className="w-5 h-5 cursor-pointer hover:text-[#062042]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

           <svg
 
  className="w-5 h-5 cursor-pointer hover:text-[#062042]"
  fill="none"
  stroke="currentColor"
  viewBox="0 0 24 24"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-7.879 
    2.067-9 5.385A2.327 2.327 0 005 21h14c1.092 0 
    2.016-.628 2.5-1.615C19.879 16.067 16.418 14 12 14z"
  />
</svg>


            <button
              onClick={onOpenApplyNow}
              className="bg-[#1E4A7A] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#0aa34f]"
            >
              Apply Now
            </button>
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-7 h-7 text-[#0F2D52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="lg:hidden bg-[#0F2D52] text-white mt-3 rounded-2xl px-5 py-5 space-y-3 shadow-xl">

            {[
              ["Home", "home"],
              ["Colleges", "listing"],
              ["Courses", "courses"],
              ["Exams", "exams"],
             
              ["Compare", "compare"],
            ].map(([label, page]) => (
              <button
                key={page}
                onClick={() => {
                  handleNavClick({ page } as View);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-base font-semibold"
              >
                {label}
              </button>
            ))}

            <button
              onClick={onOpenApplyNow}
              className="w-full mt-3 py-3 bg-[#1E4A7A] rounded-full font-semibold"
            >
              Apply Now
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
