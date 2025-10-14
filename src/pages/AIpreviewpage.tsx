// src/pages/AIPreviewPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResumeData } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { FileDown, FileText, ArrowLeft } from "lucide-react";
import { exportToPdf, exportToTxt } from "@/utils/resumeExport";

export default function AIPreviewPage() {
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("ai_enhanced_resume_data");
    if (data) {
      setResumeData(JSON.parse(data));
    } else {
      navigate("/"); // if no data, redirect home
    }
  }, [navigate]);

  if (!resumeData) return null;

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div className="flex gap-2">
          <Button onClick={() => exportToTxt(resumeData)}>
            <FileText className="w-4 h-4 mr-2" /> Download TXT
          </Button>
          <Button onClick={() => exportToPdf(resumeData)}>
            <FileDown className="w-4 h-4 mr-2" /> Download PDF
          </Button>
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-gray-50 shadow space-y-4">
        <h1 className="text-3xl font-bold">{resumeData.fullName}</h1>
        <p className="text-sm text-gray-600">
          {resumeData.email} | {resumeData.phone} | {resumeData.location}
        </p>
        <hr />

        <section>
          <h2 className="font-semibold text-lg">Summary</h2>
          <p>{resumeData.summary}</p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mt-2">Skills</h2>
          <p>{resumeData.skills}</p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mt-2">Experience</h2>
          {resumeData.experiences.map((exp) => (
            <div key={exp.id} className="mb-2">
              <strong>{exp.title}</strong> - {exp.company} ({exp.startDate} -{" "}
              {exp.endDate})
              <p>{exp.description}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="font-semibold text-lg mt-2">Education</h2>
          {resumeData.education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <strong>{edu.degree}</strong>, {edu.school} ({edu.year})
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
