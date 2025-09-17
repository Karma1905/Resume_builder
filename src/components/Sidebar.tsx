import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, FileText, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      onClose();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const navigationItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
    },
    {
      name: 'Create Resume',
      href: '/create-resume',
      icon: FileText,
    },
  ];

  const authItems = currentUser
    ? [
        {
          name: 'Logout',
          href: '#',
          icon: LogOut,
          onClick: handleLogout,
        },
      ]
    : [
        {
          name: 'Login',
          href: '/login',
          icon: LogIn,
        },
        {
          name: 'Sign Up',
          href: '/signup',
          icon: User,
        },
      ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 200,
          }}
          className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border shadow-xl z-50"
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <div>
                  <h2 className="font-bold text-lg text-foreground">Resume Builder</h2>
                  <p className="text-sm text-muted-foreground">Create your perfect resume</p>
                </div>
              </div>
            </div>

            {/* User Info */}
            {currentUser && (
              <div className="p-4 border-b border-border bg-muted/30">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">Welcome back!</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Navigation
                  </h3>
                  {navigationItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'nav-link',
                          isActive && 'nav-link-active'
                        )
                      }
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </NavLink>
                  ))}
                </div>

                <div className="pt-4">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Account
                  </h3>
                  {authItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={item.onClick || (() => {
                        if (item.href !== '#') {
                          navigate(item.href);
                          onClose();
                        }
                      })}
                      className="nav-link w-full text-left"
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
              
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}