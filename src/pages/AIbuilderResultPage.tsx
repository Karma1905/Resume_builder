// src/pages/AIBuilderResultPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResumeData } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileDown, FileText } from "lucide-react";
import { exportToPdf, exportToTxt } from "@/utils/resumeExport";

export default function AIBuilderResultPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<ResumeData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("ai_enhanced_resume_data");
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      navigate("/ai-builder");
    }
  }, [navigate]);

  if (!data) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div className="flex gap-2">
          <Button onClick={() => exportToTxt(data)}>
            <FileText className="w-4 h-4 mr-2" /> Download TXT
          </Button>
          <Button onClick={() => exportToPdf(data)}>
            <FileDown className="w-4 h-4 mr-2" /> Download PDF
          </Button>
        </div>
      </div>

      <div className="border p-6 rounded-lg bg-gray-50 shadow space-y-4">
        <h1 className="text-3xl font-bold">{data.fullName}</h1>
        <p className="text-sm text-gray-600">
          {data.email} | {data.phone} | {data.location}
        </p>
        <hr />

        <section>
          <h2 className="font-semibold text-lg">Summary</h2>
          <p>{data.summary}</p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mt-2">Skills</h2>
          <p>{data.skills}</p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mt-2">Experience</h2>
          {data.experiences.map((exp) => (
            <div key={exp.id} className="mb-2">
              <strong>{exp.title}</strong> - {exp.company} ({exp.startDate} - {exp.endDate})
              <p>{exp.description}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="font-semibold text-lg mt-2">Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <strong>{edu.degree}</strong>, {edu.school} ({edu.year})
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
