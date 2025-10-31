import { ResumeData } from "@/types/resume";

export function ProfessionalTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="border p-6 rounded-lg bg-white shadow-md space-y-4 overflow-auto h-full">
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
      <hr className="my-2" />

      {/* --- SUMMARY --- */}
      <section>
        <h2 className="font-semibold text-lg">Summary</h2>
        <p>{data.summary}</p>
      </section>

      {/* --- SKILLS (UPDATED) --- */}
      <section>
        <h2 className="font-semibold text-lg mt-2">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map(skill => (
            <span key={skill.id} className="bg-gray-200 text-sm px-2 py-0.5 rounded">
              {skill.name}
            </span>
          ))}
        </div>
      </section>

      {/* --- EXPERIENCE (UPDATED) --- */}
      <section>
        <h2 className="font-semibold text-lg mt-2">Experience</h2>
        {data.experiences.map(exp => (
          <div key={exp.id} className="mb-2">
            <h3 className="font-bold">{exp.title} - {exp.company}</h3>
            <p className="text-sm text-gray-600">{exp.startDate} - {exp.endDate} {exp.location && `| ${exp.location}`}</p>
            <ul className="list-disc list-inside pl-4">
              {exp.achievements.map(ach => (
                <li key={ach.id} className="text-sm">{ach.description}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* --- EDUCATION (UPDATED) --- */}
      <section>
        <h2 className="font-semibold text-lg mt-2">Education</h2>
        {data.education.map(edu => (
          <div key={edu.id} className="mb-2">
            <h3 className="font-bold">{edu.degree}</h3>
            <p className="text-sm">{edu.school} {edu.location && `| ${edu.location}`}</p>
            <p className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</p>
          </div>
        ))}
      </section>

      {/* --- PROJECTS (NEW) --- */}
      <section>
        <h2 className="font-semibold text-lg mt-2">Projects</h2>
        {data.projects.map(proj => (
          <div key={proj.id} className="mb-2">
            <h3 className="font-bold">{proj.name}</h3>
            <p className="text-sm text-gray-600">{proj.techStack}</p>
            <ul className="list-disc list-inside pl-4">
              {proj.achievements.map(ach => (
                <li key={ach.id} className="text-sm">{ach.description}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}