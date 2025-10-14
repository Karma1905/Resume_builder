// Assuming your type definitions for ResumeData, Experience, and Education look like this:
interface Experience { id: string; title: string; company: string; startDate: string; endDate: string; description: string; }
interface Education { id: string; degree: string; school: string; year: string; }
interface ResumeData {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    skills: string; // Comma-separated string
    experiences: Experience[];
    education: Education[];
}

/**
 * Converts the structured resume data (from local storage) into a plain text string 
 * formatted exactly like the TXT export file for AI analysis.
 */
export const getResumeTextFromState = (): string => {
    // 1. Prioritize enhanced data, fall back to current manual data
    const rawData = localStorage.getItem('ai_enhanced_resume_data') || localStorage.getItem('current_resume_data');
    
    if (!rawData) {
        return "";
    }

    try {
        const data: ResumeData = JSON.parse(rawData);
        let content = `Resume\n\n`;

        // --- Personal Info / Summary ---
        content += `Full Name: ${data.fullName || ''}\n`;
        content += `Email: ${data.email || ''}\n`;
        content += `Phone: ${data.phone || ''}\n`;
        content += `Location: ${data.location || ''}\n`;
        content += `Summary: ${data.summary || ''}\n\n`;

        // --- WORK EXPERIENCE ---
        content += "Work Experience:\n";
        (data.experiences || []).forEach((exp, i) => {
            const endDate = exp.endDate || "Present";
            
            content += ` ${i + 1}. ${exp.title || 'Untitled'} at ${exp.company || 'Unknown Company'}\n`;
            content += `    Duration: ${exp.startDate || 'N/A'} - ${endDate}\n`;
            content += `    Description: ${exp.description || ''}\n\n`;
        });

        // --- EDUCATION ---
        content += "Education:\n";
        (data.education || []).forEach((edu, i) => {
            content += ` ${i + 1}. ${edu.degree || 'Untitled Degree'} - ${edu.school || 'Unknown School'} (${edu.year || 'N/A'})\n`;
        });
        content += "\n";

        // --- SKILLS ---
        content += `Skills: ${data.skills || ''}\n`;
        
        return content.trim();
    } catch (e) {
        console.error("Error parsing resume data from storage:", e);
        return "";
    }
};
