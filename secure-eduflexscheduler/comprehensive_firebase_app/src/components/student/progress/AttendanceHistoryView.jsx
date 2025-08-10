
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchStudentAttendance } from '@/lib/services/studentApiService'; 
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckSquare, XSquare, AlertCircle, CalendarClock, Loader2, Clock } from 'lucide-react';

const AttendanceHistoryView = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAttendance = async () => {
      if (!user?.profile?.id) {
        setError("User profile not available.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const data = await fetchStudentAttendance(user.profile.id); 
        setAttendanceRecords(data); 
      } catch (err) {
        console.error("Failed to load attendance history:", err);
        setError(err.message || "Could not load attendance records.");
        toast({
          title: "Error Loading Attendance",
          description: err.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadAttendance();
  }, [user, toast]);

  const getStatusIcon = (status) => {
    status = status?.toLowerCase();
    if (status === 'present') return <CheckSquare className="text-emerald-400" />;
    if (status === 'absent') return <XSquare className="text-red-400" />;
    if (status === 'tardy') return <Clock className="text-amber-400" />; 
    return <AlertCircle className="text-slate-500" />;
  };
  
  const placeholderRecords = [
    { id: 1, date: '2025-05-20', class_name: 'Algebra II', status: 'present', seminar_title: 'Advanced Math Seminar' },
    { id: 2, date: '2025-05-20', class_name: 'English Lit', status: 'present', seminar_title: 'Shakespeare Explored' },
    { id: 3, date: '2025-05-19', class_name: 'Algebra II', status: 'absent', seminar_title: 'Advanced Math Seminar' },
    { id: 4, date: '2025-05-19', class_name: 'Physics I', status: 'tardy', seminar_title: 'Intro to Quantum Mechanics' },
  ];
  const displayRecords = attendanceRecords.length > 0 ? attendanceRecords : placeholderRecords;


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-sky-500" />
        <p className="ml-3 text-gray-300">Loading attendance history...</p>
      </div>
    );
  }
  
  if (error && attendanceRecords.length === 0) { 
    return (
      <Card className="bg-red-900/20 border-red-700/50 shadow-xl">
        <CardHeader><CardTitle className="text-red-300 flex items-center"><AlertCircle className="mr-2"/>Error</CardTitle></CardHeader>
        <CardContent><p className="text-red-400">{error}</p></CardContent>
      </Card>
    );
  }


  return (
    <div className="space-y-6">
      <motion.h1 
        initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
        className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500"
      >
        Attendance History
      </motion.h1>

      {displayRecords.length === 0 && !error ? ( 
        <div className="text-center py-12 bg-slate-800/40 rounded-lg shadow-inner">
          <CalendarClock className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-xl text-slate-400">No attendance records found.</p>
          <p className="text-slate-500 mt-1">Your attendance will appear here once recorded.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Class / Seminar</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-slate-800/30 divide-y divide-slate-700/70">
              <AnimatePresence>
                {displayRecords.map((record, index) => (
                  <motion.tr 
                    key={record.id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{record.seminar_title || record.class_name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="flex items-center">
                        {getStatusIcon(record.status)}
                        <span className="ml-2 capitalize text-slate-300">{record.status || 'Unknown'}</span>
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceHistoryView;
