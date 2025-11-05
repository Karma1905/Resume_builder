import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeMatch, generateCoverLetter } from '@/utils/api' // Actual API calls to backend
import { getResumeTextFromState } from '@/utils/resumeUtils' // Local utility for form data
import { useAuth } from '@/contexts/AuthContext';
import { Bot, FileText, TrendingUp, Edit3, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'; 

// Define the expected structure of the analysis result
interface AnalysisResult {
    match_score: number;
    summary: string;
    matching_keywords: string[];
    missing_keywords: string[];
    tailoring_suggestions: string[];
    error?: string;
}

// Define simple functional Tabs component using basic HTML/CSS
const SimpleTabs = ({ tabs, defaultValue }: { tabs: { title: string, value: string, content: React.ReactNode }[], defaultValue: string }) => {
    const [activeTab, setActiveTab] = useState(defaultValue);

    return (
        <div>
            <div style={{ display: 'flex', borderBottom: '1px solid #ddd' }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        style={{
                            padding: '10px 15px',
                            cursor: 'pointer',
                            border: 'none',
                            borderBottom: activeTab === tab.value ? '2px solid #3b82f6' : '2px solid transparent',
                            backgroundColor: 'transparent',
                            fontWeight: activeTab === tab.value ? 'bold' : 'normal',
                            color: activeTab === tab.value ? '#3b82f6' : '#6b7280',
                            transition: 'color 0.2s, border-bottom 0.2s',
                        }}
                    >
                        {tab.title}
                    </button>
                ))}
            </div>
            <div style={{ paddingTop: '16px' }}>
                {tabs.find(tab => tab.value === activeTab)?.content}
            </div>
        </div>
    );
};


export default function JobMatcherPage() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Attempt to pre-fill the resume text from state
    const initialResumeText = getResumeTextFromState();

    const [resumeText, setResumeText] = useState(initialResumeText);
    const [jdText, setJdText] = useState('');
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [coverLetter, setCoverLetter] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCoverLetter, setIsLoadingCoverLetter] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    // ✅ Helper function: converts structured resume to readable text
const formatResumeAsText = (data) => {
  const lines = [];

  if (data.fullName) lines.push(data.fullName);
  const contactInfo = [
    data.email,
    data.phone,
    data.location,
    data.linkedin,
    data.github,
    data.portfolio,
  ].filter(Boolean).join(" | ");
  if (contactInfo) lines.push(contactInfo);

  if (data.summary) lines.push("\nSUMMARY", data.summary);

  if (Array.isArray(data.skills) && data.skills.length) {
    lines.push("\nSKILLS");
    lines.push(data.skills.map((s) => s.name).join(", "));
  }

  if (Array.isArray(data.experiences) && data.experiences.length) {
    lines.push("\nEXPERIENCE");
    data.experiences.forEach((exp) => {
      lines.push(`${exp.title} - ${exp.company}`);
      if (exp.location) lines.push(exp.location);
      lines.push(`${exp.startDate || ""} - ${exp.endDate || "Present"}`);
      if (Array.isArray(exp.achievements)) {
        exp.achievements.forEach((a) => lines.push(`• ${a.description}`));
      }
      lines.push("");
    });
  }

  if (Array.isArray(data.education) && data.education.length) {
    lines.push("\nEDUCATION");
    data.education.forEach((edu) => {
      lines.push(`${edu.degree} - ${edu.school}`);
      if (edu.location) lines.push(edu.location);
      lines.push(`${edu.startDate || ""} - ${edu.endDate || "Present"}`);
    });
  }

  if (Array.isArray(data.projects) && data.projects.length) {
    lines.push("\nPROJECTS");
    data.projects.forEach((proj) => {
      lines.push(proj.name);
      if (proj.techStack) lines.push(`Tech: ${proj.techStack}`);
      if (Array.isArray(proj.achievements)) {
        proj.achievements.forEach((a) => lines.push(`• ${a.description}`));
      }
      lines.push("");
    });
  }

  return lines.join("\n");
};

// ✅ Auto-load the resume when user comes from TemplateEditor
useEffect(() => {
  const saved = localStorage.getItem("resume_for_job_match");
  if (saved) {
    try {
      const resume = JSON.parse(saved);
      const formattedText = formatResumeAsText(resume);
      setResumeText(formattedText);
    } catch (err) {
      console.error("Error reading resume_for_job_match", err);
    }
  }
}, []);


    // --- Conditional Return (must be after all hooks) ---
    if (!currentUser) {
        navigate('/login');
        return null;
    }
    
    // Clear cover letter state when starting a new analysis
    const clearPreviousResults = () => {
        setCoverLetter(null); 
    };

    const handleAnalyzeMatch = async () => {
        clearPreviousResults();
        if (!resumeText.trim() || !jdText.trim()) {
            setError("Please paste both your resume and the job description.");
            toast({ title: "Error", description: "Please paste both your resume and the job description.", variant: "destructive" });
            return;
        }

        setError('');
        setIsLoading(true);
        setAnalysisResult(null);

        try {
            const result: AnalysisResult = await analyzeMatch(resumeText, jdText); 
            
            if (result.error) {
                setError(result.error);
                toast({ title: "Error", description: result.error, variant: "destructive" });
            } else {
                setAnalysisResult(result);
            }
        } catch (err) {
            setError("An error occurred during AI analysis.");
            toast({ title: "Error", description: "An unexpected error occurred during AI analysis.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateCoverLetter = async () => {
        setIsLoadingCoverLetter(true);
        setError('');
        
        const userName = currentUser?.email || 'The Candidate';

        try {
            const letter = await generateCoverLetter(resumeText, jdText, userName);
            setCoverLetter(letter);
            toast({ title: "Success", description: "Cover letter generated!", duration: 3000 });
        } catch (err) {
            setError("An error occurred while generating the cover letter.");
            toast({ title: "Error", description: "An error occurred while generating the cover letter.", variant: "destructive" });
        } finally {
            setIsLoadingCoverLetter(false);
        }
    };

    const handleUploadClick = () => {
        // Triggers the hidden file input
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        setIsUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('resumeFile', file);

        try {
            // Call your new local backend endpoint
            // Your server runs on port 5000
            const response = await fetch('http://localhost:5000/api/extract-text', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'File upload failed');
            }

            const data = await response.json();
            

            setResumeText(data.text); 
            toast({ title: "Success", description: "Resume text extracted!" });

        } catch (err: any) {
            const errorMessage = err.message || "An unknown error occurred during file upload.";
            setError(errorMessage);
            toast({ title: "Upload Error", description: errorMessage, variant: "destructive" });
        } finally {
            setIsUploading(false);
            // Clear the file input so the same file can be uploaded again
            if(fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };
    
    // --- Tabs Data ---
    const tabsData = analysisResult ? [
        { 
            title: '✅ Found Keywords', 
            value: 'matching', 
            content: (
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                    {(analysisResult.matching_keywords || []).map((keyword, index) => (
                        <li key={`match-${index}`} style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                            <span style={{ color: '#3b82f6' }}>{keyword}</span>
                        </li>
                    ))}
                </ul>
            )
        },
        { 
            title: '❌ Missing Keywords', 
            value: 'missing', 
            content: (
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                    {(analysisResult.missing_keywords || []).map((keyword, index) => (
                        <li key={`missing-${index}`} style={{ fontSize: '14px', marginBottom: '8px' }}>
                            {keyword}
                        </li>
                    ))}
                </ul>
            )
        },
        { 
            title: '📝 Suggestions', 
            value: 'suggestions', 
            content: (
                <div>
                    {(analysisResult.tailoring_suggestions || []).map((suggestion, index) => (
                        <div 
                            key={`suggest-${index}`} 
                            style={{ 
                                padding: '12px', 
                                backgroundColor: '#eff6ff', 
                                borderLeft: '4px solid #60a5fa', 
                                color: '#1e40af', 
                                borderRadius: '4px', 
                                fontSize: '14px',
                                marginBottom: '12px',
                            }}
                        >
                            {suggestion}
                        </div>
                    ))}
                </div>
            )
        },
    ] : [];


    return (
        <div className="max-w-6xl mx-auto" style={{ padding: '20px' }}>
            
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx"
                style={{ display: 'none' }}
            />

            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
                <Bot className="inline-block w-6 h-6 mr-2 text-primary" /> AI Job Matcher
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '32px' }}>
                Paste your resume and a job description below to see how well you match!
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                
                {/* Your Resume Input (Card style simulation) */}
                <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', backgroundColor: 'white' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'semibold', marginBottom: '16px', display: 'flex', alignItems: 'center' }}><FileText style={{ width: '20px', height: '20px', marginRight: '8px' }} /> Your Resume</h2>
                    <textarea
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        placeholder="Paste your resume content here, or upload a file."
                        rows={15}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
                    />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                        <button
                            // --- THIS IS THE FIX: 'GoClick' changed to 'onClick' ---
                            onClick={handleUploadClick}
                            disabled={isUploading}
                            style={{ 
                                padding: '8px 12px', 
                                backgroundColor: isUploading ? '#9ca3af' : '#2563eb', // Gray when uploading
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '4px', 
                                cursor: 'pointer',
                                opacity: isUploading ? 0.7 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                fontWeight: '500'
                            }}
                        >
                            {isUploading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                    <span>Uploading...</span>
                                </>
                            ) : (
                                <>
                                    <Upload style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                                    Upload Resume
                                </>
                            )}
                        </button>
                        <button 
                            onClick={() => navigate('/editor/ai-import')} 
                            style={{ background: 'none', border: 'none', color: '#3b82f6', textDecoration: 'underline', padding: '0', cursor: 'pointer' }}
                        >
                            Or, edit your saved resume
                        </button>
                    </div>
                </div>

                {/* Job Description Input (Card style simulation) */}
                <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', backgroundColor: 'white' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'semibold', marginBottom: '16px', display: 'flex', alignItems: 'center' }}><TrendingUp style={{ width: '20px', height: '20px', marginRight: '8px' }} /> Job Description</h2>
                    <textarea
                        value={jdText}
                        onChange={(e) => setJdText(e.target.value)}
                        placeholder="Paste the job description here"
                        rows={15}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
                    />
                </div>
            </div>

            <button
                onClick={handleAnalyzeMatch}
                disabled={isLoading || isUploading || !resumeText.trim() || !jdText.trim()}
                style={{ width: '100%', padding: '15px', fontSize: '18px', fontWeight: 'bold', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', opacity: (isLoading || isUploading || !resumeText.trim() || !jdText.trim()) ? 0.6 : 1 }}
            >
                {isLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        AI is analyzing the match...
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bot style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                        Analyze Match
                    </div>
                )}
            </button>
            
            {/* --- DISPLAY RESULTS --- */}
            {analysisResult && !analysisResult.error && (
                <div style={{ marginTop: '32px', border: '1px solid #ccc', borderRadius: '8px', padding: '24px', backgroundColor: 'white' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '20px' }}>Analysis Results</h2>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: '#ebf5ff', borderRadius: '8px', marginBottom: '24px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 'semibold', color: '#1e40af' }}>Match Score</span>
                        <span style={{ fontSize: '36px', fontWeight: 'bold', color: analysisResult.match_score > 70 ? '#10b981' : '#f97316' }}>
                            {analysisResult.match_score}%
                        </span>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <h4 style={{ fontSize: '18px', fontWeight: 'semibold', marginBottom: '8px' }}>Summary</h4>
                        <p style={{ color: '#6b7280' }}>{analysisResult.summary || 'No summary provided.'}</p>
                    </div>

                    <SimpleTabs tabs={tabsData} defaultValue="matching" />

                    <div style={{ paddingTop: '24px', borderTop: '1px solid #ddd', marginTop: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>Next Step: Generate Cover Letter</h3>
                        <button 
                            onClick={handleGenerateCoverLetter} 
                            disabled={isLoadingCoverLetter}
                            style={{ width: '100%', padding: '15px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', opacity: isLoadingCoverLetter ? 0.6 : 1 }}
                        >
                            {isLoadingCoverLetter ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                    AI is writing your cover letter...
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Edit3 style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                                    Generate AI Cover Letter
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            )}
            
            {/* Display Cover Letter */}
            {coverLetter && (
                <div style={{ marginTop: '32px', border: '1px solid #ccc', borderRadius: '8px', padding: '24px', backgroundColor: 'white' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px' }}>Your AI-Generated Cover Letter</h2>
                    <textarea 
                        value={coverLetter} 
                        rows={20}
                        placeholder="Your generated cover letter will appear here."
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
                        onChange={(e) => setCoverLetter(e.target.value)} // Allow editing
                    />
                    <button 
                        onClick={() => navigator.clipboard.writeText(coverLetter || '')} 
                        style={{ width: '100%', padding: '12px', marginTop: '16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        Copy to Clipboard
                    </button>
                </div>
            )}
        </div>
    );
}