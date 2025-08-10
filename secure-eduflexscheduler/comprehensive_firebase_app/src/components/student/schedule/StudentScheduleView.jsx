
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { fetchStudentSchedule, getPeriodsConfig } from '@/lib/services/studentApiService';
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Printer, Download, AlertCircle, Clock, MapPin, User, BookOpen, Users } from 'lucide-react';
import * as XLSX from "xlsx";

const StudentScheduleView = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const periods = getPeriodsConfig();

  useEffect(() => {
    const loadSchedule = async () => {
      if (!user?.profile?.id) {
        setError("User profile not available.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const scheduleData = await fetchStudentSchedule(user.profile.id);
        setSchedule(scheduleData);
      } catch (err) {
        console.error("Failed to load student schedule:", err);
        setError(err.message || "Could not load schedule.");
        toast({
          title: "Error Loading Schedule",
          description: err.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadSchedule();
  }, [user, toast]);

  const printSchedule = () => window.print();

  const exportToExcel = () => {
    const excelData = schedule.map(item => {
      const periodInfo = periods.find(p => p.id === item.hour);
      return {
        "Period": periodInfo?.name || `Hour ${item.hour}`,
        "Time": periodInfo?.time || "N/A",
        "Class": item.title,
        "Room": item.room || "N/A",
        "Teacher": item.teacher_name || "N/A",
        "Description": item.description || "",
        "Status": item.enrollment_status || "Enrolled",
      };
    });
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "My Schedule");
    XLSX.writeFile(wb, "my_schedule.xlsx");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
        <p className="ml-3 text-gray-300">Loading schedule...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-900/20 border-red-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-red-300 flex items-center">
            <AlertCircle className="mr-3 h-6 w-6" /> Error Loading Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-400">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4 bg-sky-500 hover:bg-sky-600">Try Again</Button>
        </CardContent>
      </Card>
    );
  }
  
  const sortedSchedule = [...schedule].sort((a, b) => (a.hour || 0) - (b.hour || 0));


  return (
    <Card className="bg-slate-800/60 border-slate-700/50 shadow-xl print-section">
      <CardHeader className="flex flex-row items-center justify-between no-print">
        <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500 flex items-center">
          <CalendarDays className="mr-3 h-7 w-7" /> My Schedule
        </CardTitle>
        <div className="flex gap-3">
          <Button onClick={printSchedule} variant="outline" className="border-sky-500 text-sky-400 hover:bg-sky-500/10 hover:text-sky-300">
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
          <Button onClick={exportToExcel} variant="outline" className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="mt-2">
        {sortedSchedule.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-xl text-slate-400">Your schedule is currently empty.</p>
            <p className="text-slate-500 mt-1">Enroll in classes to see them here.</p>
            <Button asChild className="mt-6 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white">
                <Link to="/student/browse-classes">Browse Classes</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            {sortedSchedule.map((item, index) => {
              const periodInfo = periods.find(p => p.id === item.hour);
              return (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-5 rounded-lg bg-slate-700/40 border border-slate-600/60 shadow-md hover:shadow-sky-500/10 transition-shadow print:border-gray-300 print:shadow-none"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                    <h3 className="text-xl font-semibold text-sky-300">{item.title}</h3>
                    <span className={`mt-1 sm:mt-0 px-3 py-1 text-xs font-semibold rounded-full ${
                        item.enrollment_status === 'enrolled' ? 'bg-emerald-500/20 text-emerald-300' : 
                        item.enrollment_status === 'waitlisted' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-slate-600 text-slate-300'
                    }`}>
                        {item.enrollment_status || 'Status N/A'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center text-slate-300">
                      <Clock className="w-4 h-4 mr-2.5 text-slate-500" />
                      {periodInfo?.name || `Hour ${item.hour}`} ({periodInfo?.time || 'N/A'})
                    </div>
                    <div className="flex items-center text-slate-300">
                      <MapPin className="w-4 h-4 mr-2.5 text-slate-500" />
                      Room: {item.room || 'N/A'}
                    </div>
                    <div className="flex items-center text-slate-300">
                      <User className="w-4 h-4 mr-2.5 text-slate-500" />
                      Teacher: {item.teacher_name || 'N/A'}
                    </div>
                    {item.community_partner && (
                      <div className="flex items-center text-slate-300">
                        <Users className="w-4 h-4 mr-2.5 text-slate-500" />
                        Partner: {item.community_partner}
                      </div>
                    )}
                  </div>
                  {item.description && <p className="mt-3 text-xs text-slate-400 leading-relaxed">{item.description}</p>}
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
      <style jsx global>{`
        @media print {
          body { background-color: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-section { 
            margin: 0; 
            padding: 0;
            border: none !important;
            box-shadow: none !important;
            background-color: white !important;
          }
          .print-section * { color: black !important; background-color: transparent !important; }
          .print-section .text-sky-300 { color: #38bdf8 !important; } 
        }
      `}</style>
    </Card>
  );
};

export default StudentScheduleView;
