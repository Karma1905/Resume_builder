import { motion } from 'framer-motion';
import { FileText, Users, Trophy, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: 'Professional Templates',
      description: 'Choose from dozens of professionally designed resume templates.',
    },
    {
      icon: Users,
      title: 'ATS-Friendly',
      description: 'Our resumes are optimized to pass through applicant tracking systems.',
    },
    {
      icon: Trophy,
      title: 'Land More Interviews',
      description: 'Stand out from the competition with a perfectly crafted resume.',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-16 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 bg-accent-light rounded-full text-accent font-medium text-sm mb-8"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Professional Resume Builder
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Create Your Perfect
            <span className="bg-gradient-primary bg-clip-text text-transparent block">
              Professional Resume
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Build a stunning resume that gets you noticed. Our AI-powered builder helps you create 
            professional resumes that land interviews.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/create-resume')}
              className="btn-hero text-lg px-8 py-4"
            >
              Start Building
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            {!currentUser && (
              <Button 
                onClick={() => navigate('/signup')}
                className="btn-outline-hero text-lg px-8 py-4"
              >
                Sign Up Free
              </Button>
            )}
          </div>

          {currentUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 p-4 bg-primary-light rounded-lg"
            >
              <p className="text-primary font-medium">
                Welcome back! Ready to continue building your resume?
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="py-16 bg-gradient-subtle"
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Why Choose Our Resume Builder?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="card-professional text-center hover:shadow-xl"
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="py-16 text-center"
      >
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of professionals who have landed their dream jobs with our resume builder.
          </p>
          
          <Button 
            onClick={() => navigate(currentUser ? '/create-resume' : '/signup')}
            className="btn-hero text-lg px-8 py-4"
          >
            {currentUser ? 'Create Resume' : 'Get Started Free'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}