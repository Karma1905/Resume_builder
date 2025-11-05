
export interface Achievement {
  id: string;
  description: string;
}


export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  achievements: Achievement[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location?: string;   // New field
  startDate: string; // Replaced 'year'
  endDate: string;   // Replaced 'year'
  gpa?: string;        // New optional field
  coursework?: string; // New optional field (as a simple text string)
}

// --- NEW INTERFACES ---

export interface Skill {
  id: string;
  name: string;
  category: string; // e.g., "Programming Language", "Framework", "Tool"
}

export interface Project {
  id: string;
  name: string;
  techStack: string;
  githubLink?: string;
  liveLink?: string;
  achievements: Achievement[];
}

export interface Certification {
  id: string;
  name: string;
  organization: string;
  date: string; // e.g., "June, 2024"
  url?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string; // e.g., "Native", "Fluent", "Conversational"
}

// --- MAIN DATA STRUCTURE ---

export interface ResumeData {
  // Personal Info (Expanded)
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;   // New optional field
  github?: string;     // New optional field
  portfolio?: string;  // New optional field
  
  summary: string; // We can rename this in the form to "Professional Summary"

  // Replaced 'skills: string' with a structured array
  skills: Skill[]; 
  
  experiences: Experience[];
  education: Education[];

  // New Sections
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
}