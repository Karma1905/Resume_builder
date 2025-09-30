
import { ResumeData } from "@/types/resume";

interface Props {
  data: ResumeData;
}

export default function ResumePreview({ data }: Props) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-h-[80vh] overflow-auto">
      <header className="mb-4 border-b pb-3">
        <h1 className="text-2xl font-bold">{data.fullName || "Full Name"}</h1>
        <div className="text-sm text-muted-foreground">
          {data.email && <span>{data.email} • </span>}
          {data.phone && <span>{data.phone} • </span>}
          {data.location && <span>{data.location}</span>}
        </div>
      </header>

      {data.summary && (
        <section className="mb-4">
          <h3 className="text-lg font-semibold mb-1">Summary</h3>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.summary}</p>
        </section>
      )}

      <section className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Experience</h3>
        {data.experiences.length === 0 && <p className="text-sm text-muted-foreground">No experience added</p>}
        {data.experiences.map((exp, i) => (
          <div key={exp.id} className="mb-3">
            <div className="flex justify-between items-baseline">
              <h4 className="font-medium">{exp.title || "Job Title"}</h4>
              <span className="text-sm text-muted-foreground">{exp.startDate || ""} {exp.endDate ? ` - ${exp.endDate}` : ""}</span>
            </div>
            <div className="text-sm text-muted-foreground">{exp.company || "Company"}</div>
            {exp.description && <p className="text-sm mt-1 whitespace-pre-wrap">{exp.description}</p>}
          </div>
        ))}
      </section>

      <section className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Education</h3>
        {data.education.length === 0 && <p className="text-sm text-muted-foreground">No education added</p>}
        {data.education.map((edu) => (
          <div key={edu.id} className="mb-3">
            <div className="flex justify-between items-baseline">
              <h4 className="font-medium">{edu.degree || "Degree"}</h4>
              <span className="text-sm text-muted-foreground">{edu.year || ""}</span>
            </div>
            <div className="text-sm text-muted-foreground">{edu.school || "School"}</div>
          </div>
        ))}
      </section>

      {data.skills && (
        <section>
          <h3 className="text-lg font-semibold mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.split(",").map((s) => s.trim()).filter(Boolean).map((skill, idx) => (
              <span key={idx} className="text-xs px-2 py-1 bg-gray-100 rounded">{skill}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
