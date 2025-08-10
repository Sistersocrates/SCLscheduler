
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, UserCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const UpcomingAppointmentsList = ({ appointments = [] }) => {
  const upcoming = appointments.length > 0 ? appointments : [
    { id: 1, studentName: "John Doe", time: "10:00 AM", type: "Counseling" },
    { id: 2, studentName: "Jane Smith", time: "11:30 AM", type: "Check-in" },
  ]; // Placeholder data

  return (
    <Card className="bg-slate-800/60 border-slate-700/50 shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-200 flex items-center">
          <ListChecks className="mr-3 h-5 w-5 text-sky-400" />
          Upcoming Appointments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcoming.length === 0 ? (
          <p className="text-slate-400 text-center py-4">No upcoming appointments.</p>
        ) : (
          upcoming.map((appt, index) => (
            <motion.div
              key={appt.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 bg-slate-700/40 rounded-md border border-slate-600/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <UserCircle className="w-5 h-5 mr-2 text-slate-400" />
                  <span className="text-sm font-medium text-slate-200">{appt.studentName}</span>
                </div>
                <span className="text-xs text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded-full">{appt.type}</span>
              </div>
              <div className="flex items-center text-xs text-slate-400 mt-1">
                <Clock className="w-3 h-3 mr-1.5 text-slate-500" />
                {appt.time}
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointmentsList;
