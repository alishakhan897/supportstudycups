import React, { useState, useMemo, useEffect, useRef } from "react";
import type { View, College } from "../types";
import { PARTNER_LOGOS } from "../logos";
import CollegeCard from "../components/CollegeCard"; 


import {

    BLOG_POSTS_DATA,
    TESTIMONIALS_DATA,
    COURSE_STREAMS,
} from "../constants";
import { useOnScreen } from "../hooks/useOnScreen";
import ContactForm from "../components/ContactForm"; 


const useScroll = () => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return scrollY;
};

const FadeSection = ({ children, delay = 0 }) => {
    const [ref, visible] = useOnScreen<HTMLDivElement>({ threshold: 0.25 });
    return (
        <div
            ref={ref}
            style={{ animationDelay: `${delay}ms` }}
            className={`opacity-0 translate-y-10 transition-all duration-[1200ms]
                ${visible ? "opacity-100 translate-y-0" : ""}
            `}
        >
            {children}
        </div>
    );
};


interface HomePageProps {
    setView: (view: View) => void;
    colleges: College[];
    onOpenApplyNow: () => void;
    exams: any[];
  
}

const AnimatedContainer: React.FC<{
    children: React.ReactNode;
    delay?: number;
    className?: string;
}> = ({ children, delay = 0, className = "" }) => {
    const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.1 });
    return (
        <div
            ref={ref}
            className={`opacity-0 ${isVisible ? "animate-fadeInUp" : ""} ${className}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}; 




const StreamTag: React.FC<{ stream: string }> = ({ stream }) => {
    const colors: { [key: string]: string } = {
        Engineering: "bg-[--primary-medium]/10 text-[--primary-dark]",
        Medical: "bg-green-100 text-green-800",
        Management: "bg-indigo-100 text-indigo-800",
        Law: "bg-yellow-100 text-yellow-800",
        "Civil Services": "bg-red-100 text-red-800",
    };
    const colorClass = colors[stream] || "bg-slate-100 text-slate-800";
    return (
        <div
            className={`absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full ${colorClass}`}
        >
            {stream}
        </div>
    );
};

const HomePage: React.FC<HomePageProps> = ({
    setView,
    colleges,
    onOpenApplyNow,
    exams,
     coursesFromColleges
}) => {
    const [selectedStream, setSelectedStream] = useState("All Streams");
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [heroFilters, setHeroFilters] = useState({
        college: "",
        city: "",
        course: "",
    }); 

    const [query, setQuery] = useState("");
const [activeCity, setActiveCity] = useState("");
const [error, setError] = useState(""); 
// STREAM FILTER FOR EXPLORE COURSES
const [exploreLevel, setExploreLevel] = useState("All");
// UNIQUE STREAMS FROM COURSES
const [applyModalOpen, setApplyModalOpen] = useState(false);
const [modalMode, setModalMode] = useState<"apply" | "brochure">("apply");


const scrollY = useScroll();

const heroTranslate = Math.min(scrollY * 0.5, 160); // image moves upward  
const heroOpacity = Math.max(1 - scrollY / 400, 0);


const extractCityState = (location?: string) => {
  if (!location || typeof location !== "string") return null;

  const parts = location.split(",").map(p => p.trim());

  return {
    city: parts[0],
    state: parts[1] || null,
  };
};



    const streamFilters = [
  "BE/B.Tech",
  "MBA/PGDM",
  "MBBS",
  "ME/M.Tech",
  "B.Sc",
  "BA",
  "B.Com",
  "BBA/BMS",
  "B.Sc (Nursing)",
  "Law",
];





    const animatedCollegeWords = useMemo(
        () => ["Ranking", "Placements", "Reviews"]
,
        []
    ); 

      const cityStateList = useMemo(() => {
  const map = new Map<string, { city: string; state: string | null }>();

  colleges.forEach(college => {
    const parsed = extractCityState(college.location);
    if (!parsed) return;

    const key = parsed.city.toLowerCase();
    if (!map.has(key)) {
      map.set(key, parsed);
    }
  });

  return Array.from(map.values());
}, [colleges]);

    const [animatedCollegeWordIndex, setAnimatedCollegeWordIndex] = useState(0);

    const words = ["Ranking", "Placements", "Reviews"];
    const [currentWord, setCurrentWord] = useState("");
    const [wordIndex, setWordIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedtopcollge, setSelectedtopcollge] = useState("");
   const [selectedExamFilter, setSelectedExamFilter] = useState("All");
   const [filteredCities, setFilteredCities] = useState(cityStateList);

 
const cityRefs = useMemo(() => {
  const refs: Record<string, React.RefObject<HTMLDivElement>> = {};
  cityStateList.forEach(c => {
    refs[c.city] = React.createRef();
  });
  return refs;
}, [cityStateList]);

    



    console.log("coursesFromColleges:", coursesFromColleges);


const extractCourses = (colleges) => {
  const map = new Map();

  colleges.forEach(col => {
    const courseArray = col.rawScraped?.courses;
    if (!Array.isArray(courseArray)) return;

    courseArray.forEach(c => {
      const key = c.name.trim().toLowerCase();

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          name: c.name,
          level: c.mode || "Full Time",
          duration: c.duration || "NA",
          fees: c.fees ?? "N/A",
          courseKey: key,

          // 🔑 MOST IMPORTANT
          colleges: [col.id],
          courseIds: [c.id],
        });
      } else {
        const entry = map.get(key);

        if (!entry.colleges.includes(col.id)) {
          entry.colleges.push(col.id);
          entry.courseIds.push(c.id);
        }
      }
    });
  });

  return Array.from(map.values());
};



const courses = extractCourses(colleges);
   useEffect(() => {
        let typingSpeed = 120;

        if (isDeleting) typingSpeed = 20;

        const handleTyping = () => {
            const fullWord = words[wordIndex];

            if (!isDeleting) {
                setCurrentWord(fullWord.substring(0, charIndex + 1));
                setCharIndex(charIndex + 1);

                if (charIndex + 1 === fullWord.length) {
                    setTimeout(() => setIsDeleting(true), 1500);
                }
            } else {
                setCurrentWord(fullWord.substring(0, charIndex - 1));
                setCharIndex(charIndex - 1);

                if (charIndex - 1 === 0) {
                    setIsDeleting(false);
                    setWordIndex((prev) => (prev + 1) % words.length);
                }
            }
        };

        const timeout = setTimeout(handleTyping, typingSpeed);

        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting]);
    
    const CITY_ICONS = [
  "/icons/gate-of-india.png",
  "/icons/bangalore.png",
  "/icons/red-fort_3806647.png",
  "/icons/arch_2189457.png",
  "/icons/temple_6482997.png",
  "/icons/temple_510019.png",
  "/icons/university.png",
  "/icons/lighthouse_8162871.png",
];

const getCityIcon = (city: string) => {
  const index =
    Math.abs(city.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) %
    CITY_ICONS.length;

  return CITY_ICONS[index];
};


    useEffect(() => {
        const interval = setInterval(() => {
            setAnimatedCollegeWordIndex(
                (prevIndex) => (prevIndex + 1) % animatedCollegeWords.length
            );
        }, 2500);
        return () => clearInterval(interval);
    }, [animatedCollegeWords]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setHeroFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setView({ page: "listing", filters: heroFilters });
    };

   const normalize = (str: string) =>
  str.toLowerCase().replace(/\s+/g, "").replace(/\./g, "");

const handleCitySearch = () => {
  const value = normalize(query.trim());

  if (!value) {
    setActiveCity("");
    setFilteredCities(cityStateList);
    setError("");
    return;
  }

  // 1️⃣ CITY MATCH
  const cityMatch = cityStateList.find(
    c => normalize(c.city) === value
  );

  if (cityMatch) {
    setActiveCity(cityMatch.city);
    setFilteredCities(cityStateList);
    setError("");

    const ref = cityRefs[cityMatch.city];
    ref?.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
    return;
  }

  // 2️⃣ STATE MATCH (🔥 FIXED)
  const stateCities = cityStateList.filter(
    c => c.state && normalize(c.state) === value
  );

  if (stateCities.length > 0) {
    setFilteredCities(stateCities);
    setActiveCity("");
    setError("");
    return;
  }

  // ❌ NO MATCH
  setError("No city found");
};


  const dynamicStreams = useMemo(() => {
  const set = new Set<string>();

  colleges.forEach((college) => {
    const stream = college.rawScraped?.stream;

    if (Array.isArray(stream)) {
      stream.forEach(s => {
        if (s && typeof s === "string") {
          set.add(s.trim());
        }
      });
    } else if (typeof stream === "string") {
      set.add(stream.trim());
    }
  });

  return Array.from(set).sort();
}, [colleges]);



   const streams = useMemo(
  () => ["All Streams", ...dynamicStreams],
  [dynamicStreams]
);


  const filteredColleges = useMemo(() => {
  if (selectedStream === "All Streams") {
    return colleges.slice(0, 8);
  }

  return colleges.filter(college => {
    const stream = college.rawScraped?.stream;

    if (Array.isArray(stream)) {
      return stream.includes(selectedStream);
    }

    if (typeof stream === "string") {
      return stream === selectedStream;
    }

    return false;
  });
}, [colleges, selectedStream]);





    const whyChooseUsFeatures = [
        {
            id: "ai",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-[--primary-medium]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                </svg>
            ),
            title: "AI Guidance",
            subtitle: "Personalized recommendations",
        },
        {
            id: "verified",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-[--primary-medium]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            ),
            title: "Verified Data",
            subtitle: "Authentic information",
        },
        {
            id: "easy-app",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-[--accent-green]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            ),
            title: "Easy Applications",
            subtitle: "Simplified process",
        },
        {
            id: "trusted",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-[--primary-medium]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 11c.5304 0 1.0391-.2107 1.4142-.5858C13.7893 10.0391 14 9.5304 14 9s-.2107-1.0391-.5858-1.4142C13.0391 7.2107 12.5304 7 12 7s-1.0391.2107-1.4142.5858C10.2107 7.9609 10 8.4696 10 9s.2107 1.0391.5858 1.4142C10.9609 10.7893 11.4696 11 12 11z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 22C7.03 22 3 17.97 3 13c0-3.91 2.51-7.24 6-8.48M21 13c0 4.97-4.03 9-9 9"
                    />
                </svg>
            ),
            title: "Trusted Platform",
            subtitle: "Secure and reliable",
        },
    ];

    const courseCategories = [
        {
            name: "Engineering",
            description: "Innovate the future with cutting-edge technology.",
            color: "bg-[#1f5fd6]",
            courseCount: COURSE_STREAMS["Engineering"].length,
            iconPath: "/icons/technology.png",
              
        },
        {
            name: "Management",
            description: "Lead organizations and shape the business world.",
            color: "bg-[#1ea35a]",
            courseCount: COURSE_STREAMS["Management"].length,
            iconPath:"/icons/project-management.png",
               
        },
        {
            name: "Medical",
            description: "Embark on a journey to heal and care for others.",
            color: "bg-[#f59e0b]",
            courseCount: COURSE_STREAMS["Medical"].length,
            iconPath:"/icons/medical-symbol (1).png",
        },
        {
            name: "Commerce",
            description: "Build strong foundations in finance and trade.",
            color: "bg-[#8b5cf6]",
            courseCount: COURSE_STREAMS["Commerce"]?.length || 90,
            iconPath:"/icons/smart-shopping.png"
          ,
        },
        {
            name: "Arts",
            description: "Explore creativity and the humanities.",
            color: "bg-[#f97316]",
            courseCount: COURSE_STREAMS["Arts & Science"]?.length || 95,
            iconPath:
             "/icons/inspiration.png",
        },
    ];

    const faqs = [
        {
            question: "How does the AI recommendation work?",
            answer:
                "Our AI College Counselor uses a powerful language model to understand your query and match colleges based on your preferences for location, courses, and budget.",
        },
        {
            question: "Is there a cost to apply through StudyCups?",
            answer:
                "Using StudyCups to find and compare colleges is free. Standard college application fees may still apply as per each institution.",
        },
        {
            question: "How accurate is the college data?",
            answer:
                "We regularly update information from official college websites, government data, and other reliable sources.",
        },
        {
            question: "Can I compare more than two colleges?",
            answer:
                "Yes. On the listing page you can select multiple colleges and open the Compare view for a side-by-side comparison.",
        },
    ];

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const blogCategoryColors: { [key: string]: string } = {
        Rankings: "bg-blue-100 text-blue-800",
        "Exam Prep": "bg-orange-100 text-orange-800",
        "Career Advice": "bg-green-100 text-green-800",
    };

   const rankingColleges = [
  {
    id: 1,
    stream: "MBA/PGDM",
    name: "IIMA - Indian Institute of Management",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/IIM%2C_Ahmedabad_Logo.svg/1200px-IIM%2C_Ahmedabad_Logo.svg.png",
    city: "Ahmedabad",
    state: "Gujarat",
    rating: "5/5",
    rankingText: "#2 out of 50 in India 2019",
    cutoffText: "CAT 2024 Cut off 99",
    deadline: "7 July - 08 Sept 2025",
    fees: "₹35,35,000",
  },
  {
    id: 2,
    stream: "BE/B.Tech",
    name: "IIT Bombay - Indian Institute of Technology [IITB]",
    logoUrl: "https://www.som.iitb.ac.in/epm/images/banner.jpg",
    city: "Mumbai",
    state: "Maharashtra",
    rating: "5/5",
    rankingText: "#2 out of 50 in India 2025",
    cutoffText: "JEE-Advanced 2025 Cut off 66",
    deadline: "1 Oct - 05 Nov 2025",
    fees: "₹52,500",
  },
  {
    id: 3,
    stream: "MBBS",
    name: "AIIMS - All India Institute of Medical Sciences",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/8/85/All_India_Institute_of_Medical_Sciences%2C_Delhi.svg/1075px-All_India_Institute_of_Medical_Sciences%2C_Delhi.svg.png",
    city: "New Delhi",
    state: "Delhi NCR",
    rating: "4.9/5",
    rankingText: "#8 out of 200 in India 2025",
    cutoffText: "NEET 2025 Cut off 48",
    deadline: "8 Apr - 07 May 2025",
    fees: "₹1,145",
  },
  {
    id: 4,
    stream: "Law",
    name: "National Law School of India University - [NLSIU]",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/6/6d/National_Law_Institute_University_Logo.png",
    city: "Bangalore",
    state: "Karnataka",
    rating: "4.9/5",
    rankingText: "-",
    cutoffText: "CLAT 2025 Cut off 112",
    deadline: "15 Nov - 23 Mar 2026",
    fees: "₹5,00,000",
  },
  {
    id: 5,
    stream: "MBBS",
    name: "Vardhman Mahavir Medical College - [VMMC]",
    logoUrl: "https://neetsupport.com/content/images/2025/01/Vardhman-Mahavir-Medical-College--New-Delhi.webp",
    city: "New Delhi",
    state: "Delhi NCR",
    rating: "4.9/5",
    rankingText: "-",
    cutoffText: "NEET 2025 Cut off 132",
    deadline: "1 Feb - 15 May 2024",
    fees: "₹57,000",
  },
  {
    id: 6,
    stream: "BE/B.Tech",
    name: "IIT Delhi - Indian Institute of Technology [IITD]",
    logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYSMRrwORnDdusOT7bJ3S7WS04C3bPzEGS1Q&s",
    city: "New Delhi",
    state: "Delhi NCR",
    rating: "4.9/5",
    rankingText: "#3 out of 50 in India 2025",
    cutoffText: "JEE-Advanced 2025 Cut off 355",
    deadline: "1 Oct - 05 Nov 2025",
    fees: "₹2,27,750",
  },
  {
    id: 7,
    stream: "MBA/PGDM",
    name: "IIMC - Indian Institute of Management",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3f/IIM_Calcutta_Logo.svg/1200px-IIM_Calcutta_Logo.svg.png",
    city: "Kolkata",
    state: "West Bengal",
    rating: "4.9/5",
    rankingText: "#99 out of 200 in India 2023",
    cutoffText: "CAT 2024 Cut off 99",
    deadline: "16 Oct - 26 Nov 2025",
    fees: "₹13,50,000",
  },
  {
    id: 8,
    stream: "BA",
    name: "Hindu College",
    logoUrl: "https://we-recycle.org/wp-content/uploads/2014/03/hindu-college.png",
    city: "New Delhi",
    state: "Delhi NCR",
    rating: "4.9/5",
    rankingText: "#1 out of 300 in India 2025",
    cutoffText: "CUET 2025 Cut off 448",
    deadline: "17 June - 10 Aug 2025",
    fees: "₹28,670",
  },
  {
    id: 9,
    stream: "B.Com",
    name: "Shri Ram College of Commerce - [SRCC]",
    logoUrl: "https://srcce.org/public/uploads/logo/1704695206.png",
    city: "New Delhi",
    state: "Delhi NCR",
    rating: "4.9/5",
    rankingText: "#18 out of 300 in India 2025",
    cutoffText: "CUET 2025 Cut off 910",
    deadline: "17 June - 10 Aug 2025",
    fees: "₹32,420",
  },
  {
    id: 10,
    stream: "B.Sc",
    name: "Institute of Hotel Management [IHM], Pusa",
    logoUrl: "https://www.govtjobsblog.in/wp-content/uploads/2023/03/IHM-Pusa.png",
    city: "New Delhi",
    state: "Delhi NCR",
    rating: "4.9/5",
    rankingText: "-",
    cutoffText: "NCHMCT-JEE 2025 Cut off 180",
    deadline: "16 Dec - 15 Mar 2026",
    fees: "₹1,76,515",
  },
];

 const displayedColleges =
  selectedtopcollge === "All" || selectedtopcollge === ""
    ? rankingColleges
    : rankingColleges.filter((c) => c.stream === selectedtopcollge);




    const bgImages = [
        "https://res.cloudinary.com/alishakhan987/image/upload/v1765219557/Gemini_Generated_Image_3xjtay3xjtay3xjt-Photoroom_nx9j6s.png",
        "https://res.cloudinary.com/alishakhan987/image/upload/v1765219972/Gemini_Generated_Image_mnbzv6mnbzv6mnbz_1_-Photoroom_f5zilz.png"
    ];
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % bgImages.length);
        }, 4000); // every 4 seconds switch

        return () => clearInterval(interval);
    }, []);

    
const filteredExams =
  selectedExamFilter === "All"
    ? exams
    : exams.filter((exam) => exam.stream === selectedExamFilter);



// FILTERED COURSES
const exploreLevels = useMemo(() => {
  const s = new Set<string>();
  courses.forEach(c => {
    if (c.level) s.add(c.level.trim());
  });
  return ["All", ...Array.from(s)];
}, [courses]);


    return (
        <div >


            <style>{`
  @keyframes scrollX {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  } 

  @keyframes logoScroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-logoScroll {
  animation: logoScroll 20s linear infinite;
}
  @keyframes cityAutoScroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-cityScroll {
  animation: cityAutoScroll 25s linear infinite;
}

`}</style>



   <section
  className="
    relative w-full h-[550px] max-md:h-[400px] overflow-hidden flex items-center justify-center
  "
  style={{
    transform: `translateY(${heroTranslate}px)`,
    transition: "transform 0.05s linear",
  }}
>

  {/* BACKGROUND SLIDER (UNCHANGED) */}
  <div
    className="absolute inset-0 flex"
    style={{
      width: "200%",
      animation: "scrollX 20s linear infinite",
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundImage:
          "url('https://www.pixelstalk.net/wp-content/uploads/2016/10/College-Wallpapers-HD-1920x1080-620x349.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />

    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundImage:
          "url('https://www.pixelstalk.net/wp-content/uploads/2016/10/HD-download-college-wallpapers.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  </div>

  {/* DARK BG LAYER */}
  <div className="absolute inset-0 bg-black/30"></div>

  {/* GLASS CARD */}
  <div
    className="relative z-10 w-[92%] max-w-4xl text-center px-6 py-8 md:py-10 rounded-3xl 
               bg-white/4 backdrop-transparent-[30px] border border-white/40 shadow-xl"
    style={{
      opacity: heroOpacity,
      transform: `translateY(${scrollY * 0.2}px)`,
      transition: "all linear",
    }}
  >

    {/* HEADING */}
     <h1 className="
       text-white font-extrabold
      text-[20px] leading-[36px]
      md:text-[30px] md:leading-[58px]
    ">
      <span> Explore Top Colleges, Courses & </span>

      <span >
        {currentWord}
        <span className="inline-block w-[2px] h-8 bg-[#F4A71D] ml-1 animate-pulse md:h-10"></span>
      </span>
    </h1>


    {/* SUBTEXT */}
    <p className="text-white/80 mt-2 text-sm md:text-base font-medium max-w-2xl mx-auto">
      Search 1000+ colleges, exams, check fees & discover your future.
    </p>

    {/* SEARCH BAR */}
    <form
      onSubmit={handleSearch}
      className="
        mt-7 w-full max-w-3xl mx-auto flex overflow-hidden
        rounded-xl md:rounded-full shadow-2xl bg-white grid grid-row-3 md:grid-cols-[1fr_1fr_auto] 
      "
    >
      <input
        type="text"
        name="college"
        placeholder="College Name"
        value={heroFilters.college}
        onChange={handleFilterChange}
        className="flex-1 px-5 py-3 outline-none text-gray-800 placeholder-gray-500 text-sm md:text-base"
      />

      <input
        type="text"
        name="city"
        placeholder="City"
        value={heroFilters.city}
        onChange={handleFilterChange}
        className="
          flex-1 px-5 py-3 outline-none border-x border-gray-200 
          text-gray-800 placeholder-gray-500 text-sm md:text-base
        "
      />

      <button
        type="submit"
        className="
          bg-[#0F6BC9] px-8 py-3 text-white font-semibold
          hover:bg-[#0c59a3] text-sm md:text-base
        "
      >
        Search
      </button>
    </form>

    {/* WHY CHOOSE */}
  
  </div>
</section>



            {/* -------------------------------------------------- */}
            {/* TOP COURSES / STUDY GOAL (Image 1 middle row)     */}
            {/* -------------------------------------------------- */}
<div
style={{
  marginTop: "-120px",
  paddingTop: "120px",
  background: "white",
  borderRadius: "40px 40px 0 0",
  boxShadow: "0 -20px 60px rgba(0,0,0,.08)"
}}
>
     <FadeSection delay={150}>
       <section className="pt-5 pb-10 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* HEADER */}
    <div className="mb-6 md:mb-8">
      <h2
        className="
          text-[24px] md:text-[32px]
          font-extrabold text-[#0A214A]
          leading-tight tracking-tight
        "
      >
        Top Courses · Select Your Study Goal
      </h2>

      <p className="text-sm md:text-base text-slate-600 mt-1">
        Explore curated course categories tailored to your academic interests.
      </p>
    </div>

    {/* GRID */}
    <div
      className="
        grid
        max-md:grid-cols-2
        md:grid-cols-3 lg:grid-cols-5
        gap-4 md:gap-6
      "
    >
      {courseCategories.map((category, index) => (
        <AnimatedContainer key={category.name} delay={index * 80}>
          <button
            onClick={() =>
              setView({
                page: "courses",
                initialStream: category.name,
              })
            }
            className={`
              ${category.color}
              text-white rounded-2xl w-full

              /* Desktop Size */
              px-6 py-6 h-[150px] md:h-[170px]

              /* MOBILE SIZING */
              max-md:h-[135px]
              max-md:px-4 max-md:py-4

              /* Shadow */
              shadow-[0_6px_18px_rgba(0,0,0,0.12)]
              hover:shadow-[0_10px_24px_rgba(0,0,0,0.18)]
              transition-all duration-300 hover:-translate-y-[2px]

              /* Layout */
              flex flex-col justify-between
            `}
          >
            {/* TOP - Icon + Title */}
            <div className="flex items-center gap-3 max-md:gap-2">
              <div
                className="
                  bg-white/25 border border-white/20 backdrop-blur-sm
                  rounded-xl flex items-center justify-center

                  /* MOBILE ICON SIZE */
                  max-md:p-2 max-md:h-8 max-md:w-8
                  md:p-3
                "
              >
              <img
    src={category.iconPath}
    alt={category.name}
    className="max-md:h-5 max-md:w-5 md:h-6 md:w-6 object-contain   invert brightness-5 saturate-5"
  />
              </div>

              <div className="leading-tight">
                <p className="font-bold text-[13px] md:text-[15px]">
                  {category.name}
                </p>
                <p className="text-[10px] md:text-[11px] text-white/80">
                  {category.courseCount}+ courses
                </p>
              </div>
            </div>

            {/* DESCRIPTION */}
            <p
              className="
                text-white/90 leading-snug
                text-[10px] md:text-xs mt-1
                max-md:line-clamp-2
              "
            >
              {category.description}
            </p>
          </button>
        </AnimatedContainer>
      ))}
    </div>
  </div>
</section> 
      </FadeSection>
</div>

            {/* -------------------------------------------------- */}
            {/* FIND YOUR IDEAL COLLEGE (Top Universities cards)  */}
            {/* -------------------------------------------------- */}
   
            <FadeSection delay={150}>
            <section
            
            className="pb-6 bg-white mt-10 pt-12 shadow-[0_12px_28px_rgba(0,0,0,0.06)] rounded-2xl">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
      <div className="mb-10">

    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        {/* LEFT SIDE: Heading */}
        <div className="flex-shrink-0">
            <h2
                className="text-[28px] md:text-[32px] font-extrabold tracking-tight text-slate-900"
                style={{ fontFamily: "Roboto, sans-serif" }}
            >
                Top Universities / Colleges
            </h2>

            <p
                className="text-sm md:text-base text-slate-500 mt-1"
                style={{ fontFamily: "Roboto, sans-serif" }}
            >
                Find Your Ideal College
            </p>
        </div>

        {/* RIGHT SIDE: Stream Filters */}
        <div className="flex flex-wrap gap-1 lg:justify-end lg:max-w-[60%]">
            {streams.map((stream) => (
                <button
                    key={stream}
                    onClick={() => setSelectedStream(stream)}
                    className={`px-5 py-2 rounded-full text-sm font-medium border transition-all
                        ${selectedStream === stream
                            ? "bg-[#1f4fa8] text-white border-[#1f4fa8] shadow-md"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 shadow-sm"
                        }
                    `}
                    style={{ fontFamily: "Roboto, sans-serif" }}
                >
                    {stream}
                </button>
            ))}
        </div>

    </div>

</div>


        {/* Horizontal Carousel */}
        {filteredColleges.length > 0 ? (
            <div className="relative">

                {/* Left Arrow */}
                <button
                    onClick={() =>
                        document
                            .getElementById("collegeCarousel")
                            ?.scrollBy({ left: -350, behavior: "smooth" })
                    }
                    className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2
                    bg-[#1f4fa8] text-white h-12 w-12 rounded-full shadow-xl z-20
                    hover:bg-[#163a7a] transition"
                >
                    <span className="text-xl font-bold">←</span>
                </button>

                {/* Scroll Container */}
                <div
                    id="collegeCarousel"
                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-0 px-2"
                >
                    {filteredColleges.map((college, index) => (
                        <div
                            key={college.id}
                           className="min-w-[300px] max-w-[330px] h-[430px] flex-shrink-0 max-md:h-[400px]"

                        >
                            <AnimatedContainer delay={index * 90} className="h-full">
                                <CollegeCard 
                                college={college} 
                                setView={setView} 
                                onOpenBrochure={() => {
    setModalMode("brochure");
    setApplyModalOpen(true);
    
  }} className="mb-0"/>
                            </AnimatedContainer>
                        </div>
                    ))}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={() =>
                        document
                            .getElementById("collegeCarousel")
                            ?.scrollBy({ left: 350, behavior: "smooth" })
                    }
                    className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2
                    bg-[#1f4fa8] text-white h-12 w-12 rounded-full shadow-xl z-20
                    hover:bg-[#163a7a] transition"
                >
                    <span className="text-xl font-bold">→</span>
                </button>
            </div>
        ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-md border">
                <h3
                    className="text-lg font-semibold text-slate-700"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                >
                    No Colleges Match Your Criteria
                </h3>
                <p className="text-slate-500 mt-2" style={{ fontFamily: "Roboto, sans-serif" }}>
                    Try adjusting your filters or view all colleges.
                </p>
            </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-0">
            <button
                onClick={() => setView({ page: "listing" })}
                className="px-8 py-3 rounded-full bg-[#1f4fa8] text-white
                font-semibold shadow-lg hover:bg-[#163a7a]
                transition-all text-sm md:text-base mt-5"
                style={{ fontFamily: "Roboto, sans-serif" }}
            >
                View All Colleges
            </button>
        </div>

    </div>
</section> 
</FadeSection>

          {/* Top Study Places Section */}
 <section className="py-3 bg-[#F8F9FA] relative overflow-hidden">
  <div
    className="absolute inset-0 bg-left bg-no-repeat bg-contain opacity-10 pointer-events-none"
    style={{
      backgroundImage:
        "url('https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/India_Map.png/960px-India_Map.png?20191107232049')",
    }}
  ></div>

  <div className="max-w-7xl mx-auto px-6">

    {/* HEADING */}
    <h2 className="text-center text-[28px] md:text-[32px] font-bold text-[#0A225A] leading-[38px] md:leading-[42px] mt-4">
      Find Colleges Near You!
    </h2>

    <p className="text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] text-black text-center mt-1">
      Search by city to{" "}
      <span className="text-[#0CC25F] font-semibold">
        Explore Top Colleges
      </span>{" "}
      in your area.
    </p>

    {/* SEARCH BAR */}
    <div className="mt-6 md:mt-8 flex justify-center">
      <div className="flex gap-3 items-center w-full max-w-2xl max-md:flex-col">

        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search city or location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="
              w-full py-3 md:py-4 pl-12 pr-4 rounded-xl border border-gray-300 
              shadow-sm bg-white text-gray-700 
              focus:ring-2 focus:ring-[#0A225A] focus:border-[#0A225A]
              max-md:text-sm
            "
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
            🔍
          </span>
        </div>

        <button
          onClick={handleCitySearch}
          className="
            px-6 py-3 md:py-4 rounded-xl text-white font-semibold 
            bg-[#0A225A] hover:bg-[#071a3f]
            shadow-md transition
            w-full md:w-auto max-md:text-sm
          "
        >
          Search Now
        </button>

      </div>
    </div>

    {error && (
      <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
    )}

    {/* CITY SCROLLER */}
    <div className="relative mt-8 md:mt-10">

      {/* LEFT ARROW */}
      <button
        onClick={() =>
          document
            .getElementById("cityCarousel")
            ?.scrollBy({ left: -250, behavior: "smooth" })
        }
        className="hidden md:flex items-center justify-center absolute left-[-30px] top-1/2 
        -translate-y-1/2 h-12 w-12 bg-white shadow-lg border border-gray-200 
        rounded-full z-20 hover:scale-110 transition"
      >
        ‹
      </button>

      {/* SCROLLABLE ROW */}
      <div
        id="cityCarousel"
        className="
          flex gap-4 md:gap-6
          overflow-x-auto scroll-smooth scrollbar-hide
          snap-x snap-mandatory
          pb-3 pr-2
          max-md:overflow-x-scroll
          max-md:pl-1
        "
      >
        {filteredCities.map((city) => (
          <div
            key={city.city}
            ref={cityRefs[city.city]}
            onClick={() =>
              setView({
                page: "listing",
                filters: { city: city.city },
              })
            }
            className={`
              min-w-[130px] md:min-w-[150px]
              h-[135px] md:h-[150px]
              bg-white rounded-2xl border border-gray-200
              shadow-md hover:shadow-xl 
              snap-start p-4 md:p-6 cursor-pointer
              flex flex-col items-center justify-center transition
              ${
                activeCity === city.city
                  ? "bg-blue-100 border-blue-500 scale-105"
                  : ""
              }
            `}
          >
            <div className="h-12 w-12 md:h-14 md:w-14 flex items-center justify-center">
              <img
                src={getCityIcon(city.city)}
                alt={city.city}
                className="h-10 w-10 md:h-12 md:w-12 object-contain"
              />
            </div>

            <p className="font-bold text-sm md:text-lg text-[#0A2A6C] mt-2 md:mt-3">
              {city.city}
            </p>
          </div>
        ))}
      </div>

      {/* RIGHT ARROW */}
      <button
        onClick={() =>
          document
            .getElementById("cityCarousel")
            ?.scrollBy({ left: 250, behavior: "smooth" })
        }
        className="hidden md:flex items-center justify-center absolute right-[-30px] top-1/2 
        -translate-y-1/2 h-12 w-12 bg-white shadow-lg border border-gray-200 
        rounded-full z-20 hover:scale-110 transition"
      >
        ›
      </button>

    </div>

  </div>
</section>



{/* EXPLORE COURSES SECTION */}
<section className="py-16 bg-white">
  <div className="max-w-7xl mx-auto px-6">

    {/* Heading */}
    <div className="flex items-center gap-3 mb-6">
      <svg width="35" height="35" viewBox="0 0 24 24" stroke="#0A225A" fill="none">
        <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          d="M4 4h16v12H4z M4 16l8 4 8-4" />
      </svg>
      <h2 className="text-3xl font-extrabold text-[#0A225A]">
        Explore Courses
      </h2>
    </div>

    {/* FILTER BY LEVEL ONLY */}
    <div className="mb-8">
      <h3 className="font-bold text-lg text-[#0A225A] mb-3">Filter by Level</h3>
      <div className="flex gap-3 flex-wrap">

        {exploreLevels.map((level) => (
          <button
            key={level}
            onClick={() => setExploreLevel(level)}
            className={`
              px-4 py-2 rounded-full border font-medium text-sm transition
              ${
                exploreLevel === level
                  ? "bg-[#0A225A] text-white border-[#0A225A]"
                  : "bg-white text-[#0A225A] border-gray-300 hover:bg-gray-100"
              }
            `}
          >
            {level}
          </button>
        ))}

      </div>
    </div>

    {/* FILTERED COURSE LIST */}
    <button
      onClick={() =>
        document.getElementById("courseScroll")?.scrollBy({ left: -300, behavior: "smooth" })
      }
      className="hidden md:flex items-center justify-center absolute left-4 mt-[150px]
      h-10 w-10 bg-white text-[#0A225A] rounded-full shadow-xl hover:scale-110 transition border"
    >
      ←
    </button>

    <div
      id="courseScroll"
      className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 px-2"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {courses
        .filter((course) =>
          exploreLevel === "All" ? true : course.level === exploreLevel
        )
        .slice(0, 10)
        .map((course, index) => (
          <div
            key={index}
            onClick={() =>
              setView({
                page: "course-detail",
                courseIds: [course.id],
                courseKey: course.courseKey
              })
            }
            className="
              min-w-[260px] snap-start p-5 cursor-pointer
              bg-white rounded-2xl border border-gray-200 
              shadow-[0_4px_12px_rgba(0,0,0,0.08)]
              transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)]
            "
          >
            {/* Top Tags */}
            <div className="flex justify-between mb-3 text-xs">
              <span className="bg-gray-100 px-3 py-1 rounded-md font-semibold text-gray-700">
                {course.type || "Full Time"}
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-md font-semibold text-gray-700">
                {course.duration || "NA"}
              </span>
            </div>

            {/* Title */}
          <h3
  className="
    text-[14px]
    mb-3
    leading-tight
    truncate
    whitespace-nowrap
    overflow-hidden
    max-w-full
  "
  title={course.name}
>
  {course.name}
</h3>


            {/* Info Boxes */}
            <div className="grid grid-cols-2 gap-3 text-xs mb-4">

              <div className="bg-gray-50 p-3 rounded-md border flex flex-col">
                <span className="text-gray-500 text-[11px]">Duration</span>
                <span className="font-semibold">{course.duration || "NA"}</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-md border flex flex-col">
                <span className="text-gray-500 text-[11px]">Avg. Fees</span>
                <span className="font-semibold">
                  ₹{course.fees || "NA"}
                </span>
              </div>

             <div className="bg-gray-50 p-3 rounded-md border flex flex-col">
  <span className="text-gray-500 text-[11px]">Colleges</span>
  <span className="font-semibold">
    {course.colleges?.length || 0}
  </span>
</div>


              <div className="bg-gray-50 p-3 rounded-md border flex flex-col">
                <span className="text-gray-500 text-[11px]">Level</span>
                <span className="font-semibold">
                  {course.level || "General"}
                </span>
              </div>

            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-3 border-t">
              <button className="text-[#0A225A] text-[12px] font-semibold hover:underline">
                Course Overview →
              </button>

              <button className="bg-green-500 text-white px-2 py-2 rounded-full text-[11px] font-semibold hover:bg-green-600">
                View Details
              </button>
            </div>
          </div>
        ))}
    </div>

    {/* Right Arrow */}
    <button
      onClick={() =>
        document.getElementById("courseScroll")?.scrollBy({ left: 300, behavior: "smooth" })
      }
      className="hidden md:flex items-center justify-center absolute right-4 mt-[-160px]
      h-10 w-10 bg-white text-[#0A225A] rounded-full shadow-xl hover:scale-110 transition border"
    >
      →
    </button>

    {/* VIEW ALL */}
    <div className="flex justify-center mt-10">
      <button
        onClick={() => setView({ page: "courses" })}
        className="bg-[#0A225A] text-white px-10 py-3 text-lg rounded-full font-semibold shadow-lg hover:bg-[#071a3f] transition"
      >
        View All Courses
      </button>
    </div>

  </div>
</section>


{/* Trusted by Students Section testimonials  */}
<section className="py-12 bg-[#f4f6fb]">
  <div className="max-w-6xl mx-auto px-6">

    <h2 className="text-lg md:text-xl font-semibold text-[#0A225A] mb-6">
      Student Reviews & Testimonials
    </h2>

    {/* MOBILE: Horizontal scroll */}
    <div
      className="
        flex md:hidden
        gap-4 overflow-x-auto scroll-smooth
        snap-x snap-mandatory
        pb-3
        scrollbar-hide
      "
    >
      {TESTIMONIALS_DATA.map((t, i) => (
        <div
          key={i}
          className="
            min-w-[80%] snap-start
            bg-white rounded-2xl shadow-md border border-gray-200
            p-5 flex flex-col gap-3
          "
        >
          <div className="flex items-center gap-3">
            <img src={t.avatarUrl} className="h-10 w-10 rounded-full object-cover" />
            <div>
              <p className="font-semibold text-sm text-slate-900">{t.name}</p>
              <p className="text-[11px] text-slate-500">{t.college}</p>
            </div>
          </div>

          <p className="text-xs text-slate-600">
            “{t.quote}”
          </p>

          <p className="text-[11px] text-yellow-500">★★★★★</p>
        </div>
      ))}
    </div>

    {/* DESKTOP: 3-column grid */}
    <div className="hidden md:grid md:grid-cols-3 gap-6 mt-4">
      {TESTIMONIALS_DATA.map((t, i) => (
        <div
          key={i}
          className="
            bg-white rounded-2xl shadow-md border border-gray-200
            p-5 flex flex-col h-full
          "
        >
          <div className="flex items-center gap-3 mb-3">
            <img src={t.avatarUrl} className="h-10 w-10 rounded-full object-cover" />
            <div>
              <p className="font-semibold text-sm text-slate-900">{t.name}</p>
              <p className="text-[11px] text-slate-500">{t.college}</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 flex-grow">
            “{t.quote}”
          </p>

          <p className="text-[11px] text-yellow-500 mt-3">★★★★★</p>
        </div>
      ))}
    </div>

  </div>
</section>

{/* Trusted by Students Section */}
<section className="py-16 bg-white">
  <div className="max-w-7xl mx-auto px-6 text-center">

    <h2 className="text-lg md:text-xl font-semibold text-[#0A225A] mb-10">
      Trusted by Students from Top Institutions
    </h2>

    {/* SLIDER WRAPPER */}
    <div className="overflow-hidden relative">

      {/* SLIDER (infinite scroll) */}
      <div className="flex items-center gap-16 animate-logoScroll whitespace-nowrap">

        <img src="/logos/doon.png" className="h-14  hover:grayscale-0 transition" />
        <img src="/logos/download.jpg" className="h-14  hover:grayscale-0 transition" />
        <img src="/logos/ITM.png" className="h-14 hover:grayscale-0 transition" />
        <img src="/logos/NBS.jpg" className="h-14 hover:grayscale-0 transition" />
        <img src="/logos/StudyCups.png" className="h-14 hover:grayscale-0 transition" />

        {/* Duplicate logos for infinite loop */}
        <img src="/logos/doon.png" className="h-14 hover:grayscale-0 transition" />
        <img src="/logos/download.jpg" className="h-14  hover:grayscale-0 transition" />
        <img src="/logos/ITM.png" className="h-14 hover:grayscale-0 transition" />
        <img src="/logos/NBS.jpg" className="h-14  hover:grayscale-0 transition" />
        <img src="/logos/StudyCups.png" className="h-14 hover:grayscale-0 transition" />

      </div>
    </div>
  </div>
</section>


   {/* -------------------------------------------------- */}
{/* EXPLORE EXAMS SECTION (Updated with unique stream filters) */}
{/* -------------------------------------------------- */}

<section className="py-10 bg-white">
  
  {/* Build unique streams from backend exam.stream */}
  {(() => {
    const uniqueStreams = new Set<string>();
    exams.forEach((exam) => {
      if (exam.stream) uniqueStreams.add(exam.stream.trim());
    });
    var examFilters = ["All", ...Array.from(uniqueStreams)];
    return null;
  })()}

  {/* Exam Filters */}
  <div className="flex gap-2 flex-wrap mb-6 justify-center">
    {["All", ...Array.from(
      new Set(exams.map((e) => e.stream?.trim()).filter(Boolean))
    )].map((stream) => (
      <button
        key={stream}
        onClick={() => setSelectedExamFilter(stream)}
        className={`px-4 py-2 rounded-full text-sm font-medium border transition
          ${
            selectedExamFilter === stream
              ? "bg-[#1f4fa8] text-white border-[#1f4fa8]"
              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
          }
        `}
      >
        {stream}
      </button>
    ))}
  </div>

  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* Heading */}
    <div className="mb-6">
      <h2 className="text-[24px] md:text-[28px] font-bold text-slate-900">
        Top Exams
      </h2>
    </div>

    {/* Filtered Exams */}
    <div className="relative">
      <div
        id="examCarousel"
        className="flex gap-5 overflow-x-auto scroll-smooth pb-3 px-1 scrollbar-hide"
      >
        {exams
          .filter((exam) =>
            selectedExamFilter === "All"
              ? true
              : exam.stream?.trim() === selectedExamFilter
          )
          .map((exam) => (
            <div
              key={exam.id}
              onClick={() => setView({ page: "exam-detail", examId: exam.id })}
              className="
                min-w-[290px] max-w-[290px]
                bg-white border border-gray-200 rounded-xl 
                shadow-sm hover:shadow-md cursor-pointer 
                transition-all p-5
              "
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={exam.logoUrl}
                    className="h-10 w-10 rounded-full border object-contain"
                    alt={exam.name}
                  />
                  <div>
                    <p className="font-semibold text-sm text-slate-900">
                      {exam.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {exam.conductingBody}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                  {exam.stream || "Exam"}
                </span>
              </div>

              <div className="border-t pt-3">
                <p className="text-xs text-gray-500">Exam Date</p>
                <p className="font-semibold text-[#1f4fa8] text-sm">
                  {exam.date || "To be announced"}
                </p>
              </div>

              <div className="mt-3">
                <div className="flex justify-between py-2 border-t">
                  <p className="text-sm font-medium text-slate-800">
                    Application Process
                  </p>
                  <span className="text-lg text-slate-600">›</span>
                </div>

                <div className="flex justify-between py-2 border-t">
                  <p className="text-sm font-medium text-slate-800">Exam Info</p>
                  <span className="text-lg text-slate-600">›</span>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() =>
          document
            .getElementById("examCarousel")
            ?.scrollBy({ left: 300, behavior: "smooth" })
        }
        className="
          hidden md:flex items-center justify-center
          absolute right-[-25px] top-1/2 -translate-y-1/2
          h-12 w-12 rounded-full shadow-xl bg-white border
          hover:scale-110 transition
        "
      >
        <span className="text-xl">›</span>
      </button>
    </div>

  </div>
</section>



            {/* -------------------------------------------------- */}
            {/* COLLEGE RANKING TABLE (Image 2 middle)            */}
            {/* -------------------------------------------------- */}

         {/* Ranking Table Container */}
<div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-md mt-8 max-w-7xl mx-auto">

  {/* TABLE HEAD SECTION */}
  <div className="px-5 pt-6 pb-3">
    <h2 className="text-2xl font-bold text-slate-900">Top 10 Colleges</h2>
  </div>

  {/* STREAM FILTERS */}
<div className="flex flex-wrap gap-3 px-5 pb-4 border-b border-slate-200">

  {["All", ...streamFilters].map((item) => (
    <button
      key={item}
      onClick={() => setSelectedtopcollge(item)}
      className={`px-4 py-2 rounded-full text-sm border transition
        ${selectedtopcollge === item
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white border-slate-300 hover:bg-slate-100"
        }
      `}
    >
      {item}
    </button>
  ))}

</div>


  {/* TABLE */}
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">

      {/* TABLE HEAD */}
      <thead>
        <tr className="bg-slate-100 text-salt-700 text-sm border-b">
          <th className="px-6 py-3 text-left w-20">Rank</th>
          <th className="px-6 py-3 text-left">College</th>
          <th className="px-6 py-3 text-left w-48">Ranking</th>
          <th className="px-6 py-3 text-left w-48">Cutoff</th>
          <th className="px-6 py-3 text-left w-48">Application Deadline</th>
          <th className="px-6 py-3 text-left w-40">Fees</th>
        </tr>
      </thead>

      {/* TABLE BODY */}
   <tbody>
  {displayedColleges.map((college, index) => (
   <tr
  key={college.id}
  className={`
    border-b text-sm
    ${index % 2 === 0 ? "bg-[#f5f9ff]" : "bg-white"}
  `}
>

      <td className="px-6 py-4 font-semibold text-slate-900">#{index + 1}</td>

      <td className="px-6 py-4">
        <div className="flex items-start gap-3">
          <img
            src={college.logoUrl}
            className="h-10 w-10 rounded-full object-cover border"
          />
          <div>
            <p className="font-semibold text-[15px] leading-tight text-slate-800">
              {college.name}
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              {college.city}, {college.state} |
              <span className="ml-1 text-yellow-500 font-semibold">⭐ {college.rating}</span>
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-slate-700">{college.rankingText}</td>
      <td className="px-6 py-4 text-slate-700">{college.cutoffText}</td>
      <td className="px-6 py-4 text-slate-700">{college.deadline}</td>

      <td className="px-6 py-4 font-bold text-slate-900">
        {college.fees}
        <p className="text-xs text-slate-500 font-normal">1st Year Fees</p>
      </td>
    </tr>
  ))}
</tbody>

    </table>
  </div>
</div>

            {/* -------------------------------------------------- */}
            {/* OPTIONAL: FAQ + BLOG + CONTACT (keep functionality) */}
            {/* (You can remove these if you strictly want home to  */}
            {/* end at the gradient footer below.)                 */}
            {/* -------------------------------------------------- */}

            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
                            Have questions? We’ve got answers. You can also reach out to us
                            directly from the contact section.
                        </p>
                    </div>
                    <div className="max-w-3xl mx-auto space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full flex justify-between items-center px-5 py-4 text-left"
                                >
                                    <span className="text-sm font-semibold text-slate-900">
                                        {faq.question}
                                    </span>
                                    <span
                                        className={`transform transition-transform ${openFaq === index ? "rotate-45" : "rotate-0"
                                            }`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-[--primary-medium]"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 4v16m8-8H4"
                                            />
                                        </svg>
                                    </span>
                                </button>
                                {openFaq === index && (
                                    <div className="px-5 pb-4 pt-0 text-xs text-slate-600">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog preview */}
         <section className="py-16 bg-[#f4f6fb]">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

    <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-8">
      Latest from our Blog
    </h2>

    {/* MOBILE: horizontal scroll */}
    <div
      className="
        flex md:hidden 
        gap-4 overflow-x-auto scroll-smooth 
        snap-x snap-mandatory pb-4 scrollbar-hide
      "
    >
      {BLOG_POSTS_DATA.slice(0, 3).map((post, index) => (
        <div
          key={post.id}
          onClick={() =>
            setView({ page: 'blog-detail', postId: post.id } as any)
          }
          className="
            min-w-[85%] snap-start
            bg-white rounded-2xl shadow-md border border-slate-100 
            overflow-hidden cursor-pointer flex flex-col
          "
        >
          <div className="h-36 overflow-hidden">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="px-5 py-4 flex flex-col">
            <span
              className={`
                text-[10px] font-semibold px-2 py-1 rounded-full 
                ${blogCategoryColors[post.category] || "bg-slate-100 text-slate-700"}
              `}
            >
              {post.category}
            </span>

            <h3 className="text-sm font-semibold text-slate-900 mt-2">
              {post.title}
            </h3>

            <p className="text-[11px] text-slate-600 line-clamp-3 mt-1">
              {post.excerpt}
            </p>

            <span className="mt-3 text-[11px] font-semibold text-[#1f4fa8]">
              Read More →
            </span>
          </div>
        </div>
      ))}
    </div>

    {/* DESKTOP: 3 column grid */}
    <div className="hidden md:grid grid-cols-3 gap-6">
      {BLOG_POSTS_DATA.slice(0, 3).map((post, index) => (
        <AnimatedContainer key={post.id} delay={index * 80}>
          <div
            onClick={() =>
              setView({ page: 'blog-detail', postId: post.id } as any)
            }
            className="
              bg-white rounded-2xl shadow-md border border-slate-100 
              overflow-hidden cursor-pointer flex flex-col h-full
            "
          >
            <div className="h-40 overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="px-5 py-4 flex flex-col flex-grow">
              <span
                className={`
                  text-[10px] font-semibold px-2 py-1 rounded-full 
                  ${blogCategoryColors[post.category] || "bg-slate-100 text-slate-700"}
                `}
              >
                {post.category}
              </span>

              <h3 className="text-sm font-semibold text-slate-900 mt-2 flex-grow">
                {post.title}
              </h3>

              <p className="text-[11px] text-slate-600 line-clamp-3">
                {post.excerpt}
              </p>

              <span className="mt-3 text-[11px] font-semibold text-[#1f4fa8]">
                Read More →
              </span>
            </div>
          </div>
        </AnimatedContainer>
      ))}
    </div>

    {/* VIEW ALL BUTTON */}
    <div className="text-center mt-10">
      <button
        onClick={() => setView({ page: 'blog' })}
        className="
          inline-flex items-center justify-center px-6 py-2.5 rounded-full 
          border border-[#1f4fa8] text-[#1f4fa8] text-sm font-semibold 
          hover:bg-[#1f4fa8]/5
        "
      >
        View all articles
      </button>
    </div>

  </div>
</section>


            {/* Contact section */}
        <section className="py-8 bg-white">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                Get In Touch
            </h2>
            <p className="text-lg text-slate-500 mt-2 max-w3xl mx-auto">
                Have questions about admissions, courses, or anything else? We're here to help.
            </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-4 md:pb-0">

            {/* LEFT SIDE IMAGE + CONTACT INFO CARD */}
            <div className="flex flex-col gap-4 h-auto md:h-[520px]">

                {/* IMAGE BLOCK */}
                <div className="w-full h-[200px] md:h-[260px] rounded-3xl overflow-hidden shadow-md flex-shrink-0">
                    <img 
                        src="/icons/studycups_contact.png" 
                        alt="StudyCups Support" 
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* CONTACT INFO CARD */}
                <div className="bg-white rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.06)] 
                                border border-slate-100 p-4 space-y-3 md:flex-1">

                    <h3 className="text-lg font-semibold text-slate-900">Contact Information</h3>

                    <p className="text-sm text-slate-600 leading-relaxed">
                        Fill out the form and our team will get back to you within 24 hours.
                        You can also reach us through the contact details below.
                    </p>

                    <div className="space-y-4">

                        {/* PHONE */}
                        <div className="flex items-center gap-4 bg-white shadow-md px-5 py-4 
                                        rounded-2xl border border-slate-100">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" 
                                    className="h-6 w-6 text-[#0F2D52]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3l2 5-2 1a11 11 0 005 5l1-2 5 2v3a2 2 0 01-2 2h-1C10.82 19 5 13.18 5 6V5z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900 text-sm">Phone</p>
                                <a href="tel:+918081269969"
                                    className="text-slate-600 hover:text-[#0F2D52] text-sm">
                                    +91 8081269969
                                </a>
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div className="flex items-center gap-4 bg-white shadow-md px-5 py-4 
                                        rounded-2xl border border-slate-100">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" 
                                    className="h-6 w-6 text-[#0F2D52]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900 text-sm">Email</p>
                                <a href="mailto:Support@studycups.in"
                                    className="text-slate-600 hover:text-[#0F2D52] text-sm">
                                    Support@studycups.in
                                </a>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            {/* RIGHT SIDE FORM */}
            <AnimatedContainer delay={150}>
                <ContactForm />
            </AnimatedContainer>

        </div>
    </div>
</section>



        </div>
    );
};

export default HomePage;
