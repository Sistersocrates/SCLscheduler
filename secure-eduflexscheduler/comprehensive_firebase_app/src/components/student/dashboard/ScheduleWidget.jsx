
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, MapPin, User } from 'lucide-react';
import { getPeriodsConfig } from '@/lib/services/studentApiService';
import { motion } from "framer-motion";

const ScheduleWidget = ({ schedule, seminars }) => {
  const periods = getPeriodsConfig();

  if (!schedule || Object.keys(schedule).length === 0) {
    return (
      <Card className="bg-slate-800/60 border-slate-700/50 shadow-xl h-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-200 flex items-center">
            <CalendarDays className="mr-3 h-6 w-6 text-sky-400" />
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-full py-10">
          <CalendarDays className="w-16 h-16 text-slate-600 mb-4" />
          <p className="text-slate-400">No classes scheduled for today.</p>
          <p className="text-sm text-slate-500 mt-1">Enjoy your free time or browse available classes!</p>
        </CardContent>
      </Card>
    );
  }

  const scheduledPeriods = periods.filter(p => schedule[p.id]);

  return (
    <Card className="bg-slate-800/60 border-slate-700/50 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-200 flex items-center">
          <CalendarDays className="mr-3 h-6 w-6 text-sky-400" />
          Today's Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {scheduledPeriods.map((period, index) => {
          const registrationDetails = schedule[period.id];
          const seminarDetails = seminars?.find(s => s.id === registrationDetails?.seminar_id);

          if (!registrationDetails || !seminarDetails) return null;

          return (
            <motion.div 
              key={period.id}
              className="p-4 rounded-lg bg-slate-700/50 border border-slate-600/70 hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-sky-300">{seminarDetails.title}</h3>
                  <p className="text-sm text-slate-400">{period.name} ({period.time})</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  registrationDetails.status === 'enrolled' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {registrationDetails.status}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-300">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-slate-500" />
                  Room: {seminarDetails.room || 'N/A'}
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-slate-500" />
                  Teacher: {seminarDetails.teacher_name || 'N/A'}
                </div>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ScheduleWidget;
