
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchStudentAppointments, requestAppointment, cancelAppointment } from '@/lib/services/studentApiService';
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus, CalendarX, AlertCircle, UserCheck, Clock, MapPin, Edit3, Trash2, Loader2 } from 'lucide-react';
// Placeholder for AppointmentCalendar, SpecialistDirectory, AppointmentRequestForm, AppointmentDetailModal
// For now, we'll list appointments and have a simple request button.

const StudentAppointmentsView = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // For specific appointment actions

  const loadAppointments = async () => {
    if (!user?.profile?.id) {
      setError("User profile not available.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await fetchStudentAppointments(user.profile.id);
      setAppointments(data);
    } catch (err) {
      console.error("Failed to load student appointments:", err);
      setError(err.message || "Could not load appointments.");
      toast({
        title: "Error Loading Appointments",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [user, toast]);

  const handleCancelAppointment = async (appointmentId) => {
    setActionLoading(appointmentId);
    try {
      await cancelAppointment(appointmentId);
      toast({ title: "Appointment Cancelled", description: "The appointment has been successfully cancelled." });
      loadAppointments(); // Refresh list
    } catch (err) {
      toast({ title: "Cancellation Failed", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };
  
  // Placeholder for requesting a new appointment
  const handleRequestNewAppointment = () => {
    // This would typically open a modal with AppointmentRequestForm
    toast({ title: "Feature Coming Soon", description: "Requesting new appointments will be available soon."});
    // Example:
    // const specialistId = "some-specialist-uuid"; // From SpecialistDirectory
    // const tenantId = user.profile.tenant_id;
    // const details = { title: "Meeting Request", description: "Discuss progress", startTime: new Date(), endTime: new Date() };
    // requestAppointment(user.profile.id, specialistId, tenantId, details)
    //  .then(() => { loadAppointments(); toast({ title: "Appointment Requested" }); })
    //  .catch(err => toast({ title: "Request Failed", description: err.message, variant: "destructive" }));
  };


  if (loading && appointments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-sky-500" />
        <p className="ml-3 text-gray-300">Loading appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-900/20 border-red-700/50 shadow-xl">
        <CardHeader><CardTitle className="text-red-300 flex items-center"><AlertCircle className="mr-2"/>Error</CardTitle></CardHeader>
        <CardContent><p className="text-red-400">{error}</p></CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
        className="flex flex-col sm:flex-row justify-between items-center"
      >
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4 sm:mb-0">
          My Appointments
        </h1>
        <Button onClick={handleRequestNewAppointment} className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all">
          <CalendarPlus className="mr-2 h-5 w-5" /> Request New Appointment
        </Button>
      </motion.div>

      {appointments.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/40 rounded-lg shadow-inner">
          <UserCheck className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-xl text-slate-400">No appointments scheduled.</p>
          <p className="text-slate-500 mt-1">Use the button above to request a new one.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt, index) => (
            <motion.div
              key={appt.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-slate-700/50 border-slate-600/70 shadow-md hover:shadow-purple-500/10 transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold text-purple-300">{appt.title}</CardTitle>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      appt.status === 'scheduled' ? 'bg-sky-500/20 text-sky-300' :
                      appt.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                      appt.status === 'cancelled' ? 'bg-red-500/20 text-red-300' :
                      'bg-slate-600 text-slate-300'
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    With: {appt.specialist?.first_name} {appt.specialist?.last_name || 'Specialist'}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center text-slate-300">
                    <Clock className="w-4 h-4 mr-2 text-slate-500" />
                    {new Date(appt.start_time).toLocaleString()} - {new Date(appt.end_time).toLocaleTimeString()}
                  </div>
                  {appt.location && (
                    <div className="flex items-center text-slate-300">
                      <MapPin className="w-4 h-4 mr-2 text-slate-500" />
                      Location: {appt.location}
                    </div>
                  )}
                  {appt.description && <p className="text-xs text-slate-400 pt-1">{appt.description}</p>}
                </CardContent>
                {appt.status === 'scheduled' && (
                  <div className="p-4 border-t border-slate-600/50 flex justify-end space-x-2">
                    <Button variant="outline" size="sm" className="border-slate-500 text-slate-300 hover:bg-slate-600" onClick={() => toast({title: "Edit Coming Soon"})}>
                      <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleCancelAppointment(appt.id)}
                      disabled={actionLoading === appt.id}
                    >
                      {actionLoading === appt.id ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5 mr-1.5" />}
                      Cancel
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentAppointmentsView;
