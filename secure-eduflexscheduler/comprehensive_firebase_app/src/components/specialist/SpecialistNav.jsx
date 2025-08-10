
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { CalendarClock, Users, ClipboardList, Presentation, LogOut, Settings, UserCircle, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const SpecialistNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Appointments', path: '/specialist/appointments', icon: CalendarClock },
    { name: 'My Schedule', path: '/specialist/my-schedule', icon: ClipboardList },
    { name: 'Student Viewer', path: '/specialist/student-viewer', icon: Users },
    { name: 'Student Groups', path: '/specialist/student-groups', icon: Users },
    { name: 'Special Events', path: '/specialist/special-events', icon: Presentation },
    { name: 'Notifications', path: '/specialist/notifications', icon: Bell },
  ];

  const bottomNavItems = [
    { name: 'Settings', path: '/specialist/settings', icon: Settings },
    { name: 'Logout', action: handleLogout, icon: LogOut },
  ];

  const linkVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    hover: { scale: 1.05, color: "#67e8f9" },
    tap: { scale: 0.95 }
  };

  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="w-full md:w-64 bg-slate-800/70 backdrop-blur-md p-6 flex flex-col shadow-2xl md:min-h-screen border-r border-slate-700"
    >
      <div className="flex items-center mb-10">
        <UserCircle className="h-10 w-10 text-sky-400 mr-3" />
        <div>
          <h2 className="text-xl font-semibold text-sky-300">{user?.profile?.first_name} {user?.profile?.last_name}</h2>
          <p className="text-xs text-slate-400 capitalize">{user?.role} Dashboard</p>
        </div>
      </div>

      <nav className="flex-grow space-y-2">
        {navItems.map((item, index) => (
          <motion.div key={item.name} variants={linkVariants} initial="initial" animate="animate" transition={{ delay: index * 0.1 }}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center py-2.5 px-4 rounded-lg transition-all duration-200 ease-in-out
                 ${isActive 
                    ? 'bg-sky-500/20 text-sky-300 shadow-inner border-l-4 border-sky-400' 
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-sky-400'}`
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-700/50 space-y-2">
        {bottomNavItems.map((item, index) => (
           <motion.div key={item.name} variants={linkVariants} initial="initial" animate="animate" transition={{ delay: (navItems.length + index) * 0.1 }}>
             {item.path ? (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center py-2.5 px-4 rounded-lg transition-colors duration-200
                    ${isActive 
                        ? 'bg-sky-500/20 text-sky-300' 
                        : 'text-slate-400 hover:bg-slate-700/50 hover:text-sky-400'}`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
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
  );
};

export default SpecialistNav;
