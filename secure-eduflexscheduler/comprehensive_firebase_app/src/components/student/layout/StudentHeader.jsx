
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-800/50 backdrop-blur-md shadow-lg sticky top-0 z-40 md:relative">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
             <Link to="/student/dashboard-overview" className="flex-shrink-0 flex items-center">
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <img  className="h-10 w-10" alt="School Mascot Logo" src="https://images.unsplash.com/photo-1552254180-c5c6cc816afd" />
                </motion.div>
                 <span className="ml-3 text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
                    Student Portal
                </span>
              </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-300 hidden sm:block">
              {user?.profile?.first_name || user?.email}
            </span>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
            >
              <LogOut className="mr-1.5 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;
