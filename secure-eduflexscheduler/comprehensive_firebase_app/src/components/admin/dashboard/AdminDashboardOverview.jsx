
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Settings, BarChart3, CalendarCheck, Database, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom'; // Added useNavigate

const AdminDashboardOverview = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // Initialized useNavigate

  // Placeholder data - replace with actual data fetching from adminApiService
  const stats = [
    { title: "Total Users", value: 150, icon: Users, color: "text-sky-400", path: "/admin/users" },
    { title: "System Settings", value: "Manage", icon: Settings, color: "text-emerald-400", path: "/admin/system-config" },
    { title: "Active Tenants", value: 1, icon: ShieldAlert, color: "text-orange-400", path: "/admin/tenants" },
    { title: "Pending Tours", value: 5, icon: CalendarCheck, color: "text-purple-400", path: "/admin/parent-tours" },
  ];

  const quickActions = [
    { label: "Manage Users", path: "/admin/users", icon: Users },
    { label: "Configure System", path: "/admin/system-config", icon: Settings },
    { label: "View Reports", path: "/admin/reports", icon: BarChart3 },
    { label: "Schedule Parent Tour", path: "/admin/parent-tours", icon: CalendarCheck },
    { label: "Data Tools", path: "/admin/data-tools", icon: Database },
  ];


  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 mb-2">
          Administrator Dashboard
        </h1>
        <p className="text-lg text-gray-400">Oversee and manage the entire system.</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } }
        }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
            className="hover:shadow-yellow-500/20 transition-shadow duration-300 rounded-lg"
          >
            <Card className="bg-slate-800/60 border-slate-700/50 shadow-xl h-full cursor-pointer" onClick={() => stat.path && navigate(stat.path)}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                {stat.description && <p className="text-xs text-gray-500 pt-1">{stat.description}</p>}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-slate-800/60 border-slate-700/50 shadow-xl">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-200">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {quickActions.map(action => (
                    <button
                        key={action.label}
                        onClick={() => navigate(action.path)}
                        className="flex flex-col items-center justify-center p-4 bg-slate-700/50 hover:bg-slate-700/80 rounded-lg transition-all duration-200 aspect-square group"
                    >
                        <action.icon className="h-8 w-8 text-yellow-400 mb-2 transition-transform group-hover:scale-110" />
                        <span className="text-xs text-center text-slate-300 group-hover:text-yellow-300">{action.label}</span>
                    </button>
                ))}
            </CardContent>
        </Card>
      </motion.div>

      {/* Placeholder for recent activity or critical alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-slate-800/60 border-slate-700/50 shadow-xl">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-200">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-slate-400">System activity log or important notifications will be shown here.</p>
            </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminDashboardOverview;
