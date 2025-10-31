import { ResumeData } from "@/types/resume";
import { Mail, Phone, MapPin, Linkedin, Github, Laptop } from "lucide-react";

export function ExecutiveTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white p-8 font-serif shadow-lg overflow-auto h-full">
      {/* --- HEADER --- */}
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900">{data.fullName}</h1>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-3 text-sm text-gray-600">
          <div className="grid grid-cols-[auto_1fr] gap-x-2 items-start justify-center">
            <Mail className="w-4 h-4 mr-2 flex-shrink-0 mt-1" />
            <span className="break-words text-left">{data.email}</span>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-x-2 items-start justify-center">
            <Phone className="w-4 h-4 mr-2 flex-shrink-0 mt-1" />
            <span className="break-words">{data.phone}</span>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-x-2 items-start justify-center">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-1" />
            <span className="break-words text-left">{data.location}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-3 text-sm text-blue-700">
           {data.linkedin && (
            <div className="grid grid-cols-[auto_1fr] gap-x-2 items-start justify-center">
              <Linkedin className="w-4 h-4 mr-2 flex-shrink-0 mt-1" />
              <span className="break-words text-left">{data.linkedin}</span>
            </div>
           )}
           {data.github && (
            <div className="grid grid-cols-[auto_1fr] gap-x-2 items-start justify-center">
              <Github className="w-4 h-4 mr-2 flex-shrink-0 mt-1" />
              <span className="break-words text-left">{data.github}</span>
            </div>
           )}
        </div>
      </header>

      {/* --- SUMMARY --- */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-800 pb-1 mb-2">
          Professional Summary
        </h2>
        <p className="text-gray-700 leading-relaxed">{data.summary}</p>
      </section>

      {/* --- SKILLS --- */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-800 pb-1 mb-2">
          Core Competencies
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map(skill => (
            <span key={skill.id} className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full">
              {skill.name}
            </span>
          ))}
        </div>
      </section>

      {/* --- EXPERIENCE --- */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-800 pb-1 mb-2">
          Professional Experience
        </h2>
        {data.experiences.map(exp => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
              <span className="text-sm text-gray-600 font-sans">{exp.startDate} - {exp.endDate}</span>
            </div>
            <h4 className="text-md font-medium text-gray-700 mb-1">{exp.company}</h4>
            <ul className="list-disc list-inside pl-4">
              {exp.achievements.map(ach => (
                <li key={ach.id} className="text-gray-700 text-sm leading-relaxed">{ach.description}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* --- PROJECTS (NEW) --- */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-800 pb-1 mb-2">
          Projects
        </h2>
        {data.projects.map(proj => (
          <div key={proj.id} className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{proj.name}</h3>
            <p className="text-sm text-gray-600">{proj.techStack}</p>
            <ul className="list-disc list-inside pl-4">
              {proj.achievements.map(ach => (
                <li key={ach.id} className="text-gray-700 text-sm leading-relaxed">{ach.description}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* --- EDUCATION --- */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-800 pb-1 mb-2">
          Education
        </h2>
        {data.education.map(edu => (
          <div key={edu.id} className="mb-2">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
              <span className="text-sm text-gray-600 font-sans">{edu.endDate}</span>
            </div>
            <h4 className="text-md font-medium text-gray-700">{edu.school}</h4>
          </div>
        ))}
      </section>
    </div>
  );
}