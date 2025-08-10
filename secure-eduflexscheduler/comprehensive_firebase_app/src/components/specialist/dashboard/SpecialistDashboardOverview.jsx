
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, Users, Activity, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const SpecialistDashboardOverview = () => {
  const { user } = useAuth();
  // Placeholder data - replace with actual data fetching
  const stats = [
    { title: "Upcoming Appointments", value: 5, icon: CalendarClock, color: "text-sky-400" },
    { title: "Active Student Groups", value: 3, icon: Users, color: "text-emerald-400" },
    { title: "Pending Notes", value: 2, icon: Activity, color: "text-amber-400" },
    { title: "New Notifications", value: 1, icon: Bell, color: "text-rose-400" },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 mb-2">
          Welcome, {user?.profile?.first_name || 'Specialist'}!
        </h1>
        <p className="text-lg text-gray-400">Your specialist dashboard overview.</p>
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
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1 }
            }}
          >
            <Card className="bg-slate-800/60 border-slate-700/50 shadow-xl hover:shadow-pink-500/20 transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-slate-800/60 border-slate-700/50 shadow-xl h-full">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-200 flex items-center">
                <CalendarClock className="mr-3 h-6 w-6 text-sky-400" />
                Today's Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">Appointment list will go here.</p>
              {/* Placeholder for UpcomingAppointmentsList */}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-slate-800/60 border-slate-700/50 shadow-xl h-full">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-200 flex items-center">
                <Users className="mr-3 h-6 w-6 text-emerald-400" />
                Student Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">Student search component will go here.</p>
              {/* Placeholder for StudentSearch */}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SpecialistDashboardOverview;
