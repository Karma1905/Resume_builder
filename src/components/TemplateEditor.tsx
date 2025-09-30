import { ResumeData, Experience, Education } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileDown, FileText, Plus, Trash } from "lucide-react";
import { exportToTxt, exportToPdf } from "@/utils/resumeExport";

export interface Props {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  onBack: () => void;
}

export default function TemplateEditor({ resumeData, setResumeData, onBack }: Props) {
  const handleChange = (field: keyof ResumeData, value: string) => {
    setResumeData({ ...resumeData, [field]: value });
  };

  const handleExperienceChange = (id: string, field: keyof Experience, value: string) => {
    const updated = resumeData.experiences.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    setResumeData({ ...resumeData, experiences: updated });
  };

  const handleEducationChange = (id: string, field: keyof Education, value: string) => {
    const updated = resumeData.education.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    setResumeData({ ...resumeData, education: updated });
  };

  const addExperience = () => {
    const newExp: Experience = { id: `exp${Date.now()}`, title: "", company: "", startDate: "", endDate: "", description: "" };
    setResumeData({ ...resumeData, experiences: [...resumeData.experiences, newExp] });
  };

  const removeExperience = (id: string) => {
    setResumeData({ ...resumeData, experiences: resumeData.experiences.filter(exp => exp.id !== id) });
  };

  const addEducation = () => {
    const newEdu: Education = { id: `edu${Date.now()}`, degree: "", school: "", year: "" };
    setResumeData({ ...resumeData, education: [...resumeData.education, newEdu] });
  };

  const removeEducation = (id: string) => {
    setResumeData({ ...resumeData, education: resumeData.education.filter(edu => edu.id !== id) });
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 h-[calc(100vh-2rem)]">
      {/* Left: Editor */}
      <div className="space-y-6 overflow-auto p-4 bg-gray-50 rounded-lg shadow">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 mb-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        {/* Personal Info */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h2 className="font-semibold text-lg">Personal Info</h2>
          <Input value={resumeData.fullName} onChange={(e) => handleChange("fullName", e.target.value)} placeholder="Full Name" />
          <Input value={resumeData.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="Email" />
          <Input value={resumeData.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="Phone" />
          <Input value={resumeData.location} onChange={(e) => handleChange("location", e.target.value)} placeholder="Location" />
        </div>

        {/* Summary */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h2 className="font-semibold text-lg">Summary</h2>
          <Textarea value={resumeData.summary} onChange={(e) => handleChange("summary", e.target.value)} placeholder="Summary" rows={4} />
        </div>

        {/* Skills */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h2 className="font-semibold text-lg">Skills</h2>
          <Textarea value={resumeData.skills} onChange={(e) => handleChange("skills", e.target.value)} placeholder="Skills (comma-separated)" rows={3} />
        </div>

        {/* Experience */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h2 className="font-semibold text-lg flex justify-between items-center">
            Experience
            <Button size="sm" onClick={addExperience} className="flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </h2>
          {resumeData.experiences.map(exp => (
            <div key={exp.id} className="space-y-2 border p-2 rounded relative">
              <Button variant="ghost" size="sm" onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 p-1">
                <Trash className="w-4 h-4" />
              </Button>
              <Input value={exp.title} onChange={(e) => handleExperienceChange(exp.id, "title", e.target.value)} placeholder="Title" />
              <Input value={exp.company} onChange={(e) => handleExperienceChange(exp.id, "company", e.target.value)} placeholder="Company" />
              <div className="flex gap-2">
                <Input value={exp.startDate} onChange={(e) => handleExperienceChange(exp.id, "startDate", e.target.value)} placeholder="Start Date" type="month" />
                <Input value={exp.endDate} onChange={(e) => handleExperienceChange(exp.id, "endDate", e.target.value)} placeholder="End Date" type="month" />
              </div>
              <Textarea value={exp.description} onChange={(e) => handleExperienceChange(exp.id, "description", e.target.value)} placeholder="Description" rows={2} />
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h2 className="font-semibold text-lg flex justify-between items-center">
            Education
            <Button size="sm" onClick={addEducation} className="flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </h2>
          {resumeData.education.map(edu => (
            <div key={edu.id} className="space-y-2 border p-2 rounded relative">
              <Button variant="ghost" size="sm" onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 p-1">
                <Trash className="w-4 h-4" />
              </Button>
              <Input value={edu.degree} onChange={(e) => handleEducationChange(edu.id, "degree", e.target.value)} placeholder="Degree" />
              <Input value={edu.school} onChange={(e) => handleEducationChange(edu.id, "school", e.target.value)} placeholder="School" />
              <Input value={edu.year} onChange={(e) => handleEducationChange(edu.id, "year", e.target.value)} placeholder="Year" />
            </div>
          ))}
        </div>

        {/* Download Buttons */}
        <div className="flex gap-4 mt-6">
          <Button onClick={() => exportToTxt(resumeData)} className="bg-gradient-primary">
            <FileText className="w-4 h-4 mr-2" /> Download TXT
          </Button>
          <Button onClick={() => exportToPdf(resumeData)} className="bg-gradient-primary">
            <FileDown className="w-4 h-4 mr-2" /> Download PDF
          </Button>
        </div>
      </div>

      {/* Right: Live Preview */}
      <div className="border p-6 rounded-lg bg-gray-50 shadow-md space-y-4 overflow-auto">
        <h1 className="text-3xl font-bold">{resumeData.fullName}</h1>
        <p className="text-sm text-gray-600">{resumeData.email} | {resumeData.phone} | {resumeData.location}</p>
        <hr className="my-2" />

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
          {resumeData.experiences.map(exp => (
            <div key={exp.id} className="mb-2">
              <strong>{exp.title}</strong> - {exp.company} ({exp.startDate} - {exp.endDate})
              <p>{exp.description}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="font-semibold text-lg mt-2">Education</h2>
          {resumeData.education.map(edu => (
            <div key={edu.id} className="mb-2">
              <strong>{edu.degree}</strong>, {edu.school} ({edu.year})
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
