
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, CalendarDays, BookOpen, UserCheck, Bell, Settings, LogOut, UserCircle as ProfileIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentNav = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: "Dashboard", path: "/student/dashboard-overview", icon: LayoutDashboard },
    { name: "My Schedule", path: "/student/schedule", icon: CalendarDays },
    { name: "Browse Classes", path: "/student/browse-classes", icon: BookOpen },
    { name: "Appointments", path: "/student/appointments", icon: UserCheck },
    { name: "Notifications", path: "/student/notifications", icon: Bell },
  ];

  const bottomNavItems = [
    { name: 'Settings', path: '/student/settings', icon: Settings }, // Placeholder
    { name: 'Logout', action: handleLogout, icon: LogOut },
  ];

  const linkVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    hover: { scale: 1.05, color: "#67e8f9" }, // sky-300
    tap: { scale: 0.95 }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="w-64 bg-slate-800/70 backdrop-blur-md p-6 flex-col shadow-2xl md:min-h-screen border-r border-slate-700 hidden md:flex"
      >
        <div className="flex items-center mb-10">
          <ProfileIcon className="h-10 w-10 text-sky-400 mr-3" />
          <div>
            <h2 className="text-xl font-semibold text-sky-300">{user?.profile?.first_name} {user?.profile?.last_name}</h2>
            <p className="text-xs text-slate-400 capitalize">{user?.role} Portal</p>
          </div>
        </div>

        <nav className="flex-grow space-y-2">
          {navItems.map((item, index) => (
            <motion.div 
              key={item.name} 
              variants={linkVariants} 
              initial="initial" 
              animate="animate" 
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={item.path}
                className={`
                  flex items-center px-4 py-3 rounded-lg transition-all duration-200 ease-in-out group
                  ${
                    location.pathname === item.path
                      ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg scale-105 font-medium"
                      : "text-gray-400 hover:bg-slate-700/50 hover:text-gray-100 hover:scale-105 transform"
                  }
                `}
              >
                <item.icon className={`mr-3 h-5 w-5 transition-colors group-hover:text-sky-300 ${location.pathname === item.path ? "text-white" : ""}`} />
                <span>{item.name}</span>
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-700/50 space-y-2">
          {bottomNavItems.map((item, index) => (
            <motion.div 
              key={item.name + '-desktop-bottom'} 
              variants={linkVariants} 
              initial="initial" 
              animate="animate" 
              transition={{ delay: (navItems.length + index) * 0.05 }}
            >
              {item.path ? (
                  <Link
                    to={item.path}
                    className={`flex items-center py-2.5 px-4 rounded-lg transition-colors duration-200
                      ${location.pathname === item.path ? 'bg-sky-500/10 text-sky-300' : 'text-slate-400 hover:bg-slate-700/50 hover:text-sky-400'}`
                    }
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
              ) : (
                  <Button
                    variant="ghost"
                    onClick={item.action}
                    className="w-full flex items-center justify-start py-2.5 px-4 text-slate-400 hover:bg-red-500/20 hover:text-red-300 transition-colors duration-200"
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Button>
              )}
            </motion.div>
          ))}
        </div>
      </motion.aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800/80 backdrop-blur-md border-t border-slate-700/50 p-1.5 flex justify-around shadow-top-lg z-50">
        {navItems.map((item) => (
          <Link
            key={item.name + "-mobile"}
            to={item.path}
            className={`
              flex flex-col items-center justify-center p-2 rounded-md transition-colors w-1/5
              ${
                location.pathname === item.path
                  ? "text-sky-400 bg-sky-500/10"
                  : "text-gray-400 hover:text-sky-300"
              }
            `}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] mt-1 truncate">{item.name}</span>
          </Link>
        ))}
      </nav>
    </>
  );
};

export default StudentNav;
