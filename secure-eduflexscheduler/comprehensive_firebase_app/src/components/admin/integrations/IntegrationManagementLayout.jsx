
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Settings, ListTree, Shuffle, History, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Providers', path: 'providers', icon: ListTree },
  { name: 'Instances', path: 'instances', icon: Settings },
  { name: 'Data Mappings', path: 'mappings', icon: Shuffle },
  { name: 'Sync Logs', path: 'sync-logs', icon: History },
  // { name: 'Security', path: 'security', icon: ShieldCheck }, // Example for future
];

const IntegrationManagementLayout = () => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Data Integration System</h1>
        <p className="text-slate-400">Manage connections with external systems like Google, ClassLink, and SIS platforms.</p>
      </motion.div>

      <Card className="bg-slate-800/60 border-slate-700 shadow-xl">
        <CardContent className="p-0">
          <nav className="flex flex-wrap border-b border-slate-700">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-150 ease-in-out
                  ${isActive 
                    ? 'border-sky-500 text-sky-400 bg-sky-500/10' 
                    : 'border-transparent text-slate-400 hover:text-sky-300 hover:border-sky-400/50'
                  }`
                }
              >
                <item.icon className="mr-2 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationManagementLayout;
