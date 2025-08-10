
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, User, MapPin, FileText, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AppointmentDetailView = ({ appointment, onEdit, onDelete, onClose }) => {
  if (!appointment) return <p className="text-slate-400">No appointment selected.</p>;

  // Placeholder data if needed
  const displayAppointment = appointment || {
    title: "Sample Appointment",
    studentName: "John Doe",
    startTime: new Date().toISOString(),
    endTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(), // 1 hour later
    location: "Specialist Office",
    description: "This is a sample description for the appointment.",
    status: "Scheduled"
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <Card className="bg-slate-800/70 border-slate-700 text-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-pink-300">
            <CalendarDays className="mr-3 h-6 w-6" />
            {displayAppointment.title}
          </CardTitle>
          <p className="text-xs text-slate-400">Status: <span className={`font-semibold ${displayAppointment.status === 'Scheduled' ? 'text-sky-400' : 'text-emerald-400'}`}>{displayAppointment.status}</span></p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4 text-slate-500" />
            Student: <span className="ml-1 font-medium text-slate-300">{displayAppointment.studentName || 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-slate-500" />
            Time: <span className="ml-1 font-medium text-slate-300">{new Date(displayAppointment.startTime).toLocaleString()} - {new Date(displayAppointment.endTime).toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-slate-500" />
            Location: <span className="ml-1 font-medium text-slate-300">{displayAppointment.location || 'N/A'}</span>
          </div>
          {displayAppointment.description && (
            <div className="pt-2">
              <h4 className="text-sm font-semibold text-slate-400 flex items-center mb-1">
                <FileText className="mr-2 h-4 w-4" /> Description
              </h4>
              <p className="text-sm text-slate-300 bg-slate-700/50 p-3 rounded-md">{displayAppointment.description}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose} className="text-slate-300 border-slate-600 hover:bg-slate-700">Close</Button>
          <div className="flex gap-2">
            {onEdit && <Button onClick={() => onEdit(displayAppointment)} className="bg-sky-500 hover:bg-sky-600 text-white"><Edit className="mr-2 h-4 w-4" /> Edit</Button>}
            {onDelete && <Button variant="destructive" onClick={() => onDelete(displayAppointment.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AppointmentDetailView;
