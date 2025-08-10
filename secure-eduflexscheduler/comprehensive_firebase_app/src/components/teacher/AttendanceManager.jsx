
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import TeacherNav from "@/components/teacher/TeacherNav";
import {
  fetchAttendance,
  updateAttendance,
  subscribeToAttendanceUpdates,
} from "@/lib/supabase";
import * as XLSX from "xlsx";

const AttendanceManager = () => {
  const { seminarId } = useParams();
  const { toast } = useToast();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendance();
    const subscription = subscribeToAttendanceUpdates(seminarId, (payload) => {
      if (payload.eventType === "UPDATE") {
        setAttendance((prev) =>
          prev.map((record) =>
            record.id === payload.new.id ? payload.new : record
          )
        );
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [seminarId]);

  const loadAttendance = async () => {
    try {
      const data = await fetchAttendance(seminarId);
      setAttendance(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load attendance records",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (recordId, newStatus) => {
    try {
      await updateAttendance(recordId, newStatus);
      toast({
        title: "Success",
        description: "Attendance status updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update attendance status",
        variant: "destructive",
      });
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      attendance.map((record) => ({
        "Student Name": `${record.students.first_name} ${record.students.last_name}`,
        Email: record.students.email,
        Status: record.status,
        Date: record.date,
        "Time Slot": record.time_slot,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, `attendance_${seminarId}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <TeacherNav />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading attendance records...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900">Attendance Manager</h2>
              <Button onClick={exportToExcel}>Export to Excel</Button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendance.map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {record.students.first_name} {record.students.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.students.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            record.status === "Present"
                              ? "bg-green-100 text-green-800"
                              : record.status === "Absent"
                              ? "bg-red-100 text-red-800"
                              : record.status === "Tardy"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(record.id, "Present")}
                            variant={record.status === "Present" ? "default" : "outline"}
                          >
                            Present
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(record.id, "Absent")}
                            variant={record.status === "Absent" ? "default" : "outline"}
                          >
                            Absent
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(record.id, "Tardy")}
                            variant={record.status === "Tardy" ? "default" : "outline"}
                          >
                            Tardy
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleStatusChange(record.id, "Partial Participation")
                            }
                            variant={
                              record.status === "Partial Participation"
                                ? "default"
                                : "outline"
                            }
                          >
                            Partial
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AttendanceManager;
