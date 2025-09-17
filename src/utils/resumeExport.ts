import jsPDF from "jspdf";
import { ResumeData } from "@/types/resume";

export function exportToTxt(data: ResumeData) {
  let content = `Resume\n\n`;

  content += `Full Name: ${data.fullName}\n`;
  content += `Email: ${data.email}\n`;
  content += `Phone: ${data.phone}\n`;
  content += `Location: ${data.location}\n`;
  content += `Summary: ${data.summary}\n\n`;

  content += "Work Experience:\n";
  data.experiences.forEach((exp, i) => {
    content += ` ${i + 1}. ${exp.title} at ${exp.company}\n`;
    content += `    Duration: ${exp.startDate} - ${exp.endDate || "Present"}\n`;
    content += `    Description: ${exp.description}\n\n`;
  });

  content += "Education:\n";
  data.education.forEach((edu, i) => {
    content += ` ${i + 1}. ${edu.degree} - ${edu.school} (${edu.year})\n`;
  });
  content += "\n";

  content += `Skills: ${data.skills}\n`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "resume.txt";
  link.click();
  URL.revokeObjectURL(url);
}

export function exportToPdf(data: ResumeData) {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Resume", 10, 10);

  doc.setFontSize(12);
  doc.text(`Name: ${data.fullName}`, 10, 20);
  doc.text(`Email: ${data.email}`, 10, 30);
  doc.text(`Phone: ${data.phone}`, 10, 40);
  doc.text(`Location: ${data.location}`, 10, 50);

  doc.text("Summary:", 10, 65);
  doc.text(data.summary, 10, 72, { maxWidth: 180 });

  let y = 90;
  doc.text("Experience:", 10, y);
  data.experiences.forEach((exp, i) => {
    y += 10;
    doc.text(`${i + 1}. ${exp.title} at ${exp.company}`, 10, y);
    y += 7;
    doc.text(`Duration: ${exp.startDate} - ${exp.endDate || "Present"}`, 10, y);
    y += 7;
    doc.text(exp.description, 10, y, { maxWidth: 180 });
  });

  y += 15;
  doc.text("Education:", 10, y);
  data.education.forEach((edu, i) => {
    y += 10;
    doc.text(`${i + 1}. ${edu.degree} - ${edu.school} (${edu.year})`, 10, y);
  });

  y += 15;
  doc.text("Skills:", 10, y);
  doc.text(data.skills, 10, y + 10, { maxWidth: 180 });

  doc.save("resume.pdf");
}
