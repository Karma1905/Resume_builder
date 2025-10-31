import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResumeData } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileDown, FileText } from "lucide-react";
import { exportToTxt } from "@/utils/resumeExport";
import html2pdf from 'html2pdf.js'; // --- 1. IMPORT html2pdf ---

export default function AIBuilderResultPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<ResumeData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("ai_enhanced_resume_data");
    if (stored) {
      try {
        const parsedData = JSON.parse(stored);
        // Ensure all new arrays are present to avoid crashes
        setData({
          ...parsedData,
          skills: parsedData.skills || [],
          experiences: parsedData.experiences || [],
          education: parsedData.education || [],
          projects: parsedData.projects || [],
          certifications: parsedData.certifications || [],
          languages: parsedData.languages || [],
        });
      } catch (e) {
        console.error("Failed to parse resume data", e);
        navigate("/ai-builder");
      }
    } else {
      navigate("/ai-builder");
    }
  }, [navigate]);

  // --- 2. ADD THE PDF EXPORT FUNCTION ---
  const handleExportPdf = () => {
    if (!data) return;
    const element = document.getElementById('ai-result-content');
    if (element) {
      const options = {
        margin:       0.5,
        filename:     `${data.fullName}_Resume.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().from(element).set(options).save();
    }
  };

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
          {/* --- 3. UPDATE ONCLICK HANDLER --- */}
          <Button onClick={handleExportPdf}>
            <FileDown className="w-4 h-4 mr-2" /> Download PDF
          </Button>
        </div>
      </div>

      {/* --- 4. ADD ID TO THIS WRAPPER --- */}
      <div id="ai-result-content" className="border p-8 rounded-lg bg-white shadow space-y-6">
        {/* --- PERSONAL INFO (UPDATED) --- */}
        <h1 className="text-3xl font-bold">{data.fullName}</h1>
        <div className="text-sm text-gray-600 space-x-2">
          <span>{data.email}</span>
          <span>|</span>
          <span>{data.phone}</span>
          <span>|</span>
          <span>{data.location}</span>
        </div>
        <div className="text-sm text-blue-600 space-x-2">
          {data.linkedin && <span>{data.linkedin}</span>}
          {data.github && <span>{data.github}</span>}
          {data.portfolio && <span>{data.portfolio}</span>}
        </div>
        <hr />

        {/* --- SUMMARY (UPDATED) --- */}
        <section>
          <h2 className="font-semibold text-lg">Summary</h2>
          <p>{data.summary}</p>
        </section>

        {/* --- SKILLS (UPDATED) --- */}
        {data.skills.length > 0 && (
          <section>
            <h2 className="font-semibold text-lg mt-2">Skills</h2>
            <div className="flex flex-wrap gap-2 mt-1">
              {data.skills.map(skill => (
                <span key={skill.id} className="bg-gray-200 text-sm px-2 py-0.5 rounded">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* --- EXPERIENCE (UPDATED) --- */}
        {data.experiences.length > 0 && (
          <section>
            <h2 className="font-semibold text-lg mt-2">Experience</h2>
            {data.experiences.map((exp) => (
              <div key={exp.id} className="mb-4">
                <h3 className="font-bold">{exp.title} - {exp.company}</h3>
                <p className="text-sm text-gray-600">{exp.startDate} - {exp.endDate} {exp.location && `| ${exp.location}`}</p>
                <ul className="list-disc list-inside pl-4 mt-1">
                  {exp.achievements.map(ach => (
                    <li key={ach.id} className="text-sm">{ach.description}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* --- EDUCATION (UPDATED) --- */}
        {data.education.length > 0 && (
          <section>
            <h2 className="font-semibold text-lg mt-2">Education</h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <h3 className="font-bold">{edu.degree}</h3>
                <p className="text-sm">{edu.school} {edu.location && `| ${edu.location}`}</p>
                <p className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </section>
        )}

        {/* --- PROJECTS (NEW) --- */}
        {data.projects.length > 0 && (
          <section>
            <h2 className="font-semibold text-lg mt-2">Projects</h2>
            {data.projects.map(proj => (
              <div key={proj.id} className="mb-4">
                <h3 className="font-bold">{proj.name}</h3>
                <p className="text-sm text-gray-600">{proj.techStack}</p>
                <ul className="list-disc list-inside pl-4 mt-1">
                  {proj.achievements.map(ach => (
                    <li key={ach.id} className="text-sm">{ach.description}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}