import { motion, AnimatePresence } from 'framer-motion';
// --- 1. IMPORT ALL NEW TYPES AND UI COMPONENTS ---
import { 
  ResumeData, Experience, Education, Skill, Project, 
  Certification, Language, Achievement 
} from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, FileDown, FileText, Plus, Trash } from "lucide-react";
import { exportToTxt } from "@/utils/resumeExport";
import html2pdf from 'html2pdf.js';

import { ProfessionalTemplate } from "./templates/ProfessionalTemplate";
import { CreativeTemplate } from "./templates/CreativeTemplate";
import { ExecutiveTemplate } from "./templates/ExecutiveTemplate";

// --- PROPS INTERFACE (no change needed, as it uses the imported ResumeData) ---
export interface Props {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  onBack: () => void;
  templateId: string;
}

// --- MAIN COMPONENT ---
export default function TemplateEditor({ resumeData, setResumeData, onBack, templateId }: Props) {
  
  // --- 2. NEW HANDLER FUNCTIONS FOR ALL SECTIONS ---

  // Handle simple top-level fields (e.g., fullName, email, linkedin)
  const handleChange = (field: keyof ResumeData, value: string) => {
    setResumeData({ ...resumeData, [field]: value });
  };

  // --- Generic Handlers for Lists (Skills, Certs, Langs) ---
  const handleItemChange = <T extends { id: string }>(
    listName: keyof ResumeData, 
    itemId: string, 
    field: keyof T, 
    value: string
  ) => {
    const list = resumeData[listName] as T[];
    const updatedList = list.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    );
    setResumeData({ ...resumeData, [listName]: updatedList });
  };

  const addItem = (listName: keyof ResumeData, newItem: any) => {
    const list = resumeData[listName] as any[];
    setResumeData({ ...resumeData, [listName]: [...list, newItem] });
  };

  const removeItem = (listName: keyof ResumeData, itemId: string) => {
    const list = resumeData[listName] as { id: string }[];
    setResumeData({ ...resumeData, [listName]: list.filter(item => item.id !== itemId) });
  };

  // --- Handlers for Nested Lists (Experience & Projects Achievements) ---
  const handleNestedItemChange = <T extends Experience | Project>(
    listName: 'experiences' | 'projects',
    itemId: string,
    field: keyof T,
    value: string
  ) => {
    const list = resumeData[listName] as T[];
    const updatedList = list.map(item =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    setResumeData({ ...resumeData, [listName]: updatedList });
  };

  const handleAchievementChange = (
    listName: 'experiences' | 'projects',
    itemId: string,
    achId: string,
    value: string
  ) => {
    const list = resumeData[listName] as (Experience | Project)[];
    const updatedList = list.map(item => {
      if (item.id === itemId) {
        const updatedAchievements = item.achievements.map(ach =>
          ach.id === achId ? { ...ach, description: value } : ach
        );
        return { ...item, achievements: updatedAchievements };
      }
      return item;
    });
    setResumeData({ ...resumeData, [listName]: updatedList });
  };

  const addAchievement = (listName: 'experiences' | 'projects', itemId: string) => {
    const list = resumeData[listName] as (Experience | Project)[];
    const updatedList = list.map(item => {
      if (item.id === itemId) {
        const newAchievement: Achievement = { id: `ach${Date.now()}`, description: "" };
        return { ...item, achievements: [...item.achievements, newAchievement] };
      }
      return item;
    });
    setResumeData({ ...resumeData, [listName]: updatedList });
  };

  const removeAchievement = (listName: 'experiences' | 'projects', itemId: string, achId: string) => {
    const list = resumeData[listName] as (Experience | Project)[];
    const updatedList = list.map(item => {
      if (item.id === itemId) {
        return { ...item, achievements: item.achievements.filter(ach => ach.id !== achId) };
      }
      return item;
    });
    setResumeData({ ...resumeData, [listName]: updatedList });
  };

  // --- Handlers for Education (it's flat, so it uses the generic handlers) ---
  const handleEducationChange = (id: string, field: keyof Education, value: string) => {
    handleItemChange('education', id, field, value);
  };
  
  const addEducation = () => {
    const newEdu: Education = { 
      id: `edu${Date.now()}`, 
      degree: "", 
      school: "", 
      location: "", 
      startDate: "", 
      endDate: "" 
    };
    addItem('education', newEdu);
  };

  // --- PDF Export Function (Unchanged) ---
  const handleExportPdf = () => {
    const element = document.getElementById('resume-preview-content');
    if (element) {
      const options = {
        margin:       0.5,
        filename:     `${resumeData.fullName}_Resume.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().from(element).set(options).save();
    }
  };

  // --- 3. NEW JSX WITH ALL FORM FIELDS ---
  return (
    <div className="grid md:grid-cols-2 gap-8 h-[calc(100vh-2rem)]">
      
      {/* Left: Editor Forms */}
      <motion.div 
        className="space-y-6 overflow-auto p-4 bg-gray-50 rounded-lg shadow"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 mb-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        {/* --- Personal Info (Expanded) --- */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h2 className="font-semibold text-lg">Personal Info</h2>
          <Input value={resumeData.fullName} onChange={(e) => handleChange("fullName", e.target.value)} placeholder="Full Name" />
          {/* --- FIX: 'e-mail"' corrected to 'email' --- */}
          <Input value={resumeData.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="Email" />
          <Input value={resumeData.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="Phone" />
          <Input value={resumeData.location} onChange={(e) => handleChange("location", e.target.value)} placeholder="Location (e.g., Mumbai, India)" />
          <Input value={resumeData.linkedin || ''} onChange={(e) => handleChange("linkedin", e.target.value)} placeholder="LinkedIn URL (Optional)" />
          <Input value={resumeData.github || ''} onChange={(e) => handleChange("github", e.target.value)} placeholder="GitHub URL (Optional)" />
          <Input value={resumeData.portfolio || ''} onChange={(e) => handleChange("portfolio", e.target.value)} placeholder="Portfolio/Website URL (Optional)" />
        </div>

        {/* --- Professional Summary --- */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h2 className="font-semibold text-lg">Professional Summary</h2>
          <Textarea value={resumeData.summary} onChange={(e) => handleChange("summary", e.target.value)} placeholder="Write a brief professional summary..." rows={4} />
        </div>

        {/* --- Skills (Structured) --- */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h2 className="font-semibold text-lg flex justify-between items-center">
            Skills
            <Button size="sm" onClick={() => addItem('skills', { id: `skill${Date.now()}`, name: "", category: "Framework/Library" })} className="flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Skill
            </Button>
          </h2>
          <AnimatePresence>
            {resumeData.skills.map(skill => (
              <motion.div 
                key={skill.id} 
                className="space-y-2 border p-2 rounded relative"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <Button variant="ghost" size="sm" onClick={() => removeItem('skills', skill.id)} className="absolute top-2 right-2 p-1">
                  <Trash className="w-4 h-4" />
                </Button>
                <div className="flex gap-2">
                  <Input 
                    value={skill.name} 
                    onChange={(e) => handleItemChange('skills', skill.id, 'name', e.target.value)} 
                    placeholder="Skill Name (e.g., React.js)" 
                  />
                  <Select onValueChange={(value) => handleItemChange('skills', skill.id, 'category', value)} defaultValue={skill.category}>
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
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* --- Experience (Structured) --- */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h2 className="font-semibold text-lg flex justify-between items-center">
            Experience
            <Button size="sm" onClick={() => addItem('experiences', { id: `exp${Date.now()}`, title: "", company: "", location: "", startDate: "", endDate: "", achievements: [{ id: `ach${Date.now()}`, description: "" }] })} className="flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </h2>
          <AnimatePresence>
            {resumeData.experiences.map(exp => (
              <motion.div 
                key={exp.id} 
                className="space-y-3 border p-3 rounded relative"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <Button variant="ghost" size="sm" onClick={() => removeItem('experiences', exp.id)} className="absolute top-2 right-2 p-1">
                  <Trash className="w-4 h-4" />
                </Button>
                <Input value={exp.title} onChange={(e) => handleNestedItemChange('experiences', exp.id, "title", e.target.value)} placeholder="Title (e.g., Software Engineer)" />
                <Input value={exp.company} onChange={(e) => handleNestedItemChange('experiences', exp.id, "company", e.target.value)} placeholder="Company" />
                <Input value={exp.location || ''} onChange={(e) => handleNestedItemChange('experiences', exp.id, "location", e.target.value)} placeholder="Location (Optional)" />
                <div className="flex gap-2">
                  <Input value={exp.startDate} onChange={(e) => handleNestedItemChange('experiences', exp.id, "startDate", e.target.value)} placeholder="Start Date" type="month" />
                  <Input value={exp.endDate} onChange={(e) => handleNestedItemChange('experiences', exp.id, "endDate", e.target.value)} placeholder="End Date" type="month" />
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
                        onChange={(e) => handleAchievementChange('experiences', exp.id, ach.id, e.target.value)} 
                        placeholder={`Achievement ${index + 1}`} 
                        rows={2} 
                      />
                      <Button variant="ghost" size="sm" onClick={() => removeAchievement('experiences', exp.id, ach.id)} className="p-1">
                        <Trash className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <Button size="sm" variant="outline" onClick={() => addAchievement('experiences', exp.id)} className="flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add Achievement
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* --- Education (Structured) --- */}
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
                className="space-y-2 border p-2 rounded relative"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <Button variant="ghost" size="sm" onClick={() => removeItem('education', edu.id)} className="absolute top-2 right-2 p-1">
                  <Trash className="w-4 h-4" />
                </Button>
                <Input value={edu.degree} onChange={(e) => handleEducationChange(edu.id, "degree", e.target.value)} placeholder="Degree (e.g., B.Tech Computer Science)" />
                <Input value={edu.school} onChange={(e) => handleEducationChange(edu.id, "school", e.target.value)} placeholder="School (e.g., IIT Delhi)" />
                {/* --- FIX: 'e.g.target.value' corrected to 'e.target.value' --- */}
                <Input value={edu.location || ''} onChange={(e) => handleEducationChange(edu.id, "location", e.target.value)} placeholder="Location (Optional)" />
                <div className="flex gap-2">
                  <Input value={edu.startDate} onChange={(e) => handleEducationChange(edu.id, "startDate", e.target.value)} placeholder="Start Date" type="month" />
                  <Input value={edu.endDate} onChange={(e) => handleEducationChange(edu.id, "endDate", e.target.value)} placeholder="End Date" type="month" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {/* --- Projects (New Section) --- */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h2 className="font-semibold text-lg flex justify-between items-center">
            Projects
            <Button size="sm" onClick={() => addItem('projects', { id: `proj${Date.now()}`, name: "", techStack: "", achievements: [{ id: `ach${Date.now()}`, description: "" }] })} className="flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </h2>
          <AnimatePresence>
            {resumeData.projects.map(proj => (
              <motion.div 
                key={proj.id} 
                className="space-y-3 border p-3 rounded relative"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <Button variant="ghost" size="sm" onClick={() => removeItem('projects', proj.id)} className="absolute top-2 right-2 p-1">
                  <Trash className="w-4 h-4" />
                </Button>
                <Input value={proj.name} onChange={(e) => handleNestedItemChange('projects', proj.id, "name", e.target.value)} placeholder="Project Name" />
                <Input value={proj.techStack} onChange={(e) => handleNestedItemChange('projects', proj.id, "techStack", e.target.value)} placeholder="Tech Stack (e.g., React, Node.js)" />
                <Input value={proj.githubLink || ''} onChange={(e) => handleNestedItemChange('projects', proj.id, "githubLink", e.target.value)} placeholder="GitHub Link (Optional)" />
                <Input value={proj.liveLink || ''} onChange={(e) => handleNestedItemChange('projects', proj.id, "liveLink", e.target.value)} placeholder="Live Demo Link (Optional)" />
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
                        onChange={(e) => handleAchievementChange('projects', proj.id, ach.id, e.target.value)} 
                        placeholder={`Feature ${index + 1}`} 
                        rows={2} 
                      />
                      <Button variant="ghost" size="sm" onClick={() => removeAchievement('projects', proj.id, ach.id)} className="p-1">
                        <Trash className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <Button size="sm" variant="outline" onClick={() => addAchievement('projects', proj.id)} className="flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add Feature
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* --- Certifications (New Section) --- */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h2 className="font-semibold text-lg flex justify-between items-center">
            Certifications
            <Button size="sm" onClick={() => addItem('certifications', { id: `cert${Date.now()}`, name: "", organization: "", date: "" })} className="flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </h2>
          <AnimatePresence>
            {resumeData.certifications.map(cert => (
              <motion.div 
                key={cert.id} 
                className="space-y-2 border p-2 rounded relative"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <Button variant="ghost" size="sm" onClick={() => removeItem('certifications', cert.id)} className="absolute top-2 right-2 p-1">
                  <Trash className="w-4 h-4" />
                </Button>
                <Input value={cert.name} onChange={(e) => handleItemChange('certifications', cert.id, 'name', e.target.value)} placeholder="Certificate Name" />
                <Input value={cert.organization} onChange={(e) => handleItemChange('certifications', cert.id, 'organization', e.target.value)} placeholder="Issuing Organization" />
                <Input value={cert.date} onChange={(e) => handleItemChange('certifications', cert.id, 'date', e.target.value)} placeholder="Date Issued (e.g., June 2024)" />
                <Input value={cert.url || ''} onChange={(e) => handleItemChange('certifications', cert.id, 'url', e.target.value)} placeholder="Credential URL (Optional)" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {/* --- Languages (New Section) --- */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h2 className="font-semibold text-lg flex justify-between items-center">
            Languages
            <Button size="sm" onClick={() => addItem('languages', { id: `lang${Date.now()}`, name: "", proficiency: "Fluent" })} className="flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </h2>
          <AnimatePresence>
            {resumeData.languages.map(lang => (
              <motion.div 
                key={lang.id} 
                className="space-y-2 border p-2 rounded relative"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <Button variant="ghost" size="sm" onClick={() => removeItem('languages', lang.id)} className="absolute top-2 right-2 p-1">
                  <Trash className="w-4 h-4" />
                </Button>
                <div className="flex gap-2">
                  <Input 
                    value={lang.name} 
                    onChange={(e) => handleItemChange('languages', lang.id, 'name', e.target.value)} 
                    placeholder="Language (e.g., English)" 
                  />
                  <Select onValueChange={(value) => handleItemChange('languages', lang.id, 'proficiency', value)} defaultValue={lang.proficiency}>
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
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* --- Download Buttons (Unchanged) --- */}
        <div className="flex gap-4 mt-6">
          <Button onClick={() => exportToTxt(resumeData)} className="bg-gradient-primary">
            <FileText className="w-4 h-4 mr-2" /> Download TXT
          </Button>
          <Button onClick={handleExportPdf} className="bg-gradient-primary">
            <FileDown className="w-4 h-4 mr-2" /> Download PDF
          </Button>
        </div>
      </motion.div>

      {/* --- Right: Live Preview (Unchanged) --- */}
      <motion.div 
        id="resume-preview-content"
        className="rounded-lg shadow-md overflow-auto"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      >
        {(() => {
          switch (templateId) {
            case 'professional':
              return <ProfessionalTemplate data={resumeData} />;
            case 'creative':
              {/* --- FIX: 'rowata' corrected to 'resumeData' --- */}
              return <CreativeTemplate data={resumeData} />;
            case 'executive':
              return <ExecutiveTemplate data={resumeData} />;
            default:
              return <ProfessionalTemplate data={resumeData} />;
          }
        })()}
      </motion.div>

    </div>
  );
}