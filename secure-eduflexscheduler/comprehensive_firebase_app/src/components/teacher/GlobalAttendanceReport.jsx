import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthProvider';
import { getAggregateAttendanceForTeacher } from '../../lib/teacherFirebase';
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertCircle, BarChart3, Users, Clock, TrendingUp } from 'lucide-react';

const GlobalAttendanceReport = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const statsData = await getAggregateAttendanceForTeacher(user.uid);
        setStats(statsData);
      } catch (err) {
        setError(err.message || "Could not load aggregate report.");
        toast({
          title: "Error Loading Report",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [user, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2">Generating Overall Report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p className="font-bold flex items-center"><AlertCircle className="mr-2"/>Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!stats || stats.totalRecords === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No Attendance Data Found</h3>
        <p className="text-gray-600">No attendance has been recorded for any of your classes yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Overall Attendance Report</h1>
        <p className="text-gray-600">Showing combined statistics for all {stats.classCount} of your classes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Overall Attendance</p>
              <p className="text-3xl font-semibold text-gray-900">{stats.overallAttendanceRate}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <Users className="h-6 w-6 text-red-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Absences</p>
            <p className="text-3xl font-semibold text-gray-900">{stats.statsByStatus.absent || 0}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <Clock className="h-6 w-6 text-yellow-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Lates</p>
            <p className="text-3xl font-semibold text-gray-900">{stats.statsByStatus.late || 0}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Records</p>
            <p className="text-3xl font-semibold text-gray-900">{stats.totalRecords}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900">Students with Most Absences (All Classes)</h3>
          <ul className="divide-y divide-gray-200 mt-4">
            {stats.absencesByStudent.slice(0, 10).map(({ student, count }) => (
              <li key={student.id} className="py-3 flex justify-between items-center">
                <p className="text-sm font-medium text-gray-900">{student.displayName}</p>
                <p className="text-sm font-semibold text-red-600">{count} absences</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900">Overall Attendance Trend</h3>
          <div className="mt-4 max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.attendanceOverTime.map(item => (
                  <tr key={item.date}>
                    <td className="px-4 py-2 text-sm text-gray-900">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-sm text-green-600">{item.present || 0}</td>
                    <td className="px-4 py-2 text-sm text-red-600">{item.absent || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalAttendanceReport;
