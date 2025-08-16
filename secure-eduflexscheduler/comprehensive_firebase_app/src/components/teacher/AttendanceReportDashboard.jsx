import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthProvider';
import { getAttendanceStats } from '../../lib/teacherFirebase';
import { BarChart3, Users, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

const AttendanceReportDashboard = ({ classId, className }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (classId && user) {
      fetchStats();
    }
  }, [classId, user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const statsData = await getAttendanceStats(user.uid, classId);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <BarChart3 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-4 text-gray-600">Generating attendance report...</p>
      </div>
    );
  }

  if (!stats || stats.totalRecords === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Attendance Data</h3>
        <p className="text-gray-600">There is not enough attendance data for this class to generate a report.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attendance Report</h1>
        <p className="text-gray-600">{className}</p>
      </div>

      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Overall Attendance Rate */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Overall Attendance</p>
              <p className="text-3xl font-semibold text-gray-900">
                {stats.overallAttendanceRate}%
              </p>
            </div>
          </div>
        </div>
        {/* Total Absences */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <Users className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Absences</p>
              <p className="text-3xl font-semibold text-gray-900">
                {stats.statsByStatus.absent || 0}
              </p>
            </div>
          </div>
        </div>
        {/* Total Lates */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Lates</p>
              <p className="text-3xl font-semibold text-gray-900">
                {stats.statsByStatus.late || 0}
              </p>
            </div>
          </div>
        </div>
        {/* Total Records */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Records</p>
              <p className="text-3xl font-semibold text-gray-900">
                {stats.totalRecords}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Students with Most Absences */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              Students with Most Absences
            </h3>
            <div className="mt-4">
              <ul className="divide-y divide-gray-200">
                {stats.absencesByStudent.slice(0, 5).map(({ student, count }) => (
                  <li key={student.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{student.displayName}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                    <p className="text-sm font-semibold text-red-600">{count} absences</p>
                  </li>
                ))}
                {stats.absencesByStudent.length === 0 && (
                  <li className="py-3 text-center text-gray-500">No students have been marked absent yet.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Attendance Trend */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900">Attendance Trend</h3>
            <p className="text-sm text-gray-500">Daily attendance breakdown.</p>
            <div className="mt-4 max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Late</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.attendanceOverTime.map(item => (
                    <tr key={item.date}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{new Date(item.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-green-600">{item.present || 0}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-red-600">{item.absent || 0}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-yellow-600">{item.late || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReportDashboard;
