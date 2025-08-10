
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BellRing, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const SpecialistNotificationCenter = ({ notifications = [] }) => {
  const displayNotifications = notifications.length > 0 ? notifications : [
    { id: 1, title: "New Appointment Request", message: "John Doe requested an appointment.", type: "appointment" },
    { id: 2, title: "Student Note Update", message: "A new note was added for Jane Smith.", type: "note" },
  ]; // Placeholder data

  return (
    <Card className="bg-slate-800/60 border-slate-700/50 shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-200 flex items-center">
          <BellRing className="mr-3 h-5 w-5 text-rose-400" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {displayNotifications.length === 0 ? (
          <p className="text-slate-400 text-center py-4">No new notifications.</p>
        ) : (
          displayNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 rounded-md border bg-slate-700/40 border-slate-600/50"
            >
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 mt-0.5 text-sky-400 flex-shrink-0" /> {/* Generic Icon */}
                <div>
                  <p className="text-sm font-medium text-slate-200">{notification.title}</p>
                  <p className="text-xs text-slate-400">{notification.message}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default SpecialistNotificationCenter;
