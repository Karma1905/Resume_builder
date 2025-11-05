import { ResumeData } from "@/types/resume";

export function exportToTxt(data: ResumeData) {
  let content = `================================\n`;
  content += `${data.fullName}\n`;
  content += `================================\n\n`;
  
  content += `Contact:\n`;
  content += `  - Email: ${data.email}\n`;
  content += `  - Phone: ${data.phone}\n`;
  content += `  - Location: ${data.location}\n`;
  if (data.linkedin) content += `  - LinkedIn: ${data.linkedin}\n`;
  if (data.github) content += `  - GitHub: ${data.github}\n`;
  if (data.portfolio) content += `  - Portfolio: ${data.portfolio}\n`;
  content += `\n`;

  content += `================================\n`;
  content += `Professional Summary\n`;
  content += `================================\n`;
  content += `${data.summary}\n\n`;

  content += `================================\n`;
  content += `Skills\n`;
  content += `================================\n`;
  content += data.skills.map(skill => skill.name).join(', ') + '\n\n';

  content += `================================\n`;
  content += `Experience\n`;
  content += `================================\n`;
  data.experiences.forEach(exp => {
    content += `\n${exp.title} | ${exp.company}\n`;
    content += `${exp.startDate} - ${exp.endDate} ${exp.location ? `| ${exp.location}` : ''}\n`;
    exp.achievements.forEach(ach => {
      content += `  - ${ach.description}\n`;
    });
  });
  content += `\n`;

  content += `================================\n`;
  content += `Projects\n`;
  content += `================================\n`;
  data.projects.forEach(proj => {
    content += `\n${proj.name} | ${proj.techStack}\n`;
    proj.achievements.forEach(ach => {
      content += `  - ${ach.description}\n`;
    });
  });
  content += `\n`;

  content += `================================\n`;
  content += `Education\n`;
  content += `================================\n`;
  data.education.forEach(edu => {
    content += `\n${edu.degree}\n`;
    content += `${edu.school} ${edu.location ? `| ${edu.location}` : ''}\n`;
    content += `${edu.startDate} - ${edu.endDate}\n`;
  });
  content += `\n`;

  content += `================================\n`;
  content += `Certifications\n`;
  content += `================================\n`;
  data.certifications.forEach(cert => {
    content += `  - ${cert.name} - ${cert.organization} (${cert.date})\n`;
  });
  content += `\n`;

  content += `================================\n`;
  content += `Languages\n`;
  content += `================================\n`;
  data.languages.forEach(lang => {
    content += `  - ${lang.name} (${lang.proficiency})\n`;
  });

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "resume.txt";
  link.click();
  URL.revokeObjectURL(url);
}
