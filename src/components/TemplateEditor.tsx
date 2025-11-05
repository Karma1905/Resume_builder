import { motion, AnimatePresence } from 'framer-motion';
import {
  ResumeData, Experience, Education, Skill, Project,
  Certification, Language, Achievement
} from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, FileDown, FileText, Plus, Trash, Bot } from "lucide-react";
import { exportToTxt } from "@/utils/resumeExport";
import html2pdf from 'html2pdf.js';

import { ProfessionalTemplate } from "./templates/ProfessionalTemplate";
import { CreativeTemplate } from "./templates/CreativeTemplate";
import { ExecutiveTemplate } from "./templates/ExecutiveTemplate";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface Props {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  onBack: () => void;
  templateId: string;
  onMatchResume?: () => void;
}

// --- MAIN COMPONENT ---
export default function TemplateEditor({
  resumeData,
  setResumeData,
  onBack,
  templateId,
  onMatchResume,
}: Props) {
  // --------- Top-level field change ----------
  const handleChange = (field: keyof ResumeData, value: string) => {
    setResumeData({ ...resumeData, [field]: value });
  };

  // --------- Skills ----------
  const handleSkillChange = (id: string, field: keyof Skill, value: string) => {
    const updatedSkills = resumeData.skills.map(skill =>
      skill.id === id ? { ...skill, [field]: value } : skill
    );
    setResumeData({ ...resumeData, skills: updatedSkills });
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: `skill${Date.now()}`,
      name: "",
      category: "Framework/Library",
    };
    setResumeData({ ...resumeData, skills: [...resumeData.skills, newSkill] });
  };

  const removeSkill = (id: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter(s => s.id !== id),
    });
  };

  // --------- Experience ----------
  const handleExperienceChange = (
    id: string,
    field: keyof Experience,
    value: string
  ) => {
    const updatedExperiences = resumeData.experiences.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    setResumeData({ ...resumeData, experiences: updatedExperiences });
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: `exp${Date.now()}`,
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      achievements: [{ id: `ach${Date.now()}`, description: "" }],
    };
    setResumeData({
      ...resumeData,
      experiences: [...resumeData.experiences, newExp],
    });
  };

  const removeExperience = (id: string) => {
    setResumeData({
      ...resumeData,
      experiences: resumeData.experiences.filter(exp => exp.id !== id),
    });
  };

  const handleExperienceAchievementChange = (
    expId: string,
    achId: string,
    value: string
  ) => {
    const updatedExperiences = resumeData.experiences.map(exp => {
      if (exp.id === expId) {
        const updatedAchievements = exp.achievements.map(ach =>
          ach.id === achId ? { ...ach, description: value } : ach
        );
        return { ...exp, achievements: updatedAchievements };
      }
      return exp;
    });
    setResumeData({ ...resumeData, experiences: updatedExperiences });
  };

  const addExperienceAchievement = (expId: string) => {
    const updatedExperiences = resumeData.experiences.map(exp => {
      if (exp.id === expId) {
        const newAchievement: Achievement = {
          id: `ach${Date.now()}`,
          description: "",
        };
        return { ...exp, achievements: [...exp.achievements, newAchievement] };
      }
      return exp;
    });
    setResumeData({ ...resumeData, experiences: updatedExperiences });
  };

  const removeExperienceAchievement = (expId: string, achId: string) => {
    const updatedExperiences = resumeData.experiences.map(exp => {
      if (exp.id === expId) {
        return {
          ...exp,
          achievements: exp.achievements.filter(ach => ach.id !== achId),
        };
      }
      return exp;
    });
    setResumeData({ ...resumeData, experiences: updatedExperiences });
  };

  // --------- Education ----------
  const handleEducationChange = (
    id: string,
    field: keyof Education,
    value: string
  ) => {
    const updatedEducation = resumeData.education.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    setResumeData({ ...resumeData, education: updatedEducation });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: `edu${Date.now()}`,
      degree: "",
      school: "",
      location: "",
      startDate: "",
      endDate: "",
    };
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, newEdu],
    });
  };

  const removeEducation = (id: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter(edu => edu.id !== id),
    });
  };

  // --------- Projects ----------
  const handleProjectChange = (
    id: string,
    field: keyof Project,
    value: string
  ) => {
    const updatedProjects = resumeData.projects.map(proj =>
      proj.id === id ? { ...proj, [field]: value } : proj
    );
    setResumeData({ ...resumeData, projects: updatedProjects });
  };

  const addProject = () => {
    const newProject: Project = {
      id: `proj${Date.now()}`,
      name: "",
      techStack: "",
      achievements: [{ id: `ach${Date.now()}`, description: "" }],
    };
    setResumeData({
      ...resumeData,
      projects: [...resumeData.projects, newProject],
    });
  };

  const removeProject = (id: string) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.filter(proj => proj.id !== id),
    });
  };

  const handleProjectAchievementChange = (
    projId: string,
    achId: string,
    value: string
  ) => {
    const updatedProjects = resumeData.projects.map(proj => {
      if (proj.id === projId) {
        const updatedAchievements = proj.achievements.map(ach =>
          ach.id === achId ? { ...ach, description: value } : ach
        );
        return { ...proj, achievements: updatedAchievements };
      }
      return proj;
    });
    setResumeData({ ...resumeData, projects: updatedProjects });
  };

  const addProjectAchievement = (projId: string) => {
    const updatedProjects = resumeData.projects.map(proj => {
      if (proj.id === projId) {
        const newAchievement: Achievement = {
          id: `ach${Date.now()}`,
          description: "",
        };
        return {
          ...proj,
          achievements: [...proj.achievements, newAchievement],
        };
      }
      return proj;
    });
    setResumeData({ ...resumeData, projects: updatedProjects });
  };

  const removeProjectAchievement = (projId: string, achId: string) => {
    const updatedProjects = resumeData.projects.map(proj => {
      if (proj.id === projId) {
        return {
          ...proj,
          achievements: proj.achievements.filter(ach => ach.id !== achId),
        };
      }
      return proj;
    });
    setResumeData({ ...resumeData, projects: updatedProjects });
  };

  // --------- Certifications ----------
  const handleCertificationChange = (
    id: string,
    field: keyof Certification,
    value: string
  ) => {
    const updatedCerts = resumeData.certifications.map(cert =>
      cert.id === id ? { ...cert, [field]: value } : cert
    );
    setResumeData({ ...resumeData, certifications: updatedCerts });
  };

  const addCertification = () => {
    const newCert: Certification = {
      id: `cert${Date.now()}`,
      name: "",
      organization: "",
      date: "",
    };
    setResumeData({
      ...resumeData,
      certifications: [...resumeData.certifications, newCert],
    });
  };

  const removeCertification = (id: string) => {
    setResumeData({
      ...resumeData,
      certifications: resumeData.certifications.filter(
        cert => cert.id !== id
      ),
    });
  };

  // --------- Languages ----------
  const handleLanguageChange = (
    id: string,
    field: keyof Language,
    value: string
  ) => {
    const updatedLangs = resumeData.languages.map(lang =>
      lang.id === id ? { ...lang, [field]: value } : lang
    );
    setResumeData({ ...resumeData, languages: updatedLangs });
  };

  const addLanguage = () => {
    const newLang: Language = {
      id: `lang${Date.now()}`,
      name: "",
      proficiency: "Fluent",
    };
    setResumeData({
      ...resumeData,
      languages: [...resumeData.languages, newLang],
    });
  };

  const removeLanguage = (id: string) => {
    setResumeData({
      ...resumeData,
      languages: resumeData.languages.filter(lang => lang.id !== id),
    });
  };

  // --------- Export PDF ----------
  const handleExportPdf = () => {
    const element = document.getElementById("resume-preview-content");
    if (element) {
      const options = {
        margin: 0.5,
        filename: `${resumeData.fullName}_Resume.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      } as any;

      html2pdf().from(element).set(options).save();
    }
  };

  // ================= RENDER =================
  return (
    <div className="grid md:grid-cols-2 gap-8 h-[calc(100vh-2rem)]">
      {/* LEFT: Editor */}
      <motion.div
        className="space-y-6 overflow-auto p-4 bg-gray-50 rounded-lg shadow"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        {/* Back */}
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 mb-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        {/* Personal Info */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h2 className="font-semibold text-lg">Personal Info</h2>
          <Input
            value={resumeData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="Full Name"
          />
          <Input
            value={resumeData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Email"
          />
          <Input
            value={resumeData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Phone"
          />
          <Input
            value={resumeData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="Location (e.g., Mumbai, India)"
          />
          <Input
            value={resumeData.linkedin || ""}
            onChange={(e) => handleChange("linkedin", e.target.value)}
            placeholder="LinkedIn URL (Optional)"
          />
          <Input
            value={resumeData.github || ""}
            onChange={(e) => handleChange("github", e.target.value)}
            placeholder="GitHub URL (Optional)"
          />
          <Input
            value={resumeData.portfolio || ""}
            onChange={(e) => handleChange("portfolio", e.target.value)}
            placeholder="Portfolio/Website URL (Optional)"
          />
        </div>

        {/* Summary */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h2 className="font-semibold text-lg">Professional Summary</h2>
          <Textarea
            value={resumeData.summary}
            onChange={(e) => handleChange("summary", e.target.value)}
            placeholder="Write a brief professional summary..."
            rows={4}
          />
        </div>

        {/* Skills */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h2 className="font-semibold text-lg flex justify-between items-center">
            Skills
            <Button size="sm" onClick={addSkill} className="flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Skill
            </Button>
          </h2>

          <AnimatePresence>
            {resumeData.skills.map(skill => (
              <motion.div
                key={skill.id}
                className="flex gap-2 items-center border p-2 rounded"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                {/* Input and Select take up the available space */}
                <Input
                  value={skill.name}
                  onChange={(e) => handleSkillChange(skill.id, "name", e.target.value)}
                  placeholder="Skill Name (e.g., React.js)"
                  className="flex-grow"
                />
                <Select
                  onValueChange={(value) =>
                    handleSkillChange(skill.id, "category", value)
                  }
                  defaultValue={skill.category}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Language">Language</SelectItem>
                    <SelectItem value="Framework/Library">Framework/Library</SelectItem>
                    <SelectItem value="Database">Database</SelectItem>
                    <SelectItem value="Cloud">Cloud</SelectItem>
                    <SelectItem value="Tool">Tool</SelectItem>
                    <SelectItem value="Soft Skill">Soft Skill</SelectItem>
                  </SelectContent>
                </Select>
                {/* Delete button placed on the end - Added hover:bg-gray-100 */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSkill(skill.id)}
                  className="p-1 h-fit **hover:bg-red-50**"
                >
                  <Trash className="w-4 h-4 **text-red-500**" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Experience */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h2 className="font-semibold text-lg flex justify-between items-center">
            Experience
            <Button size="sm" onClick={addExperience} className="flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </h2>

          <AnimatePresence>
            {resumeData.experiences.map(exp => (
              <motion.div
                key={exp.id}
                className="space-y-3 border p-3 rounded"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                {/* Delete button container - Added hover:bg-gray-100 */}
                <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(exp.id)}
                      className="p-1 h-fit **hover:bg-red-50**"
                    >
                      <Trash className="w-4 h-4 **text-red-500**" />
                    </Button>
                </div>
                

                <Input
                  value={exp.title}
                  onChange={(e) =>
                    handleExperienceChange(exp.id, "title", e.target.value)
                  }
                  placeholder="Title (e.g., Software Engineer)"
                />
                <Input
                  value={exp.company}
                  onChange={(e) =>
                    handleExperienceChange(exp.id, "company", e.target.value)
                  }
                  placeholder="Company"
                />
                <Input
                  value={exp.location || ""}
                  onChange={(e) =>
                    handleExperienceChange(exp.id, "location", e.target.value)
                  }
                  placeholder="Location (Optional)"
                />

                <div className="flex gap-2">
                  <Input
                    value={exp.startDate}
                    onChange={(e) =>
                      handleExperienceChange(exp.id, "startDate", e.target.value)
                    }
                    placeholder="Start Date"
                    type="month"
                  />
                  <Input
                    value={exp.endDate}
                    onChange={(e) =>
                      handleExperienceChange(exp.id, "endDate", e.target.value)
                    }
                    placeholder="End Date"
                    type="month"
                  />
                </div>

                <h3 className="text-sm font-medium pt-2">Key Achievements</h3>

                <AnimatePresence>
                  {exp.achievements.map((ach, index) => (
                    <motion.div
                      key={ach.id}
                      className="flex gap-2 items-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                    >
                      <Textarea
                        value={ach.description}
                        onChange={(e) =>
                          handleExperienceAchievementChange(
                            exp.id,
                            ach.id,
                            e.target.value
                          )
                        }
                        placeholder={`Achievement ${index + 1}`}
                        rows={2}
                      />
                      {/* Sub-item delete button - Using hover:bg-gray-100 and grey text */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          removeExperienceAchievement(exp.id, ach.id)
                        }
                        className="p-1 h-fit **hover:bg-gray-100**"
                      >
                        <Trash className="w-4 h-4 **text-gray-500**" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addExperienceAchievement(exp.id)}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Achievement
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Education */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h2 className="font-semibold text-lg flex justify-between items-center">
            Education
            <Button size="sm" onClick={addEducation} className="flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </h2>

          <AnimatePresence>
            {resumeData.education.map(edu => (
              <motion.div
                key={edu.id}
                className="space-y-2 border p-2 rounded"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                {/* Delete button container - Added hover:bg-gray-100 */}
                <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(edu.id)}
                      className="p-1 h-fit **hover:bg-red-50**"
                    >
                      <Trash className="w-4 h-4 **text-red-500**" />
                    </Button>
                </div>
                
                <Input
                  value={edu.degree}
                  onChange={(e) =>
                    handleEducationChange(edu.id, "degree", e.target.value)
                  }
                  placeholder="Degree (e.g., B.Tech Computer Science)"
                />
                <Input
                  value={edu.school}
                  onChange={(e) =>
                    handleEducationChange(edu.id, "school", e.target.value)
                  }
                  placeholder="School (e.g., IIT Delhi)"
                />
                <Input
                  value={edu.location || ""}
                  onChange={(e) =>
                    handleEducationChange(edu.id, "location", e.target.value)
                  }
                  placeholder="Location (Optional)"
                />

                <div className="flex gap-2">
                  <Input
                    value={edu.startDate}
                    onChange={(e) =>
                      handleEducationChange(edu.id, "startDate", e.target.value)
                    }
                    placeholder="Start Date"
                    type="month"
                  />
                  <Input
                    value={edu.endDate}
                    onChange={(e) =>
                      handleEducationChange(edu.id, "endDate", e.target.value)
                    }
                    placeholder="End Date"
                    type="month"
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Projects */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h2 className="font-semibold text-lg flex justify-between items-center">
            Projects
            <Button size="sm" onClick={addProject} className="flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </h2>

          <AnimatePresence>
            {resumeData.projects.map(proj => (
              <motion.div
                key={proj.id}
                className="space-y-3 border p-3 rounded"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                {/* Delete button container - Added hover:bg-gray-100 */}
                <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProject(proj.id)}
                      className="p-1 h-fit **hover:bg-red-50**"
                    >
                      <Trash className="w-4 h-4 **text-red-500**" />
                    </Button>
                </div>

                <Input
                  value={proj.name}
                  onChange={(e) =>
                    handleProjectChange(proj.id, "name", e.target.value)
                  }
                  placeholder="Project Name"
                />
                <Input
                  value={proj.techStack}
                  onChange={(e) =>
                    handleProjectChange(proj.id, "techStack", e.target.value)
                  }
                  placeholder="Tech Stack (e.g., React, Node.js)"
                />
                <Input
                  value={proj.githubLink || ""}
                  onChange={(e) =>
                    handleProjectChange(proj.id, "githubLink", e.target.value)
                  }
                  placeholder="GitHub Link (Optional)"
                />
                <Input
                  value={proj.liveLink || ""}
                  onChange={(e) =>
                    handleProjectChange(proj.id, "liveLink", e.target.value)
                  }
                  placeholder="Live Demo Link (Optional)"
                />

                <h3 className="text-sm font-medium pt-2">Key Features / Achievements</h3>

                <AnimatePresence>
                  {proj.achievements.map((ach, index) => (
                    <motion.div
                      key={ach.id}
                      className="flex gap-2 items-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                    >
                      <Textarea
                        value={ach.description}
                        onChange={(e) =>
                          handleProjectAchievementChange(
                            proj.id,
                            ach.id,
                            e.target.value
                          )
                        }
                        placeholder={`Feature ${index + 1}`}
                        rows={2}
                      />
                      {/* Sub-item delete button - Using hover:bg-gray-100 and grey text */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          removeProjectAchievement(proj.id, ach.id)
                        }
                        className="p-1 h-fit **hover:bg-gray-100**"
                      >
                        <Trash className="w-4 h-4 **text-gray-500**" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addProjectAchievement(proj.id)}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Feature
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Certifications */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h2 className="font-semibold text-lg flex justify-between items-center">
            Certifications
            <Button size="sm" onClick={addCertification} className="flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </h2>

          <AnimatePresence>
            {resumeData.certifications.map(cert => (
              <motion.div
                key={cert.id}
                className="space-y-2 border p-2 rounded"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                {/* Delete button container - Added hover:bg-gray-100 */}
                <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCertification(cert.id)}
                      className="p-1 h-fit **hover:bg-red-50**"
                    >
                      <Trash className="w-4 h-4 **text-red-500**" />
                    </Button>
                </div>

                <Input
                  value={cert.name}
                  onChange={(e) =>
                    handleCertificationChange(cert.id, "name", e.target.value)
                  }
                  placeholder="Certificate Name"
                />
                <Input
                  value={cert.organization}
                  onChange={(e) =>
                    handleCertificationChange(
                      cert.id,
                      "organization",
                      e.target.value
                    )
                  }
                  placeholder="Issuing Organization"
                />
                <Input
                  value={cert.date}
                  onChange={(e) =>
                    handleCertificationChange(cert.id, "date", e.target.value)
                  }
                  placeholder="Date Issued (e.g., June 2024)"
                />
                <Input
                  value={cert.url || ""}
                  onChange={(e) =>
                    handleCertificationChange(cert.id, "url", e.target.value)
                  }
                  placeholder="Credential URL (Optional)"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Languages */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h2 className="font-semibold text-lg flex justify-between items-center">
            Languages
            <Button size="sm" onClick={addLanguage} className="flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </h2>

          <AnimatePresence>
            {resumeData.languages.map(lang => (
              <motion.div
                key={lang.id}
                className="flex gap-2 items-center border p-2 rounded"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                {/* Input and Select take up the available space */}
                <Input
                  value={lang.name}
                  onChange={(e) =>
                    handleLanguageChange(lang.id, "name", e.target.value)
                  }
                  placeholder="Language (e.g., English)"
                  className="flex-grow"
                />
                <Select
                  onValueChange={(value) =>
                    handleLanguageChange(lang.id, "proficiency", value)
                  }
                  defaultValue={lang.proficiency}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Proficiency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Native">Native</SelectItem>
                    <SelectItem value="Fluent">Fluent</SelectItem>
                    <SelectItem value="Conversational">Conversational</SelectItem>
                    <SelectItem value="Basic">Basic</SelectItem>
                  </SelectContent>
                </Select>
                {/* Delete button placed on the end - Added hover:bg-gray-100 */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLanguage(lang.id)}
                  className="p-1 h-fit **hover:bg-red-50**"
                >
                  <Trash className="w-4 h-4 **text-red-500**" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ===== Download Buttons ===== */}
        <TooltipProvider>
          <div className="flex gap-3 mt-6 justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => exportToTxt(resumeData)}
                  className="px-4 py-2 text-sm flex items-center gap-1 bg-gradient-primary text-white"
                >
                  <FileText className="w-4 h-4" />
                  TXT
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download in TXT format</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleExportPdf}
                  className="px-4 py-2 text-sm flex items-center gap-1 bg-gradient-primary text-white"
                >
                  <FileDown className="w-4 h-4" />
                  PDF
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download in PDF format</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onMatchResume}
                  variant="outline"
                  className="px-4 py-2 text-sm flex items-center gap-1"
                >
                  <Bot className="w-4 h-4" />
                  Match
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Match your resume</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </motion.div>

      {/* RIGHT: Preview */}
      <motion.div
        id="resume-preview-content"
        className="rounded-lg shadow-md overflow-auto"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      >
        {(() => {
          switch (templateId) {
            case "professional":
              return <ProfessionalTemplate data={resumeData} />;
            case "creative":
              return <CreativeTemplate data={resumeData} />;
            case "executive":
            return <ExecutiveTemplate data={resumeData} />;
            default:
              return <ProfessionalTemplate data={resumeData} />;
          }
        })()}
      </motion.div>
    </div>
  );
}