import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Sidebar } from './Sidebar';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Dynamic page title mapping
  const getPageTitle = () => {
    const pathMap: Record<string, string> = {
      '/': 'Home',
      '/create-resume': 'Create Resume',
      '/login': 'Login',
      '/signup': 'Sign Up',
      '/ai-builder': 'AI Builder',
      '/ai-builder/result': 'AI Builder Result',
      '/editor/ai-import': 'AI Resume Editor',
      '/job-matcher': 'Job Matcher',
    };

    // Return matching title or default one
    return pathMap[location.pathname] || 'Resume Builder';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Overlay when sidebar opens */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div>
        {/* Header */}
        <header className="bg-white border-b border-border shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/')}
                  className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center hover:scale-105 transform transition-all duration-200 hover:shadow-glow"
                >
                  <span className="text-white font-bold text-sm">R</span>
                </button>
                <h1 className="text-xl font-semibold text-foreground">
                  {getPageTitle()}
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
