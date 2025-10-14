// ✅ Base URL now points to your local Flask server
const FIREBASE_FUNCTIONS_BASE_URL = 'http://localhost:5000';

// --- 1. Types for AI Builder (File Upload) ---
interface Experience { 
    id: string; 
    title: string; 
    company: string; 
    startDate: string; 
    endDate: string; 
    description: string; 
}
interface Education { 
    id: string; 
    degree: string; 
    school: string; 
    year: string; 
}

interface AIResumeResponse {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    skills: string;
    experiences: Experience[];
    education: Education[];
    error?: string;
}

/**
 * 📄 AI Resume Parser
 * Uploads a file for parsing and enhancement
 */
export const uploadResumeFile = async (file: File, model: string): Promise<AIResumeResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model_choice', model);

    try {
        const response = await fetch(`${FIREBASE_FUNCTIONS_BASE_URL}/aiResumeParser`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            return { error: data.error || `HTTP error! Status: ${response.status}` } as AIResumeResponse;
        }

        return data as AIResumeResponse;
    } catch (error) {
        console.error("AI File Upload API Error:", error);
        return { error: "Network or server connection failed. Make sure local_server.py is running." } as AIResumeResponse;
    }
};


// --- 2. Types and functions for Job Matcher ---
interface AnalysisResult {
    match_score: number;
    summary: string;
    matching_keywords: string[];
    missing_keywords: string[];
    tailoring_suggestions: string[];
    error?: string;
}

/**
 * 🧭 AI Job Matcher
 * Sends resume and JD text for compatibility analysis
 */
export const analyzeMatch = async (resumeText: string, jdText: string): Promise<AnalysisResult> => {
    try {
        const response = await fetch(`${FIREBASE_FUNCTIONS_BASE_URL}/aiJobMatcher`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                resume_text: resumeText, 
                jd_text: jdText 
            }),
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            return { error: data.error || `HTTP error! Status: ${response.status}` } as AnalysisResult;
        }

        return data as AnalysisResult;
    } catch (error) {
        console.error("Analyze Match API Error:", error);
        return { error: "Network or server connection failed. Make sure local_server.py is running." } as AnalysisResult;
    }
};


/**
 * ✍️ Cover Letter Generator
 */
export const generateCoverLetter = async (resumeText: string, jdText: string, userName: string): Promise<string> => {
    try {
        const response = await fetch(`${FIREBASE_FUNCTIONS_BASE_URL}/aiCoverLetter`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                resume_text: resumeText, 
                jd_text: jdText, 
                user_name: userName 
            }),
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            throw new Error(data.error || `HTTP error! Status: ${response.status}`);
        }

        return data.cover_letter || "Failed to generate cover letter.";
    } catch (error) {
        console.error("Generate Cover Letter API Error:", error);
        return "An error occurred while connecting to the AI server. Please try again.";
    }
};
