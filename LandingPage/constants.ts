
import { College, Testimonial, FAQItem, Partner } from './types';

export const COLLEGES: College[] = [
  {
    id: '1',
    name: 'DBS Global University (DGU)',
    location: 'Dehradun Uttrakhand, India',
    logo: 'https://images.shiksha.com/mediadata/images/1711546309phpoIoOrR.jpeg',
    recruiters: ['McKinsey', 'EY', 'Deloitte'],
    highestPackage: '₹2.7LPA',
    tags: ['MBA/PGDM', 'AICTE Approved']
  },
  {
    id: '2',
    name: 'Bennett University',
    location: 'Greater Noida, India',
    logo: 'https://media.licdn.com/dms/image/v2/C4E0BAQHHoSUe_f2rJg/company-logo_200_200/company-logo_200_200/0/1630638999928/bennett_university_logo?e=2147483647&v=beta&t=sBSZxQlWF8NlJiLa-M2c8oUvyI8pvLk96bRNCOBAtpU',
    recruiters: ['Amazon', 'Google', 'Microsoft'],
    highestPackage: '₹13.5 LPA',
    tags: ['MBA/PGDM', 'Global Accredited']
  },
  {
    id: '3',
    name: 'Pimpri Chinchwad University (PCU)',
    location: 'Pune, India',
    logo: 'https://pcu.edu.in/assets/images/cropped-PCU-logo-270x270.webp',
    recruiters: ['Amazon', 'Google', 'BCG'],
    highestPackage: '₹2.6 LPA',
    tags: ['MBA/PGDM', 'DU Affiliate']
  },
  {
    id: '4',
    name: 'Karnavati University',
    location: 'Gujarat, India',
    logo: 'https://mir-s3-cdn-cf.behance.net/projects/404/98abc7123398093.Y3JvcCw4MDgsNjMyLDAsMA.png',
    recruiters: ['TCS', 'Deloitte', 'HDFC'],
    highestPackage: '₹4.6 LPA',
    tags: ['MBA/PGDM']
  },
  {
    id: '5',
    name: 'Brookstone Institute of Global Studies (BIGS)',
    location: 'Dubai',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQun_T4LSzT9irYdrIwwZaqwOt6RXvSb-wcHw&s',
    recruiters: ['Reliance', 'Shell', 'GAIL'],
    highestPackage: '₹17 LPA',
    tags: ['MBA/PGDM', 'AMBA Accredited']
  },
  {
    id: '6',
    name: 'Mangalayatan University',
    location: 'Aligarh Uttar Pradesh, India',
    logo: 'https://www.mangalayatan.in/images/logo-large2.jpg',
    recruiters: ['KPMG', 'ICICI', 'Infosys'],
    highestPackage: '₹3 LPA',
    tags: ['MBA/PGDM', 'AIU Approved']
  },
  {
    id: '7',
    name: 'Universal Business School',
    location: 'Mumbai, India',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQunjjBOIT-2RUHCqNzh_WKtVOGHUDbqfVsdw&s',
    recruiters: ['Aditya Birla', 'Maruti', 'Wipro'],
    highestPackage: '₹28 LPA',
    tags: ['MBA/PGDM', 'AACSB Member']
  },
  {
    id: '8',
    name: 'IMT Ghaziabad',
    location: 'Ghaziabad, UP',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/IMT_Ghaziabad_Logo.png/220px-IMT_Ghaziabad_Logo.png',
    recruiters: ['Goldman Sachs', 'JPMC', 'Loreal'],
    highestPackage: '₹45 LPA',
    tags: ['MBA/PGDM', 'AACSB Accredited']
  }
];

export const TESTIMONIALS: Testimonial[] = [
  { id: '1', name: 'Sneha Nair', company: 'J.P. Morgan', image: '../images/Untitled design (14).png' },
  { id: '2', name: 'Rohan Gupta', company: 'ICICI Bank', image: '../images/Untitled design (13).png' },
  { id: '3', name: 'Karan Singh', company: 'Amazon', image: '../images/Untitled design (12).png' },
  { id: '4', name: 'Aditya Malhotra', company: 'Cognizant', image: '../images/Untitled design (11).png' },
  { id: '5', name: 'Priya Sharma', company: 'Google', image: '../images/Untitled design (15).png' },
  { id: '6', name: 'Vikram Mehta', company: 'Deloitte', image: '../images/image 10.png' },
 
];

export const PARTNERS: Partner[] = [
  { name: 'Accenture', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture.svg/2560px-Accenture.svg.png' },
  { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png' },
  { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/2560px-Microsoft_logo_%282012%29.svg.png' },
  { name: 'Bank of America', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRffuOlAXiPir-bBbXuEt0fmA2P0RoJ_xKYYg&s' }
];

export const FAQS: FAQItem[] = [
  {
    question: "What is the average placement package for MBA graduates?",
    answer: "The average placement package for top-tier colleges in Delhi-NCR ranges between ₹15 LPA to ₹25 LPA, with highest packages going up to ₹80 LPA."
  },
  {
    question: "What are the eligibility criteria for MBA/PGDM?",
    answer: "Generally, a minimum of 50% marks in graduation and a valid entrance score (CAT/MAT/XAT/CMAT) are required."
  },
  {
    question: "Is work experience mandatory for admission?",
    answer: "While many colleges prefer candidates with work experience, freshers are equally eligible for almost all programs."
  },
  {
    question: "Are scholarships available?",
    answer: "Yes, merit-based and need-based scholarships are available in most institutes, covering up to 30-50% of the tuition fee."
  }
];
