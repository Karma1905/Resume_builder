import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import Home from "./pages/Home";
import CreateResume from "./pages/CreateResume";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import TemplateEditorPage from "./pages/TemplateEditorPage";
import AIBuilderPage from "./pages/AIbuilder";
import JobMatcherPage from "./pages/Jobmatcher";
import AIPreviewPage from "@/pages/AIpreviewpage";
import AIBuilderResultPage from "@/pages/AIbuilderResultPage";


const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path="create-resume" element={<CreateResume />} />
                            
                            {/* --- NEW AI ROUTES --- */}
                            <Route path="ai-builder" element={<AIBuilderPage />} />
                            <Route path="job-matcher" element={<JobMatcherPage />} />
                            {/* --- END NEW AI ROUTES --- */}
                            
                            <Route path="login" element={<Login />} />
                            <Route path="signup" element={<Signup />} />
                            
                            {/* Updated Editor Route to handle AI Import (ai-import segment not used in routing but maintained for clarity) */}
                            <Route path="editor/:templateId" element={<TemplateEditorPage />} />
                            <Route path="/preview/ai-result" element={<AIPreviewPage />} />
                            <Route path="/ai-builder/result" element={<AIBuilderResultPage />} />

                            {/* CATCH-ALL "*" ROUTE */}
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
