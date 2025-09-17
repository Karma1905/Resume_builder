import { motion } from 'framer-motion';
import { FileText, Plus, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ResumeForm } from '@/components/ResumeForm';
import { useState } from 'react';


export default function CreateResume() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);

  

  if (!currentUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="card-professional max-w-md mx-auto">
          <FileText className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Authentication Required
          </h2>
          <p className="text-muted-foreground mb-6">
            Please log in or sign up to start creating your resume.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/login')}
              className="btn-hero w-full"
            >
              Log In
            </Button>
            <Button 
              onClick={() => navigate('/signup')}
              className="btn-outline-hero w-full"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  const templates = [
    {
      id: 1,
      name: 'Professional',
      description: 'Clean and modern design perfect for corporate roles',
      popular: true,
    },
    {
      id: 2,
      name: 'Creative',
      description: 'Eye-catching design for creative professionals',
      popular: false,
    },
    {
      id: 3,
      name: 'Executive',
      description: 'Sophisticated layout for senior-level positions',
      popular: false,
    },
  ];

  if (showForm) {
    return <ResumeForm onBack={() => setShowForm(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Create Your Resume
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose a template to get started or create a new resume from scratch
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 gap-6 mb-12"
      >
        <div className="card-hero">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mr-4">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">Start from Scratch</h3>
              <p className="text-muted-foreground">Build your resume step by step</p>
            </div>
          </div>
          <Button 
            className="btn-hero w-full"
            onClick={() => setShowForm(true)}>
            <Plus className="mr-2 w-4 h-4" />
            Create New Resume
          </Button>
        </div>

        <div className="card-professional">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">AI-Powered Builder</h3>
              <p className="text-muted-foreground">Let AI help you create content</p>
            </div>
          </div>
          <Button className="btn-outline-hero w-full">
            <Zap className="mr-2 w-4 h-4" />
            Coming Soon
          </Button>
        </div>
      </motion.div>

      {/* Templates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Choose a Template
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="card-professional group cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="relative">
                {template.popular && (
                  <div className="absolute -top-2 -right-2 bg-accent text-white text-xs px-3 py-1 rounded-full flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </div>
                )}
                
                <div className="w-full h-48 bg-gradient-subtle rounded-lg mb-4 flex items-center justify-center">
                  <FileText className="w-16 h-16 text-primary" />
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {template.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {template.description}
                </p>
                
                <Button className="btn-outline-hero w-full group-hover:btn-hero transition-all duration-300">
                  Use Template
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Resumes - Coming Soon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16"
      >
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Recent Resumes
        </h2>
        <div className="card-professional text-center py-12">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No resumes yet
          </h3>
          <p className="text-muted-foreground">
            Your created resumes will appear here for easy access
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}