import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import TemplateEditor from "@/components/TemplateEditor";
import { ResumeData } from "@/types/resume";

export default function TemplateEditorPage() {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();

  // --- THIS OBJECT HAS BEEN COMPLETELY UPDATED TO MATCH THE NEW TYPES ---
  const templates: Record<string, ResumeData> = {
    professional: {
      fullName: "John Doe",
      email: "john.doe@example.com",
      phone: "+91 99999 99999",
      location: "Mumbai, India",
      linkedin: "linkedin.com/in/johndoe",
      github: "github.com/johndoe",
      portfolio: "johndoe.dev",
      summary: "Software engineer with 5 years of experience in building scalable applications.",
      
      // 'skills' is now an array of objects
      skills: [
        { id: 'skill1', name: 'JavaScript', category: 'Language' },
        { id: 'skill2', name: 'React', category: 'Framework/Library' },
        { id: 'skill3', name: 'Node.js', category: 'Framework/Library' },
        { id: 'skill4', name: 'SQL', category: 'Database' },
      ],
      
      experiences: [
        {
          id: "exp1",
          title: "Software Engineer",
          company: "Tech Corp",
          location: "Mumbai, India",
          startDate: "2020-01",
          endDate: "2023-06",
          // 'description' is now 'achievements'
          achievements: [
            { id: 'ach1', description: 'Developed scalable web applications and APIs.' },
            { id: 'ach2', description: 'Collaborated with cross-functional teams.' },
          ]
        }
      ],
      
      education: [
        { 
          id: "edu1", 
          degree: "B.Tech Computer Science", 
          school: "IIT Delhi",
          location: "Delhi, India",
          startDate: "2014-08",
          endDate: "2018-05", // 'year' replaced with start/end
        }
      ],

      // Add the new empty arrays so the editor doesn't crash
      projects: [],
      certifications: [],
      languages: [],
    },
    
    creative: {
      fullName: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+91 88888 77777",
      location: "Bangalore, India",
      linkedin: "linkedin.com/in/janesmith",
      github: "github.com/janesmith",
      portfolio: "janesmith.design",
      summary: "Creative UX designer with passion for crafting intuitive digital experiences.",
      
      skills: [
        { id: 'skill1', name: 'Figma', category: 'Tool' },
        { id: 'skill2', name: 'Photoshop', category: 'Tool' },
        { id: 'skill3', name: 'Illustrator', category: 'Tool' },
        { id: 'skill4', name: 'User Research', category: 'Soft Skill' },
      ],
      
      experiences: [
        {
          id: "exp1",
          title: "UX Designer",
          company: "Design Studio",
          location: "Bangalore, India",
          startDate: "2019-03",
          endDate: "Present",
          achievements: [
            { id: 'ach1', description: 'Created wireframes, prototypes, and conducted user testing.' }
          ]
        }
      ],
      
      education: [
        { 
          id: "edu1", 
          degree: "B.Des in Interaction Design", 
          school: "NID Ahmedabad", 
          location: "Ahmedabad, India",
          startDate: "2013-08",
          endDate: "2017-05",
        }
      ],
      
      projects: [],
      certifications: [],
      languages: [],
    },
    
    executive: {
      fullName: "Michael Scott",
      email: "michael.scott@example.com",
      phone: "+91 77777 66666",
      location: "Delhi, India",
      linkedin: "linkedin.com/in/michaelscott",
      summary: "Business leader with 10+ years in executive roles driving company growth.",
      
      skills: [
        { id: 'skill1', name: 'Leadership', category: 'Soft Skill' },
        { id: 'skill2', name: 'Strategy', category: 'Soft Skill' },
        { id: 'skill3', name: 'Operations', category: 'Soft Skill' },
        { id: 'skill4', name: 'Negotiation', category: 'Soft Skill' },
      ],
      
      experiences: [
        {
          id: "exp1",
          title: "CEO",
          company: "Dunder Mifflin",
          location: "Scranton, PA",
          startDate: "2015-01",
          endDate: "Present",
          achievements: [
            { id: 'ach1', description: 'Led company operations, improved revenue by 30%.' }
          ]
        }
      ],
      
      education: [
        { 
          id: "edu1", 
          degree: "MBA", 
          school: "IIM Ahmedabad", 
          location: "Ahmedabad, India",
          startDate: "2008-08",
          endDate: "2010-05",
        }
      ],

      projects: [],
      certifications: [],
      languages: [],
    }
  };
  
  // --- THE REST OF YOUR FILE REMAINS UNCHANGED ---

  let initialTemplate: ResumeData | undefined;

  // 🧠 Handle AI imported resume
  if (templateId === "ai-import") {
    const aiData = localStorage.getItem("ai_enhanced_resume_data");
    if (aiData) {
      try {
        const parsedData: Partial<ResumeData> = JSON.parse(aiData);
        // Ensure all arrays are present to prevent crashes
        initialTemplate = {
          ...templates.professional, // Start with professional as a base
          ...parsedData, // Overlay the AI data
          skills: parsedData.skills || [],
          experiences: parsedData.experiences || [],
          education: parsedData.education || [],
          projects: parsedData.projects || [],
          certifications: parsedData.certifications || [],
          languages: parsedData.languages || [],
        };
      } catch (err) {
        console.error("Failed to parse AI resume data", err);
      }
    }
  } else if (templateId) {
    initialTemplate = templates[templateId];
  }

  const [resumeData, setResumeData] = useState<ResumeData | undefined>(
    initialTemplate ? { ...initialTemplate } : undefined
  );

  if (!initialTemplate) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 font-semibold mb-4">
          ⚠️ No resume data found or data is in the wrong format.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-primary text-white rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <TemplateEditor
        resumeData={resumeData!}
        setResumeData={setResumeData}
        onBack={() => navigate(-1)}
        templateId={templateId} 
      />
    </div>
  );
}