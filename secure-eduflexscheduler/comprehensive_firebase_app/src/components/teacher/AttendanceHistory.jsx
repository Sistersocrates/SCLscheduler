
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import TeacherNav from "@/components/teacher/TeacherNav";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Download, Calendar, Clock } from "lucide-react";
import * as XLSX from "xlsx";

const AttendanceHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendanceHistory();
  }, [user]);

  const fetchAttendanceHistory = async () => {
    try {
      const { data: seminars, error: seminarError } = await supabase
        .from('seminars')
        .select('id')
        .eq('teacher_email', user?.email);

      if (seminarError) throw seminarError;

      const seminarIds = seminars.map(s => s.id);

      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          seminars (
            title,
            hour,
            room
          ),
          students (
            first_name,
            last_name,
            email
          )
        `)
        .in('seminar_id', seminarIds)
        .order('date', { ascending: false });

      if (error) throw error;
      setAttendanceRecords(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch attendance history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      attendanceRecords.map((record) => ({
        "Date": new Date(record.date).toLocaleDateString(),
        "Time Slot": record.time_slot,
        "Seminar": record.seminars?.title,
        "Hour": record.seminars?.hour,
        "Room": record.seminars?.room,
        "Student Name": `${record.students?.first_name} ${record.students?.last_name}`,
        "Student Email": record.students?.email,
        "Status": record.status,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance History");
    XLSX.writeFile(workbook, `attendance_history_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Present": return "bg-green-100 text-green-800";
      case "Absent": return "bg-red-100 text-red-800";
      case "Tardy": return "bg-yellow-100 text-yellow-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <TeacherNav />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading attendance history...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Attendance History</h1>
              <Button onClick={exportToExcel} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export History
              </Button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seminar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          <div className="text-sm text-gray-900">
                            {new Date(record.date).toLocaleDateString()}
                          </div>
                          <Clock className="w-4 h-4 ml-4 mr-2" />
                          <div className="text-sm text-gray-500">
                            {record.time_slot}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {record.seminars?.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          Hour {record.seminars?.hour} - Room {record.seminars?.room}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {record.students?.first_name} {record.students?.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.students?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AttendanceHistory;
