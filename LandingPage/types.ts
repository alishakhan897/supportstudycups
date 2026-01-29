
export interface College {
  id: string;
  name: string;
  location: string;
  logo: string;
  recruiters: string[];
  highestPackage: string;
  tags: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  image: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Partner {
  name: string;
  logo: string;
}
