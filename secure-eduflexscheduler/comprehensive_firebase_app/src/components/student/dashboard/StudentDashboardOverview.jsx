
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchStudentDashboardData } from '@/lib/services/studentApiService';
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CalendarCheck, BookOpen, BarChart3, BellRing } from 'lucide-react';
import ScheduleWidget from './ScheduleWidget';
import EnrollmentWidget from './EnrollmentWidget';
import CreditProgressWidget from './CreditProgressWidget';
import NotificationCenter from './NotificationCenter';

const StudentDashboardOverview = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.profile?.id || !user?.email) {
        setError("User profile not fully loaded. Please try again.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const data = await fetchStudentDashboardData(user.profile.id, user.email);
        setDashboardData(data);
      } catch (err) {
        console.error("Failed to load student dashboard data:", err);
        setError(err.message || "Could not load dashboard information.");
        toast({
          title: "Error Loading Dashboard",
          description: err.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-10">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-500"></div>
        <p className="ml-4 text-xl font-semibold text-gray-300">Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-full p-10 bg-red-900/20 rounded-lg shadow-xl"
      >
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-semibold text-red-300 mb-2">Oops! Something went wrong.</h2>
        <p className="text-red-400 text-center max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg shadow-md transition-colors"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  if (!dashboardData) {
     return (
      <div className="flex items-center justify-center h-full p-10">
        <p className="text-xl font-semibold text-gray-400">No dashboard data available.</p>
      </div>
    );
  }

  const stats = [
    { title: "Upcoming Classes", value: dashboardData.registrations ? Object.keys(dashboardData.registrations).length : 0, icon: CalendarCheck, color: "text-sky-400" },
    { title: "Available Seminars", value: dashboardData.seminars?.filter(s => !s.is_locked).length || 0, icon: BookOpen, color: "text-emerald-400" },
    { title: "Credits Earned", value: dashboardData.studentProfile?.total_credits || 0, icon: BarChart3, color: "text-amber-400" },
    { title: "Notifications", value: dashboardData.notifications?.filter(n => !n.read).length || 0, icon: BellRing, color: "text-rose-400" },
  ];


  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-400 to-indigo-500 mb-2">
          Welcome, {user?.profile?.first_name || 'Student'}!
        </h1>
        <p className="text-lg text-gray-400">Here's what's happening today.</p>
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
            <Card className="bg-slate-800/60 border-slate-700/50 shadow-xl hover:shadow-sky-500/20 transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                {/* <p className="text-xs text-gray-500 pt-1">+2 from last day</p> */}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ScheduleWidget 
            schedule={dashboardData.registrations} 
            seminars={dashboardData.seminars} 
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <NotificationCenter notifications={dashboardData.notifications} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <EnrollmentWidget 
            availableSeminars={dashboardData.seminars?.filter(s => !s.is_locked)} 
            currentRegistrations={dashboardData.registrations}
            studentUserId={user?.profile?.id}
            tenantId={user?.profile?.tenant_id}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <CreditProgressWidget credits={dashboardData.studentProfile?.credits_summary} />
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboardOverview;
