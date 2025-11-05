import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadResumeFile } from '@/utils/api'
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, Upload, FileText, Lightbulb, Check, X } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { ResumeData, Skill } from '@/types/resume';

interface AIResponse {
  analysis: {
    detectedRole: string;
    missingSkills: Skill[];
  };
  resumeData: ResumeData;
}

interface CritiqueResult {
  overall_feedback: string;
  summary_suggestions: string[];
  experience_suggestions: string[];
  skills_suggestions: string[];
  error?: string;
}

export default function AIBuilderPage() {

    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast(); 

    const [modelChoice, setModelChoice] = useState('Llama 3.1');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [isCritiquing, setIsCritiquing] = useState(false);
    const [suggestions, setSuggestions] = useState<CritiqueResult | null>(null);
    const [isCritiqueModalOpen, setIsCritiqueModalOpen] = useState(false);

    const [apiResponse, setApiResponse] = useState<AIResponse | null>(null);
    const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
    const [selectedMissingSkills, setSelectedMissingSkills] = useState<Skill[]>([]);
    
    if (!currentUser) {
        navigate('/login');
        return null;
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            setSelectedFile(file);
            setError('');
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            setError("Please select a file to upload.");
            toast({ title: "Error", description: "Please select a file to upload.", variant: "destructive" });
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const response: AIResponse = await uploadResumeFile(selectedFile, modelChoice);

            if (!response.resumeData || !response.analysis) {
                throw new Error( (response as any).error || "Invalid response from AI." );
            }
            
            setApiResponse(response);
            
            setSelectedMissingSkills(response.analysis.missingSkills || []);
            
            setIsSkillModalOpen(true); 

        } catch (err: any) {
            console.error(err);
            const errorMessage = err.message || "An unexpected error occurred.";
            setError(errorMessage);
            toast({ title: "Error", description: errorMessage, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleContinueToEditor = () => {
        if (!apiResponse) return;

        let finalResumeData = { ...apiResponse.resumeData };

        if (selectedMissingSkills.length > 0) {
            finalResumeData.skills = [
                ...finalResumeData.skills,
                ...selectedMissingSkills
            ];
        }

        localStorage.setItem('ai_enhanced_resume_data', JSON.stringify(finalResumeData));
        
        setIsSkillModalOpen(false);
        toast({ title: "Success", description: "Enhancement successful! Redirecting to the editor.", duration: 3000 });
        navigate('/ai-builder/result');
    };

    const handleViewSuggestions = async () => {
        if (!selectedFile) {
            setError("Please select a file to upload.");
            toast({ title: "Error", description: "Please select a file to upload.", variant: "destructive" });
            return;
        }
        setError('');
        setIsCritiquing(true);
        setSuggestions(null);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('http://localhost:5000/api/critique-resume', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (!response.ok || data.error) {
                throw new Error(data.error || 'Failed to get suggestions.');
            }
            setSuggestions(data);
            setIsCritiqueModalOpen(true);
        } catch (err: any) {
            const errorMessage = err.message || "An unexpected error occurred.";
            setError(errorMessage);
            toast({ title: "Error", description: errorMessage, variant: "destructive" });
        } finally {
            setIsCritiquing(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto py-8"
        >
            <h1 className="text-3xl font-bold text-foreground mb-2">
                <Zap className="inline-block w-6 h-6 mr-2 text-primary" /> AI-Powered Resume Builder
            </h1>
            <p className="text-muted-foreground mb-8">
                Upload your existing resume and let AI parse and enhance its content for the editor.
            </p>

             <Card className="card-professional mb-6">
                 <CardHeader>
                     <CardTitle>AI Model Selection</CardTitle>
                 </CardHeader>
                 <CardContent>
                     <Select 
                         value={modelChoice} 
                         onValueChange={setModelChoice}
                         disabled={isLoading || isCritiquing}
                     >
                         <SelectTrigger className="w-[180px]">
                             <SelectValue placeholder="Choose AI Model" />
                         </SelectTrigger>
                         <SelectContent>
                             <SelectItem value="Llama 3.1">Llama 3.1</SelectItem>
                             <SelectItem value="Gemini 1.5">Gemini 1.5</SelectItem>
                         </SelectContent>
                     </Select>
                 </CardContent>
             </Card>

            <Card className="card-professional">
                <CardHeader>
                    <CardTitle>Resume File Upload</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div 
                        className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors"
                        onClick={() => document.getElementById('file-upload-input')?.click()}
                    >
                        <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-muted-foreground">
                            Drag and drop your resume here (.pdf, .docx, .txt) or click to browse
                        </p>
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                            accept=".pdf,.docx,.txt"
                            style={{ display: 'none' }}
                            id="file-upload-input"
                        />
                    </div>
                    {selectedFile && (
                        <p className="text-sm font-medium">Selected File: 
                            <span className="text-primary ml-1">{selectedFile.name}</span>
                        </p>
                    )}

                    {error && (
                        <p className="text-sm text-red-500 font-medium">Error: {error}</p>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button 
                            onClick={handleFileUpload} 
                            disabled={isLoading || isCritiquing || !selectedFile}
                            className="w-full btn-hero"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                    {`AI is enhancing...`}
                                </div>
                            ) : (
                                <>
                                    <Zap className="w-4 h-4 mr-2" />
                                    Enhance and Edit
                                </>
                            )}
                        </Button>
                        
                        <Dialog open={isCritiqueModalOpen} onOpenChange={setIsCritiqueModalOpen}>
                            <DialogTrigger asChild>
                                <Button 
                                    onClick={handleViewSuggestions} 
                                    disabled={isLoading || isCritiquing || !selectedFile}
                                    className="w-full"
                                    variant="outline"
                                >
                                    {isCritiquing ? (
                                        <div className="flex items-center">
                                            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2" />
                                            {`Getting suggestions...`}
                                        </div>
                                    ) : (
                                        <>
                                            <Lightbulb className="w-4 h-4 mr-2" />
                                            View Suggestions
                                        </>
                                    )}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>
            
            <div className="mt-8 text-center">
                 <p className="text-muted-foreground mb-4">
                     Prefer to start from scratch or choose a template?
                 </p>
                 <Button 
                     onClick={() => navigate('/create-resume')}
                     variant="outline"
                 >
                     <FileText className="w-4 h-4 mr-2" />
                     Browse Templates
                 </Button>
            </div>

            <Dialog open={isSkillModalOpen} onOpenChange={setIsSkillModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">We found some missing skills!</DialogTitle>
                        <p className="text-sm text-muted-foreground pt-2">
                            Based on your resume, it looks like you're a 
                            <strong className="text-primary px-1">{apiResponse?.analysis.detectedRole}</strong>.
                            Do you want to add these common skills?
                        </p>
                    </DialogHeader>
                    <div className="py-4 space-y-3">
                        {apiResponse?.analysis.missingSkills.map((skill) => (
                            <div key={skill.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={skill.id}
                                    defaultChecked={true}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setSelectedMissingSkills(prev => [...prev, skill]);
                                        } else {
                                            setSelectedMissingSkills(prev => prev.filter(s => s.id !== skill.id));
                                        }
                                    }}
                                />
                                <Label htmlFor={skill.id} className="font-medium">{skill.name}</Label>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button onClick={handleContinueToEditor} className="w-full">
                            Add Skills & Continue to Editor
                        </Button>
                        <Button onClick={() => {
                            setSelectedMissingSkills([]);
                            handleContinueToEditor();
                        }} variant="ghost" className="w-full">
                            Skip
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </motion.div>
    );
}
