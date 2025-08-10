
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, Percent, Download } from 'lucide-react'; // Replaced PieChart with Percent
import { motion } from 'framer-motion';

const EventAttendanceTracker = ({ eventId, registrations = [] }) => {
  const attendedCount = registrations.filter(r => r.attended).length;
  const totalRegistered = registrations.length;
  const attendanceRate = totalRegistered > 0 ? (attendedCount / totalRegistered) * 100 : 0;

  const exportAttendance = () => {
    // Logic to export attendance data (e.g., CSV)
    console.log("Exporting attendance for event:", eventId);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="bg-slate-800/60 border-slate-700 text-slate-200">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="flex items-center text-xl">
            <UserCheck className="mr-3 h-6 w-6 text-purple-400" />
            Event Attendance
          </CardTitle>
          <Button onClick={exportAttendance} variant="outline" size="sm" className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
            <Download className="mr-2 h-4 w-4" /> Export List
          </Button>
        </CardHeader>
        <CardContent className="space-y-3 text-center">
          <div className="text-4xl font-bold text-purple-300">
            {attendedCount} / {totalRegistered}
          </div>
          <p className="text-sm text-slate-400">Attended / Registered</p>
          
          <div className="w-full bg-slate-700 rounded-full h-2.5 dark:bg-slate-700">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full" 
              style={{ width: `${attendanceRate}%` }}
            ></div>
          </div>
          <p className="text-lg font-semibold text-purple-300 flex items-center justify-center">
            <Percent className="mr-1 h-5 w-5"/> {attendanceRate.toFixed(1)}% Attendance Rate
          </p>
          <p className="text-xs text-slate-500">Based on manually marked attendance.</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EventAttendanceTracker;
