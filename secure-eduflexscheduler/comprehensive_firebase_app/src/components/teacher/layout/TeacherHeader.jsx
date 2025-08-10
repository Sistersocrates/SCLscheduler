
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const TeacherHeader = () => {
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
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            >
              <UserCircle className="h-8 w-8 text-sky-400" />
            </motion.div>
            <span className="ml-3 text-xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-400">
              Teacher Dashboard
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-300 hidden sm:block">
              {user?.profile?.first_name} {user?.profile?.last_name}
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

export default TeacherHeader;
