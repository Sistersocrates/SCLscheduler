import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../AuthProvider';
import { getStudentAttendanceHistory } from '../../../lib/firebase_enhanced';
import toast from 'react-hot-toast';
import { motion } from "framer-motion";
import { CheckSquare, XSquare, AlertCircle, CalendarClock, Loader2, Clock, Award } from 'lucide-react';

const AttendanceHistoryView = () => {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCredits, setTotalCredits] = useState(0);

  useEffect(() => {
    const loadAttendance = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const data = await getStudentAttendanceHistory(user.uid);
        setAttendanceRecords(data);

        const total = data.reduce((sum, record) => sum + (record.creditAwarded || 0), 0);
        setTotalCredits(total);

      } catch (err) {
        console.error("Failed to load attendance history:", err);
        setError(err.message || "Could not load attendance records.");
        toast.error(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    loadAttendance();
  }, [user]);

  const getStatusIcon = (status) => {
    status = status?.toLowerCase();
    if (status === 'present') return <CheckSquare className="text-emerald-400" />;
    if (status === 'absent') return <XSquare className="text-red-400" />;
    if (status === 'late') return <Clock className="text-amber-400" />;
    return <AlertCircle className="text-slate-500" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-sky-500" />
        <p className="ml-3 text-gray-300">Loading attendance history...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-900/20 border-red-700/50 shadow-xl p-6 rounded-lg">
        <h3 className="text-red-300 flex items-center font-semibold"><AlertCircle className="mr-2"/>Error</h3>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Attendance & Credit History
        </h1>
        <div className="bg-slate-800/60 border-slate-700 text-slate-200 rounded-lg p-4 flex items-center space-x-3">
            <Award className="h-8 w-8 text-yellow-400" />
            <div>
                <p className="text-sm text-slate-400">Total Credits Earned</p>
                <p className="text-2xl font-bold text-white">{totalCredits.toFixed(2)}</p>
            </div>
        </div>
      </motion.div>

      {attendanceRecords.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/40 rounded-lg shadow-inner">
          <CalendarClock className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-xl text-slate-400">No attendance records found.</p>
          <p className="text-slate-500 mt-1">Your attendance will appear here once recorded by your teacher.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Class</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Credit Awarded</th>
              </tr>
            </thead>
            <tbody className="bg-slate-800/30 divide-y divide-slate-700/70">
              {attendanceRecords.map((record, index) => (
                  <motion.tr 
                    key={record.id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{record.date?.toDate ? record.date.toDate().toLocaleDateString() : 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{record.className || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="flex items-center">
                        {getStatusIcon(record.status)}
                        <span className="ml-2 capitalize text-slate-300">{record.status || 'Unknown'}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-yellow-400">{record.creditAwarded?.toFixed(2) || '0.00'}</td>
                  </motion.tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceHistoryView;
