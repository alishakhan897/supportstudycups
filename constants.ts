import type { College, Course, Placements, Exam, BlogPost, Testimonial, Event } from './types';

export const POPULAR_COURSES_DATA = [
    {
        name: 'B.Tech',
        fullName: 'Bachelor of Technology',
        description: 'Forge the future with core engineering principles and cutting-edge tech.',
        icon: 'btech',
        color: 'from-[--primary-dark] to-[--primary-medium]',
        stream: 'Engineering',
        level: 'Undergraduate',
        courseLinkName: 'B.Tech in Computer Science'
    },
    {
        name: 'MBA',
        fullName: 'Master of Business Administration',
        description: 'Ascend the corporate ladder with advanced leadership and management skills.',
        icon: 'mba',
        color: 'from-purple-500 to-violet-600',
        stream: 'Management',
        level: 'Postgraduate',
        courseLinkName: 'MBA'
    },
    {
        name: 'BBA',
        fullName: 'Bachelor of Business Administration',
        description: 'Build a strong foundation in business principles, strategy, and operations.',
        icon: 'bba',
        color: 'from-amber-500 to-orange-600',
        stream: 'Management',
        level: 'Undergraduate',
        courseLinkName: 'BBA'
    },
    {
        name: 'MCA',
        fullName: 'Master of Computer Applications',
        description: 'Master the world of software development and advanced computing applications.',
        icon: 'mca',
        color: 'from-[--primary-medium] to-[--primary-dark]',
        stream: 'Engineering',
        level: 'Postgraduate',
        courseLinkName: 'B.Tech in Computer Science'
    },
    {
        name: 'MBBS',
        fullName: 'Bachelor of Medicine, Bachelor of Surgery',
        description: 'Embark on the noble path of saving lives and advancing modern healthcare.',
        icon: 'mbbs',
        color: 'from-green-500 to-emerald-600',
        stream: 'Medical',
        level: 'Undergraduate',
        courseLinkName: 'MBBS'
    },
    {
        name: 'LLB',
        fullName: 'Bachelor of Laws',
        description: 'Champion justice and navigate the intricate world of the legal system.',
        icon: 'llb',
        color: 'from-yellow-500 to-lime-600',
        stream: 'Law',
        level: 'Undergraduate',
        courseLinkName: 'LLB'
    },
    {
        name: 'B.Com',
        fullName: 'Bachelor of Commerce',
        description: 'Understand the language of business, finance, and economic policies.',
        icon: 'bcom',
        color: 'from-rose-500 to-red-600',
        stream: 'Arts & Science',
        level: 'Undergraduate',
        courseLinkName: 'B.Com'
    },
    {
        name: 'B.Des',
        fullName: 'Bachelor of Design',
        description: 'Shape the world with creativity, aesthetics, and user-centric design.',
        icon: 'bdes',
        color: 'from-pink-500 to-fuchsia-600',
        stream: 'Design',
        level: 'Undergraduate',
        courseLinkName: 'Bachelor of Design'
    }
];

export const COURSE_STREAMS: { [key: string]: string[] } = {
    'Engineering': ['B.Tech in Computer Science', 'B.Tech in Mechanical Engineering', 'B.Tech in Civil Engineering', 'B.Tech in Electrical Engineering', 'M.Tech in AI'],
    'Management': ['BBA', 'MBA', 'PGDM in Marketing'],
    'Medical': ['MBBS', 'BDS', 'B.Sc Nursing'],
    'Arts & Science': ['B.A in History', 'B.Sc in Physics', 'M.Sc in Chemistry', 'B.Com'],
    'Law': ['LLB', 'LLM'],
    'Design': ['Bachelor of Design', 'Master of Design']
};

const COLLEGES_COURSES: { [key: string]: Course[] } = {
    'IITD': [
        { id: 1, name: 'B.Tech in Computer Science', duration: '4 Years', level: 'Undergraduate', fees: 220000, eligibility: '10+2 with 75% + JEE Advanced' },
        { id: 2, name: 'B.Tech in Mechanical Engineering', duration: '4 Years', level: 'Undergraduate', fees: 220000, eligibility: '10+2 with 75% + JEE Advanced' },
        { id: 3, name: 'Master of Design', duration: '2 Years', level: 'Postgraduate', fees: 150000, eligibility: 'B.Des or B.Tech + CEED' },
    ],
    'VIT': [
        { id: 4, name: 'B.Tech in Computer Science', duration: '4 Years', level: 'Undergraduate', fees: 395000, eligibility: '10+2 with 60% + VITEEE' },
        { id: 5, name: 'BBA', duration: '3 Years', level: 'Undergraduate', fees: 150000, eligibility: '10+2 with 60%' },
        { id: 6, name: 'B.Tech in Electrical Engineering', duration: '4 Years', level: 'Undergraduate', fees: 395000, eligibility: '10+2 with 60% + VITEEE' },
    ],
    'AIIMS': [
         { id: 7, name: 'MBBS', duration: '5.5 Years', level: 'Undergraduate', fees: 6500, eligibility: '10+2 with PCB + NEET' },
         { id: 8, name: 'B.Sc Nursing', duration: '4 Years', level: 'Undergraduate', fees: 2400, eligibility: '10+2 with PCB' },
    ],
    'IIMB': [
        { id: 9, name: 'MBA', duration: '2 Years', level: 'Postgraduate', fees: 2300000, eligibility: 'Graduation + CAT' },
        { id: 10, name: 'PGDM in Marketing', duration: '2 Years', level: 'Postgraduate', fees: 2100000, eligibility: 'Graduation + CAT' },
    ],
    'NLU': [
        { id: 11, name: 'LLB', duration: '5 Years', level: 'Undergraduate', fees: 250000, eligibility: '10+2 + CLAT' },
        { id: 12, name: 'LLM', duration: '1 Year', level: 'Postgraduate', fees: 180000, eligibility: 'LLB + CLAT PG' },
    ]
    ,
    'ABS': [
        { id: 101, name: 'PGDM in Marketing', duration: '2 Years', level: 'Postgraduate', fees: 450000, eligibility: 'Graduation with 50% + CAT/XAT/CMAT/MAT/GMAT/ATMA' },
        { id: 102, name: 'PGDM in Finance', duration: '2 Years', level: 'Postgraduate', fees: 450000, eligibility: 'Graduation with 50% + CAT/XAT/CMAT/MAT/GMAT/ATMA' },
        { id: 103, name: 'PGDM in Human Resource Management', duration: '2 Years', level: 'Postgraduate', fees: 450000, eligibility: 'Graduation with 50% + CAT/XAT/CMAT/MAT/GMAT/ATMA' },
        { id: 104, name: 'PGDM in Operations Management', duration: '2 Years', level: 'Postgraduate', fees: 450000, eligibility: 'Graduation with 50% + CAT/XAT/CMAT/MAT/GMAT/ATMA' },
        { id: 105, name: 'PGDM in Business Analytics', duration: '2 Years', level: 'Postgraduate', fees: 450000, eligibility: 'Graduation with 50% + CAT/XAT/CMAT/MAT/GMAT/ATMA' },
    ],
    'BENNETT': [
        { id: 201, name: 'MBA', duration: '2 Years', level: 'Postgraduate', fees: 680000, eligibility: 'Graduation with 50% + CAT/XAT/GMAT/NMAT/MAT/CMAT + PI & SOP' }
        // Other programs: BBA, Integrated MBA, Ph.D. (can be added on request)
    ],
    'NBS': [
        { id: 301, name: 'MBA + PGPCE', duration: '2 Years', level: 'Postgraduate', fees: 985000, eligibility: 'Graduation with 60% + NBSAT/CMAT/NMAT/XAT/MAT/ATMA/CAT + SOP + PI' },
        { id: 302, name: 'PGDM Dual Specialization (Finance/Marketing/HR/IT)', duration: '2 Years', level: 'Postgraduate', fees: 795000, eligibility: 'Graduation with 60% + NBSAT/CMAT/NMAT/XAT/MAT/ATMA/CAT + SOP + PI' },
        { id: 303, name: 'PGDM in Data Science & Analytics', duration: '2 Years', level: 'Postgraduate', fees: 795000, eligibility: 'Graduation with 60% + NBSAT/CMAT/NMAT/XAT/MAT/ATMA/CAT + SOP + PI' },
        { id: 304, name: 'PGDM in Quantitative Finance', duration: '2 Years', level: 'Postgraduate', fees: 1085000, eligibility: 'Graduation with 60% + NBSAT/CMAT/NMAT/XAT/MAT/ATMA/CAT + SOP + PI' },
    ]
};

const COLLEGES_PLACEMENTS: { [key: string]: Placements } = {
    'IITD': { highestPackage: '2.5 Cr', averagePackage: '25 LPA', placementPercentage: 95, topRecruiters: ['Google', 'Microsoft', 'Amazon', 'Jane Street'] },
    'VIT': { highestPackage: '1.02 Cr', averagePackage: '9.23 LPA', placementPercentage: 92, topRecruiters: ['Infosys', 'Wipro', 'Cognizant', 'TCS'] },
    'AIIMS': { highestPackage: 'N/A', averagePackage: 'Govt. Stipend', placementPercentage: 100, topRecruiters: ['Government Hospitals', 'Private Hospitals'] },
    'IIMB': { highestPackage: '80 LPA', averagePackage: '33.8 LPA', placementPercentage: 100, topRecruiters: ['McKinsey & Company', 'BCG', 'Bain & Company', 'Goldman Sachs'] },
    'NLU': { highestPackage: '20 LPA', averagePackage: '15 LPA', placementPercentage: 85, topRecruiters: ['Cyril Amarchand Mangaldas', 'Khaitan & Co', 'AZB & Partners'] },
    'ABS': { highestPackage: '36.64 LPA', averagePackage: 'N/A', placementPercentage: 95, topRecruiters: ['Deloitte', 'Amazon', 'EY'] },
    'BENNETT': { highestPackage: '33 LPA', averagePackage: 'N/A', placementPercentage: 90, topRecruiters: ['Amazon', 'HDFC', 'S&P Global', 'Accenture'] },
    'NBS': { highestPackage: '32 LPA', averagePackage: '8.4 LPA', placementPercentage: 100, topRecruiters: ['Deloitte', 'EY', 'PwC', 'KPMG', 'Adani', 'Airtel', 'TCS', 'S&P Global', 'Sony'] },
};


export const COLLEGES_DATA: College[] = [
    {
        id: 1, name: 'Indian Institute of Technology, Delhi', location: 'New Delhi, Delhi', rating: 4.8, reviewCount: 1250,
        imageUrl: '/images/IIt delhi image.jpg',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/Indian_Institute_of_Technology_Delhi_Logo.svg/1200px-Indian_Institute_of_Technology_Delhi_Logo.svg.png',
        established: 1961, type: 'Government', accreditation: ['NAAC A++', 'NIRF'],
        description: 'IIT Delhi is one of the most prestigious engineering institutions in India, known for its rigorous academic programs and cutting-edge research.',
        highlights: ['Top Engineering College', 'Excellent Placements', 'Research Focused'],
        feesRange: { min: 200000, max: 250000 },
        courses: COLLEGES_COURSES['IITD'],
        placements: COLLEGES_PLACEMENTS['IITD']
    },
    {
        id: 2, name: 'Vellore Institute of Technology', location: 'Vellore, Tamil Nadu', rating: 4.5, reviewCount: 2500,
        imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2086&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        logoUrl: 'https://vit.ac.in/sites/default/files/VIT-logo.png',
        established: 1984, type: 'Private', accreditation: ['NAAC A++', 'ABET'],
        description: 'VIT is a leading private university in India, renowned for its excellent infrastructure, diverse student body, and strong industry connections.',
        highlights: ['Top Private University', 'FFCS System', 'International Collaborations'],
        feesRange: { min: 150000, max: 400000 },
        courses: COLLEGES_COURSES['VIT'],
        placements: COLLEGES_PLACEMENTS['VIT']
    },
    {
        id: 3, name: 'All India Institute of Medical Sciences, Delhi', location: 'New Delhi, Delhi', rating: 4.9, reviewCount: 980,
        imageUrl: '/images/Aiims delhi.jpg',
        logoUrl: 'https://www.aiims.edu/images/logo-hindi-eng.png',
        established: 1956, type: 'Government', accreditation: ['MCI'],
        description: 'AIIMS Delhi is the premier medical college and hospital in India, consistently ranked as the top medical institution for its exceptional clinical care and research.',
        highlights: ['Top Medical College', 'Subsidized Fees', 'Advanced Healthcare'],
        feesRange: { min: 2000, max: 7000 },
        courses: COLLEGES_COURSES['AIIMS'],
        placements: COLLEGES_PLACEMENTS['AIIMS']
    },
    {
        id: 4, name: 'Indian Institute of Management Bangalore', location: 'Bengaluru, Karnataka', rating: 4.7, reviewCount: 850,
        imageUrl: '/images/iim benglore.jpg',
        logoUrl: 'https://www.iimb.ac.in/themes/custom/iimb/logo.svg',
        established: 1973, type: 'Government', accreditation: ['EQUIS', 'AMBA'],
        description: 'IIM Bangalore is a leading graduate school of management in Asia, recognized for its excellence in management education and research.',
        highlights: ['Top B-School', 'Global Network', 'Case-based Learning'],
        feesRange: { min: 2100000, max: 2400000 },
        courses: COLLEGES_COURSES['IIMB'],
        placements: COLLEGES_PLACEMENTS['IIMB']
    },
    {
        id: 5, name: 'National Law School of India University', location: 'Bengaluru, Karnataka', rating: 4.6, reviewCount: 600,
        imageUrl: '/images/nationa law school.jpg',
        logoUrl: 'https://www.nls.ac.in/wp-content/uploads/2021/07/NLS-Logo-Navbar.png',
        established: 1986, type: 'Government', accreditation: ['BCI'],
        description: 'NLSIU is the top-ranked law university in India, pioneering legal education and setting standards for law schools across the country.',
        highlights: ['Top Law School', 'Moot Court Excellence', 'Legal Aid Clinics'],
        feesRange: { min: 180000, max: 300000 },
        courses: COLLEGES_COURSES['NLU'],
        placements: COLLEGES_PLACEMENTS['NLU']
    },
    {
        id: 6,
        name: 'Asian Business School (ABS), Noida',
        location: 'Noida, Uttar Pradesh',
        tagline: 'AICTE-approved PGDM with UK study tour and 550+ recruiters',
        rating: 4.4,
        reviewCount: 720,
        imageUrl: '/images/ABS.jpg',
        logoUrl: 'https://abs.edu.in/wp-content/uploads/2020/08/abs-logo.png',
        established: 1991,
        type: 'Private',
        accreditation: ['AICTE', 'NBA', 'AIU', 'AACSB'],
        description: 'Asian Business School (ABS), part of Asian Education Group, is an AICTE-approved premier B-school offering a globally oriented PGDM program with international certifications, business simulations, and a fully paid international study tour to Oxford/London in the UK.',
        highlights: [
            'AICTE, NBA, AIU, AACSB accredited',
            '1-week fully paid Oxford (UK) study tour',
            'Industry-linked programs and simulations',
            'Highest package up to INR 36.64 LPA',
            '550+ prominent recruiting partners',
            'Entrepreneurship and digital certifications (NIIT, EDIC, AAFT)',
            '34+ years of educational excellence'
        ],
        feesRange: { min: 900000, max: 900000 },
        courses: COLLEGES_COURSES['ABS'],
        placements: COLLEGES_PLACEMENTS['ABS']
    },
    {
        id: 7,
        name: 'Bennett University, Greater Noida',
        location: 'Greater Noida, Uttar Pradesh',
        tagline: 'Times Group university with industry-led MBA programs',
        rating: 4.6,
        reviewCount: 950,
        imageUrl: '/images/Bennett.jpg',
        logoUrl: '/images/Bennett.jpg',
        established: 2016,
        type: 'Private',
        accreditation: ['UGC'],
        description: 'Established by The Times Group, Bennett University offers globally benchmarked, research-driven, and industry-aligned education across multiple schools with strong corporate engagement and experiential learning.',
        highlights: [
            'Times Group legacy and global corporate connect',
            'UGC approved; 68-acre tech-enabled campus',
            'MBA highest package: INR 33 LPA',
            'Paid internships and strong placement cell',
            'Innovation Centre and start-up support',
            'Comprehensive grooming via Bennett Finishing School'
        ],
        feesRange: { min: 650000, max: 680000 },
        courses: COLLEGES_COURSES['BENNETT'],
        placements: COLLEGES_PLACEMENTS['BENNETT']
    },
    {
        id: 8,
        name: 'Narayana Business School (NBS), Ahmedabad',
        location: 'Ahmedabad, Gujarat',
        tagline: 'Known for PGDM programs and strong 100% placements',
        rating: 4.5,
        reviewCount: 680,
        imageUrl: '/logos/NBS.jpg',
        logoUrl: '/logos/NBS.jpg',
        established: 2003,
        type: 'Private',
        accreditation: ['IIRF Top 25 (2025)'],
        description: 'NBS is an independent B-school known for its AI-powered curriculum, strong corporate linkages, global immersion, and consistent 100% placements with top recruiters across India and globally.',
        highlights: [
            'Top-ranked private B-School in Gujarat',
            'AI-powered curriculum and personalized mentor support',
            '671+ recruiters; consistent 100% placements',
            'International immersion and paid internships',
            'Entrepreneurial funding and incubation support',
            'Scholarships for meritorious students'
        ],
        feesRange: { min: 795000, max: 1085000 },
        courses: COLLEGES_COURSES['NBS'],
        placements: COLLEGES_PLACEMENTS['NBS']
    }
];

export const EXAMS_DATA: Exam[] = [
    { id: 1, name: 'JEE Main', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/35/JEE_Main_Logo.svg/1200px-JEE_Main_Logo.svg.png', conductingBody: 'National Testing Agency (NTA)', stream: 'Engineering', date: 'April & May 2024',
      description: 'The Joint Entrance Examination (Main) is a national-level entrance exam for admission to undergraduate engineering programs.',
      eligibility: '10+2 with Physics, Chemistry, and Mathematics.',
      syllabus: [
        { subject: 'Physics', topics: ['Kinematics', 'Laws of Motion', 'Thermodynamics', 'Optics', 'Electromagnetism'] },
        { subject: 'Chemistry', topics: ['Atomic Structure', 'Chemical Bonding', 'Organic Chemistry', 'Inorganic Chemistry'] },
        { subject: 'Mathematics', topics: ['Calculus', 'Algebra', 'Trigonometry', 'Coordinate Geometry'] }
      ],
      importantDates: [{event: 'Registration', date: 'Feb 2024'}, {event: 'Exam Date', date: 'Apr 2024'}]
    },
    { id: 2, name: 'NEET', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/NEET_UG_Logo.svg/1200px-NEET_UG_Logo.svg.png', conductingBody: 'National Testing Agency (NTA)', stream: 'Medical', date: 'May 2024',
      description: 'The National Eligibility cum Entrance Test (Undergraduate) is for students who wish to study undergraduate medical courses (MBBS) and dental courses (BDS).',
      eligibility: '10+2 with Physics, Chemistry, and Biology.',
      syllabus: [
        { subject: 'Physics', topics: ['Mechanics', 'Thermodynamics', 'Modern Physics'] },
        { subject: 'Chemistry', topics: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'] },
        { subject: 'Biology', topics: ['Diversity in Living World', 'Human Physiology', 'Genetics and Evolution'] }
      ],
      importantDates: [{event: 'Registration', date: 'Mar 2024'}, {event: 'Exam Date', date: 'May 2024'}]
    },
    { id: 3, name: 'CAT', logoUrl: 'https://iimcat.ac.in/uploads/CAT_2023_logo.png', conductingBody: 'Indian Institutes of Management (IIMs)', stream: 'Management', date: 'November 2024',
      description: 'The Common Admission Test is a computer-based test for admission to postgraduate management programs.',
      eligibility: 'Bachelor\'s Degree with at least 50% marks.',
      syllabus: [
        { subject: 'Verbal Ability & Reading Comprehension', topics: ['Para Jumbles', 'Reading Comprehension Passages', 'Sentence Correction'] },
        { subject: 'Data Interpretation & Logical Reasoning', topics: ['Tables', 'Graphs', 'Caselets', 'Blood Relations'] },
        { subject: 'Quantitative Aptitude', topics: ['Arithmetic', 'Algebra', 'Geometry', 'Modern Math'] }
      ],
      importantDates: [{event: 'Registration', date: 'Aug 2024'}, {event: 'Exam Date', date: 'Nov 2024'}]
    },
    { id: 4, name: 'UPSC CSE', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4d/UPSC_Logo.svg/1200px-UPSC_Logo.svg.png', conductingBody: 'Union Public Service Commission', stream: 'Civil Services', date: 'May 2024 (Prelims)',
      description: 'The Civil Services Examination is a nationwide competitive examination in India for recruitment to various Civil Services of the Government of India.',
      eligibility: 'Bachelor\'s Degree from any recognized university.',
      syllabus: [
        { subject: 'General Studies Paper I', topics: ['History of India', 'Indian and World Geography', 'Indian Polity and Governance'] },
        { subject: 'General Studies Paper II (CSAT)', topics: ['Comprehension', 'Logical Reasoning', 'Basic Numeracy'] }
      ],
      importantDates: [{event: 'Prelims Exam', date: 'May 2024'}, {event: 'Mains Exam', date: 'Sep 2024'}]
    },
];

export const BLOG_POSTS_DATA: BlogPost[] = [
    { id: 1, title: 'Top 10 Engineering Colleges in India 2024', author: 'Dr. Ramesh Kumar', date: 'May 1, 2024', 
      category: 'Rankings',
      imageUrl: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      excerpt: 'Explore the latest NIRF rankings and our expert analysis to find the best engineering institution for your future.',
      content: '<h2>Introduction</h2><p>Choosing an engineering college is a pivotal decision... Here are the top 10 based on the latest data.</p><h3>1. IIT Madras</h3><p>Indian Institute of Technology Madras is a public technical university located in Chennai, Tamil Nadu, India. As one of the Indian Institutes of Technology, it is recognized as an Institute of National Importance and has been consistently ranked as the country\'s top engineering institute.</p><h3>2. IIT Delhi</h3><p>Indian Institute of Technology Delhi is a public technical university located in Hauz Khas, South Delhi, Delhi, India. It is one of the oldest Indian Institutes of Technology in India.</p>'
    },
    { id: 2, title: 'How to Prepare for the CAT Exam in 6 Months', author: 'Priya Sharma, IIM-A Alumna', date: 'April 25, 2024', 
      category: 'Exam Prep',
      imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      excerpt: 'A comprehensive guide with a month-by-month study plan to help you ace the CAT and get into your dream B-School.',
      content: '<h2>6-Month Strategy</h2><p>The key to cracking CAT is consistent effort and smart work...</p><h4>Month 1-2: Build Fundamentals</h4><p>Focus on understanding the basic concepts of all three sections. For Quantitative Aptitude, cover topics like Arithmetic, Algebra, and Geometry. For Verbal Ability, start reading newspapers and novels daily to improve your reading speed and comprehension.</p>'
    },
    { id: 3, title: 'The Future of AI in Medicine and Healthcare', author: 'Team StudyCups', date: 'April 18, 2024', 
      category: 'Career Advice',
      imageUrl: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      excerpt: 'Discover how artificial intelligence is revolutionizing diagnostics, treatment protocols, and medical research.',
      content: '<h2>AI in Diagnostics</h2><p>AI algorithms are now capable of analyzing medical images like X-rays and MRIs with higher accuracy than humans, helping in early detection of diseases like cancer and diabetic retinopathy.</p><h2>Personalized Treatment</h2><p>AI can analyze a patient\'s genetic makeup, lifestyle, and medical history to recommend personalized treatment plans, leading to better outcomes.</p>'
    },
];

export const TESTIMONIALS_DATA: Testimonial[] = [
    { id: 1, name: 'Anjali Singh', college: 'IIT Delhi', 
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      quote: 'StudyCups was instrumental in my college search. The AI assistant helped me shortlist colleges that perfectly matched my profile. The detailed information is unmatched!'
    },
    { id: 2, name: 'Rohan Mehta', college: 'IIM Bangalore', 
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      quote: 'The CAT preparation articles and exam date reminders were a lifesaver. I could easily compare B-schools and make an informed decision. Highly recommended!'
    },
    { id: 3, name: 'Fatima Khan', college: 'AIIMS Delhi', 
      avatarUrl: 'https://images.unsplash.com/photo-1521146764736-56c929d59c83?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      quote: 'The detailed syllabus breakdown for NEET on StudyCups was incredibly helpful. It simplified my study plan and helped me focus on important topics.'
    },
];

// Dynamically set future dates for events
const getFutureDate = (days: number, hours = 0, minutes = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(date.getHours() + hours);
    date.setMinutes(date.getMinutes() + minutes);
    return date.toISOString();
};


export const EVENTS_DATA: Event[] = [
    { 
        id: 1, 
        title: 'AI in Education: The Next Frontier', 
        category: 'Webinar', 
        date: getFutureDate(12, 3), 
        description: 'Join industry experts to discuss how Artificial Intelligence is revolutionizing the education sector, from personalized learning to automated grading.',
        imageUrl: 'https://images.unsplash.com/photo-1674027444485-a940e4d12f6b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        link: '#'
    },
    { 
        id: 2, 
        title: 'National Engineering College Fair 2024', 
        category: 'College Fair', 
        date: getFutureDate(25, 6),
        description: 'Meet representatives from India\'s top 50 engineering colleges. Get your questions answered and explore your options all in one place.',
        imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        link: '#'
    },
    { 
        id: 3, 
        title: 'Advanced Application Writing Workshop', 
        category: 'Workshop', 
        date: getFutureDate(38, 2),
        description: 'Learn the art of crafting compelling college applications and personal statements that stand out to admission committees.',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        link: '#'
    },
     { 
        id: 4, 
        title: 'JEE Advanced Application Deadline', 
        category: 'Deadline', 
        date: getFutureDate(50, 23, 59),
        description: 'Final call for all aspiring engineers! Ensure your application for the JEE Advanced exam is submitted before the portal closes.',
        imageUrl: 'https://images.unsplash.com/photo-1599658880436-c61792e70672?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        link: '#'
    },
];