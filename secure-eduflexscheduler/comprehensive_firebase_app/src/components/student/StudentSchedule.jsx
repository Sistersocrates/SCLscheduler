
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { getPeriodTime } from "@/lib/supabase";

const StudentSchedule = ({ registrations, seminars }) => {
  const printSchedule = () => {
    window.print();
  };

  const exportToExcel = () => {
    const scheduleData = Object.entries(registrations).map(([hour, seminarId]) => {
      const seminar = seminars.find(s => s.id === seminarId);
      return {
        "Period": `Period ${hour}`,
        "Time": getPeriodTime(parseInt(hour)),
        "Class": seminar?.title || "",
        "Room": seminar?.room || "",
        "Teacher": seminar?.teacher_name || "",
        "Community Partner": seminar?.community_partner || "N/A"
      };
    });

    const ws = XLSX.utils.json_to_sheet(scheduleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "My Schedule");
    XLSX.writeFile(wb, "my_schedule.xlsx");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Schedule</h2>
        <div className="flex gap-2">
          <Button
            onClick={printSchedule}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button
            onClick={exportToExcel}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="space-y-4 print:space-y-2">
        {Object.entries(registrations).map(([hour, seminarId]) => {
          const seminar = seminars.find(s => s.id === seminarId);
          if (!seminar) return null;

          return (
            <motion.div
              key={hour}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 rounded-lg p-4 print:border print:border-gray-200"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Period {hour}</p>
                  <p className="font-medium">{getPeriodTime(parseInt(hour))}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Class</p>
                  <p className="font-medium">{seminar.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Room</p>
                  <p className="font-medium">{seminar.room}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Teacher</p>
                  <p className="font-medium">{seminar.teacher_name}</p>
                </div>
                {seminar.community_partner && (
                  <div>
                    <p className="text-sm text-gray-500">Community Partner</p>
                    <p className="font-medium">{seminar.community_partner}</p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: portrait;
            margin: 1cm;
          }
          body * {
            visibility: hidden;
          }
          .print-section, .print-section * {
            visibility: visible;
          }
          .print-section {
            position: absolute;
            left: 0;
            top: 0;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentSchedule;
