import { motion, Variants } from 'framer-motion';
import { FileText, Plus, Zap, Bot, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const gridItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', damping: 12, stiffness: 100 },
  },
};

export default function CreateResume() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showTemplates, setShowTemplates] = useState(true); 

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
            <Button onClick={() => navigate('/login')} className="btn-hero w-full">
              Log In
            </Button>
            <Button onClick={() => navigate('/signup')} className="btn-outline-hero w-full">
              Sign Up
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  const templates = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Clean and modern design perfect for corporate roles',
      image: '/template-professional.png',
      popular: true,
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Eye-catching design for creative professionals',
      image: '/template-creative.png',
      popular: false,
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'Sophisticated layout for senior-level positions',
      image: '/template-executive.png',
      popular: false,
    },
  ];

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
          Choose a template or use our AI builder to get started
        </p>
      </motion.div>


      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {/* Start from Scratch */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          className="bg-white border border-border rounded-xl shadow-sm p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Start from Scratch</h3>
                <p className="text-muted-foreground">Build your resume step by step</p>
              </div>
            </div>
          </div>
          <Button
            className="btn-hero w-full mt-4"
            onClick={() => setShowTemplates((prev) => !prev)}
          >
            {showTemplates ? 'Hide Templates' : 'Show Templates'}
          </Button>
        </motion.div>

        {/* AI Builder */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
          className="bg-white border border-border rounded-xl shadow-sm p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-sm">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">AI-Powered Builder</h3>
                <p className="text-muted-foreground">Upload your resume and let AI enhance it</p>
              </div>
            </div>
          </div>
          <Button 
            className="btn-hero w-full mt-4"
            onClick={() => navigate('/ai-builder')}
          >
            <Zap className="mr-2 w-4 h-4" />
            Use AI Builder
          </Button>
        </motion.div>

        {/* AI Job Matcher */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
          className="bg-white border border-border rounded-xl shadow-sm p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-gradient-to-r from-blue-600 to-cyan-500 shadow-sm">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">AI Job Matcher</h3>
                <p className="text-muted-foreground">Compare your resume with job descriptions</p>
              </div>
            </div>
          </div>
          <Button 
            className="btn-hero w-full mt-4"
            onClick={() => navigate('/job-matcher')}
          >
            <Bot className="mr-2 w-4 h-4" />
            Try Job Matcher
          </Button>
        </motion.div>
      </div>

      {/* Templates */}
      {showTemplates && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Choose a Template
          </h2>

          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            variants={gridContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {templates.map((template) => (
              <motion.div
                key={template.id}
                variants={gridItemVariants}
                whileHover={{ scale: 1.03, y: -5 }} 
                className="card-professional group cursor-pointer transition-all duration-300"
              >
                <div className="relative flex flex-col h-full"> 
                  {template.popular && (
                    <div className="absolute -top-2 -right-2 bg-accent text-white text-xs px-3 py-1 rounded-full flex items-center z-10">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </div>
                  )}
                  <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden border">
                    <img 
                      src={template.image} 
                      alt={`${template.name} template preview`}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {template.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {template.description}
                  </p> 
                  <Button
                    className="btn-outline-hero w-full mt-auto group-hover:btn-hero transition-all duration-300"
                    onClick={() => navigate(`/editor/${template.id}`)}
                  >
                    Use Template
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
