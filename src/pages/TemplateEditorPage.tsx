import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import TemplateEditor from "@/components/TemplateEditor";
import { ResumeData } from "@/types/resume";

export default function TemplateEditorPage() {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();

  const templates: Record<string, ResumeData> = {
    professional: {
      fullName: "John Doe",
      email: "john.doe@example.com",
      phone: "+91 99999 99999",
      location: "Mumbai, India",
      summary: "Software engineer with 5 years of experience in building scalable applications.",
      skills: "JavaScript, React, Node.js, SQL",
      experiences: [
        {
          id: "exp1",
          title: "Software Engineer",
          company: "Tech Corp",
          startDate: "2020-01",
          endDate: "2023-06",
          description: "Developed scalable web applications and APIs."
        }
      ],
      education: [
        { id: "edu1", degree: "B.Tech Computer Science", school: "IIT Delhi", year: "2018" }
      ]
    },
    creative: {
      fullName: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+91 88888 77777",
      location: "Bangalore, India",
      summary: "Creative UX designer with passion for crafting intuitive digital experiences.",
      skills: "Figma, Photoshop, Illustrator, User Research",
      experiences: [
        {
          id: "exp1",
          title: "UX Designer",
          company: "Design Studio",
          startDate: "2019-03",
          endDate: "Present",
          description: "Created wireframes, prototypes, and conducted user testing."
        }
      ],
      education: [
        { id: "edu1", degree: "B.Des in Interaction Design", school: "NID Ahmedabad", year: "2017" }
      ]
    },
    executive: {
      fullName: "Michael Scott",
      email: "michael.scott@example.com",
      phone: "+91 77777 66666",
      location: "Delhi, India",
      summary: "Business leader with 10+ years in executive roles driving company growth.",
      skills: "Leadership, Strategy, Operations, Negotiation",
      experiences: [
        {
          id: "exp1",
          title: "CEO",
          company: "Dunder Mifflin",
          startDate: "2015-01",
          endDate: "Present",
          description: "Led company operations, improved revenue by 30%."
        }
      ],
      education: [
        { id: "edu1", degree: "MBA", school: "IIM Ahmedabad", year: "2010" }
      ]
    }
  };

  let initialTemplate: ResumeData | undefined;

  // 🧠 Handle AI imported resume
  if (templateId === "ai-import") {
    const aiData = localStorage.getItem("ai_enhanced_resume_data");
    if (aiData) {
      try {
        initialTemplate = JSON.parse(aiData);
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
          ⚠️ No resume data found.
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
      />
    </div>
  );
}
