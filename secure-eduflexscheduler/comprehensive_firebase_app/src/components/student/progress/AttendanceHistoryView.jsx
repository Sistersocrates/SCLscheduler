import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchStudentAttendance, getStudentEnrollments } from '../../../lib/firebase_enhanced';
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckSquare, XSquare, AlertCircle, CalendarClock, Loader2, Clock, BarChart2, Filter } from 'lucide-react';

const AttendanceHistoryView = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [filters, setFilters] = useState({ classId: 'all', startDate: '', endDate: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      if (!user) return;
      try {
        const enrollments = await getStudentEnrollments(user.uid);
        const classes = enrollments.map(e => e.classDetails);
        setEnrolledClasses(classes);
      } catch (err) {
        console.error("Failed to load enrolled classes for filter", err);
      }
    };
    loadInitialData();
  }, [user]);

  useEffect(() => {
    const loadAttendance = async () => {
      if (!user) return;
      try {
        setLoading(true);
        setError(null);

        const filterParams = {
            classId: filters.classId === 'all' ? null : filters.classId,
            dateRange: {
                startDate: filters.startDate || null,
                endDate: filters.endDate || null,
            }
        };

        const data = await fetchStudentAttendance(user.uid, filterParams);
        setAttendanceRecords(data);
      } catch (err) {
        console.error("Failed to load attendance history:", err);
        setError(err.message || "Could not load attendance records.");
        toast({
          title: "Error Loading Attendance",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadAttendance();
  }, [user, toast, filters]);

  const summaryStats = useMemo(() => {
    if (!attendanceRecords || attendanceRecords.length === 0) {
      return { present: 0, absent: 0, tardy: 0, rate: 0 };
    }
    const stats = attendanceRecords.reduce((acc, record) => {
        acc[record.status] = (acc[record.status] || 0) + 1;
        return acc;
    }, { present: 0, absent: 0, tardy: 0, excused: 0 });

    const totalPossible = stats.present + stats.absent + stats.tardy;
    const rate = totalPossible > 0 ? (stats.present / totalPossible) * 100 : 0;

    return { ...stats, rate: Math.round(rate) };
  }, [attendanceRecords]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getStatusIcon = (status) => {
    status = status?.toLowerCase();
    if (status === 'present') return <CheckSquare className="text-emerald-400" />;
    if (status === 'absent') return <XSquare className="text-red-400" />;
    if (status === 'tardy') return <Clock className="text-amber-400" />;
    return <AlertCircle className="text-slate-500" />;
  };

  if (error) {
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

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Attendance Rate" value={`${summaryStats.rate}%`} icon={BarChart2} />
        <StatCard title="Present" value={summaryStats.present} icon={CheckSquare} />
        <StatCard title="Absent" value={summaryStats.absent} icon={XSquare} />
        <StatCard title="Tardy" value={summaryStats.tardy} icon={Clock} />
      </div>

      {/* Filters Section */}
      <Card className="p-4 bg-slate-800/40 border-slate-700">
        <div className="flex flex-wrap items-center gap-4">
            <Filter className="h-5 w-5 text-slate-400" />
            <h3 className="font-semibold text-slate-300">Filters:</h3>
            <Select onValueChange={(value) => handleFilterChange('classId', value)} defaultValue="all">
                <SelectTrigger className="w-[180px] bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {enrolledClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
                <Label htmlFor="startDate" className="text-slate-400">From:</Label>
                <Input id="startDate" type="date" value={filters.startDate} onChange={e => handleFilterChange('startDate', e.target.value)} className="w-[150px] bg-slate-700 border-slate-600" />
            </div>
            <div className="flex items-center gap-2">
                <Label htmlFor="endDate" className="text-slate-400">To:</Label>
                <Input id="endDate" type="date" value={filters.endDate} onChange={e => handleFilterChange('endDate', e.target.value)} className="w-[150px] bg-slate-700 border-slate-600" />
            </div>
        </div>
      </Card>

      {loading ? (
         <div className="flex items-center justify-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-sky-500" />
         </div>
      ) : attendanceRecords.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/40 rounded-lg shadow-inner">
          <CalendarClock className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-xl text-slate-400">No attendance records found for the selected filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Class</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-slate-800/30 divide-y divide-slate-700/70">
              <AnimatePresence>
                {attendanceRecords.map((record, index) => (
                  <motion.tr 
                    key={record.id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{new Date(record.date.toDate()).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{record.description || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="flex items-center">
                        {getStatusIcon(record.status)}
                        <span className="ml-2 capitalize text-slate-300">{record.status || 'Unknown'}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{record.notes}</td>
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

const StatCard = ({ title, value, icon: Icon }) => (
    <div className="p-4 bg-slate-800/60 rounded-lg border border-slate-700 flex items-center">
        <Icon className="h-8 w-8 text-sky-400 mr-4" />
        <div>
            <p className="text-slate-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-slate-200">{value}</p>
        </div>
    </div>
);

export default AttendanceHistoryView;
