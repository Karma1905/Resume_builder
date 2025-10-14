import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadResumeFile } from '@/utils/api'
import { useAuth } from '@/contexts/AuthContext'; // Using your existing AuthContext
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, Upload, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'; 

export default function AIBuilderPage() {

    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast(); 

    const [modelChoice, setModelChoice] = useState('Llama 3.1');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    // --- Conditional Return (must be after all hooks) ---
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
            // Your API call to the new backend endpoint (Python logic)
            const apiResponse = await uploadResumeFile(selectedFile, modelChoice);

            if (apiResponse.error) {
                setError(apiResponse.error);
                toast({ title: "Error", description: apiResponse.error, variant: "destructive" });
            } else {
                // Store the response globally (e.g., via Context or Zustand)
                localStorage.setItem('ai_enhanced_resume_data', JSON.stringify(apiResponse));
                
                toast({ title: "Success", description: "Enhancement successful! Redirecting to the editor.", duration: 3000 });
                navigate('/ai-builder/result');

            }
        } catch (err) {
            console.error(err);
            setError("An unexpected error occurred during the enhancement process.");
            toast({ title: "Error", description: "An unexpected error occurred. Please try again.", variant: "destructive" });
        } finally {
            setIsLoading(false);
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
                        disabled={isLoading}
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
                    {/* File uploader equivalent to st.file_uploader */}
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

                    <Button 
                        onClick={handleFileUpload} 
                        disabled={isLoading || !selectedFile}
                        className="w-full btn-hero"
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                {`AI is enhancing your resume using ${modelChoice}...`}
                            </div>
                        ) : (
                            <>
                                <Zap className="w-4 h-4 mr-2" />
                                Enhance and Edit
                            </>
                        )}
                    </Button>
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
        </motion.div>
    );
}
