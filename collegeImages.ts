export type CollegeImageMap = Record<string, string[]>;

// Helper to create the same slug used by DetailPage for data files
export const toCollegeSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Map of college slug -> image paths served from /public/images
// Add entries here as you drop files into public/images
export const COLLEGE_IMAGE_MAP: CollegeImageMap = {
  // Known colleges with corresponding images in /public/images
  'bennett-university-greater-noida': ['/images/Bennett.jpg'],
  'asian-business-school-noida': ['/images/ABS.jpg'],
  'all-india-institute-of-medical-sciences-delhi': ['/images/Aiims delhi.jpg'],
  'indian-institute-of-management-bangalore': ['/images/iim benglore.jpg'],
  'national-law-school-of-india-university': ['/images/nationa law school.jpg'],
  // Additional available images (will be used if matching names exist)
  'bm-munjal-university': ['/images/bm-munjal.png'],
  'doon-business-school': ['/images/Doon.jpg'],
  'iilm-university': ['/images/iilm.jpg'],
  'dy-patil-university': ['/images/DY-PATIL.jpg'],
  'indian-institute-of-technology-delhi': ['/images/IIt delhi image.jpg'],
  'ibmr-business-school': ['/images/IBMR.jpg'],
};

export const getCollegeImages = (nameOrSlug: string): string[] => {
  const key = nameOrSlug.includes('-') ? nameOrSlug : toCollegeSlug(nameOrSlug);
  return COLLEGE_IMAGE_MAP[key] || [];
};