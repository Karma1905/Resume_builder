import { ResumeData } from "@/types/resume";
import { Mail, Phone, MapPin, Star, Briefcase, GraduationCap, Sparkles, Link, Github, Linkedin, Laptop } from "lucide-react";

export function CreativeTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="flex bg-white shadow-lg overflow-auto h-full">
      {/* --- LEFT SIDEBAR (DARK) --- */}
      <div className="w-1/3 bg-gray-800 text-white p-6 flex flex-col">
        <h1 className="text-4xl font-bold text-cyan-400 mb-2 break-words">{data.fullName}</h1>
        
        <div className="space-y-3 mt-6">
          <div className="grid grid-cols-[auto_1fr] gap-x-3 items-start">
            <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-1" />
            <span className="break-words">{data.email}</span>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-x-3 items-start">
            <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-1" />
            <span className="break-words">{data.phone}</span>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-x-3 items-start">
            <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-1" />
            <span className="break-words">{data.location}</span>
          </div>
          {data.linkedin && (
            <div className="grid grid-cols-[auto_1fr] gap-x-3 items-start">
              <Linkedin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-1" />
              <span className="break-words text-sm">{data.linkedin}</span>
            </div>
          )}
          {data.github && (
            <div className="grid grid-cols-[auto_1fr] gap-x-3 items-start">
              <Github className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-1" />
              <span className="break-words text-sm">{data.github}</span>
            </div>
          )}
          {data.portfolio && (
            <div className="grid grid-cols-[auto_1fr] gap-x-3 items-start">
              <Laptop className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-1" />
              <span className="break-words text-sm">{data.portfolio}</span>
            </div>
          )}
        </div>

        <hr className="my-6 border-gray-600" />

        {/* Skills Section */}
        <section>
          <h2 className="font-semibold text-xl text-cyan-400 mb-3 grid grid-cols-[auto_1fr] gap-x-2 items-start">
            <Star className="w-5 h-5 flex-shrink-0 mt-1" /> 
            <span>Skills</span>
          </h2>
          <div className="flex flex-col gap-2 items-start">
            {data.skills.map(skill => (
              <span key={skill.id} className="bg-gray-700 text-cyan-300 text-xs px-3 py-1 rounded-full">
                {skill.name}
              </span>
            ))}
          </div>
        </section>

        {/* Education Section (Moved to sidebar) */}
        <section className="mt-8">
          <h2 className="font-semibold text-xl text-cyan-400 mb-3 grid grid-cols-[auto_1fr] gap-x-2 items-start">
            <GraduationCap className="w-5 h-5 flex-shrink-0 mt-1" /> 
            <span>Education</span>
          </h2>
          {data.education.map(edu => (
            <div key={edu.id} className="mb-2">
              <strong className="text-gray-100 break-words">{edu.degree}</strong>
              <p className="text-sm text-gray-300 break-words">{edu.school} ({edu.startDate} - {edu.endDate})</p>
            </div>
          ))}
        </section>
      </div>

      {/* --- RIGHT CONTENT (LIGHT) --- */}
      <div className="w-2/3 p-8 overflow-auto">
        {/* Summary Section */}
        <section>
          <h2 className="font-bold text-2xl text-gray-800 mb-3 grid grid-cols-[auto_1fr] gap-x-2 items-start">
            <Sparkles className="w-5 h-5 text-gray-700 flex-shrink-0 mt-1" /> 
            <span>Professional Summary</span>
          </h2>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </section>

        <hr className="my-6" />

        {/* Experience Section */}
        <section>
          <h2 className="font-bold text-2xl text-gray-800 mb-4 grid grid-cols-[auto_1fr] gap-x-2 items-start">
            <Briefcase className="w-5 h-5 text-gray-700 flex-shrink-0 mt-1" /> 
            <span>Experience</span>
          </h2>
          {data.experiences.map(exp => (
            <div key={exp.id} className="mb-5">
              <div className="flex justify-between items-baseline">
                <h3 className="text-lg font-semibold text-gray-900 break-words">{exp.title}</h3>
                <span className="text-sm text-gray-600 flex-shrink-0 ml-2">{exp.startDate} - {exp.endDate}</span>
              </div>
              <h4 className="text-md font-medium text-cyan-600 mb-1 break-words">{exp.company}</h4>
              <ul className="list-disc list-inside pl-4">
                {exp.achievements.map(ach => (
                  <li key={ach.id} className="text-gray-700 text-sm">{ach.description}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
        
        {/* --- PROJECTS (NEW) --- */}
        <section>
          <h2 className="font-bold text-2xl text-gray-800 mb-4 grid grid-cols-[auto_1fr] gap-x-2 items-start">
            <Link className="w-5 h-5 text-gray-700 flex-shrink-0 mt-1" /> 
            <span>Projects</span>
          </h2>
          {data.projects.map(proj => (
            <div key={proj.id} className="mb-5">
              <h3 className="text-lg font-semibold text-gray-900 break-words">{proj.name}</h3>
              <p className="text-sm text-gray-600">{proj.techStack}</p>
              <ul className="list-disc list-inside pl-4">
                {proj.achievements.map(ach => (
                  <li key={ach.id} className="text-gray-700 text-sm">{ach.description}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}