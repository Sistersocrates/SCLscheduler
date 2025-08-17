import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchStudentSchedule, getPeriodsConfig } from '@/lib/services/studentApiService';
import { useToast } from "@/components/ui/use-toast";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addDays, setHours, setMinutes } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const locales = {
  'en-US': enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const StudentScheduleView = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const periods = useMemo(() => getPeriodsConfig(), []);

    // Helper to convert period hour to start/end Date objects for a given week day
    const createDateFromPeriod = (dayOfWeek, period) => {
        const today = new Date();
        const startOfWeekDate = startOfWeek(today, { weekStartsOn: 1 }); // Monday
        const targetDay = addDays(startOfWeekDate, dayOfWeek);

        const [startHour, startMinute] = period.time.split(' ')[0].split(':').map(Number);
        const [endHour, endMinute] = period.time.split(' ')[2].split(':').map(Number);

        const startDate = setMinutes(setHours(targetDay, startHour), startMinute);
        const endDate = setMinutes(setHours(targetDay, endHour), endMinute);

        return { startDate, endDate };
    };

    useEffect(() => {
        const loadAndFormatSchedule = async () => {
            if (!user?.profile?.id) {
                setError("User profile not available.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);
                const scheduleData = await fetchStudentSchedule(user.profile.id);

                const calendarEvents = scheduleData.flatMap(item => {
                    const periodInfo = periods.find(p => p.id === item.hour);
                    if (!periodInfo) return [];

                    // Assume classes run Monday-Friday
                    const weekdays = [1, 2, 3, 4, 5];

                    return weekdays.map(dayIndex => {
                        const { startDate, endDate } = createDateFromPeriod(dayIndex, periodInfo);

                        return {
                            title: `${item.title} - Rm: ${item.room || 'TBD'}`,
                            start: startDate,
                            end: endDate,
                            resource: item,
                        };
                    });
                });

                setEvents(calendarEvents);

            } catch (err) {
                console.error("Failed to load student schedule:", err);
                setError(err.message || "Could not load schedule.");
                toast({
                    title: "Error Loading Schedule",
                    description: err.message || "An unexpected error occurred.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };
        loadAndFormatSchedule();
    }, [user, toast, periods]);

    const minTime = new Date();
    minTime.setHours(7, 0, 0);
    const maxTime = new Date();
    maxTime.setHours(16, 0, 0); // 4 PM

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[600px]">
                <Loader2 className="h-12 w-12 animate-spin text-sky-500" />
                <p className="ml-3 text-gray-300">Loading schedule...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="bg-red-900/20 border-red-700/50">
              <CardHeader><CardTitle className="text-red-300 flex items-center"><AlertCircle className="mr-2"/>Error</CardTitle></CardHeader>
              <CardContent><p className="text-red-400">{error}</p></CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-slate-800/60 border-slate-700/50 shadow-xl p-4">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                    My Weekly Schedule
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[600px] text-white bg-slate-700/40 p-4 rounded-lg">
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        defaultView="week"
                        views={['day', 'week', 'month']}
                        style={{ height: '100%' }}
                        min={minTime}
                        max={maxTime}
                        eventPropGetter={(event) => ({
                            className: `!bg-sky-500 hover:!bg-sky-600 border-sky-700`,
                        })}
                        tooltipAccessor={(event) => event.title}
                    />
                </div>
            </CardContent>
            <style jsx global>{`
                .rbc-calendar { background-color: transparent !important; color: white !important; }
                .rbc-toolbar { color: white !important; }
                .rbc-toolbar button { color: white !important; }
                .rbc-toolbar button.rbc-active { background-color: #0ea5e9 !important; }
                .rbc-header { border-color: #475569 !important; }
                .rbc-day-bg { border-color: #475569 !important; }
                .rbc-time-view, .rbc-month-view { border-color: #475569 !important; }
                .rbc-time-header-content, .rbc-time-gutter { border-color: #475569 !important; }
                .rbc-time-slot { border-color: #475569 !important; }
                .rbc-current-time-indicator { background-color: #f59e0b !important; }
            `}</style>
        </Card>
    );
};

export default StudentScheduleView;
